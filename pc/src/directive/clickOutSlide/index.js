import clickOutSlide from "./clickOutSlide";

function install(Vue) {
  Vue.directive("clickOutSlide", clickOutSlide);
}
if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}
clickOutSlide.install = install;

export default clickOutSlide;
