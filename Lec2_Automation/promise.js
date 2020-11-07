
let fs = require("fs");

function readFilePromise(filePath){
    // a new pending promise is returned
    return new Promise( function( resolve , reject){
        fs.readFile(filePath , function(error , data){
            if(error){
                // error aagya
                reject(error);
            }
            else{
                // data aa chuka hai
                resolve(data);
            }
        });
    });
}




let pendingpromise = readfilePromise("./fi1.txt");

pendingpromise.then(function (data) {
    console.log("data found");
})

pendingpromise.catch(function (data) {
    console.log("data found");
})

