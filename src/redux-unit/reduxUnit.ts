import { HandlerMap } from './types';
import { makeTypeFormatter, TypeFormatterOptions } from './makeTypeFormatter';
import { makeActionCreators } from './makeActionCreators';
import { makeAnyReducer } from './makeAnyReducer';

export const reduxUnit = <S extends object>(initialState: S, formatter?: TypeFormatterOptions) =>
  <M extends HandlerMap<S>>(model: M) => {
    const typeFormatter = makeTypeFormatter(formatter);

    return {
      actions: makeActionCreators(model, typeFormatter),
      reducer: makeAnyReducer(model, initialState, typeFormatter),
    };
  };
