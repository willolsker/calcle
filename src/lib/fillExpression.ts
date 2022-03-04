import { Range } from "./Range";
import { operations, numbers } from "./values";

function fillExpression(length: number, rand: <Min extends number, Max extends number>(min: Min, max: Max) => Range<Min, Max>, padBefore: boolean, padAfter: boolean) {
    const expression = new Array(length);

    if (length && padBefore) {
        expression[0] = operations[rand(0, 1)];
    }

    for (let i = 0; i < length; i++) {
        if (expression[i]) continue;

        let possibilities: string[] = [];

        const last = expression[i - 1];
        if (last) {
            if (operations.includes(last)) {
                possibilities = ["x", ...numbers];
            } else if (numbers.includes(last)) {
                possibilities = ["x", ...operations];
            } else if (last === "x") {
                possibilities = [...operations, "@"];
            } else if (last === "@") {
                possibilities = [...operations];
            }
        } else {
            possibilities = ["x", ...numbers];
        }

        if (!padAfter && i + 1 === length) {
            possibilities = possibilities.filter(p => !operations.includes(p));
        }

        expression[i] = possibilities[rand(0, possibilities.length - 1)];
    }

    return expression;
}

export default fillExpression;