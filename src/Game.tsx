import { utcToZonedTime } from 'date-fns-tz';
import React, { createContext, Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react';
import Latex from 'react-latex';
import Keys from './components/Keys';
import generateExpression from './lib/generateExpression';
import pseudoRandom from './lib/pseudoRandom';
import simplifyExpression from './lib/simplifyExpression';
import { symbols } from './lib/values';

type Inputs = {[k: number]: string | undefined};
export interface Game {
    inputs: Inputs;
    setInputs: Dispatch<SetStateAction<Inputs>>;
    row: number;
}
export const GameContext = createContext<Game>({inputs: {}, setInputs: () => {}, row: 0});

function Game() {
    const [solution, setSolution] = useState<null | string>();

    useEffect(() => {
        const localDate = new Date();
        const date = utcToZonedTime(localDate, "America/Los_Angeles");
    
        const prng = pseudoRandom(
            date.getDate() + date.getMonth() + date.getFullYear()
        )

        for (let i = 0; i < 5; i++) {
            const eq = generateExpression(prng);
            setSolution(eq);
        }
    }, []);

    const [inputs, setInputs] = useState<Game["inputs"]>({});
    const [row, setRow] = useState<number>(0);
    const game = useMemo<Game>(() => ({inputs, setInputs, row}), [inputs, setInputs, row]);

    const enter = useCallback(() => {
        const currentRow = inputs[row];
        if (currentRow?.length === 9) {
            console.log(simplifyExpression(currentRow));
            setRow(row + 1);
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

            return {...prev, [game.row]: prev[game.row]?.slice(0, -1)};
        });
    }, [inputs]);

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
                window.removeEventListener("keydown", keydown);
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
                                            if (solution![ii] === elRow[ii]) {
                                                reveal = "answer correct";
                                            } else if (solution!.includes(elRow[ii])) {
                                                reveal = "answer somewhere";
                                            } else {
                                                reveal = "answer wrong";
                                            }
                                        }

                                        return (
                                            <td key={ii} className={reveal ? reveal : ""}>
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
