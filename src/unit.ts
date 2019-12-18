import { reduxUnit } from './redux-unit';
import { makeApiHandler } from './redux-unit/helpers';

import { initialState } from './initial';

const unit = reduxUnit(initialState, {
  typePrefix: 'TODO',
  prefixSeparator: ':',
  separator: '-',
});

const { actions, reducer } = unit({
  add: (state) => (todo: string) => ({ ...state, todos: state.todos.concat(todo) }),
  getTodo: makeApiHandler<Date>()({
    communication: 'getTodo',
    onSuccess: (state) => (todos: string[]) => ({ ...state, todos }),
  }),
});

export { actions as todoActions, reducer as todoReducer };
