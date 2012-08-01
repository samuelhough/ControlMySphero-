
var express = require('express'),
	app = express.createServer(),
	_public = __dirname+'/public',
	port = 8000,
	routes = require('./routes.js')(app, port, _public),
	io = require('socket.io'),
	Ball = require('./BallServer.js')( app);
	Driver = require('./DriverServer.js')(port);

app.set('view engine', 'jade');	
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


var spherey = new Ball();
var valet = new Driver(spherey, io, app);





app.listen();