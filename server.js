var express = require('express')
var session = require("express-session");
var bodyParser = require('body-parser')
var cors = require('cors')
var morgan = require('morgan')
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require('path');

var Article = require("./models/musicNews.js");

var passport = require("./config/passport");

var request = require("request");
var cheerio = require("cheerio");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;
// var PORT = 3306

// Requiring our models for syncing
var db = require("./models");

// We need to use sessions to keep track of our user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


// Sets up the Express app to handle data parsing
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Static directory
app.use(express.static("public"));

// Routes
// =============================================================
// require('./routes')(app)
require("./routes/scrapper-routes.js")(app);
require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);
require("./routes/email-routes.js")(app);


// Syncing sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({}).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
}).catch(function (err) {
  console.log(err)
});;


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/findscraper"
mongoose.connect("mongodb://heroku_lsh61zsr:ghp82sdqup681fe1smnjo5cv44@ds247587.mlab.com:47587/heroku_lsh61zsr");
var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});


