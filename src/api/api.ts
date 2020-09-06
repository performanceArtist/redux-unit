import { Dispatch } from 'redux';

import { AnyHandler, Handler, InferAction } from '../types';
import { TypeFormatter } from '../type-formatter';
import { makeActionCreator } from '../actions';

type ApiActionsMap<T = string> = {
  request: T;
  success: T;
  failure?: T;
  reset?: T;
};
export type AnyApiHandler<S> = ApiActionsMap<AnyHandler<S>> & { type: 'api' };
type ResolveUndefined<T> = T extends Function ? T : never;

export type GetActionArgs<T, F = []> = T extends (
  state: any,
  ...rest: infer A
) => any
  ? A extends [never]
    ? F
    : A
  : never;

export type ApiActionCreator<S, M extends AnyApiHandler<S>> = {
  getType: (key: keyof ApiActionsMap) => string;
  mapDispatch: (
    dispatch: Dispatch<any>,
  ) => Omit<ApiActionCreator<S, M>, 'mapDispatch'>;
  request: (
    ...args: GetActionArgs<M['request']>
  ) => InferAction<GetActionArgs<M['request']>>;
  success: (
    ...args: GetActionArgs<M['success']>
  ) => InferAction<GetActionArgs<M['success']>>;
  failure: (
    ...args: GetActionArgs<ResolveUndefined<M['failure']>>
  ) => InferAction<GetActionArgs<ResolveUndefined<M['failure']>>>;
  reset: (
    ...args: GetActionArgs<ResolveUndefined<M['reset']>>
  ) => InferAction<GetActionArgs<ResolveUndefined<M['reset']>>>;
};

export type ApiHandler<
  S,
  R extends unknown[] = unknown[],
  SC extends unknown[] = unknown[],
  F extends unknown[] = unknown[],
  RS extends unknown[] = unknown[]
> = {
  request: Handler<S, R>;
  success: Handler<S, SC>;
  failure?: Handler<S, F>;
  reset?: Handler<S, RS>;
} & { type: 'api' };

export function getApiActionTypes(
  key: string,
  typeFormatter: TypeFormatter,
): Required<ApiActionsMap<string>> {
  return {
    request: typeFormatter(`${key}Request`),
    success: typeFormatter(`${key}Success`),
    failure: typeFormatter(`${key}Failure`),
    reset: typeFormatter(`${key}Reset`),
  };
}

export function getApiActionCreators(
  key: string,
  typeFormatter: TypeFormatter,
) {
  const types = getApiActionTypes(key, typeFormatter);
  const { request, success, failure, reset } = types;
  const getActions = (dispatch?: Dispatch) => ({
    getType: (actionType: keyof ApiActionsMap) => types[actionType] as string,
    mapDispatch: dispatch
      ? undefined
      : (reduxDispatch: Dispatch) => getActions(reduxDispatch),
    request: dispatch
      ? (...args: any) => dispatch(makeActionCreator(request)(...args))
      : makeActionCreator(request),
    success: dispatch
      ? (...args: any) => dispatch(makeActionCreator(success)(...args))
      : makeActionCreator(success),
    failure: dispatch
      ? (...args: any) => dispatch(makeActionCreator(failure)(...args))
      : makeActionCreator(failure),
    reset: dispatch
      ? (...args: any) => dispatch(makeActionCreator(reset)(...args))
      : makeActionCreator(reset),
  });

  return getActions();
}

export const isApiHandler = (handler: any): handler is AnyApiHandler<any> =>
  handler.type === 'api';
