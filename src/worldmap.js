"use strict";

import { getAllContexts } from "svelte";

// NxN array of arrays with a tile map for each level (e.g. [mob, floor])
// 'tiles' contain { icon } -> info about the character or glyph that represents them
const globalVar = {};
globalVar.globalMap = parseMap(`
#G_#_,,#GG#TTTT..TTTT.......................
#__#______#TT..T.....T......................
#UU#______#T.T.........T....................
##+#______#T...T.T.T......TT................
__________#.G.....T.........................
##__GG____+....K........T...................
#,,#______#TG.......T.......T...............
#,,_______#TTT....T..TT.....................
#__G______#TTT......TT..TT..T...............
#GG______G#TT.T....T.....TT.................
###########T.TT..TTT......T.................
............T...T...........................
...........TTT..T...........................
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
      return this.playerLocation !== undefined
        ? applyPlayerMoveToMap({
            map: this,
            fromLocation: this.playerLocation,
            toLocation: getAdjacentLocation({
              location: this.playerLocation,
              direction,
            }),
          })
        : deepCopyMap(this);
    },
    tick: function (amount) {
      return Array.from({ length: amount !== undefined ? amount : 1 }).reduce(
        (currentMap, _) => applyTickToMap({ map: currentMap }),
        this
      );
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

function findInMap({ tileMap, isMatch }) {
  const foundCoordinates = mapToCoordinateTilePairs(tileMap)
    .map(([coord, tile]) => [coord, tile[0].icon])
    .filter(([_, icon]) => isMatch(icon))
    .map(([coords, _]) => coords);
  return foundCoordinates;
}

function applyTickToMap({ map }) {
  return moveGoblins({ map });
}

function applyPlayerMoveToMap({ map, fromLocation, toLocation }) {
  return fromLocation !== undefined &&
    canMoveToLocation({ location: toLocation, map })
    ? {
        ...moveItemFromTo({
          fromLocation,
          toLocation,
          map,
        }),
        playerLocation: toLocation,
      }
    : deepCopyMap(map);
}

function moveItemFromTo({ fromLocation, toLocation, map }) {
  const mapCopy = deepCopyMap(map);
  const fromTile = getTileAt({ location: fromLocation, map: mapCopy });
  const toTile = getTileAt({ location: toLocation, map: mapCopy });
  if (fromTile !== undefined && toTile !== undefined) {
    toTile.unshift(fromTile.shift());
  } else {
    throw new Error("tried to move thing from or to non-existent tile");
  }
  return mapCopy;
}

function moveGoblins({ map }) {
  const goblinLocations = findInMap({
    tileMap: map.worldmap,
    isMatch: (icon) => icon === "G",
  });
  const movements = goblinLocations
    .map((location) => {
      const locationRight = getAdjacentLocation({
        location,
        direction: ["right", "left", "up", "down"][
          Math.floor(Math.random() * 4)
        ],
      });
      return { fromLocation: location, toLocation: locationRight };
    })
    .filter(({ toLocation }) =>
      canMoveToLocation({ location: toLocation, map })
    );
  const mapCopy = movements.reduce(
    (newMap, { fromLocation, toLocation }) =>
      moveItemFromTo({ fromLocation, toLocation, map: newMap }),
    map
  );
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

// TODO: canMove() can be public function of tiles module
function canMoveToLocation({ location, map }) {
  const mapTile = getTileAt({ location, map });
  return canMove(mapTile);
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
const tickEvent = () => {
  setWorldmap(globalVar.globalMap.tick());
};

export { getIconAt, walkDirection, tickEvent, parseMap, playerLocation };
