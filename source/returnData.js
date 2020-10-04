//getting informatino from a specific website
const fetch = require('node-fetch');
const { start } = require('repl');
const express = require('express');
const { response } = require('express');
const { Server } = require('http');
const app = express()

let Website = {
    "magnitude": 0,
    "depth": 0,
    "longitude": 0,
    "latitude": 0,
    "place": "",
    "time": 0,
    "temperature": 0
}

//weather key
const key = 'df74dc3bb7424b4e874111902202909';
const WeatherUrl = 'https://api.worldweatheronline.com/premium/v1/past-weather.ashx?key=' + key + '&q=';
//const WeatherUrl = 'https://api.worldweatheronline.com/premium/v1/past-weather.ashx?key=' + key + '&q=';+ lati +'/' + long + '&format=json&date=' + begDate + '&enddate=' + endDate;

const earthquakeUrl = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&orderby=magnitude&limit=1&starttime=';
//const earthquakeUrl = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&orderby=magnitudelimit=1&starttime=';
const earthquakeRecent = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&orderby=time&limit=';
let pom = {}
//https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&orderby=magnitude&limit=1
//earthquake data
//https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&orderby=magnitude&limit=1&starttime=2014-01-01&endtime=2014-01-02




module.exports = {
    returnRecent: async function (limit = 1) {
        //'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&orderby=magnitude&limit=1&starttime=2014-01-01&endtime=2014-01-02'
        var url = earthquakeRecent + limit;
        console.log("earthquakeRecentURL " + url);
        let response = await fetch(url);
        let EarthquakeData = await response.json();
        //make function to return this data!
        Website.magnitude = EarthquakeData.features[0].properties.mag;
        Website.longitude = EarthquakeData.features[0].geometry.coordinates[0];
        Website.latitude = EarthquakeData.features[0].geometry.coordinates[1];
        Website.depth = EarthquakeData.features[0].geometry.coordinates[2];
        Website.place = EarthquakeData.features[0].properties.place;
        Website.time = EarthquakeData.features[0].properties.time;
        return Website;

    },

    returnData: async function (startDate, endDate = 0) {
        console.log("FUNCTION END/start DATE.. " + endDate + "   " + startDate);
        //if undefined we take current time - possible upgrade to search between a given date
        if (endDate == 0 || endDate == "") {
            endDate = returnDate(new Date());
            console.log("current date " + endDate);
        }
        startDate = returnDate(startDate);
        //'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&orderby=magnitude&limit=1&starttime=2014-01-01&endtime=2014-01-02'
        var url = earthquakeUrl + startDate + '&endtime=' + endDate;
        console.log("earthquake url " + url);
        try {
            let response = await fetch(url);
            let EarthquakeData = await response.json();

            Website.magnitude = EarthquakeData.features[0].properties.mag;
            Website.longitude = EarthquakeData.features[0].geometry.coordinates[0];
            Website.latitude = EarthquakeData.features[0].geometry.coordinates[1];
            Website.depth = EarthquakeData.features[0].geometry.coordinates[2];
            Website.place = EarthquakeData.features[0].properties.place;
            Website.time = EarthquakeData.features[0].properties.time;
            //sending long/lati/time to retrive weather
            //Website.temperature = weather(Website.longitude, Website.latitude, Website.time);
            console.log("WEBSITE : " + Website.magnitude);
        } catch (error) {
            //error type = object
            console.log(typeof error);
            return error;
        }
        //[object Object] - json array?
        return Website;

    },
    weather: async function (Website) {

        //2020-09-18T21:43:58.936Z
        //date y-m-d
        var date = new Date(Website.time);
        console.log("FULLTIME " + Website.time);

        //hours
        var time = date.toISOString().substring(11, 13);
        //hmm worldweatheronline (exact time only - 1200 = 12:00)
        date = returnDate(Website.time);
        console.log("date " + date);

        var url = WeatherUrl + Website.latitude + ',' + Website.longitude + '&format=json&date=' + date + '&enddate=' + date + '&tp=1';
        //tp - time updates everyhour (default 3)
        console.log("Weather url " + url);
        try {
            let response = await fetch(url);
            let WeatherData = await response.json();
            time = parseInt(time);
            console.log("Time " + time);
            Website.temperature = WeatherData.data.weather[0].hourly[time].tempC;
            console.log("WEATHER DATA " + WeatherData);
            console.log("WEATHER WEATHER " + Website.place + " " + Website.temperature);
        } catch (error) {
            Website.temperature = "no nearby places";
        }
        return Website;
    },

    callback: function (x, res) {
        console.log("CALLBACK " + x);
        res.send(x);

    }

}


function returnDate(milliseconds) {
    var date = new Date(milliseconds);
    return date.toISOString().substring(0, 10);
}

