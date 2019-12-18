import { ApiActionCreator, ApiHandler } from './api';

export type Action<P> = {
  type: string;
  payload: P;
};
export type AnyFunction = (...args: unknown[]) => any;
export type GetReturnArgs<T extends AnyFunction> = Parameters<ReturnType<T>>;
export type GenericHandler<S> = (state: S) => (...args: unknown[]) => S;
export type NoArgsHandler<S> = (state: S) => () => S;
export type Handler<S, A extends unknown[] = never> = (state: S) => (...args: A) => S;
export type HandlerMap<S> = { [key: string]: GenericHandler<S> | ApiHandler<S> };
export type FlatHandlerMap<S> = { [key: string]: GenericHandler<S> };
export type PlainActionCreator<A extends unknown[]> = {
  (...args: A): Action<A>,
  getType: () => string
};
export type SelectHandlerType<S, M extends HandlerMap<S>, T extends keyof M> =
  M[T] extends ApiHandler<S>
    ? ApiActionCreator<S, M[T]>
    : M[T] extends GenericHandler<S> ? PlainActionCreator<GetReturnArgs<M[T]>> : never;
export type ActionCreators<S, M extends HandlerMap<S>> = {
  [key in keyof M]: SelectHandlerType<S, M, key>
};
