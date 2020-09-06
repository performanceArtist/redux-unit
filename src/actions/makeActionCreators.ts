import { HandlerMap } from '../types';
import { InferAction, AnyHandler } from '../types';
import { TypeFormatter } from '../type-formatter';
import {
  isApiHandler,
  getApiActionCreators,
  ApiActionCreator,
  GetActionArgs,
  ApiHandler,
} from '../api';
import { makeActionCreator } from './makeActionCreator';

type PlainActionCreator<A extends unknown[]> = {
  (...args: A): InferAction<A>;
  getType: () => string;
};

export type SelectHandlerType<
  S,
  M extends HandlerMap<S>,
  T extends keyof M
> = M[T] extends ApiHandler<S>
  ? ApiActionCreator<S, M[T]>
  : M[T] extends AnyHandler<S>
  ? PlainActionCreator<GetActionArgs<M[T]>>
  : never;
export type ActionCreators<S, M extends HandlerMap<S>> = {
  [key in keyof M]: SelectHandlerType<S, M, key>;
};

export function makeActionCreators<S extends object, M extends HandlerMap<S>>(
  model: M,
  typeFormatter: TypeFormatter,
): ActionCreators<S, M> {
  return Object.keys(model).reduce((acc, key) => {
    const handler = model[key];
    if (isApiHandler(handler)) {
      acc[key] = getApiActionCreators(key, typeFormatter);
    } else {
      const creator = makeActionCreator(
        typeFormatter(key),
      ) as PlainActionCreator<any>;
      creator.getType = () => typeFormatter(key);

      acc[key] = creator;
    }

    return acc;
  }, {} as any) as ActionCreators<S, M>;
}
