import { ApiHandler } from '../index';
import { GetActionArgs } from '../api';
import { communication, Communication } from './communication';

export type WithCommunication<K extends string = string> = {
  communication: {
    status: Record<K, Communication>;
    data?: any;
  };
};
export type KeyOfString<T extends object> = Extract<keyof T, string>;
type FixedHandler<S> = (state: S, payload: never) => S;

export type CommunicationBranch<K extends string, S> = {
  status: Record<K, Communication>;
  data: S;
};

export function createApiHandler<Params extends object = []>() {
  return function requestHandler<
    S extends WithCommunication<KeyOfString<S['communication']['status']>>,
    SC extends FixedHandler<S['communication']['data']>,
    F extends FixedHandler<S['communication']['data']>,
    RS extends FixedHandler<S['communication']['data']>,
    RQ extends (
      data: S['communication']['data'],
      payload: Params,
    ) => S['communication']['data']
  >({
    field,
    onRequest,
    onSuccess,
    onFailure,
    onReset,
  }: {
    field: KeyOfString<S['communication']['status']>;
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
          ? onRequest(state.communication.data, payload as never)
          : state.communication.data;

        return {
          ...state,
          communication: {
            data: newData,
            status: {
              ...state.communication.status,
              [field]: communication.pending,
            },
          },
        };
      },
      success: (state, payload?) => {
        const newData = onSuccess
          ? onSuccess(state.communication.data, payload as never)
          : state.communication.data;

        return {
          ...state,
          communication: {
            data: newData,
            status: {
              ...state.communication.status,
              [field]: communication.success,
            },
          },
        };
      },
      failure: (state, payload?) => {
        const newData = onFailure
          ? onFailure(state.communication.data, payload as never)
          : state.communication.data;

        return {
          ...state,
          communication: {
            data: newData,
            status: {
              ...state.communication.status,
              [field]: communication.error(
                payload || new Error('Unknown error'),
              ),
            },
          },
        };
      },
      reset: (state, payload?) => {
        const newData = onReset
          ? onReset(state.communication.data, payload as never)
          : state.communication.data;

        return {
          ...state,
          communication: {
            data: newData,
            status: {
              ...state.communication.status,
              [field]: communication.initial,
            },
          },
        };
      },
    };
  };
}
