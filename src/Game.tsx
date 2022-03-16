import { utcToZonedTime } from 'date-fns-tz';
import React, { createContext, Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Latex from 'react-latex';
import Keys from './components/Keys';
import generateExpression from './lib/generateExpression';
import pseudoRandom from './lib/pseudoRandom';
import simplifyExpression from './lib/simplifyExpression';
import { symbols } from './lib/values';

export interface GameState {
    inputs: string[];
    setInputs: Dispatch<SetStateAction<string[]>>;
    row: number;
    solution: string;
}
export const GameContext = createContext<GameState>({inputs: [], setInputs: () => {}, row: 0, solution: ""});

function Game() {
    const [solution, setSolution] = useState<string>("");
    const [inputs, setInputs] = useState<GameState["inputs"]>([]);
    const [row, setRow] = useState<number>(0);
    const game = useMemo<GameState>(() => ({inputs, setInputs, row, solution}), [inputs, setInputs, row, solution]);

    const [solved, setSolved] = useState<number | null>(null);
    const [toast, setToast] = useState<null | string>(null);
    useEffect(() => {
        if (toast && row !== 9) {
            setTimeout(() => setToast(null), 3000);
        }
    }, [toast, row]);

    const enter = useCallback(() => {
        const currentRow = inputs[row];
        if (currentRow?.length === 9) {
            try {
                if (simplifyExpression(currentRow).toString({implicit: "show"}) === simplifyExpression(solution).toString({implicit: "show"})) {
                        setRow(row + 1);
                        if (row + 1 === 9 && currentRow !== solution) {
                            setTimeout(() => {
                                setToast(`The correct answer was ${solution.split("").map((s) => "$" + symbols[s as keyof typeof symbols] + "$").join("")}`);
                            }, 300);
                        }
                    } else {
                    setToast(`The expression that you entered is not equal to the specified solution: $${simplifyExpression(solution).toTex().replace("\\cdot", "")}$`);
                }
            } catch {
                setToast("The expression that you entered is not valid.");
            }
        }
        if (currentRow === solution) {
            setSolved(row + 1);
        }
    }, [inputs, row, solution]);

    const date = useRef(utcToZonedTime(new Date(), "America/Los_Angeles"));
    const dateId = useRef("" + date.current.getDate() + date.current.getMonth() + date.current.getFullYear());
    useEffect(() => {
        const prng = pseudoRandom(parseInt(dateId.current));
        const eq = generateExpression(prng);
        setSolution(eq);

        const savedInputs = JSON.parse(localStorage.getItem("savedInputs" + dateId.current)!);
        if (savedInputs) {
            setInputs(savedInputs.data.inputs);
            setRow(savedInputs.data.row);
            if (savedInputs.data.inputs.some((i: string) => i === eq)) {
                setSolved(savedInputs.data.row + 1);
            }
            if (savedInputs.data.row === 9 && savedInputs.data.inputs[8] !== eq) {
                setToast(`The correct answer was ${eq.split("").map((s) => "$" + symbols[s as keyof typeof symbols] + "$").join("")}`);
            }
        }
    }, []);

    useEffect(() => {
        if (inputs) {
            localStorage.setItem("savedInputs" + dateId.current, JSON.stringify({data: {inputs, row}}));
        }
    }, [inputs, row]);

    const backspace = useCallback(() => {
        setInputs((prev) => {
            if (typeof prev[game.row] !== "string") {
                prev[game.row] = "";
            }
            if (prev[game.row]?.length === 0) {
                return prev;
            }

            const next = [...prev];
            next[game.row] = prev[game.row]?.slice(0, -1);
            return next;
        });
    }, [game.row]);

    useEffect(() => {
        const keydown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                enter();
                window.removeEventListener("keydown", keydown);
            }
        }

        window.addEventListener("keydown", keydown);
        return () => window.removeEventListener("keydown", keydown);
    }, [enter]);

    useEffect(() => {
        const keydown = (e: KeyboardEvent) => {
            if (e.key === "Backspace" || e.key === "Delete") {
                backspace();
            }
        }

        window.addEventListener("keydown", keydown);
        return () => window.removeEventListener("keydown", keydown);
    }, [backspace]);

    return (
        <GameContext.Provider value={game}>
            <div className="game">
                <div className="board">
                    <table>
                        <tbody>
                            {Array.from({length: 9}, (_, i) => (
                                <tr key={i}>
                                    {Array.from({length: 9}, (char, ii) => {
                                        const elRow = game.inputs[i];

                                        let reveal = null;
                                        if (i < row && elRow) {
                                            if (solution[ii] === elRow[ii]) {
                                                reveal = "answer correct";
                                            } else if (solution.split("").filter((char, j) => elRow[j] !== char).includes(elRow[ii])) {
                                                if (solution.includes(elRow[ii])) {
                                                    reveal = "answer somewhere";
                                                }
                                            } else {
                                                reveal = "answer wrong";
                                            }
                                        }

                                        return (
                                            <td key={ii} className={reveal ?? ""}>
                                                {elRow && elRow[ii]
                                                    ? <Latex>{`$${symbols[(elRow[ii] as (keyof typeof symbols))]}$`}</Latex> 
                                                    : undefined
                                                }
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="solution">
                    {solution && <Latex displayMode>
                        {`$=${simplifyExpression(solution).toTex().replace("\\cdot", "")}$`}
                    </Latex>}
                </div>
                {toast && <div className="alert">
                    <Latex>{toast}</Latex>
                </div>}
                {solved && <div className="solved-modal-wrapper">
                    <div className="solved-modal">
                        <h1>{["Marvelous", "Excellent", "Well done", "Impressive", "Very nice"][Math.floor(Math.random() * 5)]}</h1>
                        <h2>Statistics coming soon!</h2>
                    </div>
                </div>}
                <div className="keys">
                    <Keys />

                    <button className="backspace" style={{gridRow: "3", gridColumn: "4 / -1"}} onClick={backspace}>BACKSPACE</button>
                    <button className="enter" style={{gridRow: "4", gridColumn: "4 / -1"}} onClick={enter}>ENTER</button>
                </div>
            </div>
        </GameContext.Provider>
    );
}

export default Game;
