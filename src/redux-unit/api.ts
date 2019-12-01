import { Action, AnyFunction, GenericHandler, GetReturnArgs, Handler } from './types';
import { TypeFormatter } from './makeTypeFormatter';

type ApiActionsMap<T = string> = {
  request: T;
  success: T;
  failure?: T;
  reset?: T;
}
export type GenericApiHandler<S> = ApiActionsMap<GenericHandler<S>> & { type?: 'api' };
type ResolveUndefined<T> = T extends AnyFunction ? T : (...args: never) => never;

export type ApiActionCreator<S, M extends GenericApiHandler<S>> =
  {
    getType: (key: keyof ApiActionsMap) => string,
    request: (...args: GetReturnArgs<M['request']>) =>
      Action<GetReturnArgs<M['request']>>,
    success: (...args: GetReturnArgs<M['success']>) => Action<GetReturnArgs<M['success']>>,
    failure: (...args: GetReturnArgs<ResolveUndefined<M['failure']>>) =>
      Action<GetReturnArgs<ResolveUndefined<M['failure']>>>,
    reset: (...args: GetReturnArgs<ResolveUndefined<M['reset']>>) =>
      Action<GetReturnArgs<ResolveUndefined<M['reset']>>>,
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
} & { type: 'api' }

export function getApiActionTypes(key: string, typeFormatter: TypeFormatter): ApiActionsMap<string> {
  return {
    request: typeFormatter(`${key}Request`),
    success: typeFormatter(`${key}Success`),
    failure: typeFormatter(`${key}Failure`),
    reset: typeFormatter(`${key}Reset`)
  };
}

export function getApiActionCreators(key: string, typeFormatter: TypeFormatter) {
  const types = getApiActionTypes(key, typeFormatter);
  const { request, success, failure, reset } = types;

  return {
    getType: (key: keyof ApiActionsMap) => types[key] as string,
    request: (...args: any) => ({ type: request, payload: args }),
    success: (...args: any) => ({ type: success, payload: args }),
    failure: (...args: any) => ({ type: failure, payload: args }),
    reset: (...args: any) => ({ type: reset, payload: args }),
  }
}

export const isApiHandler = (handler: GenericApiHandler<any> | GenericHandler<any>):
  handler is GenericApiHandler<any> => {
  return (handler as any).type === 'api';
}
