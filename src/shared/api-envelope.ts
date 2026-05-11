export type ApiSuccess<TData> = {
  success: true;
  data: TData;
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export const success = <TData>(data: TData): ApiSuccess<TData> => ({
  success: true,
  data,
});

export const failure = (code: string, message: string, details?: unknown): ApiError => ({
  success: false,
  error: {
    code,
    message,
    ...(details === undefined ? {} : { details }),
  },
});
