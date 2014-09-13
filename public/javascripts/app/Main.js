if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'jquery',
	'app/WebPoint',
	'app/WebStrand'
], function(
	$,
	WebPoint,
	WebStrand
) {
	return function() {
		var WIDTH = 800, HEIGHT = 600;
		var canvas = $('<canvas width="' + WIDTH + 'px" height = "' + HEIGHT + 'px" ' +
			'style="display:block;margin: 15Px auto;" />').appendTo(document.body);
		var ctx = canvas[0].getContext('2d');
		var camera = { x: 0, y: 0 };

		//init game objects
		var strands = [];
		var points = [];
		var tempWebPoint = null;

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
		var centerPoint = createPoint(400, 250);
		var prevPoint1 = createPoint(400 + 200, 250);
		var prevPoint2 = createPoint(400 + 125, 250);
		var prevPoint3 = createPoint(400 + 50, 250);
		var start1 = prevPoint1;
		var start2 = prevPoint2;
		var start3 = prevPoint3;
		createStrand(prevPoint1, prevPoint2);
		createStrand(prevPoint2, prevPoint3);
		createStrand(prevPoint3, centerPoint);
		for(var i = 1; i < 20; i++) {
			var point1 = createPoint(400 + 200 * Math.cos(i * Math.PI / 10), 250 + 200 * Math.sin(i * Math.PI / 10));
			var point2 = createPoint(400 + 125 * Math.cos(i * Math.PI / 10), 250 + 125 * Math.sin(i * Math.PI / 10));
			var point3 = createPoint(400 + 50 * Math.cos(i * Math.PI / 10), 250 + 50 * Math.sin(i * Math.PI / 10));
			createStrand(point1, point2);
			createStrand(point2, point3);
			createStrand(point3, centerPoint);
			createStrand(point1, prevPoint1);
			createStrand(point2, prevPoint2);
			createStrand(point3, prevPoint3);
			prevPoint1 = point1;
			prevPoint2 = point2;
			prevPoint3 = point3;
		}
		createStrand(start1, prevPoint1);
		createStrand(start2, prevPoint2);
		createStrand(start3, prevPoint3);
		var fixed1 = createPoint(100, 50, true);
		var fixed2 = createPoint(250, 10, true);
		var fixed3 = createPoint(700, 75, true);
		var fixed4 = createPoint(750, 250, true);
		var fixed5 = createPoint(50, 500, true);
		createStrand(fixed1, points[37]);
		createStrand(fixed1, points[31]);
		createStrand(fixed2, points[40]);
		createStrand(fixed2, points[46]);
		createStrand(fixed3, points[46]);
		createStrand(fixed3, points[49]);
		createStrand(fixed3, points[58]);
		createStrand(fixed4, points[4]);
		createStrand(fixed4, points[7]);
		createStrand(fixed5, points[22]);
		createStrand(createPoint(100, 100), points[31]);

		//input bindings
		var keys = { pressed: {} };
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
			for(var i = 0; i < strands.length; i++) {
				strands[i].tick();
			}
			for(i = 0; i < points.length; i++) {
				points[i].tick();
			}

			//render
			ctx.fillStyle = '#fff';
			ctx.fillRect(0, 0, WIDTH, HEIGHT);
			for(i = 0; i < strands.length; i++) {
				strands[i].render(ctx, camera);
			}
			for(i = 0; i < points.length; i++) {
				//points[i].render(ctx, camera);
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