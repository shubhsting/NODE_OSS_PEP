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