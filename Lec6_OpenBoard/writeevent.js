let write = document.getElementById("pencil");
let erase = document.getElementById("eraser");
let poptions = document.getElementById("pencil-options");
let erptions = document.getElementById("eraser-options");


let pencilSize = document.querySelector("#pencilSize");
let eraserSize = document.querySelector("#eraserSize");
let red = document.querySelector(".red");
let yell = document.querySelector(".yellow");
let blue = document.querySelector(".blue");
let black = document.querySelector(".black");
let activetool = "pencil";

write.addEventListener("click", function (e) {

    if (activetool == "pencil") {
        let flag = poptions.classList.contains("hide");
        if (flag) {
            poptions.classList.remove("hide");
        }
        else {
            poptions.classList.add("hide");
        }
    }
    else {
        console.log(ctx.strokeStyle);
        activetool = "pencil";
        ctx.strokeStyle = "black";
        ctx.lineWidth = pencilWidth;
        erptions.classList.add("hide");
        erase.classList.remove("nightmode");
        write.classList.add("nightmode");
        let flag = modediv.classList.contains("nightmode");
        if (flag)
            ctx.strokeStyle = "white";
    }


})

erase.addEventListener("click", function (e) {
    if (activetool == "eraser") {
        let flag = erptions.classList.contains("hide");
        if (flag) {
            erptions.classList.remove("hide");
        }
        else {
            erptions.classList.add("hide");
        }
    }
    else {
        activetool = "eraser";
        ctx.strokeStyle = "white";
        ctx.lineWidth = eraserWidth;
        poptions.classList.add("hide");
        write.classList.remove("nightmode");
        erase.classList.add("nightmode");
        let flag = modediv.classList.contains("nightmode");
        if (flag)
            ctx.strokeStyle = "black";
    }
})

// ============================================ color change============================

red.addEventListener("click", function (e) {
    ctx.strokeStyle = "red";
})
yell.addEventListener("click", function (e) {
    ctx.strokeStyle = "yellow";
})
blue.addEventListener("click", function (e) {
    ctx.strokeStyle = "blue";
})
black.addEventListener("click", function (e) {
    if (modediv.classList.contains("nightmode")) {
        ctx.strokeStyle = "white";
    }
    else { ctx.strokeStyle = "black"; }
})



//===========================================size change================================

let pencilWidth = 1;
let eraserWidth = 1;
pencilSize.addEventListener("change", function (e) {
    let size = e.target.value;
    pencilWidth = size;
    ctx.lineWidth = pencilWidth;
})

eraserSize.addEventListener("change", function (e) {
    let size = e.target.value;
    eraserWidth = size;
    ctx.lineWidth = eraserWidth;
})