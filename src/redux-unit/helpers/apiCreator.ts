import { GenericHandler, ApiHandler } from '../index';
import { GetReturnArgs } from '../types';

import { initialCommunication, Communication } from './communication';

type SubType<Base, Condition> = Pick<Base, {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never
}[keyof Base]>;

type GetOptionalArgs<S, R> = R extends GenericHandler<S>
  ? GetReturnArgs<R>
  : [];

export function apiHandler
  <
    S extends object,
    SC extends GenericHandler<S> = GenericHandler<S>,
    RQ extends GenericHandler<S> = GenericHandler<S>,
    F extends GenericHandler<S> = (state: S) => (error: any) => S,
    RS extends GenericHandler<S> = GenericHandler<S>,
  >
  ({
    communication,
    onSuccess,
    onRequest,
    onFailure,
    onReset
  }: { communication: keyof SubType<S, Communication>, onSuccess?: SC, onRequest?: RQ, onFailure?: F, onReset?: RS }):
  ApiHandler<S, GetOptionalArgs<S, RQ>, GetReturnArgs<SC>, GetOptionalArgs<S, F>, GetOptionalArgs<S, RS>> {
  return {
    type: 'api',
    request: (state) => (...args) => {
      const newCommunication = { [communication]: { ...state[communication], isFetching: true } };

      return onRequest
      ? { ...onRequest(state)(args), ...newCommunication }
      : { ...state, ...newCommunication };
    },
    success: (state) => (...args) => {
      const newCommunication = { [communication]: { isFetching: false } };

      return onSuccess
      ? { ...onSuccess(state)(args), ...newCommunication }
      : { ...state, ...newCommunication };
    },
    failure: (state) => (...args) => {
      const newCommunication = { [communication]: { ...state[communication], error: args, isFetching: false }};

      return onFailure
      ? { ...onFailure(state)(args), ...newCommunication }
      : { ...state, ...newCommunication }
    },
    reset: (state) => (...args) => {
      return onReset
      ? ({ ...onReset(state)(args), [communication]: initialCommunication })
      : ({ ...state, [communication]: initialCommunication })
    }
  };
}
