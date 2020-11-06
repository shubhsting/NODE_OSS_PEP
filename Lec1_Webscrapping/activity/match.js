let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
const { parse } = require("path");
// let link = "https://www.espncricinfo.com/series/8039/scorecard/1144530/england-vs-new-zealand-final-icc-cricket-world-cup-2019";


function addthisMatch(link) {
    request(link, cb);
}
function cb(error, response, html) {
    parseData(html);
}




function parseData(html) {
    let $ = cheerio.load(html);

    let bothInnings = $(".card.content-block.match-scorecard-table .Collapsible");


    for (let i = 0; i < 2; i++) {
        let teamName = $(bothInnings[i]).find(".header-title.label").text();

        teamName = teamName.split("Innings")[0].trim();
        let allTrs = $(bothInnings[i]).find(".table.batsman tbody tr");
        for (let idx = 0; idx < allTrs.length; idx++) {
            let allTds = $(allTrs[idx]).find("td");

            if (allTds.length > 4) {
                let batsmanName = $(allTds[0]).find("a").text().trim();
                let runs = $(allTds[2]).text().trim();
                let balls = $(allTds[3]).text().trim();
                let fours = $(allTds[5]).text().trim();
                let sixes = $(allTds[6]).text().trim();
                let strikeRate = $(allTds[7]).text().trim();
                // String interpolation
                // console.log(`Batsman = ${batsmanName} Runs = ${runs} Balls = ${balls} Fours = ${fours} Sixes = ${sixes} SR = ${strikeRate}`);
                processDetails(teamName, batsmanName, runs, balls, fours, sixes, strikeRate);


                addScorecard(teamName, batsmanName, runs, balls, fours, sixes);
            }
        }


    }
}

function addScorecard(teamName, batsmanName, runs, balls, fours, sixes) {
    let temp = fs.existsSync("SCORECARD.json");

    let inning = {
        tName: teamName,
        bName: batsmanName,
        Runs: runs,
        Balls: balls,
        Fours: fours,
        Sixes: sixes,
    }

    if (temp) {
        let file = fs.readFileSync("SCORECARD.json");
        file = JSON.parse(file);
        for (var i = 0; i < file.length; i++) {
            var obj = file[i];
            if (obj.tName == teamName && obj.bName == batsmanName) {

                obj.Runs = parseInt(obj.Runs) + parseInt(runs);
                obj.Balls = parseInt(obj.Balls) + parseInt(balls);
                obj.Fours = parseInt(obj.Fours) + parseInt(fours);
                obj.Sixes = parseInt(obj.Sixes) + parseInt(sixes);
                file = JSON.stringify(file);
                fs.writeFileSync("SCORECARD.json", file);
                return;
            }
        }
        file.push(inning);
        file = JSON.stringify(file);
        fs.writeFileSync("SCORECARD.json", file);

    }
    else {
        let file = [];
        file.push(inning);
        file = JSON.stringify(file);
        fs.writeFileSync("SCORECARD.json", file);
    }
}

function processDetails(teamName, batsmanName, runs, balls, fours, sixes, strikeRate) {
    let folderpresent = checkfolder(teamName);
    if (folderpresent) {

        addFile(teamName, batsmanName, runs, balls, fours, sixes, strikeRate);
    }
    else {
        createFolder(teamName);
        addFile(teamName, batsmanName, runs, balls, fours, sixes, strikeRate);
    }

}
function findbatsmanFile(teamName, batsmanName) {
    let batsmanPath = teamName + "/" + batsmanName + ".json";
    return fs.existsSync(batsmanPath);
}
function addFile(teamName, batsmanName, runs, balls, fours, sixes, strikeRate) {
    let isBatsman = findbatsmanFile(teamName, batsmanName);
    if (isBatsman) {
        updateBatsmanFile(teamName, batsmanName, runs, balls, fours, sixes, strikeRate);
    }
    else {
        createBatsmanFile(teamName, batsmanName, runs, balls, fours, sixes, strikeRate);
    }

}
function updateBatsmanFile(teamName, batsmanName, runs, balls, fours, sixes, strikeRate) {
    let batsmanPath = teamName + "/" + batsmanName + ".json";
    let Batsmanfile = fs.readFileSync(batsmanPath);
    Batsmanfile = JSON.parse(Batsmanfile);

    let inning = {
        Runs: runs,
        Balls: balls,
        Fours: fours,
        Sixes: sixes,
        SR: strikeRate
    }

    Batsmanfile.push(inning);
    Batsmanfile = JSON.stringify(Batsmanfile);
    fs.writeFileSync(batsmanPath, Batsmanfile);
}
function createBatsmanFile(teamName, batsmanName, runs, balls, fours, sixes, strikeRate) {
    let batsmanPath = teamName + "/" + batsmanName + ".json";
    let Batsmanfile = [];
    let inning = {
        Runs: runs,
        Balls: balls,
        Fours: fours,
        Sixes: sixes,
        SR: strikeRate
    }

    Batsmanfile.push(inning);
    Batsmanfile = JSON.stringify(Batsmanfile);
    fs.writeFileSync(batsmanPath, Batsmanfile);
}
function checkfolder(teamName) {
    return fs.existsSync(teamName);
}

function createFolder(teamName) {
    fs.mkdirSync(teamName);
}




module.exports = addthisMatch;