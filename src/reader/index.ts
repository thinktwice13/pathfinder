import * as fs from "fs";
import * as os from "os";

export interface MapReader {
  read(): string[][];
}

export abstract class FileReader implements MapReader {
  protected readonly filepath: string;

  protected constructor(filepath: string) {
    this.filepath = filepath;
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
  constructor(filepath: string) {
    super(filepath);
    Object.setPrototypeOf(this, TxtFileReader.prototype);
  }

  read(): string[][] {
    const data = FileReader.loadFile(this.filepath);
    return data.split(os.EOL).map((line) => line.split(""));
  }
}

export class JsonFileReader extends FileReader {
  constructor(filepath: string) {
    super(filepath);
    Object.setPrototypeOf(this, JsonFileReader.prototype);
  }

  read(): string[][] {
    const data = FileReader.loadFile(this.filepath);
    return JSON.parse(data);
  }
}
