import { Direction, MoveOption } from "./types";
import { pickDirection } from "./pickDirection";
import { ElementInvalidError, PathInvalidError } from "../errors";

// TODO Test errors instead of their messages
describe("pickDirection", () => {
  const doTests = (
    tests: [string, string, MoveOption[], Direction?, Error?][],
  ) => {
    tests.forEach(([desc, currentElement, options, dir, err]) => {
      test(desc, () => {
        if (err) {
          expect(() => pickDirection(currentElement, options)).toThrow(err);
        } else {
          expect(pickDirection(currentElement, options)).toEqual(dir);
        }
      });
    });
  };

  describe("general", function () {
    // desc, currentElement, options, expected picked direction?, err?
    const tests: [
      string,
      string,
      MoveOption[],
      result?: Direction,
      err?: Error,
    ][] = [
      [
        "Element invalid",
        "%",
        [],
        undefined,
        ElementInvalidError as unknown as Error,
      ],
      ["broken path", "-", [], undefined, PathInvalidError as unknown as Error],
      [
        "straight path",
        "-",
        [
          {
            element: "-",
            direction: Direction.Right,
            turn: 0,
            isVisited: false,
          },
        ],
        Direction.Right,
      ],
      [
        "into unvisited intersection",
        "-",
        [
          {
            element: "|",
            direction: Direction.Right,
            turn: 0,
            isVisited: false,
          },
        ],
        undefined,
        PathInvalidError as unknown as Error,
      ],
      [
        "into unvisited letter",
        "-",
        [
          {
            element: "A",
            direction: Direction.Right,
            turn: 0,
            isVisited: false,
          },
        ],
        Direction.Right,
      ],
      [
        "into visited intersection",
        "-",
        [
          {
            element: "|",
            direction: Direction.Right,
            turn: 0,
            isVisited: true,
          },
        ],
        Direction.Right,
      ],
    ];

    doTests(tests);
  });

  describe("turn", function () {
    doTests([
      [
        "fake turn",
        "+",
        [
          {
            element: "A",
            direction: Direction.Right,
            turn: 0,
            isVisited: false,
          },
        ],
        undefined,
        PathInvalidError as unknown as Error,
      ],
      [
        "turn fork with straight option works because straight is removed",
        "+",
        [
          {
            element: "-",
            direction: Direction.Right,
            turn: 0,
            isVisited: false,
          },
          {
            element: "|",
            direction: Direction.Down,
            turn: 1,
            isVisited: false,
          },
        ],
        Direction.Down,
      ],
      [
        "turn fork",
        "+",
        [
          { element: "|", direction: Direction.Up, turn: 3, isVisited: false },
          {
            element: "|",
            direction: Direction.Down,
            turn: 1,
            isVisited: false,
          },
        ],
        undefined,
        PathInvalidError as unknown as Error,
      ],
      [
        "turn into visited intersection",
        "+",
        [
          {
            element: "|",
            direction: Direction.Right,
            turn: 1,
            isVisited: true,
          },
        ],
        Direction.Right,
      ],
      [
        "turn into letter",
        "+",
        [
          {
            element: "A",
            direction: Direction.Right,
            turn: 1,
            isVisited: false,
          },
        ],
        Direction.Right,
      ],
      [
        "turn into turn",
        "+",
        [
          {
            element: "+",
            direction: Direction.Right,
            turn: 1,
            isVisited: false,
          },
        ],
        Direction.Right,
      ],
    ]);
  });

  describe("start", function () {
    doTests([
      [
        "start into straight",
        "@",
        [
          {
            element: "-",
            direction: Direction.Right,
            turn: 0,
            isVisited: false,
          },
        ],
        Direction.Right,
      ],
      [
        "start into unvsited intersection",
        "@",
        [
          {
            element: "|",
            direction: Direction.Right,
            turn: 0,
            isVisited: false,
          },
        ],
        undefined,
        PathInvalidError as unknown as Error,
      ],
      [
        "start into unvisited intersection plus valid option",
        "@",
        [
          {
            element: "|",
            direction: Direction.Right,
            turn: 0,
            isVisited: false,
          },
          {
            element: "-",
            direction: Direction.Right,
            turn: 0,
            isVisited: false,
          },
        ],
        Direction.Right,
      ],
      [
        "start into letter",
        "@",
        [
          {
            element: "A",
            direction: Direction.Right,
            turn: 0,
            isVisited: false,
          },
        ],
        Direction.Right,
      ],
      [
        "start into turn",
        "@",
        [
          {
            element: "+",
            direction: Direction.Right,
            turn: 0,
            isVisited: false,
          },
        ],
        Direction.Right,
      ],
      [
        "start into visited intersection",
        "@",
        [
          {
            element: "|",
            direction: Direction.Right,
            turn: 0,
            isVisited: true,
          },
        ],
        Direction.Right,
      ],
      [
        "start with multiple branches",
        "@",
        [
          {
            element: "+",
            direction: Direction.Right,
            turn: 0,
            isVisited: false,
          },
          {
            element: "+",
            direction: Direction.Right,
            turn: 0,
            isVisited: false,
          },
        ],
        undefined,
        PathInvalidError as unknown as Error,
      ],
    ]);
  });

  describe("letters", function () {
    doTests([
      [
        "take the only turn",
        "A",
        [
          {
            element: "|",
            direction: Direction.Down,
            turn: 1,
            isVisited: false,
          },
        ],
        Direction.Down,
      ],
      [
        "take the straight options among multiple",
        "A",
        [
          {
            element: "-",
            direction: Direction.Right,
            turn: 0,
            isVisited: false,
          },
          {
            element: "|",
            direction: Direction.Down,
            turn: 1,
            isVisited: false,
          },
        ],
        Direction.Right,
      ],
      [
        "multiple turns, one visited",
        "A",
        [
          { element: "|", direction: Direction.Down, turn: 1, isVisited: true },
          { element: "|", direction: Direction.Up, turn: 3, isVisited: false },
        ],
        Direction.Up,
      ],
      [
        "multiple turns, both unvisited",
        "A",
        [
          {
            element: "|",
            direction: Direction.Down,
            turn: 1,
            isVisited: false,
          },
          { element: "|", direction: Direction.Up, turn: 3, isVisited: false },
        ],
        undefined,
        PathInvalidError as unknown as Error,
      ],
      [
        "multiple turns, both visited",
        "A",
        [
          { element: "|", direction: Direction.Down, turn: 1, isVisited: true },
          { element: "|", direction: Direction.Up, turn: 3, isVisited: true },
        ],
        undefined,
        PathInvalidError as unknown as Error,
      ],
    ]);
  });
});
