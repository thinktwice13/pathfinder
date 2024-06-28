import { FileReader, MapReader } from "./reader";
import getPath from "./path";

function run(reader: MapReader): void {
  const map = reader.read();
  const { letters, path } = getPath(map);

  // always write to stdout for now
  // TODO writer
  console.log("Letters: \t", letters);
  console.log("Path: \t\t", path);
}

(function () {
  let filepath = "sample_map.txt";
  if (process.argv.length > 2) {
    filepath = process.argv[2];
  }

  console.info(`Reading from ${filepath}`);

  try {
    run(FileReader.from(filepath));
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    }
    process.exit(1);
  }

  process.exit(0);
})();
