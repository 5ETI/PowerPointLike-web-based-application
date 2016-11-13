"use strict";

// slid.route.js
var multer = require("multer");
var uiid = require("./../../utils.js");
var SlidController = require("./../controllers/slid.controller.js");
var SlidModel=require("./../models/slid.model.js");
var express = require("express");
var router = express.Router();

var multerMiddleware = multer({ "dest": "./../../uploads/" });
var path = require("path");
var CONFIG = require("./../../config.json");
process.env.CONFIG  =  JSON.stringify(CONFIG);
var fs = require("fs");


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


//console.dir(" REQUEST BODY: " + request.buffer);
//console.dir(" REQUEST: " + JSON.stringify(JSON.parse(request));

//console.log(request.file.path); // The full path to the uploaded file
//console.log(request.file.originalname); // Name of the file on the user's computer
//console.log(request.file.mimetype); // Mime type of the file

var ofilename = request.file.originalname;
var fname = request.file.filename;
//console.log(fname);
var title = ofilename.substr(0, ofilename.lastIndexOf('.'));
var id = fname.substr(0, fname.lastIndexOf('.'));
var type = path.extname(request.file.originalname).substr(1);




var tmp_path = request.file.path;
    // set where the file should actually exists 
    var target_path = path.join(CONFIG.contentDirectory, ofilename);
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
    	if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
        	if (err) {
        		throw err;
        	}else{
        		var image = ofilename;
        	};
        });

        fs.readFile(target_path, 'utf8', function(err,data) {  
        	if (err) {
        		console.error(response.status(500).end);
        		return response.status(500).end;
        	}				

        	var json_file ={};
        	json_file["id"]= uiid.generateUUID();
        	json_file["type"]= type;
        	json_file["title"]=title;
        	json_file["fileName"]= json_file["id"] + '.' + type;
        	json_file["data"]=data;


        	SlidController.create(json_file, function(err, data){
        		if(err){
        			console.error(response.statut(500).end);
        			return response.statut(500).end;
        		}
        		else{
        			fs.rename(target_path,path.join(CONFIG.contentDirectory,json_file["fileName"]));
        			//response.json(data);
        		}
        	});

        });
    });

response.send(request.files);

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

module.exports = router;

