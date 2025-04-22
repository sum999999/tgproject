import { Message } from "iview";

function origin_less() {
  // insert less.js and color.less
  const lessStyleNode = document.createElement("link");
  lessStyleNode.setAttribute("id", "themeStyle");
  lessStyleNode.setAttribute("rel", "stylesheet/less");
  lessStyleNode.setAttribute(
    "href",
    "/static/css/theme.less?v=" + process.env.VERSION
  );
  document.body.insertBefore(lessStyleNode, document.body.firstChild);
}
export function less_init() {
  // 只有有换肤功能才需要
  if(!configText.isShowSwitchTemplate){return}
  origin_less();
  const lessConfigNode = document.createElement("script");
  lessConfigNode.innerHTML = `
        window.less = {
          async: true,
          env: 'production',
          javascriptEnabled: true
        };
      `;
  document.body.appendChild(lessConfigNode);
  let inited_key = null;
  try {
    let locTheme = JSON.parse(localStorage.getItem("themeColorList"));
    if (locTheme && locTheme.key) {
      inited_key = locTheme.key;
    } else {
      localStorage.removeItem("themeColorList");
    }
  } catch (e) {}
  if (!inited_key) {
    const { pageTemplate } = configText;
    for (const key in pageTemplate) {
      const item = pageTemplate[key];
      if (item.selected) {
        inited_key = key;
        break;
      }
    }
  }
  const lessScriptNode = document.createElement("script");
  lessScriptNode.src =
    "https://cdnjs.cloudflare.com/ajax/libs/less.js/3.13.1/less.js";
  lessScriptNode.async = true;
  lessScriptNode.onload = () => {
    less_change(inited_key);
    lessScriptNode.onload = null;
  };
  document.body.appendChild(lessScriptNode);
}

export function less_change(temp_key, callback) {
  if (!window.less) {
    return;
  }
  let config = {
    "@primaryColor": "#1f6efe",
    "@primary-color-hover": "#1f5efe",
    "@background-color": "#f0f6ff",
    "@button-bg-color": "#1f6efe",
  };
  if (CONTROL_LESS && CONTROL_LESS[temp_key]) {
    config = CONTROL_LESS[temp_key];
    console.log("切换颜色配置", temp_key, config, new Date());
    setTimeout(() => {
      window.less
          .modifyVars(config)
          .then(() => {
            console.log("使用颜色配置成功", temp_key, config, new Date());
            const themeStyleNode = document.getElementById("themeStyle");
            themeStyleNode && themeStyleNode.remove();
            if (callback) callback();
          })
          .catch((e) => {
            console.log(e);
            if (callback) {
              Message.error("Failed to update theme");
              callback();
            }
          });
    }, 200);
  }

}
