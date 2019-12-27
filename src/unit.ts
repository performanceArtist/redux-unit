import { reduxUnit } from './redux-unit';
import { makeCommunicationHandler } from './redux-unit/helpers';

import { initialState } from './initial';

const unit = reduxUnit(initialState, {
  typePrefix: 'TODO',
  prefixSeparator: ':',
  separator: '-',
});

const { actions, reducer } = unit({
  add: (state, todo: string) => ({ ...state, todos: state.todos.concat(todo) }),
  repeat: (state, todo: string, count: number) => ({ ...state, todos: state.todos.concat(todo.repeat(count)) }),
  getTodo: makeCommunicationHandler<Date>()({
    communication: 'getTodo',
    onSuccess: (state, todos: string[]) => ({ ...state, todos }),
  }),
});

export { actions as todoActions, reducer as todoReducer };
