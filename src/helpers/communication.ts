export type Communication = {
  isRequesting: boolean;
  error?: string;
};

export const initialCommunication: Communication = {
  isRequesting: false,
};

export function isCompletedComm(prev: Communication, next: Communication): boolean {
  return prev.isRequesting && !next.isRequesting && !next.error;
}
