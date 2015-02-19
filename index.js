var express = require('express');
var serveStatic = require('serve-static');

var app = express();
app.use(function(req, res, next){
	next();
});
app.use(serveStatic('public', {index: 'index.html'}));
app.use(function(req, res, next){
	console.log(req.path);
	res.send('handle image');
});
app.listen(3000);