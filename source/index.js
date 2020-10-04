//const express = require('express');
const express = require('express');
const { Server } = require('http');
const app = express()
const port = 3000
const fetch = require('node-fetch');
const bodyParser = require("body-parser");
const cors = require('cors');
//const performance = require('performance-now')
const {performance} = require('perf_hooks');

//reading limitations from the txt file
//const Txt = require('./ReadingTxt');
//Txt.ReadingTxt('info.txt');

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//1601140222422
//month - 2592000000
//week - 604800000
//day - 86400000 
const month = 2592000000;
const week = 604800000;
const day = 86400000;

var timeout = require('connect-timeout');
app.use(timeout('5s'));
app.use(cors());

//date variables
let currentDate = new Date();
let lastMonth = currentDate - month;
let lastWeek = currentDate - week;
let lastDay = currentDate - day;

//stats api variables
let numOfCalls = 0;
let callTimes = 0;


//fetch
let earthquake = require('./returnData');

app.disable('x-powered-by');

statsApi();

app.get('/num', (req,res) =>{
    statsApi();
    res.send("updated");
})

async function statsApi(res) {
    console.log();
    fetch('http://localhost:3100/', {
        method: 'POST',
        headers: {
            'Accept': 'application/ json, text/plain, /',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ numOfCalls,callTimes})
    }
    ).catch(error => {
        console.log("statsApi fetch problem: " + error);
    });
}


function Retrive_Send(time, res) {
    //time at begging of the function
    let bTime = performance.now();
    earthquake.returnData(time).then(
        //data received from earthquake, sent to weather(location)
        potres => {
            earthquake.weather(potres).then(
                potres => {
                    //all varibales returned, and sent with callback
                    earthquake.callback(potres, res);
                    ++numOfCalls;
                    console.log("num of calls: " + numOfCalls);
                    //time at end of function
                    let eTime = performance.now();
                    callTimes = eTime - bTime;
                    //console.log("TIME RETRIVE : " + callTimes)
                    statsApi(res);
                }
            ).catch(error => {
                console.log(error + "ERROR");
                res.send(error + "");
            })
        }
    ).catch(error => {
        console.log(error + "ERROR");
        res.send(error + "");
    })
}


function Retrive_Send_Recent(res) {
    let bTime = performance.now();
    earthquake.returnRecent().then(
        potres => {
            earthquake.weather(potres).then(
                potres => {
                    earthquake.callback(potres, res);
                    ++numOfCalls;
                    let eTime = performance.now();
                    callTimes = eTime - bTime;
                    statsApi();
                }
            ).catch(error => {
                console.log(error + "ERROR");
                res.send(error + "");
            })
        }
    ).catch(error => {
        console.log(error + "ERROR");
        res.send(error + "");
    })
}


app.get('/potresi/rekordDneva', (req, res) => {
    Retrive_Send(lastDay, res);
})

app.get('/potresi/rekordTedna', (req, res) => {
    Retrive_Send(lastWeek, res);
})


app.get('/potresi/rekordMeseca', (req, res) => {
    Retrive_Send(lastMonth, res);
})

app.get('/potresi/zadnji', (req, res) => {
    Retrive_Send_Recent(res);
})




app.listen(port, () => {
    console.log(`http://localhost:${port}`)
});


