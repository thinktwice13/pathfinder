// TODO Be more specific

abstract class CustomError extends Error {
  protected constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export class ElementInvalidError extends CustomError {
  static readonly message = "Element invalid";
  constructor() {
    super(ElementInvalidError.message);
    Object.setPrototypeOf(this, ElementInvalidError.prototype);
  }
}

export class MapInvalidError extends CustomError {
  static readonly message = "Map invalid";
  constructor() {
    super(MapInvalidError.message);
    Object.setPrototypeOf(this, MapInvalidError.prototype);
  }
}

export class PathInvalidError extends CustomError {
  static readonly message = "Path invalid";
  constructor(message?: string) {
    super(message ?? PathInvalidError.message);
    Object.setPrototypeOf(this, PathInvalidError.prototype);
  }
}

export class FileTypeUnsupportedError extends CustomError {
  constructor(filename?: string) {
    super("File format not supported" + filename ? `: ${filename}` : "");
    Object.setPrototypeOf(this, FileTypeUnsupportedError.prototype);
  }
}
