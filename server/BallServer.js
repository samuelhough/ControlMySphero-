module.exports = function( app){
	
	var Ball = function(){}
	Ball.prototype.status = function(){
		
	}
	Ball.prototype.setSocket = function(socket){
		var self = this;
		this.socket = socket;
		this.socket.on('disconnect', function(){
			console.log('Sphero server disconnected')
			self.socket = null;
		})
	}
	Ball.prototype.toJSON = function(){
		
	}
	Ball.prototype.setHeading= function(data){
		if(!this.socket){ console.log('Sphero not connected'); return;}
		console.log('sending heading to sphero server')
		this.socket.emit("set_heading", data)
	}
	Ball.prototype.move = function(data){

		if(!this.socket){ console.log('Sphero not connected'); return;}
		console.log('sending move to sphero server')
		this.socket.emit('move_ball', data)
	}
	Ball.prototype.stop = function(data){

		if(!this.socket){ console.log('Sphero not connected'); return;}

		console.log('sending stop to sphero server')
		this.socket.emit('stop_ball', data)
	}
	
	return Ball;

}
