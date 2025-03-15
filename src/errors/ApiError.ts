interface ApiErrorParams {
  message: string;
  status: number;
}

export class ApiError extends Error {
  status: number;

  constructor({ message, status }: ApiErrorParams) {
    super(message);
    this.status = status;
  }
}
