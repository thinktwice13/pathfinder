import { Direction, MoveOption, Point } from "./types";
import { getElementValidTurns, getNextPoint, pointToString } from "./helpers";
import { pickDirection } from "./pickDirection";

// regex representing valid elements on the map
const allowedElementRegex = /^[A-Z|+-@x]$/;

// getMoveOptions considers the map boundaries and allowed elements on the path, and returns valid options
export function getMoveOptions(
  map: string[][],
  visited: Set<string>,
  point: Point,
  direction: Direction,
): MoveOption[] {
  const options: MoveOption[] = [];

  for (const turn of getElementValidTurns(map[point.row][point.col])) {
    // get next possible element and construst an option if recognized as valid
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

// move creates a new point and direction to move to by in following steps:
// - get relative turning options,
// - peek into each adjacent cell to create a set of valid options to move to in regards with map boundaries and allowed elements
// - pick single option to move to or error, based on requirement rules provided. Consider more declarative ruleset to filter options against
export function move(
  map: string[][],
  visited: Set<string>,
  point: Point,
  direction: Direction,
): [Point, Direction] {
  const options = getMoveOptions(map, visited, point, direction);
  direction = pickDirection(map[point.row][point.col], options);
  point = getNextPoint(point, direction); // Consider movable Point class to encapsulate this logic
  return [point, direction];
}
