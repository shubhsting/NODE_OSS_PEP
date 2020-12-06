socket.on("md", function (point) {
    //mousedown point
    let myStrokeStyle = ctx.strokeStyle;
    let myWidth = ctx.lineWidth;

    ctx.strokeStyle = point.color;
    ctx.lineWidth = point.w;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    toolbox.classList.add("hide");
    undo.push(point);
    ctx.lineWidth = myWidth;
    ctx.strokeStyle = myStrokeStyle;
});

socket.on("mm", function (point) {
    // mousemove point
    let myStrokeStyle = ctx.strokeStyle;
    let myWidth = ctx.lineWidth;

    ctx.strokeStyle = point.color;
    ctx.lineWidth = point.w;
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    undo.push(point);
    ctx.lineWidth = myWidth;
    ctx.strokeStyle = myStrokeStyle;
});

socket.on("staagya", function (stick) {
    let sticky = document.createElement("div");
    sticky.classList.add("sticky");
    console.log("aagya");

    let stickyheader = document.createElement("div");
    stickyheader.classList.add("sticky-header");

    let minimisediv = document.createElement("div");
    minimisediv.classList.add("minimise");

    let imgminimise = document.createElement("img");
    imgminimise.setAttribute("src", "./images/minimise.png");
    imgminimise.setAttribute("id", "imgo");

    minimisediv.appendChild(imgminimise);

    let closediv = document.createElement("div");
    closediv.classList.add("close");

    let imgclose = document.createElement("img");
    imgclose.setAttribute("src", "./images/close.png");
    imgclose.setAttribute("id", "imgo");

    closediv.appendChild(imgclose);


    stickyheader.appendChild(minimisediv);
    stickyheader.appendChild(closediv);

    let stickybody = document.createElement("div");
    stickybody.classList.add("sticky-body");

    let textarea = document.createElement("textarea");
    textarea.setAttribute("id", "textarea");

    textarea.setAttribute("cols", "30");
    textarea.setAttribute("rows", "10");
    sticky.appendChild(stickyheader);

    sticky.appendChild(stickybody);
    stickybody.appendChild(textarea);

    let initialX;
    let initialY;
    let isStickyHold = false;
    stickyheader.addEventListener("mousedown", function (e) {
        isStickyHold = true;
        initialX = e.clientX;
        initialY = e.clientY - topOffSet;
    })

    stickyheader.addEventListener("mousemove", function (e) {
        if (isStickyHold) {
            let finalX = e.clientX;
            let finalY = e.clientY - topOffSet;
            let dy = finalY - initialY;
            let dx = finalX - initialX;

            let { top, left } = sticky.getBoundingClientRect();

            sticky.style.top = top + dy + "px";
            sticky.style.left = left + dx + "px";

            initialX = finalX;
            initialY = finalY;
        }

    })

    stickyheader.addEventListener("mouseup", function (e) {
        isStickyHold = false;
    })

    minimisediv.addEventListener("click", function () {
        textarea.style.display = textarea.style.display == "none" ? "block" : "none";
    })

    closediv.addEventListener("click", function () {
        sticky.remove();
    })

    document.body.appendChild(sticky);
})

socket.on("clrall", function (data) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    undo = [];
    redo = [];
})



socket.on("mc", function (data) {
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



// socket.on("imgcome", function (filePath) {
//     console.log(filePath);

//     let img = document.createElement("img");
//     // <img />
//     // set attribute of img element
//     img.setAttribute("src", filePath)
//     img.classList.add("photo");

//     let sticky = document.createElement("div");
//     sticky.classList.add("sticky");


//     let stickyheader = document.createElement("div");
//     stickyheader.classList.add("sticky-header");

//     let minimisediv = document.createElement("div");
//     minimisediv.classList.add("minimise");

//     let imgminimise = document.createElement("img");
//     imgminimise.setAttribute("src", "./images/minimise.png");
//     imgminimise.setAttribute("id", "imgo");

//     minimisediv.appendChild(imgminimise);

//     let closediv = document.createElement("div");
//     closediv.classList.add("close");

//     let imgclose = document.createElement("img");
//     imgclose.setAttribute("src", "./images/close.png");
//     imgclose.setAttribute("id", "imgo");

//     closediv.appendChild(imgclose);


//     stickyheader.appendChild(minimisediv);
//     stickyheader.appendChild(closediv);

//     let stickybody = document.createElement("div");
//     stickybody.classList.add("sticky-body");

//     let textarea = document.createElement("textarea");
//     textarea.setAttribute("id", "textarea");

//     textarea.setAttribute("cols", "30");
//     textarea.setAttribute("rows", "10");
//     sticky.appendChild(stickyheader);

//     sticky.appendChild(stickybody);
//     // stickybody.appendChild(img);
//     stickybody.appendChild(textarea);

//     document.body.appendChild(sticky);


//     let initialX;
//     let initialY;
//     let isStickyHold = false;
//     stickyheader.addEventListener("mousedown", function (e) {
//         isStickyHold = true;
//         initialX = e.clientX;
//         initialY = e.clientY - topOffSet;
//     })

//     stickyheader.addEventListener("mousemove", function (e) {
//         if (isStickyHold) {
//             let finalX = e.clientX;
//             let finalY = e.clientY - topOffSet;
//             let dy = finalY - initialY;
//             let dx = finalX - initialX;

//             let { top, left } = sticky.getBoundingClientRect();

//             sticky.style.top = top + dy + "px";
//             sticky.style.left = left + dx + "px";

//             initialX = finalX;
//             initialY = finalY;
//         }

//     })

//     stickyheader.addEventListener("mouseup", function (e) {
//         isStickyHold = false;
//     })

//     minimisediv.addEventListener("click", function () {
//         img.style.display = img.style.display == "none" ? "block" : "none";
//     })

//     closediv.addEventListener("click", function () {
//         sticky.remove();
//     })

// })