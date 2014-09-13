if (typeof define !== 'function') { var define = require('amdefine')(module); }
define(function() {
	var NEXT_STRAND_ID = 0;
	function WebStrand(start, end) {
		this._id = NEXT_STRAND_ID++;
		this.start = start;
		this.end = end;
		var dx = (this.start.x - this.end.x);
		var dy = (this.start.y - this.end.y);
		this._dist = Math.sqrt(dx * dx + dy * dy) * 0.99;
		this.start.addWeight(this._dist / 2);
		this.end.addWeight(this._dist / 2);
	}
	WebStrand.prototype.tick = function() {
		var dx = (this.start.x - this.end.x);
		var dy = (this.start.y - this.end.y);
		var dist = Math.sqrt(dx * dx + dy * dy);
		var amt = (dist >= this._dist ? Math.min(10 * (dist - this._dist) * (dist - this._dist), 150) : 0);
		this.start.applyForce(-amt * dx / dist, -amt * dy / dist);
		this.end.applyForce(amt * dx / dist, amt * dy / dist);
	};
	WebStrand.prototype.render = function(ctx, camera) {
		ctx.strokeStyle = '#fff';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(this.start.x - camera.x, this.start.y - camera.y);
		ctx.lineTo(this.end.x - camera.x, this.end.y - camera.y);
		ctx.stroke();
	};
	WebStrand.prototype.sameAs = function(other) {
		return this._id === other._id;
	};
	return WebStrand;
});