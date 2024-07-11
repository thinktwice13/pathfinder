import * as fs from "fs";
import * as os from "os";
import { TxtFileReader } from ".";

// TODO: different EOL characters, empty files

// Helper function to create a test file
function createTestFile(filepath: string, content: string) {
  fs.writeFileSync(filepath, content, { encoding: "utf8" });
}

// Helper function to remove the test file
function removeTestFile(filepath: string) {
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }
}

describe("TxtFileReader", () => {
  const testFilePath = "./testFile.txt";
  const testFileContent = `line1${os.EOL}line2${os.EOL}line3`;

  beforeAll(() => {
    createTestFile(testFilePath, testFileContent);
  });

  afterAll(() => {
    removeTestFile(testFilePath);
  });

  // removed due to the fact that the filepath is a private property and should not be accessed directly
  // test("instantiate with the correct filepath", () => {
  //   const reader = new TxtFileReader(testFilePath);
  //   expect(reader.filepath).toBe(testFilePath);
  // });

  test("read the file and return its content as a 2D array of characters", () => {
    const reader = new TxtFileReader(testFilePath);
    const expectedOutput = [
      ["l", "i", "n", "e", "1"],
      ["l", "i", "n", "e", "2"],
      ["l", "i", "n", "e", "3"],
    ];

    const result = reader.read();
    expect(result).toEqual(expectedOutput);
  });

  test("empty file", () => {
    const emptyFilePath = "./emptyFile.txt";
    createTestFile(emptyFilePath, "");
    const reader = new TxtFileReader(emptyFilePath);
    expect(reader.read()).toEqual([[]]);
    removeTestFile(emptyFilePath);
  });
});
