import drag from "./drag";

function install(Vue) {
  Vue.directive("drag", drag);
}
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}
drag.install = install;

export default drag;
