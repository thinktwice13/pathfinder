import { Direction, Point, Result } from "./types";
import { pointToString } from "./helpers";
import { move } from "./move";
import { MapInvalidError } from "../errors";

export function findStart(map: string[][]) {
  let startCount = 0;
  let endCount = 0;
  let point: Point;
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      if (map[row][col] === "@") {
        startCount++;
        point = { row, col };
      } else if (map[row][col] === "x") {
        endCount++;
      }
    }
  }

  // there can only be one start and one end
  if (startCount !== 1 || endCount !== 1) {
    throw new MapInvalidError();
  }

  return point!; // point is guaranteed to be set here
}

// generator yields path elements to the caller and PREVIOUSLY visited state of that point, then moves to the next point until the end
export function* generateElements(
  map: string[][],
): Generator<[string, boolean]> {
  // initial position. assume any direction for now
  let point = findStart(map);
  let direction = Direction.Right;

  // visited points, using a string key
  const visited: Set<string> = new Set();

  while (true) {
    // every point here is valid. Send it with visited status to caller
    // finish if we reach the end, otherwise record it and move on
    const el = map[point.row][point.col];
    yield [el, visited.has(pointToString(point))];
    if (el === "x") {
      // we're done
      break;
    }
    visited.add(pointToString(point));

    [point, direction] = move(map, visited, point, direction);
    // TODO: Loops. Keep track picked directions in addition to visited points
  }
}

// main result producing function, uses point generator to get only relevant positions in the map
export default function getPath(map: string[][]): Result {
  // init results and set of visited points for validation
  const path: string[] = [];
  const letters: string[] = [];

  for (const [element, visited] of generateElements(map)) {
    // always save it to the path, only save letters if not visited before
    path.push(element);
    if (element >= "A" && element <= "Z" && !visited) {
      letters.push(element);
    }
  }

  return {
    letters: letters.join(""),
    path: path.join(""),
  };
}
