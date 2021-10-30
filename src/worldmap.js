'use strict';

const worldmap = `
#G_#_,,#GG#.................................
#__#______#.................................
#UU#______#.................................
##+#______#.................................
__________#.G...............................
##__GG____+....K............................
#,,#______#.G...............................
#,,_______#.................................
#__G______#.................................
#GG______G#.................................
###########.................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
............................................
`.trim().split('\n').map((l) => Array.from(l.trim()))

const playerLocation = {x: 5, y: 15};

const swapTiles = ({location1, location2}) => {
	const tile1 = getTileAt(location1);
	const tile2 = getTileAt(location2);
	setTileAt({location: location2, tile: tile1});
	setTileAt({location: location1, tile: tile2});
	return {tile1, tile2};
}

const getTileAt = ({x, y}) => worldmap[x] && worldmap[x][y]
const setTileAt = ({location, tile}) => {
	if (getTileAt(location)) {
		worldmap[location.x][location.y] = tile;
		return tile;
	} else {
		return undefined;
	}
}
const walkDirection = ({location, direction}) => {
	const move = {
		'left': {x: 0, y: -1},
		'right': {x: 0, y: 1},
		'up': {x: -1, y: 0},
		'down': {x: 1, y: 0}
	}[direction]
	const newLoc = {x: location.x + move.x, y: location.y + move.y}
	swapTiles({location1: location, location2: newLoc});
	console.log(newLoc);
	return newLoc;
};

export {
  getTileAt,
	setTileAt,
	playerLocation,
	walkDirection
}