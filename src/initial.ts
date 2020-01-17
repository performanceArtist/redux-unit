import { initialCommunication, Communication } from './redux-unit/helpers';

export type InitialState = {
  savedTodos: string[];
  communication: {
    getTodo: Communication
  },
  data: {
    todos: string[],
  }
}

export const initialState: InitialState = {
  savedTodos: [],
  communication: {
    getTodo: initialCommunication
  },
  data: {
    todos: []
  }
};
