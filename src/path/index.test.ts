import { Point } from "./types";
import { findStart, generatePoints } from "./index";

describe("findStart", () => {
  // tests: [desc, map, throws, expected point]
  const tests: [string, string[][], boolean, Point?][] = [
    ["valid", [["x", "", "@"]], false, { row: 0, col: 2 }],
    ["multiple starts", [["@", "@", "x"]], true],
    ["two ends", [["@", "x", "x"]], true],
    ["missing start", [["", "", "x"]], true],
    ["missing end", [["@", "", ""]], true],
    ["missing start and end", [["", "", ""]], true],
  ];

  tests.forEach(([desc, map, throws, expected]) => {
    test(desc, () => {
      if (throws) {
        expect(() => findStart(map)).toThrow();
      } else {
        expect(findStart(map)).toEqual(expected);
      }
    });
  });
});

describe("generatePoints", () => {
  test("generates correct steps", () => {
    const map = [["@", "-", "x"]];
    // expect yields with the following points: [0, 0], [0, 1], [0, 2], none visited
    const gen = generatePoints(map);

    expect(gen.next().value).toEqual([{ row: 0, col: 0 }, false]);
    expect(gen.next().value).toEqual([{ row: 0, col: 1 }, false]);
    expect(gen.next().value).toEqual([{ row: 0, col: 2 }, false]);
  });

  // FIXME: fix pickDirection to handle this case
  test("generates correct steps with visited letters", () => {
    const map = [
      ["", "x", ""],
      ["@", "A", "+"],
      ["", "+", "+"],
    ];
    // expect yields with the following points: [0, 0], [0, 1], [0, 2], none visited
    const gen = generatePoints(map);
    expect(gen.next().value).toEqual([{ row: 1, col: 0 }, false]);
    expect(gen.next().value).toEqual([{ row: 1, col: 1 }, false]);
    expect(gen.next().value).toEqual([{ row: 1, col: 2 }, false]);
    expect(gen.next().value).toEqual([{ row: 2, col: 2 }, false]);
    expect(gen.next().value).toEqual([{ row: 2, col: 1 }, false]);
    expect(gen.next().value).toEqual([{ row: 1, col: 1 }, true]);
    expect(gen.next().value).toEqual([{ row: 0, col: 1 }, false]);
    expect(gen.next().done).toBe(true);
  });
});
