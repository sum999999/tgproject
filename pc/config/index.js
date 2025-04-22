"use strict";
// Template version: 1.2.4
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require("path");
const proxy = [
  "https://biyingbaowang.cc" /* 演示demo站 */,
  // "http://16.163.165.156:5555/" /* 测试站 */,
  // "http://192.168.15.156:4848/" /* ziCheng */,
  // "http://192.168.15.145:4848/" /* 肯利 */,
  // "https://052101.cc/a/" /* 金沙娱乐 */,
  // "https://yd8801.cc" /* 云顶娱乐 */,
  // " https://qm5591.com/#/" /* 全民49 */,
  // "https://ckw602.com/#/" /* 彩客网 */,
  // "https://0850c.com/#/" /* 澳门新葡京 */,
  // "https://5867c.cc/#/" /* 8313-5678 */,
  // "https://6688cp532a.top/a/#/" /* 8316-6688 */,
  // "https://okw890.com/#/" /* 澳客网 */,
  // "https://bll-by-1.com/#/" /* 佰利乐 */,
  // "https://qm5593.com/" /* 8319-全民49彩票 */,
  // "https://857555.cc/" /* BY8320-857彩 */,
  // "https://hyl003.com/#/" /* 235-好运 */,
  // "https://988020.com/#/" /* BY8326-98彩 */,
  // "https://7718001.com/" /* by329-新葡京娱乐城 */,
  // "https://819530.com/#/" /* by331-盛大娱乐 */,
  // "https://slgj77.com/#/" /* by335 */,
  // "https://yc9901.com/#/" /* by336-盛大娱乐 */,
  // "https://jzyl111.com/#/" /* BY8337-九洲娱乐 */,
  // "https://jzyl.shop/#" /* BY8337-九洲娱乐 */,
  // "https://cyt001.cc/#/" /* BY8339-财运通 */,
  // "https://3949c.com/#/" /* BY8341-金沙娱乐城 */,
  // "https://164816.com/#/" /* BY8343-彩客网 */,
  //"https://gameliveyou.cc/#/" /* BY8347-彩客网 */,
  // "https://g.tg9demo.cc",
  // "https://xwsy9.app",
  // "https://tgkaifa.com",
  // "https://www.luc44.com/"
  // "https://tg9demo.com",
  // "https://49cp881.com
  // "https://xwcp9.com/"
  // "https://493.ms"
  // "https://491.ms/"
  // "https://luc66.com"
  // "https://gah111.com/"
  // "https://www.070780.com",
  // "https://gah444.com",
  // "https://g.tgceshi.com",
  // "https://tgceshi.com",
  // "https://gah0040.com/"
  // "https://x899999.com"
  // "https://bet135.vip/"
  // "https://bet135.vip/"
  // "https://www.dufuhao.com/#/home"
];

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: "static",
    assetsSubDirectory2: "configstatic2",
    assetsPublicPath: "/",
    proxyTable: {
      "/api": {
        target: proxy[0],
        changeOrigin: true,
        // pathRewrite: {
        //   '^/api': ''
        // }
      },
      "/party": {
        target: proxy[0],
        // target:proxy[1],
        changeOrigin: true,
        // pathRewrite: {
        //     '^/party': '/party'
        // }
      },
      // '/apis': {
      //   target: 'https://api.55466.cc:6869/lottery-api',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/apis': '/api'
      //   }
      // },
      "/socket": {
        target: "ws://192.168.1.168:8090",
        changeOrigin: true,
        pathRewrite: {
          "^/socket": "",
        },
      },
    },

    // Various Dev Server settings
    host: "0.0.0.0", // can be overwritten by process.env.HOST
    // host: "127.0.0.11", // can be overwritten by process.env.HOST
    port: 8866, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: "eval-source-map",

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, "../dist/index.html"),

    // Paths
    assetsRoot: path.resolve(__dirname, "../dist"),
    assetsSubDirectory: "static",
    assetsPublicPath: "/",

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: false,
    //'#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ["js", "css"],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
  },
};
