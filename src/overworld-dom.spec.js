import { render, fireEvent } from "@testing-library/svelte";
import Overworld from "./Overworld.svelte";

/**
 * @see https://jestjs.io/docs/getting-started
 * @see https://github.com/testing-library/jest-dom
 */
describe("Overworld", () => {
  let comp;
  let getByText;
  beforeEach(() => {
    comp = render(Overworld);
    getByText = comp.getByText;
  });

  describe("when looking at the map", () => {
    test("should see myself", () => {
      expect(getByText("K")).toBeInTheDocument();
    });
  });

  describe("when I press up arrow key", () => {
    test("should move me upwards", async () => {
      const elem = getByText("K"); // anywhere in the page
      for (let i = 0; i < 10; i++) {
        await fireEvent.keyDown(elem, { key: "ArrowUp" });
        await fireEvent.keyUp(elem);
      }
      // edge of map '0' nulls
      expect(comp.getAllByText("0")[0]).toBeInTheDocument();
    });
  });

  describe("when looking at my stats", () => {
    test("should show how many unicorns I own", () => {
      expect(getByText("unicorns owned: 0.0")).toBeInTheDocument();
    });
    test("should show how much hp I have left", () => {
      expect(getByText("hp: 3")).toBeInTheDocument();
    });
    test("should explain how I feel right now", () => {
      expect(getByText("i a m s a d")).toBeInTheDocument();
    });
  });
});
