const fs = require("fs");
const cheerio = require("cheerio");


const htmlkadata = fs.readFileSync("./index.html");

const $ = cheerio.load(htmlkadata);
let h1KaText = $("h1").text();
console.log(h1KaText);