import { HandlerMap, ActionCreators, PlainActionCreator } from './types';
import { TypeFormatter } from './makeTypeFormatter';
import { isApiHandler, getApiActionCreators } from './api';
import { makeActionCreator } from './makeActionCreator';

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
        const creator = makeActionCreator(typeFormatter(key)) as PlainActionCreator<any>;
        creator.getType = () => typeFormatter(key);

        acc[key] = creator;
      }

      return acc;
    },
    {} as any,
  ) as ActionCreators<S, M>;
}

export { makeActionCreators };
