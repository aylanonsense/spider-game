if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'app/Tile',
	'app/Constants',
	'app/Rect'
], function(
	Tile,
	Constants,
	Rect
) {
	function SquareTile(tiles, col, row) {
		Tile.apply(this, arguments);
		this.box = new Rect(this.col * Constants.TILE_SIZE,
			this.row * Constants.TILE_SIZE,
			Constants.TILE_SIZE, Constants.TILE_SIZE);
	}
	SquareTile.prototype = Object.create(Tile.prototype);
	return SquareTile;
});