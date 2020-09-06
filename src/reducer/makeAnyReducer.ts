import { Action, PayloadAction, HandlerMap } from '../types';
import { makeHandlerMap } from './makeHandlerMap';
import { TypeFormatter } from '../type-formatter';

function isPayloadAction(action: Action<any>): action is PayloadAction<any> {
  return (action as any).payload !== undefined;
}

export function makeAnyReducer<S extends object, M extends HandlerMap<S>>(
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

    if (handler.length === 1 || !isPayloadAction(action)) {
      return handler(state);
    }

    return handler.length === 2
      ? handler(state, action.payload)
      : handler(state, ...action.payload);
  };
}
