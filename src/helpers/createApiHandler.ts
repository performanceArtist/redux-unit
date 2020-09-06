import { ApiHandler } from '../index';
import { GetActionArgs } from '../api';
import { communication, Communication } from './communication';

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
    GetActionArgs<F, [Error]>,
    GetActionArgs<RS>
  > {
    return {
      type: 'api',
      request: (state, payload?) => {
        const newData = onRequest
          ? onRequest(state.data, payload as never)
          : state.data;

        return {
          ...state,
          communication: {
            ...state.communication,
            [field]: communication.pending,
          },
          data: newData,
        };
      },
      success: (state, payload?) => {
        const newData = onSuccess
          ? onSuccess(state.data, payload as never)
          : state.data;

        return {
          ...state,
          data: newData,
          communication: {
            ...state.communication,
            [field]: communication.success,
          },
        };
      },
      failure: (state, payload?) => {
        const newData = onFailure
          ? onFailure(state.data, payload as never)
          : state.data;

        return {
          ...state,
          data: newData,
          communication: {
            ...state.communication,
            [field]: communication.error(payload || new Error('Unknown error')),
          },
        };
      },
      reset: (state, payload?) => {
        const newData = onReset
          ? onReset(state.data, payload as never)
          : state.data;

        return {
          ...state,
          data: newData,
          communication: {
            ...state.communication,
            [field]: communication.initial,
          },
        };
      },
    };
  };
}
