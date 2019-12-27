import { Dispatch } from 'redux';

import {
  GenericHandler, GetActionArgs, Handler, AnyAction,
} from './types';
import { TypeFormatter } from './makeTypeFormatter';
import { makeActionCreator } from './makeActionCreator';
import { pipe } from './pipe';

type ApiActionsMap<T = string> = {
  request: T;
  success: T;
  failure?: T;
  reset?: T;
};
export type GenericApiHandler<S> = ApiActionsMap<GenericHandler<S>> & { type?: 'api' };
type ResolveUndefined<T> = T extends Function ? T : never;

export type ApiActionCreator<S, M extends GenericApiHandler<S>> =
  {
    getType: (key: keyof ApiActionsMap) => string,
    mapDispatch: (dispatch: Dispatch<any>) => Omit<ApiActionCreator<S, M>, 'mapDispatch'>,
    request: (...args: GetActionArgs<M['request']>) =>
    AnyAction<GetActionArgs<M['request']>>,
    success: (...args: GetActionArgs<M['success']>) => AnyAction<GetActionArgs<M['success']>>,
    failure: (...args: GetActionArgs<ResolveUndefined<M['failure']>>) =>
    AnyAction<GetActionArgs<ResolveUndefined<M['failure']>>>,
    reset: (...args: GetActionArgs<ResolveUndefined<M['reset']>>) =>
    AnyAction<GetActionArgs<ResolveUndefined<M['reset']>>>,
  };

export type ApiHandler<
  S,
  R extends unknown[] = unknown[],
  SC extends unknown[] = unknown[],
  F extends unknown[] = unknown[],
  RS extends unknown[] = unknown[],
> = {
  request: Handler<S, R>;
  success: Handler<S, SC>;
  failure?: Handler<S, F>;
  reset?: Handler<S, RS>;
} & { type: 'api' };

export function getApiActionTypes(
  key: string, typeFormatter: TypeFormatter,
): Required<ApiActionsMap<string>> {
  return {
    request: typeFormatter(`${key}Request`),
    success: typeFormatter(`${key}Success`),
    failure: typeFormatter(`${key}Failure`),
    reset: typeFormatter(`${key}Reset`),
  };
}

export function getApiActionCreators(key: string, typeFormatter: TypeFormatter) {
  const types = getApiActionTypes(key, typeFormatter);
  const {
    request, success, failure, reset,
  } = types;
  const getActions = (dispatch?: Dispatch) => ({
    getType: (actionType: keyof ApiActionsMap) => types[actionType] as string,
    mapDispatch: dispatch ? undefined : (reduxDispatch: Dispatch) => getActions(reduxDispatch),
    request: dispatch
      ? pipe(makeActionCreator(request), dispatch)
      : makeActionCreator(request),
    success: dispatch
      ? pipe(makeActionCreator(success), dispatch)
      : makeActionCreator(success),
    failure: dispatch
      ? pipe(makeActionCreator(failure), dispatch)
      : makeActionCreator(failure),
    reset: dispatch
      ? pipe(makeActionCreator(reset), dispatch)
      : makeActionCreator(reset),
  });

  return getActions();
}

export const isApiHandler = (handler: GenericApiHandler<any> | GenericHandler<any>):
  handler is GenericApiHandler<any> => (handler as any).type === 'api';
