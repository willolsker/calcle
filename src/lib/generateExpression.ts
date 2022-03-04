import { simplify, string } from "mathjs";
import fillExpression from "./fillExpression";
import {Range} from "./Range";
import simplifyExpression from "./simplifyExpression";
import { numbers, operations } from "./values";

function generateExpression(randomIterator: Iterator<number>) {
    const rand = <Min extends number, Max extends number>(min: Min, max: Max): Range<Min, Max> => (randomIterator.next().value % (max + 1 - min) + min as Range<Min, Max>);

    const length = 9;

    // create the parentheses
    const insideLength = rand(1, length - 2);

    let afterLength;
    if (insideLength + 4 <= length) {
        afterLength = rand(0, 1) ? rand(2, length - insideLength - 2) : 0;
    } else {
        afterLength = 0;
    }

    const beforeLength = length - afterLength - insideLength - 2;

    const before = fillExpression(beforeLength, rand, false, true);
    const inside = fillExpression(insideLength, rand, false, false);
    const after = fillExpression(afterLength, rand, true, false);

    const grouping = rand(0, 1)
        ? ["[", "]"]
        : ["[", "]"];

    const expression = [...before, grouping[0], ...inside, grouping[1], ...after];

    return expression.join("");
}

export default generateExpression;