var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	path = require('express-path'),
	Schema = mongoose.Schema;

/* CONNECT TO BDD */
var connect = function () {
  mongoose.connect('mongodb://localhost/schoolApp');
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

/* EXPORT MODULE AND ADD ROUTES */
var app = express();

app.use(session({secret: 'hashtopsecret'}));

var sess;

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
require('./config/routes')(app);
app.use(express.static(__dirname + '/public'));

app.listen(8080);

module.exports = app;