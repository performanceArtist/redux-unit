export function makeActionCreator(type: string) {
  return (...args: any) => {
    return args.length === 0
      ? { type }
      : {
          type,
          payload: args.length > 1 ? args : args[0],
        };
  };
}