import { HandlerMap, ActionCreators, PlainActionCreator } from './types';
import { TypeFormatter } from './makeTypeFormatter';
import { isApiHandler, getApiActionCreators } from './api';

function makeActionCreators<S extends object, M extends HandlerMap<S>>(
  model: M,
  typeFormatter: TypeFormatter,
): ActionCreators<S, M> {
  return Object.keys(model).reduce(
    (acc, key) => {
      const handler = model[key];
      if (isApiHandler(handler)) {
        acc[key] = getApiActionCreators(key, typeFormatter);
      } else {
        const creator = ((...args: any) => ({
          type: typeFormatter(key),
          payload: args,
        })) as PlainActionCreator<any>;
        creator.getType = () => typeFormatter(key);

        acc[key] = creator;
      }

      return acc;
    },
    {} as any,
  ) as ActionCreators<S, M>;
}

export { makeActionCreators };
