const fs = require("fs");

console.log("start");
fs.readFile("./f1.txt", cb);
function cb(error, data) {
    console.log("data file 1  " + data);
}


fs.readFile("./f2.txt", cb);
function cb(error, data) {
    console.log("data file 2  " + data);
}
console.log("end");