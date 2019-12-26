export type Communication = {
  isRequesting: boolean;
  error?: string
};

export const initialCommunication: Communication = {
  isRequesting: false,
};
