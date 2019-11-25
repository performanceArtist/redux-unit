export type Communication = {
  isFetching: boolean;
  error?: string
}

export const initialCommunication: Communication = {
  isFetching: false
}
