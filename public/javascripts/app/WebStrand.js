if (typeof define !== 'function') { var define = require('amdefine')(module); }
define(function() {
	var HEX = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
	var NEXT_STRAND_ID = 0;
	var K = 400;
	function WebStrand(start, end, restingLength) {
		this._id = NEXT_STRAND_ID++;
		this.start = start;
		this.end = end;
		var dx = (this.start.x - this.end.x);
		var dy = (this.start.y - this.end.y);
		if(restingLength) {
			this.restingLength = restingLength;
		}
		else {
			this.restingLength = 0.98 * Math.sqrt(dx * dx + dy * dy);
		}
		this.start.addMass(this.restingLength / 2);
		this.end.addMass(this.restingLength / 2);
	}
	WebStrand.prototype.tick = function() {
		var dx = (this.start.x - this.end.x);
		var dy = (this.start.y - this.end.y);
		var dist = Math.sqrt(dx * dx + dy * dy);
		if(dist > this.restingLength) {
			var force = K * (dist - this.restingLength);
			this.start.applyForce(-force * dx / dist, -force * dy / dist);
			this.end.applyForce(force * dx / dist, force * dy / dist);
		}
	};
	WebStrand.prototype.render = function(ctx, camera) {
		var dx = (this.start.x - this.end.x);
		var dy = (this.start.y - this.end.y);
		var p = Math.floor(11 * Math.sqrt(dx * dx + dy * dy) / this.restingLength) - 10;
		if(p < 0) {
			p = 15;
		}
		else {
			p = Math.max(15 - p, 0);
		}
		ctx.strokeStyle = '#f' + HEX[p] + HEX[p];
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(this.start.x - camera.x, this.start.y - camera.y);
		ctx.lineTo(this.end.x - camera.x, this.end.y - camera.y);
		ctx.stroke();
	};
	WebStrand.prototype.kill = function() {
		this.start.addMass(-this.restingLength / 2);
		this.end.addMass(-this.restingLength / 2);
	};
	WebStrand.prototype.sameAs = function(other) {
		return this._id === other._id;
	};
	return WebStrand;
});