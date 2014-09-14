if (typeof define !== 'function') { var define = require('amdefine')(module); }
define(function() {
	var NEXT_POINT_ID = 0;
	function WebPoint(x, y, fixed) {
		this._id = NEXT_POINT_ID++;
		this.x = x;
		this.y = y;
		this._vel = { x: 0, y: 0 };
		this._isFixed = (fixed === true);
		this.mass = 0;
	}
	WebPoint.prototype.addMass = function(mass) {
		this.mass += mass;
	};
	WebPoint.prototype.applyForce = function(forceX, forceY) {
		if(!this._isFixed && this.mass > 0) {
			this._vel.x += forceX / this.mass;
			this._vel.y += forceY / this.mass;
		}
	};
	WebPoint.prototype.tick = function() {
		if(!this._isFixed) {
			this._vel.y += 0.5; //gravity
			this._vel.x *= 0.95; // friction
			this._vel.y *= 0.95; // friction
			this.x += this._vel.x / 60;
			this.y += this._vel.y / 60;
		}
	};
	WebPoint.prototype.render = function(ctx, camera) {
		ctx.fillStyle = '#fff';
		ctx.beginPath();
		ctx.arc(this.x - camera.x, this.y - camera.y, 2, 0, 2 * Math.PI, false);
		ctx.fill();
	};
	return WebPoint;
});