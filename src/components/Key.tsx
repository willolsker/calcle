import { useCallback, useContext, useEffect } from "react";
import Latex from "react-latex";
import { GameContext } from "../Game";
import { symbols } from "../lib/values";

function Key(props: {input: keyof typeof symbols, row: number, column: number}) {
    const game = useContext(GameContext);

    const addInput = useCallback(() => {
        game.setInputs((prev) => {
            if (typeof prev[game.row] !== "string") {
                prev[game.row] = "";
            }
            if (prev[game.row]?.length === 9) {
                return prev;
            }

            const next = [...prev];
            next[game.row] = prev[game.row] + props.input;
            return next;
        });
    }, [props.input, game]);

    useEffect(() => {
        const keydown = (e: KeyboardEvent) => {
            if (e.key === props.input) {
                addInput();
                window.removeEventListener("keydown", keydown);
            }
        }

        window.addEventListener("keydown", keydown);
        return () => window.removeEventListener("keydown", keydown);
    }, [props.input, addInput]);

    let reveal: string | null = null;
    Object.keys(game.inputs).forEach((_i) => {
        const i = parseInt(_i);

        if (
            !isNaN(i)
            && game.inputs[i] 
            && game.inputs[i]?.includes(props.input)
            && i < game.row
        ) {
            reveal = "answer wrong";
            if (game.solution.includes(props.input)) {
                reveal = "answer somewhere";
                game.inputs.forEach((input, ii) => {
                    if (ii < game.row) {
                        const solutionArr = game.solution.split("");
                        input.split("").forEach((_, iii) => {
                            if (solutionArr[iii] === input[iii] && input[iii] === props.input) {
                                reveal = "answer correct";
                            }
                        });
                    }
                });
            }
        }
    });

    return (
        <button 
            className={"key " + (reveal ?? "")}
            style={{gridRow: props.row, gridColumn: props.column}}
            onMouseDown={addInput}
        >
            <Latex>{`$${symbols[props.input]}$`}</Latex>
        </button>
    );
}

export default Key;