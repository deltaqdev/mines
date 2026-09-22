/// <reference types="astro/client" />
/// <reference path="./virtual.d.ts" />

// Lets plain `tsc` resolve component imports; editors use the Astro language server instead.
declare module '*.astro' {
  const Component: (props: Record<string, any>) => any;
  export default Component;
}
