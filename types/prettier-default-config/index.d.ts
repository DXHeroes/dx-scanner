declare module 'prettier-default-config' {
  export function defaultConfigFor(format: string): { [key: string]: string };
  export const formats: { [key: string]: { filename: string; generate: () => string } };
}
