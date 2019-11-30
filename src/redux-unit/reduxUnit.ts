import { HandlerMap } from './types';
import makeActionCreators from './makeActionCreators';
import makeAnyReducer from './makeAnyReducer';

export const reduxUnit =
  <S extends object>(initialState: S, typePrefix?: string) =>
  <M extends HandlerMap<S>>(model: M) => {
  return {
    creators: makeActionCreators(model, typePrefix),
    reducer: makeAnyReducer(model, initialState, typePrefix)
  };
};
