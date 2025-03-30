import { FileReader, MapReader } from "./reader";
import getPath from "./path";
import fs from "fs";

function run(reader: MapReader): void {
  const map = reader.read();
  const { letters, path } = getPath(map);

  // always write to stdout for now
  // TODO writer
  console.log("Letters: \t", letters);
  console.log("Path: \t\t", path);
}

(function () {
  // By default, use sample_map.txt, If file provided, use it. It not found, error
  const filepath = process.argv.length > 2 ? process.argv[2] : "sample_map.txt";
  if (!fs.existsSync(filepath)) {
    console.error(`File ${filepath} not found`);
    process.exit(1);
  }

  console.info(`Reading from ${filepath}`);

  try {
    run(FileReader.from(filepath));
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    }
    console.error("Error reading file");
    process.exit(1);
  }

  process.exit(0);
})();
