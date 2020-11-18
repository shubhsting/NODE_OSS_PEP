const fs = require("fs");
const $ = require("jquery");
const dialog = require('electron').remote.dialog;
let db;
let lsc;
let sheetsDB = [];
$("document").ready(function () {
    init();
    // ====================top options code start========================

    //new open save
    $('.new').on("click", function () {
        emptyALLcellsfromdb();
        init();

    })

    $('.open').on("click", function () {
        let filesPath = dialog.showSaveDialogSync();
        let data = fs.readFileSync(filesPath);
        db = JSON.parse(data);
        updateGUIfromcurrentdb();
    })

    $('.save').on("click", function () {
        let filesPath = dialog.showSaveDialogSync();
        let data = JSON.stringify(db);
        fs.writeFileSync(filesPath, data);
    })

    $('.file').on("click", function () {
        $('.home-menu-options').removeClass('active');
        $('.home').removeClass('active-menu-option');
        $('.file').addClass('active-menu-option');
        $('.file-menu-options').addClass('active');

    })

    $('.home').on("click", function () {
        $('.file-menu-options').removeClass('active');
        $('.home-menu-options').addClass('active');
        $('.home').addClass('active-menu-option');
        $('.file').removeClass('active-menu-option');
    })

    $('#bold').on("click", function () {
        let cellObject = getCellObject(lsc);
        $(lsc).css("font-weight", cellObject.bold ? "normal" : "bold");
        cellObject.bold = !cellObject.bold;

        //side bar ko adjust krna ....
        let height = $(lsc).height();
        let rid = $(lsc).attr("rid");
        $(`.left-col-cell[cellId=${rid}]`).height(height);

    })

    $('#italic').on("click", function () {
        let cellObject = getCellObject(lsc);
        $(lsc).css("font-style", cellObject.italic ? "normal" : "italic");
        cellObject.italic = !cellObject.italic;
    })

    $('#underline').on("click", function () {
        let cellObject = getCellObject(lsc);
        $(lsc).css("text-decoration", cellObject.underline ? "none" : "underline");
        cellObject.underline = !cellObject.underline;
    })

    $("#font-size").on("change", function () {
        let fontSize = $(this).val();
        // console.log(fontSize);
        $(lsc).css("font-size", fontSize + "px");
        let cellObject = getCellObject(lsc);
        cellObject.fontSize = fontSize + "px";

    })

    $("#left").on("click", function () {
        let cellObject = getCellObject(lsc);

        $(lsc).css("text-align", "left");
        cellObject.textAlign.left = !cellObject.textAlign.left;
    })

    $("#centre").on("click", function () {
        let cellObject = getCellObject(lsc);

        $(lsc).css("text-align", "center");
        cellObject.textAlign.center = !cellObject.textAlign.center;
    })

    $("#right").on("click", function () {
        let cellObject = getCellObject(lsc);

        $(lsc).css("text-align", "right");
        cellObject.textAlign.right = !cellObject.textAlign.right;
    })

    $('#font-select').on("change", function () {
        let fonttype = $(this).val();
        $(lsc).css("font-family", fonttype);
        let cellObject = getCellObject(lsc);
        cellObject.fonttype = fonttype;
    })

    $('#cell-font').on("change", function () {
        let color = $(this).val();
        let cellObject = getCellObject(lsc);
        $(lsc).css("color", color);
        cellObject.cellfontcolor = color;
    })

    $('#cell-background').on("change", function () {
        let color = $(this).val();
        let cellObject = getCellObject(lsc);
        $(lsc).css("background-color", color);
        cellObject.cellbackground = color;
    })

    function getCellObject(element) {
        let rowId = Number($(element).attr("rid"));
        let colId = Number($(element).attr("cid"));
        let cellObject = db[rowId][colId];
        return cellObject;
    }
    // ===============================top options code end===========================================

    //scroll ko adjust
    $(".content").on("scroll", function () {
        let left = $(this).scrollLeft();
        let top = $(this).scrollTop();
        // console.log(left+"  "+top);
        $(".top-row").css("top", top + "px");
        $(".top-left-cell").css("top", top + "px");
        $(".top-left-cell").css("left", left + "px");
        $(".left-col").css("left", left + "px");
    })

    //height ko adjust side ki
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
            let maxrowcolobj = db[100][26];
            maxrowcolobj.trow = Math.max(Number(maxrowcolobj.trow), rowId);
            maxrowcolobj.tcol = Math.max(Number(maxrowcolobj.tcol), colId);
            db[rowId][26].flag = true;
            db[100][colId].flag = true;
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






    // =================================footer -sheets -section======================

    $('.addsheet').on("click", function () {
        emptyALLcellsfromdb();
        $(".sheets .allsheets .sheet.active-sheet-option").removeClass('active-sheet-option');
        let sheet = `<div class="sheet active-sheet-option" sid="${sheetsDB.length}">Sheet ${sheetsDB.length + 1}</div>`;

        $(".allsheets").append(sheet);

        $(".sheet.active-sheet-option").on("click", function () {
            let isActive = $(this).hasClass("active-sheet-option");
            if (!isActive) {
                emptyALLcellsfromdb();
                let index = Number($(this).attr("sid"));
                db = sheetsDB[index];
                $(".sheet.active-sheet-option").removeClass('active-sheet-option');
                $(this).addClass("active-sheet-option");
                updateGUIfromcurrentdb();
                // console.log(isActive);
            }
        })
        init();
    })


    $('.sheet').on("click", function () {
        let isActive = $(this).hasClass("active-sheet-option");
        if (!isActive) {
            emptyALLcellsfromdb();
            let index = Number($(this).attr("sid"));
            db = sheetsDB[index];
            $(".sheet.active-sheet-option").removeClass('active-sheet-option');
            $(this).addClass("active-sheet-option");
            updateGUIfromcurrentdb();
            // console.log(isActive);
        }
    })


    // ===========================================================================




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

function updateGUIfromcurrentdb() {
    let objrowcol = db[100][26];
    for (let i = 0; i <= Number(objrowcol.trow); i++) {
        if (db[i][26].flag) {
            for (let j = 0; j <= Number(objrowcol.tcol); j++) {
                if (db[100][j].flag) {
                    let cellObject = db[i][j];
                    $(`.cell[rid=${i}][cid=${j}]`).text(cellObject.value);
                }
            }
        }
    }
}

function emptyALLcellsfromdb() {
    let objrowcol = db[100][26];
    for (let i = 0; i <= Number(objrowcol.trow); i++) {
        if (db[i][26].flag) {
            for (let j = 0; j <= Number(objrowcol.tcol); j++) {
                if (db[100][j].flag) {
                    let curr = $(`.cell[rid=${i}][cid=${j}]`);
                    $(curr).html("");
                    $(curr).css("background-color", "white");
                    $(lsc).css("color", "black");
                }
            }
        }
    }

}

function init() {
    let curdb = [];
    for (let i = 0; i < 100; i++) {
        let rdb = [];
        for (let j = 0; j < 26; j++) {
            let cellAddress = String.fromCharCode(65 + j) + (i + 1);
            let cellObject = {
                name: cellAddress,
                value: "",
                formula: "",
                children: [],
                parents: [],
                bold: false,
                italic: false,
                underline: false,
                textAlign: { left: true, center: false, right: false },
                fontSize: "16px",
                fonttype: "Times New Roman",
                cellfontcolor: "black",
                cellbackground: "white"
            }
            rdb.push(cellObject);
        }
        let rowend = {
            flag: false
        }
        rdb.push(rowend);
        curdb.push(rdb);
    }

    let finalrow = [];
    for (let i = 0; i < 26; i++) {
        let colend = {
            flag: false
        }
        finalrow.push(colend);
    }
    //final db[100][26]
    let rowcolc = {
        trow: "0",
        tcol: "0"
    }
    finalrow.push(rowcolc);
    curdb.push(finalrow);
    db = curdb;
    sheetsDB.push(curdb);
    console.log(sheetsDB);

}