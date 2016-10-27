"use strict";

console.log("It works !");

var  path  =  require("path");
var fs = require("fs");
var  express  =  require("express");
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var SlideModel = require("./app/models/slid.model.js");
var bodyParser = require('body-parser');
var  http  =  require("http");
var  CONFIG  =  require("./config.json");
process.env.CONFIG  =  JSON.stringify(CONFIG);
var util = require("./utils.js");
var  defaultRoute  =  require("./app/routes/default.route.js");
var  slidRoute  =  require("./app/routes/slid.router.js");
var IOController = require("./app/controllers/io.controller.js");
var io = require('socket.io');



var  app  =  express();

// init server
var  server  =  http.createServer(app);
server.listen(CONFIG.port);
IOController.listen(server);
io = io.listen(server);

app.use(defaultRoute);
app.use(slidRoute);
app.use("/admin",express.static(path.join(__dirname, "/public/admin")));
app.use("/login",express.static(path.join(__dirname, "/public/login")));
app.use("/uploads",express.static(path.join(__dirname, "/uploads")));

app.get("/loadPres",  function (request, response) {

	var jsonData = {};

	fs.readdir(CONFIG.contentDirectory, function (err, files) {
		if (err) {
			console.error(response.statut(500).end);
			return response.statut(500).end;
		}
		var filteredFiles;
		files.filter(function (file) {
			filteredFiles = files.filter(extension);
		});

		var compteur = 0;
		filteredFiles.forEach(function (file) {

			fs.readFile(path.join(CONFIG.contentDirectory, file), 'utf8', function(err,data) {  
				if (err) {
					console.error(response.statut(500).end);
					return response.statut(500).end;
				}				
				var obj = JSON.parse(data);
				var Id = obj["id"];

				jsonData[Id] = obj;
				compteur ++;
				if (compteur == filteredFiles.length) returnJson();
			});
		});
	});

	function returnJson(){

		response.send(jsonData);

	}

});


function extension(element) {
	var extName = path.extname(element);
	return extName === '.json'; 
};


app.use(bodyParser.json());

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, '/var/www/nodejs/uploads/');
		cb(null, '/var/www/nodejs/public/admin/img/');
	},
	filename: function (req, file, cb) {
		console.log(file.originalname);
		cb(null,file.originalname);
	}
})

var upload = multer({ storage: storage });

var type = upload.single('file');
app.post("/upload", type, function (req, res, next) {
	console.log("Upload done in folder /uploads");
	console.log(req.file);
	res.send(req.file);
});

io.sockets.on('connection', function (socket) {
	console.log('Client connected.');

	socket.emit('connection', { hello: 'world' });
	socket.on('data_comm', function (data) {
		console.log(data);
	});
});












