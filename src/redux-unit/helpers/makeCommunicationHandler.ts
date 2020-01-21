import { ApiHandler } from '../index';
import { GetActionArgs } from '../types';
import { initialCommunication, Communication } from './communication';

export type WithCommunication<K extends string = string> = {
  communication: Record<K, Communication>;
  data?: object;
};
export type KeyOfString<T extends object> =Extract<keyof T, string>;
type FixedHandler<S> = (state: S, payload: never) => S;

function makeCommunicationHandler<Params extends object = []>() {
  return function requestCommunicationHandler
  <
    S extends WithCommunication<KeyOfString<S['communication']>>,
    SC extends FixedHandler<S['data']>,
    F extends FixedHandler<S['data']>,
    RS extends FixedHandler<S['data']>,
  >({
    field,
    onSuccess,
    onFailure,
    onReset,
  }: {
    field: KeyOfString<S['communication']>;
    onSuccess?: SC;
    onFailure?: F;
    onReset?: RS;
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
      request: state => {
        const newCommunication = {
          ...state.communication,
          [field]: {
            isRequesting: true,
          },
        };

        return {
          ...state,
          communication: newCommunication,
        };
      },
      success: (state, payload?) => {
        const newCommunication = {
          ...state.communication,
          [field]: { isRequesting: false },
        };
        const newData = onSuccess
          ? onSuccess(state.data, payload as never)
          : state.data;

        return { ...state, data: newData, communication: newCommunication };
      },
      failure: (state, payload?) => {
        const newCommunication = {
          ...state.communication,
          [field]: {
            error: payload || 'Error',
            isRequesting: false,
          },
        };
        const newData = onFailure
          ? onFailure(state.data, payload as never)
          : state.data;

        return { ...state, data: newData, communication: newCommunication };
      },
      reset: (state, payload?) => {
        const newCommunication = {
          ...state.communication,
          [field]: initialCommunication,
        };
        const newData = onReset
          ? onReset(state.data, payload as never)
          : state.data;

        return { ...state, data: newData, communication: newCommunication };
      },
    };
  };
}

export { makeCommunicationHandler, makeCommunicationHandler as api };
