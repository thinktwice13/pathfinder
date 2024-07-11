import { Direction, MoveOption } from "./types";
import { isIntersection } from "./helpers";
import { ElementInvalidError, PathInvalidError } from "../errors";

// pick a direction among 1 or more positions valid on a map, or throw an error
// this is where movement rules are applied
// TODO refactor: how much is option.direction needed? only used for intersection detection. Option idx could be returned instead
export function pickDirection(
  currentElement: string,
  options: MoveOption[],
): Direction {
  // cannot continue if elemnt is invalid or no valid options available
  if (!currentElement.match(/^[A-Z|+-@]$/)) throw new ElementInvalidError();

  // no options provided
  if (options.length === 0) throw new PathInvalidError("Broken path");

  // remove unvisited intersections from options
  // this is here only to throw an error distinguishing broken path and no valid moves
  options = options.filter(
    (opt) => !isIntersection(opt.element, opt.direction) || opt.isVisited,
  );
  if (options.length === 0) throw new PathInvalidError("No valid moves");

  switch (currentElement) {
    // in case of straight elements, prefer keeping direction
    case "|":
    case "-":
      return options[0].direction;

    // in case of turns, straight and forks not allowed
    case "+":
      if (options.length === 1 && options[0].turn === 0)
        throw new PathInvalidError("Fake turn");
      options = options.filter((opt) => opt.turn !== 0);
      if (options.length > 1) throw new PathInvalidError("Fork");
      return options[0].direction;
    case "@":
      // starting point is only allowed to have one option
      // this is distinct from straight elements case because getValidTurns limits their options to one,
      // compared to starting point, which can move in any direction
      if (options.length > 1)
        throw new PathInvalidError("Multiple starting points");
      return options[0].direction;
    default:
      // letters
      // TODO simplify
      // Take the only option OR take straight option OR take only unvisited option. Throw error on no valid options or fork
      if (options.length === 1 || options[0].turn === 0) {
        return options[0].direction;
      }
      options = options.filter((opt) => !opt.isVisited);
      if (options.length === 0) throw new PathInvalidError("No valid options");
      if (options.length > 1) throw new PathInvalidError("Multiple paths");
      return options[0].direction;
  }
}
