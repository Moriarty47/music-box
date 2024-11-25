export function viteGlobalPlugin() {
  const virtualModuleId = 'virtual:$global';
  const resovledVirtualModuleId = '\0' + virtualModuleId;
  return {
    name: 'vite-plugin-global',
    enfoce: 'pre',
    resolveId(id) {
      if (id === virtualModuleId) return resovledVirtualModuleId;
    },
    load(id) {
      if (id === resovledVirtualModuleId) {
        return `export function $(selectors, parent = document) {
  return parent.querySelector(selectors);
}`;
      }
    },
  };
}