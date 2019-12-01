import { reduxUnit } from './redux-unit';
import { apiHandler } from './redux-unit/helpers';

import { initialState } from './initial';

const unit = reduxUnit(initialState, {
  typePrefix: 'TODO',
  prefixSeparator: ':',
  separator: '-'
});

const { creators, reducer } = unit({
  add: (state) => (todo: string) => ({ ...state, todos: state.todos.concat(todo) }),
  getTodo: apiHandler({
    communication: 'getTodo',
    onRequest: (state) => (filter: Date) => state,
    onSuccess: (state) => (todos: string[]) => ({ ...state, todos })
  })
});

export { creators as todoCreators, reducer as todoReducer };
