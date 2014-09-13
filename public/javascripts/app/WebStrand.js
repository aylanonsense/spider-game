if (typeof define !== 'function') { var define = require('amdefine')(module); }
define(function() {
	var NEXT_STRAND_ID = 0;
	function WebStrand(start, end) {
		this._id = NEXT_STRAND_ID++;
		this._start = start;
		this._end = end;
		var dx = (this._start.x - this._end.x);
		var dy = (this._start.y - this._end.y);
		this._dist = Math.sqrt(dx * dx + dy * dy);
		this._start.addWeight(this._dist / 2);
		this._end.addWeight(this._dist / 2);
	}
	WebStrand.prototype.tick = function() {
		var dx = (this._start.x - this._end.x);
		var dy = (this._start.y - this._end.y);
		var dist = Math.sqrt(dx * dx + dy * dy);
		var amt = dist >= this._dist ? 10 * (dist - this._dist) * (dist - this._dist) : 0;
		this._start.applyForce(-amt * dx / dist, -amt * dy / dist);
		this._end.applyForce(amt * dx / dist, amt * dy / dist);
	};
	WebStrand.prototype.render = function(ctx, camera) {
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 0.5;
		ctx.beginPath();
		ctx.moveTo(this._start.x - camera.x, this._start.y - camera.y);
		ctx.lineTo(this._end.x - camera.x, this._end.y - camera.y);
		ctx.stroke();
	};
	return WebStrand;
});