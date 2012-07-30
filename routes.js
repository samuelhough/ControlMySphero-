module.exports = function(app, port, _public){
	app.get('/', function(req, res){
		res.render('index.jade', {
			layout: false,
			port: port+1
		})
	})
	app.get('/js/:file', function(req,res){
		var fileName = req.params.file;
		res.sendfile(_public + "/js/"+fileName);
	})
}
