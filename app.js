"use strict";

console.log("It works !");

var  express  =  require("express");
var  app  =  express();
var  http  =  require("http");
var  CONFIG  =  require("./config.json");
process.env.CONFIG  =  JSON.stringify(CONFIG);
// init server
var  server  =  http.createServer(app);
server.listen(CONFIG.port);

var  defaultRoute  =  require("./app/routes/default.route.js");
app.use(defaultRoute);

/*// #2
app.get("/",  function (request, response) {
    response.send("It works !");
});
// #3
app.use( function (request, response, cb) {
    response.send("It works !");
    cb();
});*/

var  path  =  require("path");

app.use("/index",express.static(path.join(__dirname, "/public")));
