import { Action, HandlerMap } from './types';
import { makeHandlerMap } from './makeHandlerMap';
import { TypeFormatter } from './makeTypeFormatter';

function makeAnyReducer<S extends object, M extends HandlerMap<S>>(
  model: M,
  initialState: S,
  typeFormatter: TypeFormatter,
) {
  const handlerMap = makeHandlerMap<S, M>(model, typeFormatter);

  return (state = initialState, action: Action<any>): S => {
    const handler = handlerMap[action.type];

    if (!handler) {
      return state;
    }

    if (handler.length === 1) {
      return handler(state);
    } if (handler.length === 2) {
      return handler(state, action.payload);
    }

    return handler(state, ...action.payload);
  };
}

export { makeAnyReducer };
