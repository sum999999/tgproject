import preventReClick from "./preventReClick";

function install(Vue) {
    Vue.directive("preventReClick", preventReClick);
}
if (typeof window !== "undefined" && window.Vue) {
    install(window.Vue);
}
preventReClick.install = install;
export default preventReClick;
