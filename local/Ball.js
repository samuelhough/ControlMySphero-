module.exports = function(Sphero){
	var Ball = function(connectionPort, socket){
		console.log(" ");
		console.log("Spherey: Connecting to "+connectionPort)
		var self = this;
		this.alive = false;
		this.heading = 0;
		this.speed = 0;
		this.maxSpeed = 100;
		this.readyToMove = true;
		this.noop = function(){ };
		
		this.stopTime = 1500;
		this.socket = socket;
		this.setupSocket();
		
		this.sphero = new Sphero(connectionPort);
		
		this.status();
	}
	Ball.prototype.setColor = function(arr){
		this.sphero.changeLedColor(arr);
	}

	Ball.prototype.setupSocket = function(){
		console.log('Setting up socket')
		var self = this;
		

		this.socket.on('move_ball', function(data){
			console.log("Spherey received move data")
			self.move(data.speed, data.heading);
		});

		this.socket.on('stop_ball', function(){
			console.log("Spherey asked to stop")
			self.stop();
		});

		this.socket.on('set_heading', function(data){
			console.log("Spherey given heading")
			self.setHeading(data.heading);
		});

		this.socket.on('connect', function(){
			console.log("Spherey connected to server")
		});
		this.socket.on('disconnect', function(){
			console.log("Spherey disconnected from server")
		});
	}
	Ball.prototype.status = function(){
		var self = this;
		setInterval(function(){
			self.sphero.ping(function(){
				self.alive = true;
			}, function(){
				console.log("Lost sphero connection")
				self.alive = false;
			});
		}, 1000);
	}
	Ball.prototype.toJSON = function(){
		var self = this;
		return JSON.stringify({
			heading: self.heading,
			speed: self.speed,
			readyToMove: self.readyToMove,
			alive: self.alive
		});
	}
	Ball.prototype.setHeading= function(heading, cb){
		cb = cb || this.noop;
		if(!this.readyToMove){ return; } else { this.readyToMove = false; }
		
		if(isNaN(Number(heading)) || heading > 359 || heading < 0){ 
			console.log("Invalid heading")
			this.readyToMove = true;
			return;
		}

		var self = this;
		this.heading = Math.round(heading);
		

		console.log("Setting heading")
		this.sphero.setHeading(this.heading, function(){
			self.readyToMove = true;
			cb();
		});
	}
	Ball.prototype.move = function(speed, heading, cb){
		cb = cb || this.noop;
		if(!this.readyToMove){ return; } else { this.readyToMove = false; }
		speed = Number(speed);
		heading = Number(heading);

		if(isNaN(heading) || heading > 359 || heading < 0){ 
			console.log("Invalid heading " + heading)
			this.readyToMove = true;
			return;
		}
		if(isNaN(speed) || speed < 0){ 
			console.log("Invalid Speed "+ speed);
			this.readyToMove = true;
			return;
		}
		if(speed > this.maxSpeed){ speed = this.maxSpeed; }


		var self = this;
		this.speed = Math.round(speed);
		this.heading = Math.round(heading);


		console.log("Moving H: "+this.heading+" S:"+this.speed)
		this.sphero.setHeading(this.heading, function(){
			self.sphero.roll(self.speed, self.heading, function(){
				self.readyToMove = true;
			});
		});
		
		
		setTimeout(function(){
			self.stop();
		}, self.stopTime)
	}

	Ball.prototype.stop = function(cb){
		cb = cb || this.noop;
		var self = this;
		this.readyToMove = false;
		console.log('Stoping sphero')
		this.sphero.stop();
		setTimeout(function(){
			console.log('Sphero ready to move again');
			cb();
			self.readyToMove = true;
		}, 1000)
	}
	return Ball;
}
