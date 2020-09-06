export type Separator = '.' | ':' | '-' | '_' | '+' | '*' | '&';
export type TypeFormatterOptions = {
  typePrefix: string | undefined;
  prefixSeparator: Separator;
  separator: Separator;
  formatWord: (word: string) => string;
  formatPrefix: (prefix: string) => string;
};
export type TypeFormatter = (action: string) => string;

const defaultOptions: TypeFormatterOptions = {
  typePrefix: undefined,
  prefixSeparator: ':',
  separator: '_',
  formatWord: word => word.toUpperCase(),
  formatPrefix: prefix => prefix.toUpperCase(),
};

export function makeTypeFormatter(
  options?: Partial<TypeFormatterOptions>,
): TypeFormatter {
  const withDefaults = options
    ? { ...defaultOptions, ...options }
    : defaultOptions;
  const {
    typePrefix,
    formatPrefix,
    prefixSeparator,
    formatWord,
    separator,
  } = withDefaults;

  const prefix = typePrefix
    ? `${formatPrefix(typePrefix)}${prefixSeparator}`
    : '';
  const getActionName = (action: string) =>
    formatWord(action.replace(/([a-zA-Z])([A-Z])/g, `$1${separator}$2`));

  return (action: string) => `${prefix}${getActionName(action)}`;
}
