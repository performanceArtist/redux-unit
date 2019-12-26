import { Dispatch } from 'redux';

import {
  Action, GenericHandler, GetActionArgs, Handler,
} from './types';
import { TypeFormatter } from './makeTypeFormatter';

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
    Action<GetActionArgs<M['request']>>,
    success: (...args: GetActionArgs<M['success']>) => Action<GetActionArgs<M['success']>>,
    failure: (...args: GetActionArgs<ResolveUndefined<M['failure']>>) =>
    Action<GetActionArgs<ResolveUndefined<M['failure']>>>,
    reset: (...args: GetActionArgs<ResolveUndefined<M['reset']>>) =>
    Action<GetActionArgs<ResolveUndefined<M['reset']>>>,
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
): ApiActionsMap<string> {
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
    request: (...payload: any) => (dispatch
      ? dispatch({ type: request, payload })
      : { type: request, payload }),
    success: (...payload: any) => (dispatch
      ? dispatch({ type: success, payload })
      : { type: success, payload }),
    failure: (...payload: any) => (dispatch
      ? dispatch({ type: failure, payload })
      : { type: failure, payload }),
    reset: (...payload: any) => (dispatch
      ? dispatch({ type: reset, payload })
      : { type: reset, payload }),
  });

  return getActions();
}

export const isApiHandler = (handler: GenericApiHandler<any> | GenericHandler<any>):
  handler is GenericApiHandler<any> => (handler as any).type === 'api';
