"use strict";

import { getAllContexts } from "svelte";

// NxN array of arrays with a tile map for each level (e.g. [mob, floor])
// 'tiles' contain { icon } -> info about the character or glyph that represents them
const globalVar = {};
globalVar.globalMap = parseMap(`
#G_#_,,#GG#TTTT..TTTT.......................
#__#______#..........T......................
#UU#______#............T....................
##+#______#.................................
__________#.G...............................
##__GG____+....K............................
#,,#______#.G...............................
#,,_______#..T.......TT.....................
#__G______#.T.......TT......................
#GG______G#........T........................
###########......TTT........................
................T...........................
............TT..T...........................
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
`);

const playerLocation = findPlayerInMap(globalVar.globalMap.worldmap);
const setWorldmap = (newGlobalMap) => {
  globalVar.globalMap = newGlobalMap;
};
const getIconAt = (location) =>
  getTopIcon(getTileAt({ location, map: globalVar.globalMap }));

function parseMap(mapString2D) {
  const tileMap = stringToTileMap(mapString2D);
  const playerStartingLocation = findPlayerInMap(tileMap);

  return {
    worldmap: tileMap,
    playerLocation: playerStartingLocation,
    asString: function () {
      return tileMapToString(this.worldmap);
    },
    move: function (direction) {
      return applyMoveToMap({
        map: this,
        startLocation: this.playerLocation,
        direction,
      });
    },
  };
}

function stringToTileMap(mapString2D) {
  return mapString2D
    .trim()
    .split("\n")
    .map((l) => Array.from(l.trim()))
    .map((row, _yIdx) =>
      row.map((icon, _xIdx) =>
        isPlatform(icon) ? [{ icon }] : [{ icon }, defaultTile()]
      )
    );
}

function tileMapToString(tileMap) {
  return tileMap
    .map((row) => row.map((tile) => getTopIcon(tile)).join(""))
    .join("\n");
}

function findPlayerInMap(tileMap) {
  const [foundPlayerCoordinates, _] = mapToCoordinateTilePairs(tileMap)
    .map(([coord, tile]) => [coord, tile[0].icon])
    .filter(([_, icon]) => isPlayer(icon))[0] || [undefined, undefined];

  return foundPlayerCoordinates;
}

function applyMoveToMap({ map, startLocation, direction }) {
  const mapCopy = deepCopyMap(map);
  if (startLocation === undefined) {
    return mapCopy;
  }
  const startTile = getTileAt({ location: startLocation, map: mapCopy });

  const target = getAdjacentLocation({
    location: startLocation,
    direction,
  });
  const targetTile = getTileAt({ location: target, map: mapCopy });

  if (canMove(targetTile)) {
    const removedPlayer = startTile?.shift();
    targetTile?.unshift(removedPlayer);
    mapCopy.playerLocation = target;
  }
  return mapCopy;
}

function mapToCoordinateTilePairs(tileMap) {
  return tileMap
    .map((row, yIdx) => row.map((tile, xIdx) => [{ x: xIdx, y: yIdx }, tile]))
    .flat(1);
}

function deepCopyMap(map) {
  return {
    ...map,
    worldmap: map.worldmap.map((row) => [
      ...row.map((tile) => [...tile.map((obj) => ({ ...obj }))]),
    ]),
  };
}

function getTileAt({ location, map }) {
  return map.worldmap[location.y]?.[location.x] || emptyTileSet();
}

function canMove(mapTile) {
  let icon = getTopIcon(mapTile);
  return [isPlatform, isSmall].some((isType) => isType(icon));
}

function isPlayer(icon) {
  return icon === "K";
}
function isPlatform(icon) {
  return [".", "_"].includes(icon);
}
function isSmall(icon) {
  return [",", "+"].includes(icon);
}
function defaultTile() {
  return { icon: "." };
}
function emptyTile() {
  return { icon: "0" };
}
function emptyTileSet() {
  return [emptyTile()];
}
function getTopIcon(tile) {
  return tile[0]?.icon;
}

const getAdjacentLocation = ({ location, direction }) => {
  const moveVector =
    {
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
    }[direction] ||
    (() => {
      throw Error(`bad direction '${direction}'`);
    })();
  return {
    x: location.x + moveVector.x,
    y: location.y + moveVector.y,
  };
};

const walkDirection = ({ direction }) => {
  setWorldmap(globalVar.globalMap.move(direction));
  return globalVar.globalMap.playerLocation;
};

export { getIconAt, walkDirection, parseMap, playerLocation };
