import world from "./worldmap";

describe("worldmap", () => {
  describe("given a valid map string", () => {
    [
      `
        _._
        ...
        _._
        `,
      `
        ...
        .K.
        ...
        `,
      `UUUU
        UUU
        UU
        U`,
    ].forEach((mapRepr) => {
      describe("when parsed", () => {
        const map = world.parseMap(mapRepr);
        it("should return map object", () => {
          expect(map).toMatchObject({
            asString: expect.anything(),
            move: expect.anything(),
            tick: expect.anything(),
          });
        });
        it("should unparse to the same string representation", () => {
          expect(map.asString()).toEqual(removeOuterWhitespace(mapRepr));
        });
      });
    });
  });

  describe("player movement commands", () => {
    describe("given a map with no player tile", () => {
      const map = world.parseMap(`
            ...
            ...
            ...`);
      describe("when move is given", () => {
        const newMap = map.move("right");
        it("should change nothing", () => {
          expectMapToBe(newMap, map.asString());
        });
      });
    });

    describe("given a map with a player tile", () => {
      const map = world.parseMap(`
          ...
          .K.
          ...
        `);
      [
        [
          "right",
          `
          ...
          ..K
          ...
          `,
        ],
        [
          "left",
          `
          ...
          K..
          ...
          `,
        ],
        [
          "up",
          `
          .K.
          ...
          ...
          `,
        ],
        [
          "down",
          `
          ...
          ...
          .K.
          `,
        ],
      ].forEach(([direction, expectedMap]) => {
        describe(`on move ${direction}`, () => {
          const newMap = map.move(direction);
          it(`should put player one tile ${direction}`, () => {
            expectMapToBe(newMap, expectedMap);
          });
        });
        describe(`on move twice`, () => {
          const rightDown = map.move("right").move("down");
          const upLeft = map.move("up").move("left");
          it(`should put player two tiles in the correct direction`, () => {
            expectMapToBe(
              rightDown,
              `...
                ...
                ..K`
            );
            expectMapToBe(
              upLeft,
              `K..
                ...
                ...`
            );
          });
        });
      });
    });
  });

  describe("tiles you can't walk over", () => {
    [
      ["null tile", "0"],
      ["wall", "#"],
      ["tree", "T"],
      ["goblin", "G"],
      ["map edge", ""],
    ].forEach(([thing, icon]) => {
      const playerAndThing = "K" + icon;
      describe(`given map ${playerAndThing}`, () => {
        const map = world.parseMap(playerAndThing);
        describe(`when player moves into ${thing}`, () => {
          const newMap = map.move("right");
          it("should not move", () => {
            expectMapToBe(newMap, playerAndThing);
          });
        });
      });
    });
  });

  describe(`tiles you can walk over`, () => {
    [
      ["gate", "+"],
      ["food", ","],
      ["platform", "_"],
      ["ground", "."],
    ].forEach(([thing, icon]) => {
      const playerNextToThing = ["K", icon, "."].join("");
      describe(`given map ${playerNextToThing}`, () => {
        const map = world.parseMap(playerNextToThing);
        describe(`when player moves into ${thing}`, () => {
          const newMap = map.move("right");
          it("should put player on top", () => {
            expectMapToBe(newMap, ".K.");
          });
        });
        describe(`when player moves past ${thing}`, () => {
          const newMap = map.move("right").move("right");
          it("should not move", () => {
            const thingInTheMiddle = RegExp(`.${icon}.`);
            expect(newMap.asString()).toMatch(thingInTheMiddle);
          });
          it("should let player go to other side", () => {
            const playerAcross = RegExp(`..K`);
            expect(newMap.asString()).toMatch(playerAcross);
          });
        });
      });
    });
  });

  describe(`goblin ai`, () => {
    describe("movement", () => {
      describe("given a goblin in an empty space", () => {
        const map = world.parseMap(`
        ...
        .G.
        ...
        `);
        describe("when time passes", () => {
          const nextMaps = getNextTicks(map, 10);
          it("should eventually move", () => {
            const didGoblinMove = nextMaps.some(
              (m) => m.asString() !== map.asString()
            );
            expect(didGoblinMove).toBe(true);
          });
        });
      });
      describe("given a goblin next to walls", () => {
        const map = world.parseMap(`
        ###
        #G#
        ###
        `);
        describe("when time passes", () => {
          const nextMaps = getNextTicks(map, 10);
          it("should not move into walls", () => {
            const didGoblinMove = nextMaps.some(
              (m) => m.asString() !== map.asString()
            );
            expect(didGoblinMove).toBe(false);
          });
        });
      });
    });
  });
});

function expectMapToBe(map, repr) {
  expect(map.asString()).toEqual(world.parseMap(repr).asString());
}

function getNextTicks(map, amount) {
  return Array.from({ length: amount }).reduce(
    (prevMaps, _) => [...prevMaps, prevMaps[prevMaps.length - 1].tick()],
    [map]
  );
}

function removeOuterWhitespace(str) {
  return str
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .join("\n");
}
