// types.ts
export class EdenFetchError<
  Status extends number = number,
  Value = unknown,
> extends Error {
  status: Status;
  value: Value;

  constructor(status: Status, value: Value) {
    super(`HTTP error ${status}`);
    this.status = status;
    this.value = value;
  }
}
