"use strict";

import { getAllContexts } from "svelte";

// NxN array of arrays with a tile map for each level (e.g. [mob, floor])
// 'tiles' contain { icon } -> info about the character or glyph that represents them
const globalVar = {};
globalVar.globalMap = parseMap(`
TTTTTTTTTTTTTTTTTTTTTTTTTTwTTTTTTwwwwwwwwwwwwTTTTTTTTTTTTTTTTT
TTTTTTTTTTTTTTTTTTTTTTTTTTwTTTTTTwwwwwwwwwwwwTTTTTTTTTTTTTTTTT
TTTTT..TTTTTTT.TTTTTTTTTTwTTTTTTTTwwwwwwwwwwTTTTTTTTTTTTTTTTTT
TTTTTTTTTTTTT..TTTTTTTTTTTTTTTTTTTTwwwwwwwwwTTTTTTTTTTTTTTTTTT
TTTTTT.TTT..TTTTTTTTTTTTTTTTTTTTTTTTwwwwwwwwTTTTTTTTTTTTTTTTTT
TTTTTTTTTTTTTTTTTTT.TT.TT...UTTTTTTTTwwwwwwTTTTTTTTTTTTTTTTTTT
TTTUTTTTT##########TTTTTTT.TTTT.T.TTTTwwwwTTTTTTTTTGTTTTTTTTTT
TT..TTTTT#G_+_,,#_##TTTT...TTTTT.T.T.TTTwwwTTTTTTTTTTTTTTTTTTTT
TT.TTTTTT#__#______#TT..T.TTTTTTT.TTT.TTwwwTT.T.....TGTTTTTTTTTTT
TT.TT..TT#UU#__.__##T.T...TTTTTTTTTT.T.wwwT.T....T#UTTTTTTTTTTTTT
TT.TTTTTT####___.__#T...T.TTTTTTTTTTTTwwwTTTTTTT.TTTTGTTTTTTTTTTT
TT......_.________##.G....TTTTTTTT...++++........TTTTTTTTTTTTTTTT
T..TTT.TT##__GG____+..._.K..........wwwTTTT.TTT...T.TTTTTTTTTTTTT
TT.TTTTTT#,,#___.__#.G.....TTTTTTTTwwTwTT..T.T...T..TTTTTTTTTTTTT
TT...TTTTT,,G__.__##TTT.._.TTTTTTTTwwwTw.TT...T.T.TTTTTTTTTTTTTTT
TTTT.TTTTT########TTTTT....TTTTTTTTwwTTTw.T..T...T.TTTTTTTTTTTTTT
TTTT.TTTTTTTTTTTTTTTTT.T._.TTTTTT.TTwwTTTwwTT.....T.TTTTTTTTTTTTT
TTT..TTTT.TTT.TTTTTTT.TT._TTTTTTT..T.wwT.TTwww...T.TTTTTTTTTTTTTT
TTT.TTTTTTTTTTTT.TTTT......TTTTTT.T..wwT.TT..wT..T..TTTTTTTTTTTTT
TTT.TTTTTTTT.TT.T..TTT....T..T.TT.TT..ww..T...w+wwT.TTTTTTTTTTTTT
TTT.TTTTTTT..T.T.T..T...TT.T.TT..T.T.wTw....T...T.wwTT.TTTTTTTTTT
TTT..TTTT.TTTT..........TT.TT.TTTTTTwTTTww.........wwTTTTTTTTTTTT
TTww.TTT.T.......T.T.TTT..T.T.TT.TwwTTTTTTwT.....T#TTwTT.TTTTTTTT
TTww.........TT..T..TTTTTT.T.T.TwwTTTUUUTTTw.T...#G#TTwwTTTTTTTTT
TTTTT#TT....TTTTTTTTTTTTTTT.T.TwTTTTTUUUTTTTw....###TTTTwTTTTTTTT
TTTTTG#....T..TTTTTTT.TTTT.TTwwTTT....U.TTT.Tw....TTTT.TTwwTTTTTT
TTTT.#.T..TTTTTTTTTTTTTTTTTTwTT....TTTTTTTTTTwwT...TTTTTTTTwTTTTT
TTTTTTTT..TTTT.TTTT.TTTTTTTwTTT.TTTTTTTTTTTTwwwwwT.TTTTTTTTTTTTTT
TTTTTTTT..TTTTTTTTTTTTTTTTwTTTT.TTTT.TTTTTTwwwwww..TTTTTTTTTTTTTT
TTTT.TTT..TTTTT.TTTTTTTT.wTTTTT.T.TTTTTTTTwwwwwwww.TTTTTTTTTTTTTT
TTTTTTTT..TTTTTTTTTTTTTTwTTTTTT.TTTTTTTTTTTwTwwwwT..TT.TTTTTTTTTT
TT..TTTT..TTTTTTTTTTTTTw.T.TTTT.TTTTTTTTTTTTTTTwT..TTTTTTTTTTTTTT
TTTTTTT.T..T.T.T.T.TTTw.TTTTTT..TTT..T.T..TTTT.....TTTTTTTTTTTTTT
TTTTTTTT..T.T.TTTTTTTw.T........T.T.T.T.TTTTT..TTT.TTTTTTTTTTTTTT
TTTT..TT....TT.TT.TTw....TTTTTTTTT.......TTT..TTTT..TTTTTTTTTTTTT
TTTTTTTT...T....T.TwTTT..T...T..T.TT.T.TTTTTT..T.T..TTTTTTTTTTTTT
wTTTTTTT..T..T...TTwT....T....T..T..T..TTTTTT..TT..TTTTTTTTTTTTTT
wwTTTTTT..T..T...T.TwT....T.T..T.T.TTTTTTTT.T..T....TTTTTTTTTTTTT
wwwTTT.....TT.TT..TTTwT......TT.T.TT.T..T..T...T.....TTTTTTwwwww
wwwwTTTT.....T..TT..TTwT............T..............T..TTTTTwwwww
wwwwwTTT.T............Tw.......T...........T...........TTwwwwwww
wwwwwwTT......T...T........T.....###..T......T.T..T.TTTwwwwwwwww
wwwwwwTTT..............T........_+_##....T.......T.Twwwwwwwwwwwww
wwwwwwwwwTwwwww.wwwwww..wwww.www##__###www.wwww.w.wwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww#GG+U#wwwwwwwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww######wwwwwwwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
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
    tick: function () {
      return applyTickToMap({ map: this });
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
  const nextMap = deepCopyMap(map);
  moveGoblins({ map: nextMap });
  return nextMap;
}

function applyPlayerMoveToMap({ map, fromLocation, toLocation }) {
  const nextMap = deepCopyMap(map);
  if (
    fromLocation !== undefined &&
    canMoveToLocation({ location: toLocation, map })
  ) {
    moveItemFromTo({
      fromLocation,
      toLocation,
      map: nextMap,
    });
    nextMap.playerLocation = toLocation;
  }
  return nextMap;
}

function moveItemFromTo({ fromLocation, toLocation, map }) {
  const fromTile = getTileAt({ location: fromLocation, map });
  const toTile = getTileAt({ location: toLocation, map });
  if (fromTile !== undefined && toTile !== undefined) {
    toTile.unshift(fromTile.shift());
  } else {
    throw new Error("tried to move thing from or to non-existent tile");
  }
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
  movements.forEach(({ fromLocation, toLocation }) =>
    moveItemFromTo({ fromLocation, toLocation, map })
  );
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

export function getTileAt({ location, map }) {
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

export const getAdjacentLocation = ({ location, direction }) => {
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
