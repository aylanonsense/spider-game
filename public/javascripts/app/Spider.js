if (typeof define !== 'function') { var define = require('amdefine')(module); }
define(function() {
	var MOVE_SPEED = 100;
	function Spider(x, y) {
		this.x = x;
		this.y = y;
		this._radius = 10;
		this._vel = { x: 0, y: 0 };
		this._move = { x: 0, y: 0 };
		this._anchorStrand = null;
		this._anchorStrandPos = 0.0;
	}
	Spider.prototype.tick = function(strands, moveX, moveY) {
		this._move = { x: moveX, y: moveY };
		this.x += MOVE_SPEED * this._move.x / 60;
		this.y += MOVE_SPEED * this._move.y / 60;
		var closestCollision = null;
		for(var i = 0; i < strands; i++) {
			var collision = this._checkForCollision(strands[i]);
			if(collision && (!closestCollision || closestCollision.dist > collision.dist)) {
				closestCollision = collision;
			}
		}
	};
	Spider.prototype._checkForCollision = function(strand) {
		//TODO	
	};
	Spider.prototype.render = function(ctx, camera) {
		ctx.fillStyle = '#a33';
		ctx.beginPath();
		ctx.arc(this.x - camera.x, this.y - camera.y, this._radius, 0, 2 * Math.PI, false);
		ctx.fill();
	};
	return Spider;
});