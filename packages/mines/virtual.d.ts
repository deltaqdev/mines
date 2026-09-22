declare module 'virtual:mines/config' {
  const config: import('./config').MinesConfig;
  export default config;
}

declare module 'virtual:mines/styles' {}

declare module 'virtual:mines/components' {
  type Component = (props: Record<string, any>) => any;
  export const Header: Component;
  export const Sidebar: Component;
  export const PageHeader: Component;
  export const Toc: Component;
  export const Pager: Component;
  export const Footer: Component;
}

declare module 'virtual:mines/mdx-components' {
  const components: Record<string, (props: Record<string, any>) => any>;
  export default components;
}
