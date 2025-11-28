export class InfluxError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InfluxError";
    Object.setPrototypeOf(this, InfluxError.prototype);
  }
}
