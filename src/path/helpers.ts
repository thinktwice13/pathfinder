import { Direction, Point, Turn } from "./types";

export function pointToString(point: Point) {
  return `${point.row}.${point.col}`;
}

export function isIntersection(el: string, dir: Direction): boolean {
  return (el === "-" && dir % 2 === 1) || (el === "|" && dir % 2 === 0);
}

// get valid relative turns from the current element
export function getElementValidTurns(el: string): Turn[] {
  // turn element should never continue straight, but we're allowing it to be able to throw correct error for fake turns
  if (el === "@") return [0, 1, 2, 3];
  if (/^[+A-Z]$/.test(el)) return [0, 1, 3];
  if (el === "|" || el === "-") return [0];
  return [];
}

export function getNextPoint(point: Point, direction: Direction): Point {
  switch (direction) {
    case Direction.Right:
      return { row: point.row, col: point.col + 1 };
    case Direction.Down:
      return { row: point.row + 1, col: point.col };
    case Direction.Left:
      return { row: point.row, col: point.col - 1 };
    case Direction.Up:
      return { row: point.row - 1, col: point.col };
  }
}
