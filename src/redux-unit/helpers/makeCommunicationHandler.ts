import { GenericHandler, ApiHandler } from '../index';
import { GetActionArgs } from '../types';
import { initialCommunication, Communication } from './communication';

type SubType<Base, Condition> = Pick<Base, {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never
}[keyof Base]>;

export function makeCommunicationHandler<Params = []>() {
  return function requestCommunicationHandler
  <
    S extends object,
    SC extends GenericHandler<S>,
    F extends GenericHandler<S>,
    RS extends GenericHandler<S>,
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
    F extends (state: S, ...args: []) => S ? [string | Error] : GetActionArgs<F>,
    RS extends (state: S, ...args: []) => S ? [] : GetActionArgs<RS>
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
      success: (state, ...args) => {
        const newCommunication = { [communication]: { isRequesting: false } };

        return onSuccess
          ? { ...onSuccess(state, ...args), ...newCommunication }
          : { ...state, ...newCommunication };
      },
      failure: (state, ...args) => {
        const newCommunication = {
          [communication]: {
            ...state[communication],
            error: args[0] || args,
            isRequesting: false,
          },
        };

        return onFailure
          ? { ...onFailure(state, ...args), ...newCommunication }
          : { ...state, ...newCommunication };
      },
      reset: (state, ...args) => (onReset
        ? ({ ...onReset(state, ...args), [communication]: initialCommunication })
        : ({ ...state, [communication]: initialCommunication })),
    };
  };
}
