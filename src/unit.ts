import { reduxUnit } from './redux-unit';
import { apiHandler } from './redux-unit/helpers';

import { initialState } from './initial';

const unit = reduxUnit(initialState, 'TODO');

const { creators, reducer } = unit({
  add: (state) => (todo: string) => ({ ...state, todos: state.todos.concat(todo) }),
  getTodo: apiHandler({
    communication: 'getTodo',
    onSuccess: (state) => (todos: string[]) => ({ ...state, todos })
  })
});

export { creators as todoCreators, reducer as todoReducer };
