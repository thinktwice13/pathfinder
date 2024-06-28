// Point is a coordinate. Prefer row and col over x and y for clarity.
export type Point = { readonly row: number; readonly col: number };

// TODO consider removing enum, barely used
export enum Direction {
  Right,
  Down,
  Left,
  Up,
}

// Turn is a direction change relative to the current direction.
// 0 represents no change, 1 is a right turn, 2 is a U-turn, and 3 is a left turn.
export type Turn = 0 | 1 | 2 | 3;

// MoveOption represents a possible move from the current position to the next position in the specified direction
export type MoveOption = {
  // element is the next element at the position
  element: string;
  // direction is the absolute direction we can move in
  direction: Direction;
  // turn is the relative direction change from the current direction
  turn: Turn;
  // isVisited is true if the next position has been visited before
  isVisited: boolean;
};

// Result represents the final output of the program
export type Result = {
  // letters is the string of letters collected along the path, can be repeated but each only visited once
  letters: string;
  // path is all the elements visited in order
  path: string;
};
