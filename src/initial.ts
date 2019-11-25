import { initialCommunication, Communication } from './redux-unit/helpers';

export type InitialState = {
  todos: string[],
  getTodo: Communication
}

export const initialState: InitialState = {
  todos: [],
  getTodo: initialCommunication
};
