module.exports = (function(){
	var Events = require('events').EventEmitter;


	function Pilot(socket, playerNum, Driver){
		
		var self = this;
		
		this.socket = socket;
		this.socket.isTheDriver = true;
		this.socket.emit('is_driver');

		this.socket.on('disconnect', function(){
			self.quit();
		});

		Driver.on('NewPlayer', function(playerNum){
			self.setTimeLimit(playerNum);
		})

		this.setTimeLimit(playerNum);
		
		console.log('Pilot setup')
	}
	Pilot.prototype = new Events();
	Pilot.prototype.quit = function(){
		this.socket.emit('not_driver');
		this.socket.isTheDriver = false;
		this.emit('driver_dead', this.socket);
	}
	Pilot.prototype.setTimeLimit = function(playerNum){

		if(playerNum <= 1){ 
			console.log('Not enough players to set time limit');
			return;
		}

		var min = 3;
		var minSecs = 30;
		var timeLeft = (1000) * (60) * (min);
		this.time = { 
			startTime: new Date(),
			timeLeft:  timeLeft,
			endTime: new Date(new Date() + timeLeft)
		};
		

		if(timeLeft < (1000 * minSecs)){
			timeLeft = (1000 * minSecs);
		}

		if(this.time_timeout){
			console.log('removing previous timelimit')
			clearInterval(this.time_timeout)
		}

		this.time_timeout = setTimeout(function(){
			self.quit();
		}, this.timeLeft);
		
		
		this.sendTime();
		
	}
	Pilot.prototype.sendTime = function(){
		this.socket.emit('time_left', this.time);
		this.socket.broadcast.emit('time_left', this.time);
	}

	return Pilot;
}());
