"use strict";

var path = require("path");
var SlidModel = require("../models/slid.model.js");
var CONFIG = require("./../../config.json");
process.env.CONFIG = JSON.stringify(CONFIG);

var slid = new SlidModel();

exports.listen = function(httpServer){

	    // IO server connection
	    if(httpServer == undefined)
	    	return;
	    var io = require("socket.io").listen(httpServer);


    // Handling IO events
    io.sockets.on("connection", function (socket) {
        // First thing is notifying the client in order to get his ID from 'data_comm' event
        socket.emit("connection");

        socket.on("data_comm", function(data){
        	console.log("Socket connection on ID: " + data.id);
        	var map = {};
        	map[data.id] = socket;

        });

        socket.on("slidEvent", function(data){

        	var obj = JSON.parse(data);
        	if (obj[CMD] != "PAUSE") {

        		var id = obj[PRES_id];

        		SlidModel.read(id, function(err, slid) {
        			if (err) {
        				console.error(err);
        			} else {
        				slid.src = path.join(CONFIG.contentDirectory, slid.id + ".meta.json");
        				socket.broadcast.emit('Slid meta data', slid);
        			}
        		});

        	}


        });
    });

}