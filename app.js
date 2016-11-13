"use strict";

console.log("It works !");

var  path  =  require("path");



var fs = require("fs");
var  express  =  require("express");
var SlideModel = require("./app/models/slid.model.js");
var bodyParser = require('body-parser');
var  http  =  require("http");
var  CONFIG  =  require("./config.json");
process.env.CONFIG  =  JSON.stringify(CONFIG);
var util = require("./utils.js");
var  defaultRoute  =  require("./app/routes/default.route.js");
var  slidRoute  =  require("./app/routes/slid.router.js");
var IOController = require("./app/controllers/io.controller.js");
var slidController = require("./app/controllers/slid.controller.js");



var  app  =  express();


// init server
var  server  =  http.createServer(app);
server.listen(CONFIG.port);
IOController.listen(server);

/*io.sockets.on('connection', function (socket) {
	console.log('Un client est connecté !');
});*/

app.use(defaultRoute);
app.use(slidRoute);


app.use("/admin",express.static(path.join(__dirname, "/public/admin")));
app.use("/login",express.static(path.join(__dirname, "/public/login")));

app.get("/loadPres",  function (request, response) {

	var jsonData = {};

	fs.readdir(CONFIG.presentationDirectory, function (err, files) {

		if (err) {
			console.error(response.status(500).end);
			return response.status(500).end;
		}

		var filteredFiles;
		files.filter(function (file) {
			filteredFiles = files.filter(extension);
		});

		var compteur = 0;
		filteredFiles.forEach(function (file) {

			fs.readFile(path.join(CONFIG.presentationDirectory, file), 'utf8', function(err,data) {  
				if (err) {
					console.error(response.status(500).end);
					return response.status(500).end;
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

app.post("/savePres",  function (request, response) {

	request.accepts('application/json');
	var presJson = request.body;

	console.log(presJson);
	var Id = presJson["id"];
	console.log(Id);

	fs.writeFile(path.join(CONFIG.presentationDirectory, Id + ".pres.json"), JSON.stringify(presJson), (err) => {
		if (err) {
			console.error(response.status(500).end);
			return response.status(500).end;
		}

		response.end('SAVED: ' + Id);
	});


});



/*var storage = multer.diskStorage({
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

sockets.on('connection', function (socket) {
	console.log('Client connected.');

	socket.emit('connection', { hello: 'world' });
	socket.on('data_comm', function (data) {
		console.log(data);
	});
});*/











