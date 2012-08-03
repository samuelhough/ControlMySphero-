module.exports = function(Sphero){
	var Ball = function(connectionPort, socket){
		console.log(" ");
		console.log("Spherey: Connecting to "+connectionPort)
		var self = this;
		this.alive = false;
		this.heading = 0;
		this.speed = 0;
		this.readyToMove = true;
		this.noop = function(){ }
		
		this.stopTime = 1500;

		this.socket = socket;
		this.setupSocket();
		
		this.sphero = new Sphero(connectionPort);
		
		this.sphero.ping(function(){
			console.log("Sphero Connected")
			self.sphero.stop();
			console.log('Setting color');
			self.sphero.changeLedColor();
			self.move(100, 50);
		})
	}

	Ball.prototype.setupSocket = function(){
		console.log('Setting up socket')
		var self = this;
		
		this.socket.on('connect', function(){
			console.log("Spherey connected to server")
		})
		this.socket.on('disconnect', function(){
			console.log("Spherey disconnected from server")
		})
		this.socket.on('move_ball', function(data){
			console.log("Spherey received move data")

			self.move(data.speed, data.heading);
		})
		this.socket.on('stop_ball', function(){
			console.log("Spherey asked to stop")
			self.stop();
		})
		this.socket.on('set_heading', function(data){
			console.log("Spherey given heading")
			self.setHeading(data.heading);
		})

	}
	Ball.prototype.status = function(){
		var self = this;
		setInterval(function(){
			self.sphero.ping(function(){
				self.alive = true;
			}, function(){
				self.alive = false;
			});
		}, 100);
	}
	Ball.prototype.toJSON = function(){
		var self = this;
		return {
			heading: self.heading,
			speed: self.speed,
			readyToMove: self.readyToMove,
			alive: self.alive
		}
	}
	Ball.prototype.setHeading= function(heading, cb){
		cb = cb || this.noop;
		if(!this.readyToMove){ return; } else { this.readyToMove = false; }
		this.heading = Math.round(heading);
		var self = this;

		console.log("Setting heading")
		this.sphero.setHeading(this.heading, function(){
			self.readyToMove = true;
			cb();
		});
	}
	Ball.prototype.move = function(speed, heading, cb){
		cb = cb || this.noop;
		if(!this.readyToMove){ return; } else { this.readyToMove = false; }
		var self = this;
		this.speed = Math.round(speed);
		this.heading = Math.round(heading);

		console.log("Moving H: "+heading+" S:"+speed)
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
			console.log('Sphero ready to move again')
			cb()
			self.readyToMove = true;
		}, 1000)
	}
	return Ball;
}
