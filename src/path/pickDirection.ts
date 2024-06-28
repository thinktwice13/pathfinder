import { Direction, MoveOption } from "./types";
import { isIntersection } from "./helpers";

// pick a direction among 1 or more positions valid on a map, or throw an error
// this is where movement rules are applied
export function pickDirection(
  currentElement: string,
  options: MoveOption[],
): Direction {
  if (!currentElement.match(/^[A-Z|+-@]$/)) throw new Error("Invalid element");

  if (options.length === 0) throw new Error("Broken path");

  options = options.filter(
    (opt) => !isIntersection(opt.element, opt.direction) || opt.isVisited,
  );
  if (options.length === 0) throw new Error("No valid moves");

  let opt: MoveOption;

  switch (currentElement) {
    case "|":
    case "-":
      opt = options[0];
      break;
    case "+":
      if (options.length === 1 && options[0].turn === 0)
        throw new Error("Fake turn");
      options = options.filter((opt) => opt.turn !== 0);
      if (options.length > 1) throw new Error("Fork");
      opt = options[0];
      break;
    case "@":
      if (options.length > 1) throw new Error("Multiple starting points");
      opt = options[0];
      break;
    default:
      // letters
      // take the only option or prefer straight option. Note unvisited intersections will be filtered out already
      if (options.length === 1 || options[0].turn === 0) {
        opt = options[0];
        break;
      }

      // multiple paths? remove visited
      options = options.filter((opt) => !opt.isVisited);
      if (options.length === 0) throw new Error("No valid options");
      if (options.length > 1) throw new Error("Multiple paths");
      opt = options[0];
  }

  return opt.direction;
}
