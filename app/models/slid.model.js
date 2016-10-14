"use strict";

module.exports = SlidModel;

var fs = require("fs");
var path = require("path");
var  CONFIG  =  require("../../config.json");
process.env.CONFIG  =  JSON.stringify(CONFIG);

function SlidModel () {

	this.type = '';
	this.id = '';
	this.title = ''; 
	this.fileName = '';

	var data = '';

	this.getData = function() { return this.data; }
	this.setData = function(data) { this.data = data; }

}

function SlidModel (type, id, title, fileName, data) {

	this.type = type;
	this.id = id;
	this.title = title; 
	this.fileName = fileName;

	var data = data;

	this.getData = function() { return this.data; }
	this.setData = function(data) { this.data = data; }

}



SlidModel.create = function(slid,callback) {


	fs.writeFile(path.join(CONFIG.contentDirectory, slid.fileName), slid.data, function(err) {
		if(slid.id == null) {
			return console.log("L'id ne peut pas être nulle");
		}
		if (err) {
			return console.log(err);
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

	fs.readFile(path.join(CONFIG.contentDirectory, id + ".meta.json"), 'utf8', function(err,data) {  
		if(id == null) {
			return console.log("L'id ne peut pas être nulle");
		}
		if (err) {
			return console.log(err);
		}
		
		var obj = JSON.parse(data);
		console.log("fichier lu");
		callback(err,obj);

	});

};

SlidModel.update = function(slid,callback) {



	if (slid.getData() && slid.getData().length > 0){
		fs.writeFile(path.join(CONFIG.contentDirectory, slid.fileName), slid.data, function(err) {
			if(slid.id == null) {
				return console.log("L'id ne peut pas être nulle");
			}
			if(slid.fileName === undefined) {
				return console.log("Le filename ne peut pas être nul");
			}
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

	

};
