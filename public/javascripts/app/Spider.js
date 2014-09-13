if (typeof define !== 'function') { var define = require('amdefine')(module); }
define(function() {
	var MOVE_SPEED = 100;
	var DIAG_MOVE_SPEED = MOVE_SPEED / Math.sqrt(2);
	function Spider(x, y) {
		this.x = x;
		this.y = y;
		this._radius = 10;
		this._vel = { x: 0, y: 0 };
		this._move = { x: 0, y: 0 };
		this._anchorStrand = null;
		this._anchorStrandPercent = 0.0;
		this._anchorStrandPos = null;
	}
	Spider.prototype.tick = function(strands, moveX, moveY) {
		var dx, dy, collision;
		if(this._anchorStrand) {
			dx = this._anchorStrand.start.x + this._anchorStrandPercent * (this._anchorStrand.end.x - this._anchorStrand.start.x) - this._anchorStrandPos.x;
			dy = this._anchorStrand.start.y + this._anchorStrandPercent * (this._anchorStrand.end.y - this._anchorStrand.start.y) - this._anchorStrandPos.y;
			this.x += dx;
			this.y += dy;
		}
		this._move = { x: moveX, y: moveY };
		this.x += (this._move.x === 0 || this._move.y === 0 ? MOVE_SPEED : DIAG_MOVE_SPEED) * this._move.x / 60;
		this.y += (this._move.x === 0 || this._move.y === 0 ? MOVE_SPEED : DIAG_MOVE_SPEED) * this._move.y / 60;
		var closestCollision = null;
		var numCollisions = 0;
		for(var i = 0; i < strands.length; i++) {
			collision = this._checkForCollision(strands[i]);
			if(collision) {
				numCollisions++;
				if(!closestCollision || collision.dist < closestCollision.dist) {
					closestCollision = collision;
				}
			}
		}
		if(!closestCollision) {
			numCollisions = 0;
			this.x -= MOVE_SPEED * this._move.x / 60;
			this.y -= MOVE_SPEED * this._move.y / 60;
			for(i = 0; i < strands.length; i++) {
				collision = this._checkForCollision(strands[i]);
				if(collision) {
					numCollisions++;
					if(!closestCollision || collision.dist < closestCollision.dist) {
						closestCollision = collision;
					}
				}
			}
		}
		if(closestCollision) {
			this._anchorStrand = closestCollision.strand;
			this._anchorStrandPercent = closestCollision.strandPercent;
			this._anchorStrandPos = {
				x: this._anchorStrand.start.x + this._anchorStrandPercent * (this._anchorStrand.end.x - this._anchorStrand.start.x),
				y: this._anchorStrand.start.y + this._anchorStrandPercent * (this._anchorStrand.end.y - this._anchorStrand.start.y)
			};
			if(numCollisions === 1) {
				dx = closestCollision.x - this.x;
				dy = closestCollision.y - this.y;
				var dist = Math.sqrt(dx * dx + dy * dy);
				var adjustAmt = 0.25 * dist;
				this.x += adjustAmt * (dx / dist);
				this.y += adjustAmt * (dy / dist);
			}
		}
		else {
			this._anchorStrand = null;
		}
	};
	Spider.prototype._checkForCollision = function(strand) {
		var dx = strand.end.x - strand.start.x;
		var dy = strand.end.y - strand.start.y;
		if(dx === 0 || dy === 0) { return null; }
		var strandSlope = dy / dx; //TODO handle dx = 0
		var strandAt0 = strand.start.y - strandSlope * strand.start.x;
		var perpendicularSlope = -dx / dy; //TODO handle dy = 0
		var perpendicularAt0 = this.y - perpendicularSlope * this.x;
		var intersectionX = (strandAt0 - perpendicularAt0) / (perpendicularSlope - strandSlope);
		var intersectionY = strandSlope * intersectionX + strandAt0;
		dx = intersectionX - this.x;
		dy = intersectionY - this.y;
		var squareDistToIntersection = dx * dx + dy * dy;
		if(squareDistToIntersection < this._radius * this._radius) {
			dx = intersectionX - strand.start.x;
			dy = intersectionY - strand.start.y;
			var distFromStartOfStrandToIntersection = Math.sqrt(dx * dx + dy * dy);
			dx = intersectionX - strand.end.x;
			dy = intersectionY - strand.end.y;
			var distFromEndOfStrandToIntersection = Math.sqrt(dx * dx + dy * dy);
			dx = strand.end.x - strand.start.x;
			dy = strand.end.y - strand.start.y;
			var lengthOfStrand = Math.sqrt(dx * dx + dy * dy);
			var strandPercent = distFromStartOfStrandToIntersection / lengthOfStrand;
			if(distFromStartOfStrandToIntersection > lengthOfStrand || distFromEndOfStrandToIntersection > lengthOfStrand) {
				return null;
			}
			else {
				return {
					x: intersectionX,
					y: intersectionY,
					dist: Math.sqrt(squareDistToIntersection),
					strand: strand,
					strandPercent: strandPercent
				};
			}
		}
		return null;
	};
	Spider.prototype.render = function(ctx, camera) {
		ctx.fillStyle = '#a33';
		ctx.beginPath();
		ctx.arc(this.x - camera.x, this.y - camera.y, this._radius, 0, 2 * Math.PI, false);
		ctx.fill();
	};
	return Spider;
});