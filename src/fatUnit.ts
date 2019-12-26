import { reduxUnit } from './redux-unit';
import { makeCommunicationHandler } from './redux-unit/helpers';

import { initialState, InitialState } from './initial';

const unit = reduxUnit(initialState, { typePrefix: 'TEST' });

const kokoko = (state: InitialState, l: number) => state;
const bunch = {
  tt: (state: InitialState, a: number) => state,
  bb: (state: InitialState, j: string) => state,
};
const onGetSuccess = (state: InitialState, j: number) => state;

const { actions, reducer } = unit({
  addMessage: (state, todo: string) => ({ ...state, messages: state.todos.concat(todo) }),
  kokoko,
  comm: makeCommunicationHandler()({
    communication: 'getTodo',
    onSuccess: onGetSuccess,
  }),
  ...bunch,
});

actions.kokoko(54);
actions.comm.success(5);
actions.comm.reset();
export { actions as testActions, reducer as testReducer };
