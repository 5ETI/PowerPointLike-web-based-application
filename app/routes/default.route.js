"use strict";

var  express  =  require("express");
var  router  =  express.Router();
module.exports  =  router;
// Routing using

router.route("/")
    .get(function (request, response) {
    response.send("It works !!");
})
    .post()
    .put()
    .delete()
    .all();
