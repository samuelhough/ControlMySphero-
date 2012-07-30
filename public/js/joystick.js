var Stats = Backbone.Model.extend({
	defaults: {
		socket: socket
	},
	initialize: function(socket){

		socket.on('stats', function(data){
			this.set({
				heading: data.heading,
				alive: data.alive,
				speed: data.speed,
				readyToMove: data.readyToMove
			})
		})
	}
})
			
var StatView = Backbone.View.extend({
	el: $('#stats'),
	model: null,
	render: function(){
		$(this.el).html('hi')
	},
	initialize: function(socket){
		this.model = new Stats(socket);
		this.model.on('change', _.bind(this.render, this))
		render();
	}
})
//var stats = new StatsView(socket);

var w = 500,
	h = 500;
var canvas = document.getElementById('stage');
var coords = document.getElementById('stats_2')
var stage = (function(canvas){
	var ctx = canvas.getContext('2d');
		ctx.fillStyle = "#000000";
		width = 10,
		height = 10;

	function drawLines(){
		ctx.fillRect(0, (h/2)-1, w, 2 );
		ctx.fillRect((w/2)-1, 0, 2, h );
		
	}
	drawLines()
	function clearCanvas(){
		ctx.clearRect(0,0,500,500);
	}
	function drawCircle(x, y){
		clearCanvas();
		ctx.fillRect(x,y,10,10);
		coords.innerHTML = x + " " +y;
		drawLines();
	}

	return {
		drawCircle: drawCircle
	}
}(canvas));


var findDegree = function(oX, oY){
	var x = w/2,
		y = h/2;

	var dist = Math.sqrt(((oX - x)*(oX-x)) + ((oY - y)*(oY-y)));
	var res = Math.asin(((oY-250) / dist) ) * (180 / Math.PI);

	//speed = dist/
	speed = (dist / 314) * topSpeed
	if(res < 0){ res = -res}

	var ret = res;
	if(oX < x){
		ret = (90-res) + 90
		if(oY > y){
			ret = res + 180
		}
	}
	if(oX > x){
		if(oY > y){
			ret = (90 - res) + 270;
		}
	}
	return ret;
}

var holding = false;
var heading;
$(canvas).on('mousemove', function(e){
	if(!holding){ return; }	

	var oX = e.offsetX - 5;
	var oY = e.offsetY - 5;
	heading = findDegree(oX, oY);
	console.log(heading)
	stage.drawCircle(oX, oY)

})

var speed = 50;
var topSpeed = 120;
$(canvas).on('mouseup', function(){
	console.log('sending')
	moveBall({
		heading: heading,
		speed: speed
	})
	holding = false;
})

$(canvas).on('mouseout', function(){
	holding = false;
})
$(canvas).on('mousedown', function(e){
	holding = true;
	var width = 500,
		height = 500;


	cW = width / 2;
	cH = height / 2;
	oX = e.offsetX;
	oY = e.offsetY;

	stage.drawCircle(oX, oY)
	
	oX = e.offsetX - 5;
	oY = e.offsetY - 5;
	heading = findDegree(oX, oY);
	
})
$('#stop').on('click', function(){
	socket.emit('stop_ball', true)
})

function moveBall(data){
	data.timeout = 50;
	console.log(data)
	socket.emit('move_ball', data)

}