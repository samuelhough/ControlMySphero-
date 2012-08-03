
var express = require('express'),
	app = express.createServer(),
	_public = __dirname+'/public',
	port = 8000,
	routes = require('./routes.js')(app, port, _public),
	Ball = require('./BallServer.js')( app);
	Driver = require('./DriverServer.js')(port);

app.set('view engine', 'jade');	
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


app.listen(port);
var io = require('socket.io').listen(app);

var spherey = new Ball();
var valet = new Driver(spherey, io, app);

console.log("Server running on port "+port);


