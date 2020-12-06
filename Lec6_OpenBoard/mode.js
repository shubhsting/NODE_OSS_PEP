let modediv = document.getElementById("mode");
let bl = document.querySelector(".black");
let tbx = document.querySelector(".toolbox");

// ctx.fillStyle = "blue";
// ctx.fillRect(0, 0, canvas.width, canvas.height);


modediv.addEventListener("click", function () {
    socket.emit("modechange", tbx);
    let flag = modediv.classList.contains("nightmode");
    if (flag) {
        modediv.classList.remove("nightmode");
        document.body.style.backgroundColor = "white";
        tbx.style.border = "none";
        invertcolor();
        redraw();
        bl.style.backgroundColor = "black";
        //agar nighmode beech mein hi on kr diya to ye dono honge
        if (write.classList.contains("nightmode")) {
            if (ctx.strokeStyle = "#ffffff" || ctx.strokeStyle == "white") {
                ctx.strokeStyle = "black";
            }
        }
        else {
            if (ctx.strokeStyle == "#000000" || ctx.strokeStyle == "black")
                ctx.strokeStyle = "white";
        }

    }
    else {
        modediv.classList.add("nightmode");
        document.body.style.backgroundColor = "black";
        tbx.style.border = "thick solid #0000FF";
        invertcolor();
        redraw();

        bl.style.backgroundColor = "white";

        //agar nighmode beech mein hi on kr diya to ye dono honge
        if (write.classList.contains("nightmode")) {
            if (ctx.strokeStyle == "#000000" || ctx.strokeStyle == "black")
                ctx.strokeStyle = "white";

        }
        else {
            if (ctx.strokeStyle = "#ffffff" || ctx.strokeStyle == "white") {
                ctx.strokeStyle = "black";
            }
        }

    }
})


function invertcolor() {
    for (let i = 0; i < undo.length; i++) {
        let pt = undo[i];
        if (pt.color == "#000000" || pt.color == "black")
            pt.color = "white";
        else if (pt.color == "#ffffff" || pt.color == "white")
            pt.color = "black";
    }
    for (let i = 0; i < redo.length; i++) {
        let pt = redo[i];
        if (pt.color == "#000000" || pt.color == "black")
            pt.color = "white";
        else if (pt.color == "#ffffff" || pt.color == "white")
            pt.color = "black";
    }
}