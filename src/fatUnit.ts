import { reduxUnit, ApiHandler } from './redux-unit';
import { initialCommunication, apiHandler, GetReturnArgs } from './redux-unit/helpers';

import { initialState, InitialState } from './initial';

const unit = reduxUnit(initialState, { typePrefix: 'TEST' });

const kokoko = (state: InitialState) => (l: number) => state;
const onRequest = (state: InitialState) => () => state;
const onSuccess = (state: InitialState) => (f: string) => state;
const someApi: ApiHandler<InitialState, GetReturnArgs<typeof onRequest>, GetReturnArgs<typeof onSuccess>> = {
  type: 'api',
  request: onRequest,
  success: onSuccess,
};

const onGetSuccess = (state: InitialState) => (j: number) => state;
const bunch = {
  tt: (state: InitialState) => (a: number) => state,
  bb: (state: InitialState) => (j: string) => state,
  comm: apiHandler<InitialState, typeof onGetSuccess>({
    communication: 'getTodo',
    onSuccess: onGetSuccess
  })
}

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
  someApi,
  ...bunch
});

creators.kokoko(54);
creators.someApi.success('');
creators.comm.success(5);
creators.comm.reset();
creators.someApi.success('fd');
export { creators as testCreators, reducer as testReducer };
