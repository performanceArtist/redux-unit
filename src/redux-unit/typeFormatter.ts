function toUpperSnakeCase(handlerName: string) {
  const snakeCased = handlerName.replace(/([a-zA-Z])([A-Z])/, '$1_$2');
  return snakeCased.toUpperCase();
}

function getTypePrefix(typePrefix?: string, separator = ':') {
  return typePrefix ? `${typePrefix.toUpperCase()}${separator}` : '';
}

export function makeActionTypeCreator(prefixFormatter = getTypePrefix, keyFormatter = toUpperSnakeCase) {
  return (key: string, prefix?: string) => `${prefixFormatter(prefix)}${keyFormatter(key)}`;
}

export const defaultTypeCreator = makeActionTypeCreator();
