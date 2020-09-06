import { ApiHandler } from '../index';
import { GetActionArgs } from '../api';
import { initialCommunication, Communication } from './communication';

export type WithCommunication<K extends string = string> = {
  communication: Record<K, Communication>;
  data?: object;
};
export type KeyOfString<T extends object> = Extract<keyof T, string>;
type FixedHandler<S> = (state: S, payload: never) => S;

export function createApiHandler<Params extends object = []>() {
  return function requestHandler<
    S extends WithCommunication<KeyOfString<S['communication']>>,
    SC extends FixedHandler<S['data']>,
    F extends FixedHandler<S['data']>,
    RS extends FixedHandler<S['data']>,
    RQ extends (data: S['data'], payload: Params) => S['data']
  >({
    field,
    onRequest,
    onSuccess,
    onFailure,
    onReset,
  }: {
    field: KeyOfString<S['communication']>;
    onRequest?: RQ;
    onSuccess?: SC;
    onFailure?: F;
    onReset?: RS;
  }): ApiHandler<
    S,
    Params extends unknown[] ? Params : [Params],
    GetActionArgs<SC>,
    GetActionArgs<F, [string | Error]>,
    GetActionArgs<RS>
  > {
    return {
      type: 'api',
      request: (state, payload?) => {
        const newCommunication = {
          ...state.communication,
          [field]: {
            isRequesting: true,
          },
        };
        const newData = onRequest
          ? onRequest(state.data, payload as never)
          : state.data;

        return {
          ...state,
          communication: newCommunication,
          data: newData,
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
