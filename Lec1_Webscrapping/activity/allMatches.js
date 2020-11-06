let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let match = require("./match.js");
const addthisMatch = require("./match.js");


let link = "https://www.espncricinfo.com/scores/series/8039/season/2019/icc-cricket-world-cup?view=results";


request(link, cb);


function cb(error, response, html) {
    let $ = cheerio.load(html);

    let allscorecard = $('a[data-hover="Scorecard"]');

    for (let i = 0; i < allscorecard.length; i++) {

        let link = $(allscorecard[i]).attr("href");
        let completeLink = "https://www.espncricinfo.com" + link;
        addthisMatch(completeLink);
    }

}