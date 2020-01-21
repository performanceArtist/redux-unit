import { reduxUnit } from './redux-unit';
import { api, identity } from './redux-unit/helpers';

import { initialState } from './initial';

const unit = reduxUnit(initialState, {
  typePrefix: 'TODO',
  prefixSeparator: ':',
  separator: '-',
});

const { actions, reducer } = unit({
  plainAction: identity,
  add: (state, todo: string) => ({ ...state, savedTodos: state.savedTodos.concat(todo) }),
  repeat: (state, todo: string, count: number) => ({
    ...state,
    savedTodos: state.savedTodos.concat(todo.repeat(count))
  }),
  getTodo: api<Date>()({
    field: 'getTodo',
    onSuccess: (dataState, todos: string[]) => ({ ...dataState, todos }),
  }),
});

export { actions as todoActions, reducer as todoReducer };
