import clipboard from "./clipboard";

const install = function (Vue) {
  Vue.directive("clipboard", clipboard);
};

if (window.Vue) {
  Vue.use(install); // eslint-disable-line
}

clipboard.install = install;
export default clipboard;
