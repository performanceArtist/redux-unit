import { HandlerMap, FlatHandlerMap } from './types';
import { isApiHandler, getActionTypes } from './api';
import { defaultTypeCreator } from './typeFormatter';

function makeHandlerMap<S extends object, M extends HandlerMap<S>>(model: M, typePrefix?: string) {
  return Object.keys(model).reduce<FlatHandlerMap<S>>((acc, key) => {
    const handler = model[key];

    if (isApiHandler(handler)) {
      const actions = getActionTypes(key, typePrefix);

      acc[actions.success] = handler.success;
      if (handler.request && actions.request) acc[actions.request] = handler.request;
      if (handler.reset && actions.reset) acc[actions.reset] = handler.reset;
      if (handler.failure && actions.failure) acc[actions.failure] = handler.failure;
    } else {
      acc[defaultTypeCreator(key, typePrefix)] = handler;
    }

    return acc;
  }, {});
}

export default makeHandlerMap;
