import * as fs from "fs";
import * as path from "path";
import { TxtFileReader } from "../src/reader";
import getPath from "../src/path";

describe.only("valid samples", () => {
  const files = fs.readdirSync(path.join(__dirname, "samples/ok"));
  const maps = files.map((file) => {
    // oprn each file and parse it
    const reader = new TxtFileReader(path.join(__dirname, "samples/ok", file));
    const map = reader.read();
    return [file, map] as const;
  });

  maps.forEach(([file, map]) => {
    it(`should return correct path for ${file}`, () => {
      const { path, letters } = getPath(map);
      console.log(letters, path);
      expect(letters).not.toBe("");
      expect(path).not.toBe("");
    });
  });
});

describe("invalid samples", () => {
  const files = fs.readdirSync(path.join(__dirname, "samples/err"));
  const maps = files.map((file) => {
    // oprn each file and parse it
    const reader = new TxtFileReader(path.join(__dirname, "samples/err", file));
    const map = reader.read();
    return [file, map] as const;
  });

  maps.forEach(([file, map]) => {
    it(`should throw error for ${file}`, () => {
      expect(() => getPath(map)).toThrowError();
    });
  });
});
