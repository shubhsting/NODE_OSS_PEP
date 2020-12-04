let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let { top: topOffSet } = canvas.getBoundingClientRect();
let toolbox = document.querySelector(".toolbox");
let tools = document.querySelector(".tools");
let mousedownflag = false;
canvas.height = window.innerHeight - topOffSet;
canvas.width = window.innerWidth;

let undo = [];
tools.addEventListener("mouseover", function (e) {
    if (!mousedownflag)
        toolbox.classList.remove("hide");
})
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
    socket.emit("mousedown", point);
    toolbox.classList.add("hide");
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
        socket.emit("mousemove", point);
        ctx.stroke();
    }

})

canvas.addEventListener("mouseup", function (e) {
    mousedownflag = false;
})