export type Separator = '.' | ':' | '-' | '_' | '+' | '*' | '&';
export type TypeFormatter = (action: string) => string;
export type TypeFormatterOptions = Partial<{
  typePrefix: string;
  prefixSeparator: Separator;
  separator: Separator;
}>;

function getPrefix(typePrefix: string | undefined, prefixSeparator?: Separator) {
  if (!typePrefix) return '';

  if (typePrefix && prefixSeparator) {
    return `${typePrefix.toUpperCase()}${prefixSeparator}`
  }

  return `${typePrefix}:`;
}

function makeTypeFormatter(options?: TypeFormatterOptions): TypeFormatter {
  const {
    typePrefix,
    prefixSeparator,
    separator = '_'
  } = options || {};

  const prefix = getPrefix(typePrefix, prefixSeparator);
  const getActionName = (action: string) =>
    action.replace(/([a-zA-Z])([A-Z])/g, `$1${separator}$2`).toUpperCase();

  return (action: string) => {
    return `${prefix}${getActionName(action)}`
  }
}

export default makeTypeFormatter;
