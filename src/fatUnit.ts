import { reduxUnit, Handler, ApiHandler } from './redux-unit';
import { initialCommunication } from './redux-unit/helpers';

import { initialState, InitialState } from './initial';

const unit = reduxUnit(initialState, 'TEST');

const kokoko: Handler<InitialState, [number]> = (state) => (l: number) => state;
const someApi: ApiHandler<InitialState, [], [number[]]> = {
  type: 'api',
  request: (state) => () => state,
  success: (state) => (stuff: number[]) => state,
};

const { creators, reducer } = unit({
  addMessage: (state) => (todo: string) => ({ ...state, messages: state.todos.concat(todo) }),
  getMessage: {
    type: 'api',
    request: (state) => (id: string) => ({ ...state, getTodo: { ...state.getTodo, isFetching: true }}),
    success: (state) => (messages: string[]) => ({
      ...state,
      messages,
      getMessage: { ...state.getTodo, isFetching: false }
    }),
    failure: (state) => (error: string) => ({
      ...state,
      getMessage: {
        isFetching: false
      }
    }),
    reset: (state) => () => ({ ...state, getMessage: initialCommunication })
  },
  kokoko,
  someApi
});

creators.kokoko(54);
creators.someApi.success([1,2,3]);

export { creators as testCreators, reducer as testReducer };
