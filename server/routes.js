module.exports = function(app, port, _public){

	app.get('/', function(req, res){
		res.render('index.jade', {
			layout: false,
			origin: 'http://sphero.jit.su',
			server: 'http://sphero.jit.su/spherey',
			port: port,
			fullpath: 'http://localhost:8000'
		})
	})
	app.get('/js/:file', function(req,res){
		var fileName = req.params.file;
		res.sendfile(_public + "/js/"+fileName);
	})

	app.get('/css/:file', function(req,res){
		var fileName = req.params.file;
		res.sendfile(_public + "/css/"+fileName);
	})

}
