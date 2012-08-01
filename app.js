// Test basic commands
var Sphero = require("Sphero-Node-SDK").Sphero;
var express = require('express'),
	app = express.createServer(),
	port = 8000,
	_public = "./public",
	routes = require('./routes.js')(app, port, _public),
	io = require('socket.io'),
	Ball = require('./BallServer.js')(Sphero, app);
	Driver = require('./DriverServer.js')(port+1);

app.set('view engine', 'jade');	
app.set('views', __dirname + '/views');

var noop = function(){}
var fakeSpherey = { setHeading: noop, move: noop } ;


var spherey = new Ball();
var valet = new Driver(spherey, io);





app.listen(port);