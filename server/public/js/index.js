var SpheroModel = Backbone.Model.extend({
	defaults: {
		controller_name: "None",
		time_left: 0,
		start_time: 0,
		color: "teal",
		sphero_connected: false
	},
	initialize: function(socket){
		var self = this;
		this.handleSocket(socket);
	},
	handleSocket: function(socket){
		var self = this;
		socket.on('set_sphero_stats', function(stats){
			self.set('controller_name', stats.controller_name);
			self.set('time_left', stats.time_left);
			self.set('start_time', stats.start_time);
			self.set('color', stats.color);
			self.set('sphero_connected', stats.sphero_connected);
		});		
	}
});

var SpheroView = Backbone.View.extend({
	el: $('#stats'),
	render: function(){
		$('#sphero_connected').html(this.model.get('sphero_connected'));
	},
	initialize: function(socket){
		var self = this;
		this.model = new SpheroModel(socket)
		this.model.on('change', function(){
			self.render();
		});
	}
});