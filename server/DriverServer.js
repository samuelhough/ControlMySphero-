module.exports = function(port){
	var Events = require('events').EventEmitter;
	var Pilot = require('./Pilot.js');
	var socketKey = 'fc1fe409-1881-4b88-8b5c-d311a635052b';

	function Driver(spherey, io, app){
		this.spherey = spherey;
		this.pilot = null;
		this.current_driver = null;
		this.possible_drivers = [];
		this.io = io;
		this.setupSocket();
		this.msgs = {
			request_driver: 'request_driver'
		}
		this.playerNum = 0;
		console.log("Driver installed");
	}
	Driver.prototype = new Events();
	Driver.prototype.setupSocket = function(){
		if(!this.io){ throw "Missing socket.io instance in Driver" }
		if(!port) { throw "Missing port for socket.io" }
		var self = this;

		this.io.of('/s/'+socketKey).on('connection', function(socket){
			console.log('Sphero Connected')
			self.spherey.setSocket(socket);
		});

		this.io.of('/spherey').on('connection', function(socket){
			console.log("Client connected")
			self.findPilot(socket);
			self.emit('NewPlayer', ++self.playerNum);
			socket.on('move_ball', function(data){
				if(!socket.isTheDriver) {
					console.log('Not the driver - cant do that')
					return; 
				}
				console.log(data)
				
				self.spherey.move(data);
				
			})
			socket.on('stop_ball', function(){
				if(!socket.isTheDriver) {
					console.log('Not the driver - cant do that')
					return; 
				}
				self.spherey.stop();
			})
			socket.on('set_heading', function(data){
				if(!socket.isTheDriver) {
					console.log('Not the driver - cant do that')
					return; 
				}

				self.spherey.setHeading(data);
			})
			socket.on('apply_for_driver', function(data){
				console.log('Driver request')
				if(!self.pilot){
					self.pilot = true;
					console.log('Driver accepted')
					console.log(self.playerNum)
					self.setupNewPilot(socket);
				} else {
					socket.emit('not_driver');
					console.log('request denied')
				}
			})
			socket.on('leave_pilot_seat', function(){
				self.pilot.quit()
			})
			socket.on('disconnect', function(){
				self.playerNum -= 1;
			})
		})
	}

	Driver.prototype.findPilot = function(socket){
		if(!this.pilot && socket){
			socket.emit(this.msgs.request_driver);
			this.possible_drivers.push(socket);
			return;
		} else {
			console.log("Pilot exists")
		}

	}
	Driver.prototype.setupNewPilot = function(pilotSocket){
		var self = this;
		this.pilot = new Pilot(pilotSocket, this.playerNum, this);
		this.pilot.on('driver_dead', function(socket){
			self.pilot = null;
			socket.broadcast.emit(self.msgs.request_driver)
		})
		

	}

	return Driver;
}
