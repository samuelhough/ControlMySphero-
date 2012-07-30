module.exports = function(Sphero, app){
	
	var Ball = function(connectionPort){
		console.log("Connecting to "+connectionPort)
		var self = this;
		this.alive = false;
		this.heading = 0;
		this.speed = 0;
		this.readyToMove = true;
		this.noop = function(){ }
		this.stopTime = 1500;
		
		this.sphero = new Sphero(connectionPort);
		this.sphero.ping(function(){
			console.log("Sphero Connected")
			self.sphero.stop();

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


		this.sphero.setHeading(this.heading, function(){
			self.readyToMove = true;
			cb();
		});
	}
	Ball.prototype.move = function(speed, cb){
		cb = cb || this.noop;
		if(!this.readyToMove){ return; } else { this.readyToMove = false; }
		var self = this;
		this.speed = speed;
		this.sphero.roll(this.speed, this.heading, function(){
			self.readyToMove = true;
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
