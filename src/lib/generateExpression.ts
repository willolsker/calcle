import fillExpression from "./fillExpression";
import {Range} from "./Range";

function generateExpression(randomIterator: Iterator<number>): string {
    const rand = <Min extends number, Max extends number>(min: Min, max: Max): Range<Min, Max> => (randomIterator.next().value % (max + 1 - min) + min as Range<Min, Max>);

    const length = 9;
    const insideLength = rand(1, length - 2);

    let afterLength;
    if (insideLength + 4 <= length) {
        afterLength = rand(0, 1) ? rand(2, length - insideLength - 2) : 0;
    } else {
        afterLength = 0;
    }

    const beforeLength = length - afterLength - insideLength - 2;

    const before = fillExpression(beforeLength, rand, {padAfter: true});
    const inside = fillExpression(insideLength, rand, {mustContainX: true});
    const after = fillExpression(afterLength, rand, {padBefore: true});

    const expression = [...before, "d", ...inside, "v", ...after];

    return expression.join("");
}

export default generateExpression;