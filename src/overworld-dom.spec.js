import { render, fireEvent } from "@testing-library/svelte";
import { select_option } from "svelte/internal";
import Overworld from "./Overworld.svelte";

/**
 * @see https://jestjs.io/docs/getting-started
 * @see https://github.com/testing-library/jest-dom
 */
describe("Overworld", () => {
  let comp;
  let getByText;
  const testTickInterval = 1;
  beforeEach(() => {
    comp = render(Overworld, { TICK_INTERVAL: testTickInterval });
    getByText = comp.getByText;
  });

  describe("when looking at the map", () => {
    test("should see myself", () => {
      expect(getByText(/K$/i)).toBeInTheDocument();
    });
  });

  describe("when I hold up arrow key", () => {
    test("should move me to edge of map", async () => {
      const elem = getByText(/K$/i); // anywhere in the page
      await fireEvent.keyDown(elem, { key: "ArrowUp" });
      await new Promise((resolve) =>
        setTimeout(resolve, testTickInterval * 50)
      );
      // edge of default map has water
      expect(comp.getAllByText(/[wo]$/i)[0]).toBeInTheDocument();
      expect(getByText(/K$/i)).toBeInTheDocument();
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
