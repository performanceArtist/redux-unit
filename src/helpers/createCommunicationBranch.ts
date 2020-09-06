import { communication, Communication } from './communication';

export const createCommunicationBranch = <K extends string, S>(
  keys: K[],
  initial: S,
) => ({
  status: keys.reduce(
    (acc, key) => ({ ...acc, [key]: communication.initial }),
    {},
  ) as Record<K, Communication>,
  data: initial,
});
