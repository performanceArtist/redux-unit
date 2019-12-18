import { GenericHandler, ApiHandler } from '../index';
import { GetReturnArgs, NoArgsHandler } from '../types';
import { initialCommunication, Communication } from './communication';

type SubType<Base, Condition> = Pick<Base, {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never
}[keyof Base]>;

type GetOptionalArgs<S, R> = R extends GenericHandler<S>
  ? GetReturnArgs<R>
  : never;

export function makeApiHandler<Params = unknown[]>() {
  return function requestApiHandler
  <
    S extends object,
    SC extends GenericHandler<S> = NoArgsHandler<S>,
    F extends GenericHandler<S> =(state: S) => (error: Error | string) => S,
    RS extends GenericHandler<S> = NoArgsHandler<S>,
  >
  ({
    communication,
    onSuccess,
    onFailure,
    onReset,
  }: {
    communication: keyof SubType<S, Communication>,
    onSuccess?: SC,
    onFailure?: F,
    onReset?: RS
  }):
    ApiHandler<
    S,
    Params extends unknown[] ? Params : [Params],
    GetReturnArgs<SC>,
    GetOptionalArgs<S, F>,
    GetOptionalArgs<S, RS>
    > {
    return {
      type: 'api',
      request: (state) => () => {
        const newCommunication = {
          [communication]: {
            ...state[communication],
            isFetching: true,
            error: undefined,
          },
        };

        return { ...state, ...newCommunication };
      },
      success: (state) => (...args) => {
        const newCommunication = { [communication]: { isFetching: false } };

        return onSuccess
          ? { ...onSuccess(state)(...args), ...newCommunication }
          : { ...state, ...newCommunication };
      },
      failure: (state) => (...args) => {
        const newCommunication = {
          [communication]: {
            ...state[communication],
            error: args[0] || args,
            isFetching: false,
          },
        };

        return onFailure
          ? { ...onFailure(state)(...args), ...newCommunication }
          : { ...state, ...newCommunication };
      },
      reset: (state) => (...args) => (onReset
        ? ({ ...onReset(state)(...args), [communication]: initialCommunication })
        : ({ ...state, [communication]: initialCommunication })),
    };
  };
}
