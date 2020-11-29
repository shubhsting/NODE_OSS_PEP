let modediv = document.getElementById("mode");

modediv.addEventListener("click", function () {
    let flag = modediv.classList.contains("nightmode");
    if (flag) {
        modediv.classList.remove("nightmode");
        document.body.style.backgroundColor = "white";
    }
    else {
        modediv.classList.add("nightmode");
        document.body.style.backgroundColor = "black";
        // setTimeout(function () {
        //     modediv.classList.remove("nightmode");
        // }, 300);
        
    }
})