"use strict";

// NxN array of arrays with a tile map for each level (e.g. [mob, floor])
// 'tiles' contain { icon } -> info about the character or glyph that represents them
const globalMap = parseMap(`
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

const { worldmap } = globalMap;

function parseMap(mapString2D) {
  const mapArray = mapString2D
    .trim()
    .split("\n")
    .map((l) => Array.from(l.trim()))
    .map((row, _yIdx) =>
      row.map((icon, _xIdx) =>
        isPlatform(icon) ? [{ icon }] : [{ icon }, defaultTile()]
      )
    );
  const coordTilePairs = mapArray
    .map((row, yIdx) =>
      row.map((tile, xIdx) => [{ x: xIdx, y: yIdx }, tile[0]?.icon])
    )
    .flat(1);

  const [foundPlayerCoords, _icon] = coordTilePairs.filter(
    ([_coords, icon]) => {
      return icon === "K";
    }
  )[0] || [undefined, ""];

  return {
    worldmap: mapArray,
    playerLocation: foundPlayerCoords,
    asString: function () {
      return this.worldmap
        .map((row) => row.map((tile) => getTopIcon(tile)).join(""))
        .join("\n");
    },
    move: function (direction) {
      if (this.playerLocation === undefined) {
        return { ...this };
      }
      const target = getAdjacentLocation({
        location: this.playerLocation,
        direction,
      });
      const mapCopy = {
        ...this,
        worldmap: this.worldmap.map((row) =>
          row.map((tile) => tile.map((obj) => ({ ...obj })))
        ),
      };
      const playerTile =
        mapCopy.worldmap?.[this.playerLocation.y]?.[
          this.playerLocation.x
        ]?.shift();
      mapCopy.worldmap?.[target.y]?.[target.x]?.unshift(playerTile);
      return mapCopy;
    },
  };
}

function isPlayer(icon) {
  return icon === "K";
}
function isPlatform(icon) {
  return [".", "_"].includes(icon) || icon === "+";
}
function defaultTile() {
  return { icon: "." };
}
function emptyTile() {
  return { icon: "0" };
}
function getTopIcon(tile) {
  return tile[0]?.icon;
}
const playerLocation = { x: 15, y: 5 };

const getIconAt = ({ x, y }) => worldmap[y]?.[x]?.[0]?.icon;
const popTileAt = ({ x, y }) => worldmap[y]?.[x]?.shift() || emptyTile();
const placeTileAt = ({ tile, location }) =>
  (tile !== undefined ||
    (() => {
      throw Error(`cannot place undefined tile at ${location}`);
    })()) &&
  worldmap[location.y]?.[location.x]?.unshift(tile) &&
  location;

const canMoveOver = ({ x, y }) => isPlatform(getIconAt({ x, y }));
const moveTile = ({ from, to }) => {
  if (canMoveOver({ ...to })) {
    const tile = popTileAt({ ...from });
    return placeTileAt({ tile, location: to });
  }
};

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

const walkDirection = ({ location, direction }) => {
  const target = getAdjacentLocation({ location, direction });
  const finalLocation =
    moveTile({
      from: location,
      to: target,
    }) || location;

  return finalLocation;
};

export { getIconAt, walkDirection, parseMap, playerLocation };
