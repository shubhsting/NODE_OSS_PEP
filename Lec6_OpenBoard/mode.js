let modediv = document.getElementById("mode");

modediv.addEventListener("click", function () {
    let flag = modediv.classList.contains("nightmode");
    if (flag) {
        modediv.classList.remove("nightmode");
        document.body.style.backgroundColor = "white";
        for(let i=0;i<undo.length;i++){
            let pt=undo[i];
            pt.color="black";
        }
        for(let i=0;i<redo.length;i++){
            let pt=redo[i];
            pt.color="black";
        }
        redraw();
    }
    else {
        modediv.classList.add("nightmode");
        document.body.style.backgroundColor = "black";
        for(let i=0;i<undo.length;i++){
            let pt=undo[i];
            pt.color="white";
        }
        for(let i=0;i<redo.length;i++){
            let pt=redo[i];
            pt.color="white";
        }
        redraw();
    }
})