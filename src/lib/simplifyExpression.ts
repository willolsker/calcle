import { derivative, simplify } from "mathjs";

function mapOperators(ex: string) {
    return ex
        .replaceAll("x^", "(x^2)")
        .replaceAll("x(", "x*(");
}

function simplifyExpression(ex: string) {
    const solvedDerivatives = ex.replace(/(d[^d]+v)/g, (c) => {
        const inner = c.slice(1, -1);
        return "(" + derivative(mapOperators(inner), "x").toString() + ")";
    });

    return simplify(mapOperators(solvedDerivatives));
}

export default simplifyExpression;