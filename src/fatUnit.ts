import { reduxUnit } from './redux-unit';
import { api } from './redux-unit/helpers';

import { initialState, InitialState } from './initial';

const unit = reduxUnit(initialState, { typePrefix: 'TEST' });

const kokoko = (state: InitialState, l: number) => state;
const bunch = {
  tt: (state: InitialState, a: number) => state,
  bb: (state: InitialState, j: string) => state,
};
const onGetSuccess = (dataState: InitialState['data'], j: number) => dataState;

const { actions, reducer } = unit({
  addMessage: (state, todo: string) => ({
    ...state,
    messages: state.savedTodos.concat(todo)
  }),
  kokoko,
  comm: api()({
    field: 'getTodo',
    onSuccess: onGetSuccess,
  }),
  ...bunch,
});

actions.kokoko(54);
actions.comm.success(5);
actions.comm.reset();
export { actions as testActions, reducer as testReducer };
