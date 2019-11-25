import { defaultTypeCreator } from './typeFormatter';
import { ApiActionCreator, ApiHandler, isApiHandler, getActionTypes, getActionCreators } from './api';

export type Action<P> = {
  type: string;
  payload?: P;
}
export type AnyFunction = (...args: unknown[]) => any;
export type GetReturnArgs<T extends AnyFunction> = Parameters<ReturnType<T>>;
export type GenericHandler<S> = (state: S) => (...args: unknown[]) => S;
export type Handler<S, A extends unknown[]> = (state: S) => (...args: A) => S;

type HandlerMap<S> = { [key: string]: GenericHandler<S> | ApiHandler<S> };
type FlatHandlerMap<S> = { [key: string]: GenericHandler<S> };
type SelectHandlerType<S, M extends HandlerMap<S>, T extends keyof M> =
  M[T] extends ApiHandler<S>
  ? ApiActionCreator<S, M[T]>
  : M[T] extends GenericHandler<S> ? (...args: GetReturnArgs<M[T]>) => Action<GetReturnArgs<M[T]>> : never
type ActionCreators<S, M extends HandlerMap<S>> = {
  [key in keyof M]: ReturnType<<T extends key> () => SelectHandlerType<S, M, T>>
};

export const reduxUnit = <S extends object>(initial: S, typePrefix?: string) => <M extends HandlerMap<S>>(model: M) => {
  const creators = Object.keys(model).reduce(
    (acc, key) => {
      const handler = model[key];
      if (isApiHandler(handler)) {
        acc[key] = getActionCreators(key, typePrefix);
      } else {
        acc[key] = (...args: any) => ({
          type: defaultTypeCreator(key, typePrefix),
          payload: args
        });
      }

      return acc;
    },
    {} as any
  ) as ActionCreators<S, M>;

  const handlerMap = Object.keys(model).reduce<FlatHandlerMap<S>>((acc, key) => {
    const handler = model[key];
    if (isApiHandler(handler)) {
      const actions = getActionTypes(key, typePrefix);
      acc[actions.success] = handler.success;
      if (handler.request && actions.request) acc[actions.request] = handler.request;
      if (handler.reset && actions.reset) acc[actions.reset] = handler.reset;
      if (handler.failure && actions.failure) acc[actions.failure] = handler.failure;
    } else {
      acc[defaultTypeCreator(key, typePrefix)] = handler;
    }

    return acc;
  }, {})

  const reducer = (state = initial, action: Action<any>) => {
    const handler = handlerMap[action.type];

    if (handler) {
      return handler(state)(...action.payload);
    }

    return state;
  }

  return { creators, reducer };
};
