import Vue from "vue";
import VueI18n from "vue-i18n";
import enUSLocale from "./en_US";
import zhCNLocale from "./zh_CN";
// import hiINLocale from "./hi_IN";
// import inIDLocale from "./in_ID";
// import thTHLocale from "./th_TH";
// import viVNLocale from "./vi_VN";
// import ptBRLocale from "./pt_BR";
// import itITLocale from "./it_IT";

import ienUSLocale from "iview/dist/locale/en-US";
import izhCNLocale from "iview/dist/locale/zh-CN";
// import ihiINLocale from "iview/dist/locale/hi-IN"
// import iinIDLocale from "./i-in_ID"
// import ithTHLocale from "iview/dist/locale/th-TH"
// import iviVNLocale from "iview/dist/locale/vi-VN"
// import iptBRLocale from "iview/dist/locale/pt-BR"
// import iitITLocale from "iview/dist/locale/it-IT"

import Config from "@/config";

Vue.use(VueI18n);
Vue.locale = () => {};

const messages = {
  en_US: {
    ...Object.assign(ienUSLocale),
    ...enUSLocale,
  },
  zh_CN: {
    ...Object.assign(izhCNLocale),
    ...zhCNLocale,
  },
  // hi_IN: {
  //   ...Object.assign(ihiINLocale),
  //   ...hiINLocale
  // },
  // in_ID: {
  //   ...Object.assign(iinIDLocale),
  //   ...inIDLocale
  // },
  // th_TH: {
  //   ...Object.assign(ithTHLocale),
  //   ...thTHLocale
  // },
  // vi_VN: {
  //   ...Object.assign(iviVNLocale),
  //   ...viVNLocale
  // },
  // pt_BR: {
  //   ...Object.assign(iptBRLocale),
  //   ...ptBRLocale
  // },
  // it_IT: {
  //   ...Object.assign(iitITLocale),
  //   ...itITLocale
  // }
};

export function getChineseKey() {
  return "zh_CN";
}

export function getLocalLanguage() {
  let localLanguage = null;
  try {
    const language = localStorage.getItem("language");
    if (language) {
      localLanguage = JSON.parse(language);
    }
  } catch (e) {
    console.log("getLocalLanguage parse error!");
  }
  return localLanguage;
}

export function getLocalApiCoin() {
  let localApiCoin = null;
  try {
    const apiCoin = localStorage.getItem("api-coin");
    if (apiCoin) {
      localApiCoin = JSON.parse(apiCoin);
    }
  } catch (e) {
    console.log("getLocalApiCoin parse error!");
  }
  return localApiCoin;
}
export function getLanguage() {
  const localLanguage = getLocalLanguage();
  if (localLanguage) return localLanguage.code;

  // if has not choose language
  const language = configText.language || "";
  const locales = Object.keys(messages);
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale;
    }
  }
  return Config.language;
}

export function checkChineseKey() {
  return getChineseKey() === getLanguage();
}

const i18n = new VueI18n({
  locale: getLanguage(),
  messages,
});

export default i18n;
