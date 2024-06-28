import { Direction, MoveOption } from "./types";
import { pickDirection } from "./pickDirection";

describe("pickDirection", () => {
  const doTests = (
    tests: [string, string, MoveOption[], Direction | string, boolean?][],
  ) => {
    tests.forEach(([desc, currentElement, options, want, wantErr]) => {
      test(desc, () => {
        if (wantErr) {
          expect(() => pickDirection(currentElement, options)).toThrow(
            want as string,
          );
        } else {
          expect(pickDirection(currentElement, options)).toEqual(want);
        }
      });
    });
  };

  describe("general", function () {
    // desc, currentElement, options, expected picked direction or error, wantErr
    const tests: [
      string,
      string,
      MoveOption[],
      result: Direction | string,
      boolean?,
    ][] = [
      ["invalid element", "%", [], "Invalid element", true],
      ["broken path", "-", [], "Broken path", true],
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
        "No valid moves",
        true,
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
        "Fake turn",
        true,
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
        "Fork",
        true,
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
        "No valid moves",
        true,
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
        "Multiple starting points",
        true,
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
        "Multiple paths",
        true,
      ],
      [
        "multiple turns, both visited",
        "A",
        [
          { element: "|", direction: Direction.Down, turn: 1, isVisited: true },
          { element: "|", direction: Direction.Up, turn: 3, isVisited: true },
        ],
        "No valid options",
        true,
      ],
    ]);
  });
});
