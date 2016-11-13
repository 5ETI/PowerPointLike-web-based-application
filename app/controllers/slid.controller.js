var SlidModel=require("./../models/slid.model.js");
var CONFIG = require("./../../config.json");
process.env.CONFIG  =  JSON.stringify(CONFIG);
var path = require("path");
var fs = require("fs");

var list = function(callback){
  var dirpath = path.resolve(path.dirname(require.main.filename), CONFIG.contentDirectory);

  fs.readdir(CONFIG.contentDirectory, function (err, files) {
    if (err) {
      console.error(response.statut(500).end);
      return response.statut(500).end;
    }
    var filteredFiles;
    files.filter(function (file) {
      filteredFiles = files.filter(extension);
    });

    var slid_list = {};
    var i= 0;
    filteredFiles.forEach(function (file) {

      var sfile = require(path.join(dirpath, file));

      SlidModel.read(sfile.id, function(err, slid){
       if(err){

         return callback("Error reading content: " + err);
       }
       else{

        var slide = new SlidModel(slid);
        console.dir(slid.getData());
        slide.src = path.join(CONFIG.contentDirectory, slide.fileName);
        //slide.setData(slid.getData());
        slid_list[slide.id] = slide;
        if(i == filteredFiles.length - 1){
         return callback(null, slid_list);
       }
       i++;
     }
   });

    });
  });

};


function extension(element) {
  var extName = path.extname(element);
  return extName === '.json'; 
};



var create = function(slid, callback){

  //var slide = new SlidModel(slid.type,slid.id,slid.title,slid.fileName);
  var slide = new SlidModel(slid);


  slide.setData(slid.data);

  SlidModel.create(slide, function(err, smodel){
    if(err){
     callback(err);
   }
   else{
     callback(null,smodel);
   }
 });
}


var read = function(id, callback){
  SlidModel.read(id, function(err, slid){
    if(err){
      return callback(err);
    }
    else{
      return callback(null, slid);
    }
  });
}

exports.list = list;
exports.create = create;
exports.read = read;

