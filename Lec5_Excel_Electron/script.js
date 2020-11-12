const $ = require("jquery");

let db;
let lsc;
$("document").ready(function () {
    
    init();



    $('.cell').on("click", function () {
        let rowId = Number($(this).attr("rid")) + 1;
        let colId = Number($(this).attr("cid"));
        let currObj=db[rowId][colId];
        $("#address").val(currObj.name);
        $("#formula").val(currObj.formula);
    });



    $('.cell').on("blur", function () {
        lsc=this;
        let val = $(this).text();
        let rowId = Number($(this).attr("rid"));
        let colId = Number($(this).attr("cid"));
        let cellObject = db[rowId][colId];
        if (cellObject.value != val) {
            cellObject.value = val;
        }
        console.log(db);
    });




    $('#formula').on('blur', function () {
        let nformula = $(this).val();         //( A1 + A2 )


        let activecell = $('#address').val();  //B1

        let { rowId, colId } = getrcidfromAddress(activecell);

        let activeObject = db[rowId][colId];

        if (activeObject.formula != nformula) {
            let nvalue = calculatevalueForFormula(nformula);
            activeObject.formula = nformula;
            activeObject.value = nvalue;
            $(lsc).text(nvalue);
            console.log(db);
        }
    })

})



function calculatevalueForFormula(formula) {
    let fcomponents = formula.split(" ");
    //[ ( , A1 , + , A2 , ) ]
    for (let i = 0; i < fcomponents.length; i++) {
        let smallcomp = fcomponents[i];
        if (smallcomp[0] >= "A" && smallcomp[0] <= "Z") {
            let { rowId, colId } = getrcidfromAddress(smallcomp);

            let parentObject = db[rowId][colId];//database
            let parentvalue = parentObject.value; //value aa gyi
            formula = formula.replace(smallcomp, parentvalue);
        }

    }

    let value = eval(formula);
    return value;
}


function getrcidfromAddress(address) {
    let rowId = Number(address.substring(1)) - 1;
    let colId = address.charCodeAt(0) - 65;
    return { rowId: rowId, colId: colId };
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
                formula: ""
            }
            rdb.push(cellObject);
        }
        db.push(rdb);
    }
    console.log(db);

}