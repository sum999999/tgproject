import parallax from "./parallax.js";

const install = function (Vue) {
  Vue.directive("parallax", parallax);
};

if (window.Vue) {
  Vue.use(install); // eslint-disable-line
}

parallax.install = install;
export default parallax;
