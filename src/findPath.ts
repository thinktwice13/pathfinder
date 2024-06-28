import { Direction, MoveOption, Point, Result } from "./types";
import {
  getElementValidTurns,
  getNextPoint,
  isIntersection,
  pointToString,
} from "./helpers";

const allowedElementRegex = /^[A-Z|+-@x]$/;

// pick one direction from the options based on the current element, or throw an error
// TODO: Test, fix
export function pickDirection(
  currentElement: string,
  options: MoveOption[],
): Direction {
  // try reducing the options to one, or error
  if (options.length === 0) {
    throw new Error("Broken path at " + currentElement + " " + options);
  }

  // ignore intersections not previously visited
  // NOTE: discuss
  options = options.filter(
    (opt) => !isIntersection(opt.element, opt.direction) || opt.isVisited,
  );

  // err on broken path
  // consider combining with the broken path error
  if (options.length === 0) {
    throw new Error("No valid moves at " + currentElement);
  }

  // Keep opt here. After deciding, we can check for loops
  let opt: MoveOption;

  switch (currentElement) {
    case "|":
    case "-":
      // "|" and "-" can have 1 option at most
      opt = options[0];
      break;
    case "+":
      // handle turns
      // err on fake turn or remove straight option
      if (options.length === 1 && options[0].turn === 0) {
        throw new Error("Fake turn");
      }
      options = options.filter((opt) => opt.turn !== 0);
      // err on fork
      if (options.length > 1) {
        throw new Error("Fork");
      }
      opt = options[0];
      break;
    case "@":
      // handle starting point
      // this is the only element we can go back from, because intial direction is assumed
      // intersections already filtered, multiple branches not allowed. Everything else is ok
      if (options.length > 1) {
        throw new Error("Multiple starting points");
      }
      opt = options[0];
      break;
    default:
      // handle letters
      // TODO better
      if (options.length > 1) {
        // multiple paths. Remove straight visited one
        options = options.filter((opt) => opt.turn !== 0 || !opt.isVisited);
      }
      if (options.length > 1) {
        throw new Error("Multiple paths");
      }
      opt = options[0];
  }

  // check loop: TODO: must have record of visited points and decided directions
  return opt.direction;
}

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

export function getMoveOptions(
  map: string[][],
  visited: Set<string>,
  point: Point,
  direction: Direction,
): MoveOption[] {
  const options: MoveOption[] = [];

  for (const turn of getElementValidTurns(map[point.row][point.col])) {
    const nextDirection = (direction + turn) % 4;
    const nextPoint = getNextPoint(point, nextDirection);
    const nextElement = map[nextPoint.row]?.[nextPoint.col];

    if (allowedElementRegex.test(nextElement)) {
      options.push({
        element: nextElement,
        direction: nextDirection,
        turn,
        isVisited: visited.has(pointToString(nextPoint)),
      });
    }
  }
  return options;
}

export function move(
  map: string[][],
  visited: Set<string>,
  point: Point,
  direction: Direction,
): [Point, Direction] {
  const options = getMoveOptions(map, visited, point, direction);
  direction = pickDirection(map[point.row][point.col], options);
  point = getNextPoint(point, direction);
  return [point, direction];
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
  }
}

export function findPath(map: string[][]): Result {
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
