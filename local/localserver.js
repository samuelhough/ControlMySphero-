// Test basic commands
var Sphero = require("Sphero-Node-SDK").Sphero;
var io = require('socket.io-client'),
	Ball = require('./Ball.js')(Sphero, app),
	socket = io.connect('http://sphero.jit.su/s/fc1fe409-1881-4b88-8b5c-d311a635052b');

var spherey = new Ball("/dev/tty.Sphero-GGB-RN-SPP", socket)

