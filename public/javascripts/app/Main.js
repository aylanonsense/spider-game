if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'jquery',
	'app/WebPoint',
	'app/WebStrand',
	'app/Spider'
], function(
	$,
	WebPoint,
	WebStrand,
	Spider
) {
	return function() {
		var WIDTH = 800, HEIGHT = 600;
		var canvas = $('<canvas width="' + WIDTH + 'px" height = "' + HEIGHT + 'px" ' +
			'style="display:block;margin: 15Px auto;" />').appendTo(document.body);
		var ctx = canvas[0].getContext('2d');
		var camera = { x: 0, y: 0 };

		//init game objects
		var spider = new Spider(100, 50);
		var strands = [];
		var points = [];
		var tempWebPoint = null;
		var wind = 0;

		function createPoint(x, y, fixed) {
			var point = new WebPoint(x, y, fixed);
			points.push(point);
			return point;
		}
		function createStrand(start, end) {
			var strand = new WebStrand(start, end);
			strands.push(strand);
			return strand;
		}

		//create web
		var pt1 = createPoint(50, 50);
		var pt2 = createPoint(750, 50);
		var pt3 = createPoint(750, 550);
		var pt4 = createPoint(50, 550);
		createStrand(pt1, pt2);
		createStrand(pt2, pt3);
		createStrand(pt3, pt4);
		createStrand(pt4, pt1);
		createStrand(pt1, createPoint(0, 0, true));
		createStrand(pt2, createPoint(800, 0, true));
		createStrand(pt3, createPoint(800, 600, true));
		createStrand(pt4, createPoint(0, 600, true));

		//input bindings
		var keys = { pressed: {} };
		var MOVE_KEYS = {
			UP: 87, //W
			LEFT: 65, //A
			DOWN: 83, //S
			RIGHT: 68 //D
		};
		$(document).on('keydown', function(evt) {
			if(!keys[evt.which]) {
				keys[evt.which] = true;
			}
		});
		$(document).on('keyup', function(evt) {
			if(keys[evt.which]) {
				keys[evt.which] = false;
			}
		});
		$(document).on('click', function(evt) {
			var x = evt.offsetX, y = evt.offsetY;
		});

		//the main game loop
		function tick() {
			wind += Math.random() - 0.5;
			if(wind > 3) {
				wind = 3;
			}
			else if(wind < -3) {
				wind = -3;
			}
			for(var i = 0; i < points.length; i++) {
				points[i]._vel.x += wind;
			}
			for(i = 0; i < strands.length; i++) {
				strands[i].tick();
			}
			for(i = 0; i < points.length; i++) {
				points[i].tick();
			}
			var m = MOVE_KEYS;
			spider.tick(strands, keys[m.LEFT] ? -1 : (keys[m.RIGHT] ? 1 : 0), keys[m.UP] ? -1 : (keys[m.DOWN] ? 1 : 0));

			//render
			ctx.fillStyle = '#000';
			ctx.fillRect(0, 0, WIDTH, HEIGHT);
			spider.render(ctx, camera);
			for(i = 0; i < strands.length; i++) {
				strands[i].render(ctx, camera);
			}
			for(i = 0; i < points.length; i++) {
				points[i].render(ctx, camera);
			}
		}

		//set up animation frame functionality
		function loop() {
			tick();
			requestAnimationFrame(loop);
		}
		requestAnimationFrame(loop);
	};
});