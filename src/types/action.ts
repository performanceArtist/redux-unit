export type PlainAction = {
  type: string;
};

export type PayloadAction<P> = {
  type: string;
  payload: P extends [any] ? P[0] : P;
};

export type Action<P> = PlainAction | PayloadAction<P>;

export type InferAction<P> = P extends [] ? PlainAction : PayloadAction<P>;
