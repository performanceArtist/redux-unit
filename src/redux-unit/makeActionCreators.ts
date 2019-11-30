import { HandlerMap, ActionCreators } from './types';
import { isApiHandler, getActionCreators } from './api';
import { defaultTypeCreator } from './typeFormatter';

function makeActionCreators
  <S extends object, M extends HandlerMap<S>>
  (model: M, typePrefix?: string): ActionCreators<S, M> {
  return Object.keys(model).reduce(
    (acc, key) => {
      const handler = model[key];
      if (isApiHandler(handler)) {
        acc[key] = getActionCreators(key, typePrefix);
      } else {
        acc[key] = (...args: any) => ({
          type: defaultTypeCreator(key, typePrefix),
          payload: args
        });
      }

      return acc;
    },
    {} as any
  ) as ActionCreators<S, M>;
}

export default makeActionCreators;

