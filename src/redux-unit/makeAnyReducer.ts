import { Action, HandlerMap } from './types';
import makeHandlerMap from './makeHandlerMap';

function makeAnyReducer
  <S extends object, M extends HandlerMap<S>>
  (model: M, initialState: S, typePrefix?: string) {
  const handlerMap = makeHandlerMap(model, typePrefix);

  return (state = initialState, action: Action<any>) => {
    const handler = handlerMap[action.type];

    if (handler) {
      return handler(state)(...action.payload);
    }

    return state;
  }
}

export default makeAnyReducer;
