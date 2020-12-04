let undos = document.getElementById("undo");
let redost = document.getElementById("redo");
let clear = document.getElementById("clearall");
let dnld = document.getElementById("download");
let redo = [];

// ============================ undo function ========================
undos.addEventListener("click", function (e) {
    undos.classList.add("nightmode");
    if (undo.length == 0) {
        setTimeout(function () {
            undos.classList.remove("nightmode");
        }, 300);
        return;
    }
    let pt = undo.pop();
    redo.push(pt);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    redraw();

    setTimeout(function () {
        undos.classList.remove("nightmode");
    }, 300);
})

// =========================redo function========================
redost.addEventListener("click", function (e) {
    redost.classList.add("nightmode");
    if (redo.length == 0) {
        setTimeout(function () {
            redost.classList.remove("nightmode");
        }, 300);
        return;
    }
    let pt = redo.pop();
    undo.push(pt);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    redraw();
    setTimeout(function () {
        redost.classList.remove("nightmode");
    }, 300);
})


function redraw() {
    for (let i = 0; i < undo.length; i++) {
        let pt = undo[i];
        if (pt.id == "md") {
            ctx.strokeStyle = pt.color;
            ctx.lineWidth = pt.w;
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
        }
        else {
            ctx.strokeStyle = pt.color;
            ctx.lineWidth = pt.w;
            ctx.lineTo(pt.x, pt.y);
            ctx.stroke();
        }
    }
}
// =======================clearall function=============================

clear.addEventListener("click", function (e) {
    clear.classList.add("nightmode");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setTimeout(function () {
        clear.classList.remove("nightmode");
    }, 300);
    undo = [];
    redo = [];
    socket.emit("clearall", undo);
})




// ====================================Download button========================


dnld.addEventListener("click", function (e) {
    dnld.classList.add("nightmode");
    let link = document.getElementById('canvas').toDataURL();
    let elem = document.createElement('a');
    elem.setAttribute("download", "canvas.png");
    let flag = modediv.classList.contains("nightmode");
    elem.setAttribute("href", link);
    //     link.download = 'canvas.png'
    //     link.href = document.getElementById('canvas').toDataURL()


    elem.click();
    setTimeout(function () {
        dnld.classList.remove("nightmode");
    }, 300);


    // console.log("clicked");
})