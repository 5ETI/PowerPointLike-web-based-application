"use strict";

//module.exports = SlidModel;

var fs = require("fs");
var path = require("path");
var  CONFIG  =  require("../../config.json");
process.env.CONFIG  =  JSON.stringify(CONFIG);


var SlidModel=function(smodel) {

	smodel=check_attr(smodel);
	this.type = smodel.type;
	this.id = smodel.id;
	this.title = smodel.title; 
	this.fileName = smodel.fileName;

	var data = smodel.data;

	this.getData = function() { 
		return this.data;
	}

	this.setData = function(data2) { 
		if (data2 === "undefined") {return -1;}
		this.data = data2;
	}

	function check_attr(smodel){
		if(typeof smodel === "undefined")
		{
			smodel={type: null, id: null, title: null, filename: null, data: null};
		}
		return smodel;
	}

}


SlidModel.create = function(slid,callback) {

	if(slid.id === "undefined" ) {
		return console.error("L'id ne peut pas être nulle");
	}
	if(slid.filename === "undefined") {
		return console.error("Le filename ne peut pas être nul");
	}

	fs.writeFile(path.join(CONFIG.contentDirectory, slid.fileName), slid.data, function(err) {
		if (err) {
			return console.log(err); //return console.error(err);
		}
		console.log('CREATED ' + slid.id);
		fs.writeFile(path.join(CONFIG.contentDirectory, slid.id + ".meta.json"), JSON.stringify(slid), function(err) {
			if (err) {
				return console.log(err);
			}
			console.log('CREATED ' + slid.id);
			callback(err);
		});
	});

};

SlidModel.read = function(id,callback) {

	if(id === "undefined") {
		return console.error("L'id ne peut pas être nulle");
	}
	fs.readFile(path.join(CONFIG.contentDirectory, id + ".meta.json"), 'utf8', function(err,data) {  
		if (err) {
			return console.log(err);
		}
		
		var obj = JSON.parse(data);
		var slid = new SlidModel(obj);
		//console.log("fichier lu");
		callback(err,slid);

	});

};

SlidModel.update = function(slid,callback) {



	if (slid.getData() && slid.getData().length > 0){
		if(slid.id === "undefined") {
			return console.error("L'id ne peut pas être nulle");
		}
		if(slid.fileName === "undefined") {
			return console.error("Le filename ne peut pas être nul");
		}
		fs.writeFile(path.join(CONFIG.contentDirectory, slid.fileName), slid.data, function(err) {
			
			if (err) {
				return console.log(err);
			}
			
			console.log('UPDATED: ' + slid.id);
			fs.writeFile(path.join(CONFIG.contentDirectory, slid.id + ".meta.json"), JSON.stringify(slid), function(err) {
				if (err) {
					return console.log(err);
				}
				console.log('UPDATED ' + slid.id);
				callback(err);
			});
		});
	}
};


SlidModel.delete = function(id,callback) {


	fs.readFile(path.join(CONFIG.contentDirectory, id + ".meta.json"), 'utf8', function(err,data) {  
		if (err) {
			return console.log(err);
		}
		var obj = JSON.parse(data);
		console.log(obj);
		var filename = obj["fileName"];
		console.log(filename);
		fs.unlink(path.join(CONFIG.contentDirectory, filename),function(err){
			if(err) {
				return console.log(err);
			} 
			console.log('file deleted successfully');
			fs.unlink(path.join(CONFIG.contentDirectory, id + ".meta.json"),function(err){
				if(err) {
					return console.log(err);
				} 
				console.log('file deleted successfully');
				callback(err);
			});
		});

	});

}

module.exports = SlidModel;


