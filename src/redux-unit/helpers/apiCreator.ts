import { GenericHandler, ApiHandler } from '../index';
import { GetReturnArgs } from '../types';

import { initialCommunication, Communication } from './communication';

type SubType<Base, Condition> = Pick<Base, {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never
}[keyof Base]>;

type GetRequestArgs<S, R> = R extends GenericHandler<S>
  ? GetReturnArgs<R>
  : [];

export function apiHandler
  <S extends object, SC extends GenericHandler<S>, R extends GenericHandler<S> = GenericHandler<S>>
  ({
    communication,
    onSuccess,
    onRequest
  }: { communication: keyof SubType<S, Communication>, onSuccess: SC, onRequest?: R }):
  ApiHandler<S, GetRequestArgs<S, R>, GetReturnArgs<SC>, [string], []> {
  return {
    type: 'api',
    request: (state) => (...args) => {
      const newCommunication = { [communication]: { ...state[communication], isFetching: true } };
      return onRequest ? { ...onRequest(state)(args), ...newCommunication } : { ...state, ...newCommunication };
    },
    success: (state) => (...args) => ({ ...onSuccess(state)(args), [communication]: { isFetching: false } }),
    failure: (state) => (error: string) => ({ ...state, [communication]: { ...state[communication], error, isFetching: false }}),
    reset: (state) => () => ({ ...state, [communication]: initialCommunication })
  };
}
