import { Direction, Point } from "./types";
import {
  getElementValidTurns,
  getNextPoint,
  isIntersection,
  pointToString,
} from "./helpers";

describe("pointToString", () => {
  const tests: [Point, string][] = [
    [{ row: 0, col: 0 }, "0.0"],
    [{ row: 1, col: 1 }, "1.1"],
    [{ row: 2, col: 3 }, "2.3"],
    [{ row: 42, col: 42 }, "42.42"],
  ];

  tests.forEach(([point, expected]) => {
    test(`convert ${point} to ${expected}`, () => {
      expect(pointToString(point)).toEqual(expected);
    });
  });
});

describe("isIntersection", () => {
  const tests: [string, Direction, boolean][] = [
    ["-", Direction.Right, false],
    ["-", Direction.Down, true],
    ["-", Direction.Left, false],
    ["-", Direction.Up, true],
    ["|", Direction.Right, true],
    ["|", Direction.Down, false],
    ["|", Direction.Left, true],
    ["|", Direction.Up, false],
  ];

  tests.forEach(([el, dir, expected]) => {
    test(`is ${el} an intersection for ${Direction[dir]}?`, () => {
      expect(isIntersection(el, dir)).toEqual(expected);
    });
  });
});

describe("getElementValidTurns", () => {
  const tests: [string, number[]][] = [
    ["-", [0]],
    ["|", [0]],
    ["+", [0, 1, 3]],
    ["A", [0, 1, 3]],
    ["Z", [0, 1, 3]],
    ["@", [0, 1, 2, 3]],
    ["QQ", []],
    ["", []],
    [" ", []],
    ["\n", []],
    ["#", []],
  ];

  tests.forEach(([el, expected]) => {
    test(`valid turns for ${el}`, () => {
      expect(getElementValidTurns(el)).toEqual(expected);
    });
  });
});

describe("getNextPoint", () => {
  const tests: [Point, Direction, Point][] = [
    [{ row: 0, col: 0 }, Direction.Right, { row: 0, col: 1 }],
    [{ row: 0, col: 0 }, Direction.Down, { row: 1, col: 0 }],
    [{ row: 0, col: 0 }, Direction.Left, { row: 0, col: -1 }],
    [{ row: 0, col: 0 }, Direction.Up, { row: -1, col: 0 }],
    [{ row: 1, col: 1 }, Direction.Right, { row: 1, col: 2 }],
    [{ row: 1, col: 1 }, Direction.Down, { row: 2, col: 1 }],
    [{ row: 1, col: 1 }, Direction.Left, { row: 1, col: 0 }],
    [{ row: 1, col: 1 }, Direction.Up, { row: 0, col: 1 }],
  ];

  tests.forEach(([point, direction, expected]) => {
    test(`move ${direction} from ${point} to ${expected}`, () => {
      expect(getNextPoint(point, direction)).toEqual(expected);
    });
  });
});
