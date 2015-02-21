/* global require, console */
'use strict';
var express = require('express');
var serveStatic = require('serve-static');
var extend = require('extend');
var fs = require('fs');

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

function grayScaleCanvas(ctx, options){
	var imageData = ctx.getImageData(0, 0, options.width, options.height);
	var data = imageData.data;

	for(var i = 0; i < data.length; i += 4) {
		//reduce each color to 33% of it's previous saturation and add them to get grey shade
		var shadeOfGrey = 0.33 * data[i] + 0.33 * data[i + 1] + 0.33 * data[i + 2];
		//rgb
		data[i] = shadeOfGrey;
		data[i + 1] = shadeOfGrey;
		data[i + 2] = shadeOfGrey;
	}
	ctx.putImageData(imageData, 0, 0);
}


function createImage(options){
	var Canvas = require('canvas');
	var Image = Canvas.Image;
	var canvas = new Canvas(options.width, options.height);
	var ctx = canvas.getContext('2d');

	var ratio = options.width/options.height;
	//Determine with group of photos to pull from
	var folder = 'n/';
	if(ratio < 0.8){
		folder = 't/';
	}else if(ratio > 1.2){
		folder = 'w/';
	}

	//Grab a random image
	var files = fs.readdirSync('images/'+folder);
	var srcImageName = files[Math.floor( Math.random() * files.length)];
	var srcImageBuffer = fs.readFileSync('images/'+folder+srcImageName);
	var srcImg = new Image;
	srcImg.src = srcImageBuffer;

	// Scale the photo
	if(ratio <= srcImg.width/srcImg.height){
		var resizedWidth = srcImg.width*(options.height/srcImg.height);
		ctx.drawImage(srcImg,
			0, 0, srcImg.width, srcImg.height,
			-(resizedWidth-options.width)/2, 0, resizedWidth, options.height
		);
	}else{
		var resizedHeight = srcImg.height*(options.width/srcImg.width);
		ctx.drawImage(srcImg,
			0, 0, srcImg.width, srcImg.height,
			0, -(resizedHeight-options.height)/2, options.width, resizedHeight
		);
	}

	if(options.grayScale){
		grayScaleCanvas(ctx, options);
	}

	ctx.font = '25px Verdana';
	ctx.fillStyle = 'white';
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 2;
	ctx.strokeText(options.width+"x"+options.height, 10, 30);
	ctx.fillText(options.width+"x"+options.height, 10, 30);

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