// Test basic commands
var Sphero = require("Sphero-Node-SDK").Sphero;
var express = require('express'),
	app = express.createServer(),
	port = 8000,
	_public = "./public",
	routes = require('./routes.js')(app, port, _public),
	io = require('socket.io').listen(port+1),
	Ball = require('./Ball.js')(Sphero, app);
	

app.set('view engine', 'jade');	
app.set('views', __dirname + '/views');


var spherey = new Ball("/dev/tty.Sphero-GGB-RN-SPP");

io.on('connection', function(socket){

	socket.on('move_ball', function(data){
		console.log(data.heading)
		spherey.setHeading(data.heading, function(){
			spherey.move(data.speed);
		})
	})
	socket.on('stop_ball', function(){
		spherey.stop(function(){
			console.log("Spherey ready to move again")
		});
	})
	socket.on('set_heading', function(data){
		spherey.setHeading(data.heading);
	})

//	setInterval(function(){
	//	socket.emit('stats', spherey.toJSON())
//	}, 100)
})


app.listen(port);