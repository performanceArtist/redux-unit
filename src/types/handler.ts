import { ApiHandler } from '../api';

export type AnyHandler<S> = (state: S, ...args: any[]) => S;

export type Handler<S, A extends unknown[]> = (state: S, ...args: A) => S;

export type FlatHandlerMap<S> = { [key: string]: AnyHandler<S> };

export type HandlerMap<S> = {
  [key: string]: AnyHandler<S> | ApiHandler<S>;
};
