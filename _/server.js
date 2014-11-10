
// Module dependencies:
var express = require("express")
  , app = express()                               // Express
  , http = require("http").createServer(app)      // HTTP
  , bodyParser = require("body-parser")           // Body-parser
  , _ = require("underscore")                     // Underscore.js

  /***********************************
           Load Models 
   ***********************************/

  , user     = require('./routes/user')
  , location = require('./routes/location')

// Server config
app.set("host", "danabucci.dyndns.org"); 	  // Set host to Bucci's server
app.set("port", 8080);                     	// Set Port
app.set("views", __dirname + "/views");  	  // Set /views folder
app.set("view engine", "jade");          	  // Use Jade for HTML parsing

// Specify public folder
app.use(express.static("public", __dirname + "/public"));

// Support JSON requests
app.use(bodyParser.json());

// Global Variables
global.DV = {};
global.DV.ENV = process.env.NODE_ENV || 'development';
global.DV.ENV_EV = (DV.ENV === 'development') || (DV.ENV === 'local');
global.DV.ENV_PROD = DV.ENV === 'production';

// Config based on current environment
global.DV.config = require('./config/config')[DV.ENV];

var mongoose = require('./common.js');

mongoose.dbConnect();

/*****************************
       Default ROUTING
 *****************************/

// Home
app.get("/", function(request, response) {
  	response.render("index");
});

// Test Express -> Return JSON Object
app.get("/test", function(request, response) {
  	response.json(200, {message: "express is cool"});
});

/*****************************
        API Responses
 *****************************/

app.get('/user', user.findAll);
app.get('/user/:id', user.findById);
app.post('/user', user.addUser);
app.put('/user/:id', user.updateUser);
// app.delete('/wines/:id', wine.deleteWine);

// app.post("/message", function(request, response) {

//   // request = {message : msg, name : name};
//   var message = request.body.message;

//   // Error Handling
//   if(_.isUndefined(message) || _.isEmpty(message.trim())) {
//     return response.json(400, {error: "Message is invalid"});
//   }

//   // We also expect the sender's name with the message
//   var name = request.body.name;

//   // Success
//   response.json(200, {message: "Message received"});
// });

// Start HTTP server
http.listen(app.get("port"), app.get("ip"), function() {
  console.log("Server up and running.");
  console.log("URL: http://" + app.get("host") + ":" + app.get("port"));
});
