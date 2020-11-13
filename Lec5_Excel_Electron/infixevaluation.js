function infixevaluation(formula) {
    let fcomponents = formula.split(" ");
    //[ ( , A1 , + , A2 , ) ]
    let stackoperators = [];
    let stacknumbers = [];
    for (let i = 0; i < fcomponents.length; i++) {
        let part = fcomponents[i];
        if (part == "(") {
            stackoperators.push(part);
        }
        else if (part == ")") {
            while (stackoperators[stackoperators.length - 1] != "(") {
                let op = stackoperators.pop();
                let operand1 = stacknumbers.pop();
                let operand2 = stacknumbers.pop();
                let val = eval(operand2 + "" + op + "" + operand1);
                stacknumbers.push(val);
            }

            stackoperators.pop();
        }
        else if (part == "+" || part == "-" || part == "*" || part == "/") {
            while (stackoperators[stackoperators.length - 1] != "(" && priority(stackoperators[stackoperators.length - 1]) > priority(part)) {
                let op = stackoperators.pop();
                let operand1 = stacknumbers.pop();
                let operand2 = stacknumbers.pop();
                let val = eval(operand2 + "" + op + "" + operand1);
                stacknumbers.push(val);
            }
            stackoperators.push(part);
        }
        else { stacknumbers.push(part); }
    }

    return stacknumbers.pop();
}

function priority(symbol) {
    if (symbol == "/" || symbol == '*') return 2;
    else if (symbol == "+" || symbol == "-") return 1;
}


console.log(infixevaluation("( 100 * 200 + 25 - 20 )"));