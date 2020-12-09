let img = document.querySelectorAll("img");

var imgURL = chrome.runtime.getURL("./images/clearall.png");




chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        for (let i = 0; i < img.length; i++) {
            img[i].src = imgURL;
        }
        if (request.greeting == "hello")
            sendResponse({ farewell: "goodbye" });
    });