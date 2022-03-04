import { derivative, simplify } from "mathjs";

function mapOperators(ex: string) {
    return ex.replaceAll("x@", "(x^2)");
}

function simplifyExpression(ex: string) {
    const solvedDerivatives = ex.replace(/(\[[^[]+\])/, (c) => {
        const inner = c.slice(1, -1);
        return derivative(mapOperators(inner), "x").toString();
    });

    return simplify(solvedDerivatives);    
}

export default simplifyExpression;