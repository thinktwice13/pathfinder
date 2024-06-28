import getPath from "./path";

// in, wantLetters, wantPath, wantErr
const tests: {
  map: string[][];
  expectedLetters: string;
  expectedPath: string;
}[] = [
  {
    map: [
      [" ", "@", "-", "-", "-", "A", "-", "-", "-", "+", " "],
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", "|", " "],
      [" ", "x", "-", "B", "-", "+", " ", " ", " ", "C", " "],
      [" ", " ", " ", " ", " ", "|", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", "+", "-", "-", "-", "-", "+"],
    ],
    expectedLetters: "ACB",
    expectedPath: "@---A---+|C|+---+|+-B-x",
  },
];

describe("getPath", () => {
  tests.forEach(({ map, expectedLetters, expectedPath }) => {
    test(`finds path for ${expectedLetters}`, () => {
      expect(getPath(map)).toEqual({
        letters: expectedLetters,
        path: expectedPath,
      });
    });
  });
});
