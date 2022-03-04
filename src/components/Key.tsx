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

            return {...prev, [game.row]: prev[game.row] + props.input};
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

    return (
        <button 
            className="key" 
            style={{gridRow: props.row, gridColumn: props.column}}
            onMouseDown={addInput}
        >
            <Latex>{`$${symbols[props.input]}$`}</Latex>
        </button>
    );
}

export default Key;