export class CustomError extends Error {
  status: number;

  constructor(msg: string, status: number) {
    super();
    this.message = msg;
    this.status = status;

    Object.setPrototypeOf(this, CustomError);
  }
}
