import * as fs from "fs";
import * as os from "os";

export interface MapReader {
  read(): string[][];
}

export abstract class FileReader extends Error implements MapReader {
  abstract filepath: string;

  protected constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, FileReader.prototype);
  }

  abstract read(): string[][];

  // only txt and json supported
  static from(filepath: string): FileReader {
    if (filepath.endsWith(".txt")) {
      return new TxtFileReader(filepath);
    }

    if (filepath.endsWith(".json")) {
      return new JsonFileReader(filepath);
    }

    throw new Error("Unsupported file type");
  }

  static loadFile(filepath: string): string {
    return fs.readFileSync(filepath, "ascii");
  }
}

// TODO check file existence on create
export class TxtFileReader extends FileReader {
  filepath: string;

  constructor(filepath: string) {
    super(filepath);
    this.filepath = filepath;

    Object.setPrototypeOf(this, TxtFileReader.prototype);
  }

  read(): string[][] {
    const data = FileReader.loadFile(this.filepath);
    return data.split(os.EOL).map((line) => line.split(""));
  }
}

export class JsonFileReader extends FileReader {
  filepath: string;

  constructor(filepath: string) {
    super(filepath);
    this.filepath = filepath;

    Object.setPrototypeOf(this, JsonFileReader.prototype);
  }

  read(): string[][] {
    const data = FileReader.loadFile(this.filepath);
    return JSON.parse(data);
  }
}
