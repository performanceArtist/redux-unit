import { GenericHandler, ApiHandler } from '../index';
import { GetReturnArgs, NoArgsHandler } from '../types';

import { initialCommunication, Communication } from './communication';

type SubType<Base, Condition> = Pick<Base, {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never
}[keyof Base]>;

type GetOptionalArgs<S, R> = R extends GenericHandler<S>
  ? GetReturnArgs<R>
  : never;

export function apiHandler
  <
    S extends object,
    SC extends GenericHandler<S> = NoArgsHandler<S>,
    RQ extends GenericHandler<S> = NoArgsHandler<S>,
    F extends GenericHandler<S> = (state: S) => (error: any) => S,
    RS extends GenericHandler<S> = NoArgsHandler<S>,
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
      ? { ...onRequest(state).apply(null, args), ...newCommunication }
      : { ...state, ...newCommunication };
    },
    success: (state) => (...args) => {
      const newCommunication = { [communication]: { isFetching: false } };

      return onSuccess
      ? { ...onSuccess(state).apply(null, args), ...newCommunication }
      : { ...state, ...newCommunication };
    },
    failure: (state) => (...args) => {
      const newCommunication = { [communication]: { ...state[communication], error: args, isFetching: false }};

      return onFailure
      ? { ...onFailure(state).apply(null, args), ...newCommunication }
      : { ...state, ...newCommunication }
    },
    reset: (state) => (...args) => {
      return onReset
      ? ({ ...onReset(state).apply(null, args), [communication]: initialCommunication })
      : ({ ...state, [communication]: initialCommunication })
    }
  };
}
