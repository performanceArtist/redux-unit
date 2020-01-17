import { Action, PlainAction, HandlerMap } from './types';
import { makeHandlerMap } from './makeHandlerMap';
import { TypeFormatter } from './makeTypeFormatter';

function hasPayload(action: Action<any> | PlainAction): action is Action<any> {
  return (action as any).payload !== undefined;
}

function makeAnyReducer<S extends object, M extends HandlerMap<S>>(
  model: M,
  initialState: S,
  typeFormatter: TypeFormatter,
) {
  const handlerMap = makeHandlerMap<S, M>(model, typeFormatter);

  return (state = initialState, action: Action<any> | PlainAction): S => {
    const handler = handlerMap[action.type];

    if (!handler) {
      return state;
    }

    if (handler.length === 1 || !hasPayload(action)) {
      return handler(state);
    }

    return handler.length === 2
      ? handler(state, action.payload)
      : handler(state, ...action.payload);
  };
}

export { makeAnyReducer };
