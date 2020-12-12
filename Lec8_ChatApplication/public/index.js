let ch = document.querySelector("#send");
let type = document.querySelector("#type");
let content = document.querySelector(".content");
ch.addEventListener("click", function () {
    let divo = document.createElement("div");
    divo.classList.add("right");
    let name = document.createElement("div");
    name.classList.add("name");
    let txt = type.value;
    console.log(txt);
    let message = document.createElement("div");
    message.classList.add("message");
    

    divo.appendChild(name);
    divo.appendChild(message);
    message.innerHTML = txt;
    name.innerHTML="Shubham"
    content.appendChild(divo);
    type.value = "";
})