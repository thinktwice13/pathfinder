import { Direction, MoveOption, Point } from "./types";
import { getElementValidTurns, getNextPoint, pointToString } from "./helpers";
import { pickDirection } from "./pickDirection";

const allowedElementRegex = /^[A-Z|+-@x]$/;

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
