var SlidModel=require("./../models/slid.model.js");
var CONFIG = require("./../../config.json");
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
                  console.dir(slid);
                 slid.src = path.join(CONFIG.presentationDirectory + '/' + slid.filename);
                 slid_list[slid.id] = slid;
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



var create = function(param, callback){

    //if(isMetaOnly !== true) isMetaOnly = false;

    var slid = new SlidModel(param);

    /*if(isMetaOnly)
        slid.setData(slid.filename);    // file is created by another function or module, like Multer. So the meta file does not really have data.
    else
        slid.setData(param.data);*/

    SlidModel.create(slid, function(err, smodel){
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
