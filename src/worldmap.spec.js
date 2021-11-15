import world from "./worldmap";

describe("world", () => {
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
  //   describe("given an empty map", () => {
  //     const map = world.parseMap(`
  //         ...
  //         ...
  //         ...`);
  //     describe("when I move right", () => {
  //       const newMap = map.move('right')
  //       expect(newMap.asString()).toEqual(world.parseMap())
  //     });
  //   });
});

function expectMapEquals(map, repr) {
  expect(map.asString()).toEqual(world.parseMap(repr).asString());
}

function removeOuterWhitespace(str) {
  return str
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .join("\n");
}
