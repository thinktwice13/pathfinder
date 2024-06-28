import { Direction, Point, Result } from "./types";
import { pointToString } from "./helpers";
import { move } from "./move";

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
    throw new Error(
      "Invalid map with " + startCount + " starts and " + endCount + " ends",
    );
  }

  return point!; // point is guaranteed to be set here
}

export function* generatePoints(map: string[][]): Generator<[Point, boolean]> {
  // initial position. assume any direction for now
  let point = findStart(map);
  let direction = Direction.Right;

  // visited points, using a string key
  const visited: Set<string> = new Set();

  while (true) {
    // every point here is valid. Send it with visited status to caller
    // finish if we reach the end, otherwise record it and move on
    yield [point, visited.has(pointToString(point))];

    if (map[point.row][point.col] === "x") {
      // we're done
      break;
    }

    visited.add(pointToString(point));

    [point, direction] = move(map, visited, point, direction);
    // TODO: Loops. Keep track picked directions in addition to visited points
  }
}

export default function getPath(map: string[][]): Result {
  // init results and set of visited points for validation
  const path: string[] = [];
  const letters: string[] = [];

  for (const [point, visited] of generatePoints(map)) {
    const el = map[point.row][point.col]; // always valid
    // push element to path, and if it's a letter not visited before, push it to letters
    // NOTE: consider this function having its own visited set, as it has different concerns
    path.push(el);
    if (/[A-Z]/.test(el) && !visited) {
      letters.push(el);
    }
  }

  return {
    letters: letters.join(""),
    path: path.join(""),
  };
}
