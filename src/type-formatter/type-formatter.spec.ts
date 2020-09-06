import { makeTypeFormatter } from './makeTypeFormatter';

describe('makeTypeFormatter', () => {
  it('Creates a formatter, that formats an action name in camelCase according to the passed config', () => {
    const formatter = makeTypeFormatter({
      typePrefix: 'test',
      prefixSeparator: ':',
      separator: '-',
      formatPrefix: prefix => prefix.toLowerCase(),
      formatWord: word => word.toUpperCase(),
    });
    const result = formatter('actionName');

    expect(result).toBe('test:ACTION-NAME');
  });
});
