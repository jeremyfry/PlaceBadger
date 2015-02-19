'use strict';
var express = require('express');
var serveStatic = require('serve-static');
var extend = require('extend');
var fs = require('fs');
var filesCache = null;

function parseOptionsFromPath(fullPath){
	var path = fullPath.replace(/\//g, ' ').trim();
	var pathParts = path.split(' ');
	var options = {};

	if(isNaN(pathParts[0])){
		if(pathParts[0] === 'g'){
			options.grayScale = true;
			pathParts.shift();
		}
	}

	if(pathParts.length > 2){
		return;
	}

	options.width = Math.min(parseInt(pathParts[0], 10), 2000);
	options.height = Math.min(parseInt(pathParts[1], 10) || options.width, 2000);

	return options;
}


function createImage(options){
	var Canvas = require('canvas');
	var Image = Canvas.Image;
	var canvas = new Canvas(options.width, options.height);
	var ctx = canvas.getContext('2d');

	//Grab a random image
	if(!filesCache){
		filesCache = fs.readdirSync('images');
	}

	var srcImageName = filesCache[Math.floor( Math.random() * filesCache.length)];
	console.log('images/'+srcImageName);
	var srcImageBuffer = fs.readFileSync('images/'+srcImageName);
	var srcImg = new Image;
	srcImg.src = srcImageBuffer;
	//return srcImageBuffer;

	ctx.drawImage(srcImg, 0, 0, options.width, options.height);

	return canvas.toBuffer();
}


var app = express();
app.use(function(req, res, next){
	next();
});

app.use(serveStatic('public', {index: 'index.html'}));
app.use(function(req, res){
	var options = extend(
		{
			grayScale: false,
			width: 0,
			height: 0
		},
		parseOptionsFromPath(req.path)
	);

	if(!options.width){
		res.status(404).end();
		return;
	}


	res.set('Content-Type', 'image/png');
	res.send(createImage(options)).end();
});
app.listen(3000);