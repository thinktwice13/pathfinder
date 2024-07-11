import { PathInvalidError } from ".";

// Sample custom error test

describe("PathInvalidError", () => {
  test("is instance of Error", () => {
    const error = new PathInvalidError();
    expect(error).toBeInstanceOf(Error);
  });

  test("instanceof PathInvalidError", () => {
    const error = new PathInvalidError();
    expect(error).toBeInstanceOf(PathInvalidError);
  });

  test("default message", () => {
    const error = new PathInvalidError();
    expect(error.message).toBe("Path invalid");
  });

  test("static message", () => {
    expect(PathInvalidError.message).toBe("Path invalid");
  });

  test("custom message", () => {
    const error = new PathInvalidError("Custom message");
    expect(error.message).toBe("Custom message");
  });

  test("stack trace", () => {
    const error = new PathInvalidError();
    expect(error.stack).toBeDefined();
  });
});
