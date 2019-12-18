import { HandlerMap, FlatHandlerMap } from './types';
import { isApiHandler, getApiActionTypes } from './api';
import { TypeFormatter } from './makeTypeFormatter';

function makeHandlerMap<S extends object, M extends HandlerMap<S>>(
  model: M,
  typeFormatter: TypeFormatter,
) {
  return Object.keys(model).reduce<FlatHandlerMap<S>>((acc, key) => {
    const handler = model[key];

    if (isApiHandler(handler)) {
      const actions = getApiActionTypes(key, typeFormatter);

      acc[actions.success] = handler.success;
      if (handler.request && actions.request) acc[actions.request] = handler.request;
      if (handler.reset && actions.reset) acc[actions.reset] = handler.reset;
      if (handler.failure && actions.failure) acc[actions.failure] = handler.failure;
    } else {
      acc[typeFormatter(key)] = handler;
    }

    return acc;
  }, {});
}

export { makeHandlerMap };
