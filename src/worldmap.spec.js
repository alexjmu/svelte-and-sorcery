import world from "./worldmap";

describe("world", () => {
  describe("given any valid map string", () => {
    const mapRepr = `
            ...
            ...
            ...
        `;
    describe("when parsed", () => {
      const map = world.parseMap(mapRepr);
      it("should return map object", () => {
        expect(map).toMatchObject({
          asString: expect.anything(),
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
