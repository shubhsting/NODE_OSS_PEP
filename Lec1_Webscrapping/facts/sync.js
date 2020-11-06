
const fs = require("fs");

console.log("start");

let f1kadata = fs.readFileSync("./f1.txt");
console.log("content " +f1kadata);


console.log("end");
