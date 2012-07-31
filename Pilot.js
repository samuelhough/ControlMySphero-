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
		

	}
	Pilot.prototype = new Events();
	Pilot.prototype.quit = function(){
		this.socket.emit('not_driver');
		this.socket.isTheDriver = false;
		this.emit('driver_dead', this.socket);
	}
	Pilot.prototype.setTimeLimit = function(playerNum){

		if(playerNum <= 1){ 
			console.log('Not enough players to kick '+playerNum);
			return;
		}
		var min = 3;
		var minSecs = 30;

		timeToPlay =  Math.round(((1000) * (60) * (min)) / playerNum);
		console.log(playerNum + " " + timeToPlay)
		if(timeToPlay < (1000 * minSecs)){
			timeToPlay = (1000 * minSecs);
		}
		setTimeout(function(){
			self.quit();
		}, timeToPlay)
		console.log('Pilot has '+ timeToPlay / 1000)
	}

	return Pilot;
}());
