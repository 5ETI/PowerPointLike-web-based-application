"use strict";

// slid.route.js
var multer = require("multer");
var uiid = require("./../../utils.js");
var SlidController = require("./../controllers/slid.controller.js");
var SlidModel=require("./../models/slid.model.js");
var express = require("express");
var router = express.Router();
module.exports = router;
var multerMiddleware = multer({ "dest": "./../../uploads/" });
var path = require("path");
var CONFIG = require("./../../config.json");
var fs = require("fs");

router.get('/slids',function(request, response){
	SlidController.list(function(err, Slidlist){
		if(err){
			console.error(response.statut(500).end);
			return response.statut(500).end;		
		}
		else{
			console.info(response.json(Slidlist));
			//response.send("ok");
			return response.json(Slidlist);
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
var fname = request.file.filename;
console.log(fname);
var title = ofilename.substr(0, ofilename.lastIndexOf('.'));
var id = fname.substr(0, fname.lastIndexOf('.'));
var type = path.extname(request.file.originalname).substr(1);


var json_file ={};
json_file["id"]= uiid.generateUUID();
json_file["type"]= type;
json_file["title"]=title;
json_file["fileName"]= json_file["id"] + '.' + type;
json_file["data"]=JSON.stringify(request.file);

//console.dir(json_file)

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



router.get("/slids/:id/(:json)?", function(request, response) {

	var params = request.url.split("/");
	var id = params[2];
	var json = '';
	if (params[3]) json = params[3];
	console.dir(json);
	//console.dir(id);
	SlidController.read(id, function (err, slid) {
		if (err) {
			response.status(500).send(err);
		}
		else {
			if(json=="json=true"){
				response.send(JSON.stringify(slid));
			}else{

				var filename = slid.fileName;
				fs.readFile(path.join(CONFIG.contentDirectory, filename), 'utf8', function(err,data) {

					if (err) {
						response.status(500).send(err);
					}
					else{
						response.send(data);
					}	

				});
			}
		}
	});

});

