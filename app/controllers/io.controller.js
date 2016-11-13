"use strict";

var path = require("path");
var SlidModel = require("../models/slid.model.js");
var CONFIG = require("./../../config.json");
process.env.CONFIG = JSON.stringify(CONFIG);

var stateList = {"PAUSING": 0, "PLAYING": 1};
var playerState = stateList.PAUSING;
var playerDelay = 3000;
var cmdList = {START: "START", PAUSE: "PAUSE", NEXT: "NEXT", PREV: "PREV", BEGIN: "BEGIN", END: "END"};
var socketMap = {};
var curPres = null;
var curSlidIndex = 0;
//var getListFile = require("../../myListFile.js");
var path = require("path");
var SlidModel = require("../models/slid.model.js");;
var CONFIG = JSON.parse(process.env.CONFIG);
var autoPlay = null;


var slid = new SlidModel();

exports.listen = function(httpServer){

	    // IO server connection
	    if(httpServer == undefined)
	    	return;
	    var io = require("socket.io").listen(httpServer);


    // Handling IO events
    io.sockets.on("connection", function (socket) {

        socket.emit("connection");

        socket.on("data_comm", function(id){
        	console.log("Socket connection on ID: " + id);
        	var map = {};
        	map[id] = socket;

        });
    });
}