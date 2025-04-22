import { Message } from "iview";
import { getTemplateConfig, THEME_CONFIG } from "@/utils/tplConfig";
import { less_change } from "@/utils/less";
import { ThemeIndex } from "@/constant/theme";

let themeColorList = getDefPrimaryColor();
let locTheme;
try {
  locTheme = JSON.parse(localStorage.getItem("themeColorList"));
  less_change(locTheme.key);
  if (locTheme && locTheme.primaryColor) {
    themeColorList = locTheme;
  }
} catch (e) {
  // 使用主题默认颜色
  locTheme = null;
}
let lessNodesAppended = false;
themeColorList.version = themeColorList.version || "1.0.0";

function getDefPrimaryColor() {
  const tpls = getTemplateConfig();
  const cur = tpls.find((item) => item.selected);
  if (cur) {
    return {
      primaryColor: cur.primaryColor,
    };
  }
  return THEME_CONFIG[configText.defaultTheme || 0];
}

function getCurrentTemplate() {
  const tpls = getTemplateConfig();
  return locTheme || tpls.find((item) => item.selected) || {};
}

const updateTheme = (themeColorList) => {
  if (!themeColorList) {
    return;
  }
  const hideMessage = Message.info("正在更换主题！", 0);
  console.log("切换模版", themeColorList);
  if (themeColorList && themeColorList.key) {
    less_change(themeColorList.key, hideMessage);
  } else {
    less_change(null, hideMessage);
  }
};

export default {
  state: {
    themeColorList: themeColorList || {},
    pageTemplate: getCurrentTemplate(),
  },
  getters: {
    themeColorList: (state) => state.themeColorList,
    pageTemplate: (state) => state.pageTemplate,
    isInternational: (state, getters) => {
      const { index } = getters.pageTemplate;
      return (
        index === ThemeIndex.v6 ||
        index === ThemeIndex.v7 ||
        index === ThemeIndex.v8
      ); /* || index === ThemeIndex.v10 */
    },
    isDianziVersion: (state, getters) => {
      const { index } = getters.pageTemplate;
      return (
        index === ThemeIndex.v8 ||
        index === ThemeIndex.v9 ||
        index === ThemeIndex.v10 ||
        index === ThemeIndex.v11
      );
    },
  },
  mutations: {
    SET_THEME_COLOR(state, data) {
      data.version = process.env.VERSION;
      if (data.primaryColor) {
        localStorage.setItem("themeColorList", JSON.stringify(data));
      } else {
        localStorage.removeItem("themeColorList");
      }
      state.themeColorList = data;
    },
    SET_PAGE_TEMPLATE(state, data) {
      data.version = process.env.VERSION;
      if (data.primaryColor) {
        localStorage.setItem("themeColorList", JSON.stringify(data));
      } else {
        localStorage.removeItem("themeColorList");
      }
      state.pageTemplate = data;
      state.themeColorList = data;
    },
  },
  actions: {
    changTheme({ commit, state }, playload) {
      const { themeColorList } = playload;
      if (state.themeColorList.primaryColor !== themeColorList.primaryColor) {
        updateTheme(themeColorList);
        commit("SET_THEME_COLOR", themeColorList);
      }
    },
    changTemplate({ commit, state }, playload) {
      const { pageTemplate } = playload;
      if (state.pageTemplate.index !== pageTemplate.index) {
        updateTheme(pageTemplate);
        commit("SET_PAGE_TEMPLATE", pageTemplate);
      }
    },
  },
};
