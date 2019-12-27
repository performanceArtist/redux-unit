export function makeActionCreator(type: string) {
  return (...args: any) => {
    if (args.length === 0) {
      return { type };
    }

    return {
      type,
      payload: args.length > 1 ? args : args[0],
    };
  };
}
