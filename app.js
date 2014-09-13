//configure requirejs
var requirejs = require('requirejs');
requirejs.config({ baseUrl: __dirname, nodeRequire: require });
require = requirejs;

//dependencies
var express = require('express');
var lessMiddleware = require('less-middleware');

//set up server
var app = express();
app.use(lessMiddleware({ src: __dirname + "/public", compress : true }));
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {
	res.render('index.jade', {})
});
app.get('/map-builder', function(req, res) {
	res.render('index.jade', {})
});
app.listen(3000);