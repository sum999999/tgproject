import loading from "./loading";

function install(Vue) {
    Vue.directive("loading", loading);
}
if (typeof window !== "undefined" && window.Vue) {
    install(window.Vue);
}
loading.install = install;
export default loading;
