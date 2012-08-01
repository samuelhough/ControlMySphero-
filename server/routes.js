module.exports = function(app, port, _public){

	app.get('/spherey', function(req, res){
		res.render('index.jade', {
			layout: false,
			origin: 'http://sphero.jit.su',
			server: 'http://sphero.jit.su/spherey'
		})
	})
	app.get('/js/:file', function(req,res){
		var fileName = req.params.file;
		res.sendfile(_public + "/js/"+fileName);
	})

}
