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
          });
        });
        it("should unparse to the same string representation", () => {
          expect(map.asString()).toEqual(removeOuterWhitespace(mapRepr));
        });
      });
    });
  });

  describe("given a map with no player tile", () => {
    const map = world.parseMap(`
          ...
          ...
          ...`);
    describe("when move is given", () => {
      const newMap = map.move("right");
      it("should change nothing", () => {
        expect(newMap).toEqual(map);
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
          expectMap(newMap, expectedMap);
        });
      });
      describe(`on move twice`, () => {
        const rightDown = map.move("right").move("down");
        const upLeft = map.move("up").move("left");
        it(`should put player two tiles in the correct direction`, () => {
          expectMap(
            rightDown,
            `...
              ...
              ..K`
          );
          expectMap(
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

function expectMap(map, repr) {
  expect(map.asString()).toEqual(world.parseMap(repr).asString());
}

function removeOuterWhitespace(str) {
  return str
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .join("\n");
}
