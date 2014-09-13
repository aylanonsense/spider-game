if (typeof define !== 'function') { var define = require('amdefine')(module); }
define(function() {
	var NEXT_POINT_ID = 0;
	function WebPoint(x, y, fixed) {
		this._id = NEXT_POINT_ID++;
		this.x = x;
		this.y = y;
		this._vel = { x: 0, y: 0 };
		this._isFixed = fixed === true;
		this._weight = 0;
	}
	WebPoint.prototype.addWeight = function(weight) {
		this._weight += weight;
	};
	WebPoint.prototype.applyForce = function(x, y) {
		if(!this._isFixed) {
			this._vel.x += x;
			this._vel.y += y;
		}
	};
	WebPoint.prototype.tick = function() {
		if(!this._isFixed) {
			this._vel.y += 2; //gravity
			this._vel.x *= 0.96;
			this._vel.y *= 0.96;
			this.x += this._vel.x / 60;
			this.y += this._vel.y / 60;
		}
	};
	WebPoint.prototype.render = function(ctx, camera) {
		ctx.fillStyle = '#000';
		ctx.beginPath();
		ctx.arc(this.x - camera.x, this.y - camera.y, 2, 0, 2 * Math.PI, false);
		ctx.fill();
	};
	return WebPoint;
});