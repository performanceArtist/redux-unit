export const pipe = (...fs: Function[]) => (x: any) => fs.reduce((g, f) => f(g), x);
