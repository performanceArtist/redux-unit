export type Initial = {
  type: 'initial';
};

export type Pending = {
  type: 'pending';
};

export type Success = {
  type: 'success';
};

export type CommuncationError = {
  type: 'error';
  value: Error;
};

const initial: Communication = {
  type: 'initial',
};

const error = (error: Error): Communication => ({
  type: 'error',
  value: error,
});

const success: Communication = {
  type: 'success',
};

const pending: Communication = {
  type: 'pending',
};

export type Communication = Initial | Pending | Success | CommuncationError;

export const communication = {
  initial,
  error,
  success,
  pending,
};
