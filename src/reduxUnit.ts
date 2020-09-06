import { HandlerMap } from './types';
import { makeTypeFormatter, TypeFormatterOptions } from './type-formatter';
import { makeActionCreators } from './actions';
import { makeAnyReducer } from './reducer';

export const reduxUnit = <S extends object>(
  initialState: S,
  formatter?: Partial<TypeFormatterOptions>,
) => <M extends HandlerMap<S>>(model: M) => {
  const typeFormatter = makeTypeFormatter(formatter);

  return {
    actions: makeActionCreators<S, M>(model, typeFormatter),
    reducer: makeAnyReducer(model, initialState, typeFormatter),
  };
};
