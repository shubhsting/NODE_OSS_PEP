let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let { top: topOffSet } = canvas.getBoundingClientRect();
let mousedownflag = false;
canvas.height = window.innerHeight - topOffSet;
canvas.width = window.innerWidth;

let undo = [];
canvas.addEventListener("mousedown", function (e) {
    mousedownflag = true;
    ctx.beginPath();
    let x = e.clientX;
    let y = e.clientY - topOffSet;
    ctx.moveTo(x, y);
    let point = {
        id: "md",
        x: x,
        y: y,
        color: ctx.strokeStyle,
        w: ctx.lineWidth
    }
    undo.push(point);
})

canvas.addEventListener("mousemove", function (e) {
    if (mousedownflag) {
        let x = e.clientX;
        let y = e.clientY - topOffSet;
        ctx.lineTo(x, y);
        let point = {
            id: "mm",
            x: x,
            y: y,
            color: ctx.strokeStyle,
            w: ctx.lineWidth
        }
        undo.push(point);
        ctx.stroke();
    }
})

canvas.addEventListener("mouseup", function (e) {
    mousedownflag = false;
})