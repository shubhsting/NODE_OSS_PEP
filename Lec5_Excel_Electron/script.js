const $ = require("jquery");

let db;
let lsc;
$("document").ready(function () {

    init();

    $(".content").on("scroll", function () {
        let left = $(this).scrollLeft();
        let top = $(this).scrollTop();
        // console.log(left+"  "+top);
        $(".top-row").css("top", top + "px");
        $(".top-left-cell").css("top", top + "px");
        $(".top-left-cell").css("left", left + "px");
        $(".left-col").css("left", left + "px");
    })

    $(".cell").on("keyup", function () {
        let height = $(this).height();
        let rid = $(this).attr("rid");
        $(`.left-col-cell[cellId=${rid}]`).height(height);
    })


    $('.cell').on("click", function () {
        let rowId = Number($(this).attr("rid"));
        let colId = Number($(this).attr("cid"));
        let currObj = db[rowId][colId];
        $("#address").val(currObj.name);
        $("#formula").val(currObj.formula);
    });



    $('.cell').on("blur", function () {
        lsc = this;
        let val = $(this).text();
        let rowId = Number($(this).attr("rid"));
        let colId = Number($(this).attr("cid"));
        let cellObject = db[rowId][colId];
        if (cellObject.value != val) {
            cellObject.value = val;
            removecurrfromallparentschildren(cellObject);
            updateAllDependentChildren(cellObject);
        }
        console.log(db);
    });




    $('#formula').on('blur', function () {
        let nformula = $(this).val();         //( A1 + A2 )


        let activecell = $('#address').val();  //B1

        let { rowId, colId } = getrcidfromAddress(activecell);

        let activeObject = db[rowId][colId];

        if (activeObject.formula != nformula) {

            if (traverseandCheckCycle(nformula, activeObject)) {
                alert("Cyclic sequence!!");
                return;
            }


            removecurrfromallparentschildren(activeObject);
            let nvalue = calculatevalueForFormula(nformula, activeObject);
            activeObject.formula = nformula;
            activeObject.value = nvalue;
            updateAllDependentChildren(activeObject);
            $(lsc).text(nvalue);
            console.log(db);
        }
    })

})





// =======================UTILITIES=======================



function traverseandCheckCycle(formula, activeObj) {
    let fcomponents = formula.split(" ");
    //[ ( , A1 , + , A2 , ) ]
    for (let i = 0; i < fcomponents.length; i++) {
        let smallcomp = fcomponents[i];
        if (smallcomp[0] >= "A" && smallcomp[0] <= "Z") {
            let { rowId, colId } = getrcidfromAddress(smallcomp);

            let parentObject = db[rowId][colId];//database

            let res = checkforCycle(activeObj, smallcomp);
            if (res) return true;
        }
    }
    return false;
}

function calculatevalueForFormula(formula, activeObject) {
    let fcomponents = formula.split(" ");
    //[ ( , A1 , + , A2 , ) ]
    for (let i = 0; i < fcomponents.length; i++) {
        let smallcomp = fcomponents[i];
        if (smallcomp[0] >= "A" && smallcomp[0] <= "Z") {
            let { rowId, colId } = getrcidfromAddress(smallcomp);

            let parentObject = db[rowId][colId];//database



            if (activeObject) {
                let checkcycle = checkforCycle(activeObject, smallcomp);
                if (checkcycle) return -1;
                addcurrentinchildrenofparent(parentObject, activeObject.name);
                addparentinparentofcurrent(activeObject, smallcomp);
            }
            let parentvalue = parentObject.value; //value aa gyi
            formula = formula.replace(smallcomp, parentvalue);
        }

    }

    let value = infixevaluation(formula);
    return value;
}

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

function checkforCycle(activeObj, parentname) {
    let res = false;
    for (let i = 0; i < activeObj.children.length; i++) {
        if (activeObj.children[i] == parentname) return true;
        let { rowId, colId } = getrcidfromAddress(activeObj.children[i]);
        let childobj = db[rowId][colId];
        res = res || checkforCycle(childobj, parentname);
    }
    return res;
}

function removecurrfromallparentschildren(activeObj) {
    //parents[A1,A2]
    for (let i = 0; i < activeObj.parents.length; i++) {
        let oneparent = activeObj.parents[i];
        let { rowId, colId } = getrcidfromAddress(oneparent);
        let oneparentobj = db[rowId][colId];
        let filteredparentobj = oneparentobj.children.filter(function (element) {
            return element != activeObj.name;
        });
        db[rowId][colId].children = filteredparentobj;
    }


    activeObj.parents = [];
}

function addparentinparentofcurrent(activeobj, parentname) {
    activeobj.parents.push(parentname);
}

function addcurrentinchildrenofparent(parentObject, childname) {
    parentObject.children.push(childname);
}

function getrcidfromAddress(address) {
    let rowId = Number(address.substring(1)) - 1;
    let colId = address.charCodeAt(0) - 65;
    return { rowId: rowId, colId: colId };
}


function updateAllDependentChildren(cellObject) {
    for (let i = 0; i < cellObject.children.length; i++) {
        let { rowId, colId } = getrcidfromAddress(cellObject.children[i]);
        let childobj = db[rowId][colId];
        let updatedval = calculatevalueForFormula(childobj.formula);

        if (updatedval != childobj.value) {
            childobj.value = updatedval;
            $(`.cell[rid=${rowId}][cid=${colId}]`).text(updatedval);
            updateAllDependentChildren(childobj);
        }
    }
}


function init() {
    db = [];
    for (let i = 0; i < 100; i++) {
        let rdb = [];
        for (let j = 0; j < 26; j++) {
            let cellAddress = String.fromCharCode(65 + j) + (i + 1);
            let cellObject = {
                name: cellAddress,
                value: "",
                formula: "",
                children: [],
                parents: []
            }
            rdb.push(cellObject);
        }
        db.push(rdb);
    }
    console.log(db);

}