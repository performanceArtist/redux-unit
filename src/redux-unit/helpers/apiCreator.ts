import { GenericHandler, ApiHandler } from '../index';

import { initialCommunication } from './communication';

export function apiHandler
  <S extends object, T extends keyof S, H extends GenericHandler<S>>
  ({ communication, onSuccess }: { communication: T, onSuccess: H}):
  ApiHandler<S, [], Parameters<ReturnType<H>>, [string], []> {
  return {
    type: 'api',
    request: (state) => () => ({ ...state, [communication]: { ...state[communication], isFetching: true } }),
    success: onSuccess,
    failure: (state) => (error: string) => ({ ...state, [communication]: { ...state[communication], error, isFetching: false }}),
    reset: (state) => () => ({ ...state, [communication]: initialCommunication })
  };
}
