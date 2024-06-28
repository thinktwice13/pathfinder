import * as fs from "fs";
import * as path from "path";
import { TxtFileReader } from "../reader";
import getPath from "..//path";
import { Result } from "../path/types";

const filenameResult: Record<string, Result> = {
  "basic.txt": { path: "@---A---+|C|+---+|+-B-x", letters: "ACB" },
  "intersection.txt": {
    path: "@|A+---B--+|+--C-+|-||+---D--+|x",
    letters: "ABCD",
  },
  "visitedLetter.txt": {
    path: "@-G-O-+|+-+|O||+-O-N-+|I|+-+|+-I-+|ES|x",
    letters: "GOONIES",
  },
  "letterTurns.txt": { path: "@---A---+|||C---+|+-B-x", letters: "ACB" },
  "compact.txt": { path: "@B+++B|+-L-+A+++A-+Hx", letters: "BLAH" },
  "postEnd.txt": { path: "@-A--+|+-B--x", letters: "AB" },
};

describe("valid samples", () => {
  const files = fs.readdirSync(path.join(__dirname, "samples/ok"));
  const maps = files.map((file) => {
    // oprn each file and parse it
    const reader = new TxtFileReader(path.join(__dirname, "samples/ok", file));
    const map = reader.read();
    return [file, map] as const;
  });

  maps.forEach(([file, map]) => {
    it(`returns correct result for ${file}`, () => {
      expect(getPath(map)).toEqual(filenameResult[file]);
    });
  });
});

const errFromFilename = (filename: string) => {
  switch (filename) {
    case "broken.txt":
      return "Broken path";
    case "fakeTurn.txt":
      return "Fake turn";
    case "multibranch.txt":
    // NOTE: requirements asking for fork error, but map is discarded earlier
    // return "Multiple branches";
    // eslint-disable-next-line no-fallthrough
    case "turnFork.txt":
    // NOTE: requirements asking for multiple branches error, but map is discarded earlier
    // return "Fork";
    // eslint-disable-next-line no-fallthrough
    case "multistart.txt":
    case "multistart2.txt":
    case "multistart3.txt":
    case "noend.txt":
    case "nostart.txt":
      return "Invalid map";
      return "Invalid map";
    default:
      return undefined;
  }
};

describe("invalid samples", () => {
  const files = fs.readdirSync(path.join(__dirname, "samples/err"));
  const maps = files.map((file) => {
    // oprn each file and parse it
    const reader = new TxtFileReader(path.join(__dirname, "samples/err", file));
    const map = reader.read();
    return [file, map] as const;
  });

  maps.forEach(([file, map]) => {
    it(`throws error for ${file}`, () => {
      const errMessage = errFromFilename(file);

      expect(() => getPath(map)).toThrowError(errMessage);
    });
  });
});
