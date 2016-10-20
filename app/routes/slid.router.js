"use strict";

// slid.route.js
var multer = require("multer");
var SlidController = require("./../controllers/slid.controller.js");
var express = require("express");
var router = express.Router();
module.exports = router;
var multerMiddleware = multer({ "dest": "./../../uploads/" });
var path = require("path");

router.get('/slids',function(request, response){
	SlidController.list(function(err, Slidlist){
		if(err){
			console.error(response.statut(500).end);
			return response.statut(500).end;		}
			else{
				//response.send("ok");
				response.json(Slidlist);
			}
		});
});


router.post("/slids", multerMiddleware.single("file"), function(request,
	response) {

//console.dir(request.file);
console.log(request.file.path); // The full path to the uploaded file
console.log(request.file.originalname); // Name of the file on the user's computer
console.log(request.file.mimetype); // Mime type of the file

var ofilename = request.file.originalname;
var filename = request.file.filename;
var title = ofilename.substr(0, ofilename.lastIndexOf('.'));
var id = filename.substr(0, filename.lastIndexOf('.'));
var type = path.extname(ofilename).substr(1);

var json_file ={};
json_file["id"]= id;
json_file["type"]= type;
json_file["title"]=title;
json_file["filename"]= filename;
json_file["data"]=request.file;

SlidController.create(json_file, function(err, data){
	if(err){
		console.error(response.statut(500).end);
		return response.statut(500).end;
	}
	else{
		response.json(data);
		console.log("data:"+JSON.stringify(data));
	}
});

});




router.get("/slids/:id", function(request, response) {

	var id = request.url.split("/slids/");
	SlidController.read(id[1], function (err, slid) {
		if (err) {
			response.status(500).send("Slid not available. Cause: " + err);
		}
		else {
			response.json(JSON.parse(slid));
		}
	});
});

