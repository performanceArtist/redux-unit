import { GenericHandler, ApiHandler } from '../index';
import { GetReturnArgs } from '../types';

import { initialCommunication, Communication } from './communication';

type SubType<Base, Condition> = Pick<Base, {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never
}[keyof Base]>;

export function apiHandler
  <S extends object, H extends GenericHandler<S>>
  ({ communication, onSuccess }: { communication: keyof SubType<S, Communication>, onSuccess: H }):
  ApiHandler<S, [], GetReturnArgs<H>, [string], []> {
  return {
    type: 'api',
    request: (state) => () => ({ ...state, [communication]: { ...state[communication], isFetching: true } }),
    success: onSuccess,
    failure: (state) => (error: string) => ({ ...state, [communication]: { ...state[communication], error, isFetching: false }}),
    reset: (state) => () => ({ ...state, [communication]: initialCommunication })
  };
}

