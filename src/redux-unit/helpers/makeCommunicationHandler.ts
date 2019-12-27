import { ApiHandler } from '../index';
import { GetActionArgs } from '../types';
import { initialCommunication, Communication } from './communication';

type SubType<Base, Condition> = Pick<Base, {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never
}[keyof Base]>;

type FixedHandler<S extends object> = (state: S, payload: never) => S;

export function makeCommunicationHandler<Params = []>() {
  return function requestCommunicationHandler
  <
    S extends object,
    SC extends FixedHandler<S>,
    F extends FixedHandler<S>,
    RS extends FixedHandler<S>,
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
    GetActionArgs<SC>,
    GetActionArgs<F, [string | Error]>,
    GetActionArgs<RS>
  > {
    return {
      type: 'api',
      request: (state) => {
        const newCommunication = {
          [communication]: {
            ...state[communication],
            isRequesting: true,
            error: undefined,
          },
        };

        return { ...state, ...newCommunication };
      },
      success: (state, payload?) => {
        const newCommunication = { [communication]: { isRequesting: false } };

        return onSuccess
          ? { ...onSuccess(state, payload as never), ...newCommunication }
          : { ...state, ...newCommunication };
      },
      failure: (state, payload?) => {
        const newCommunication = {
          [communication]: {
            ...state[communication],
            error: payload,
            isRequesting: false,
          },
        };

        return onFailure
          ? { ...onFailure(state, payload as never), ...newCommunication }
          : { ...state, ...newCommunication };
      },
      reset: (state, payload?) => (onReset
        ? ({ ...onReset(state, payload as never), [communication]: initialCommunication })
        : ({ ...state, [communication]: initialCommunication })),
    };
  };
}
