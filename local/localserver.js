// Test basic commands
var express = require('express'),
	app = express.createServer(),
	port = 8002,
	io = require('socket.io-client'),
	Ball = require('./Ball.js')(Sphero, app),
	socket = io.connect('http://localhost:8001/s/fc1fe409-1881-4b88-8b5c-d311a635052b');

app.set('view engine', 'jade');	
app.set('views', __dirname + '/views');


var spherey = new Ball("/dev/tty.Sphero-GGB-RN-SPP", socket)



app.listen(port);