import { ThemeIndex } from "@/constant/theme";

export const THEME_CONFIG = [
  { primaryColor: "#ae291a", primaryColorHover: "#de2f04" }, //酒红
  { primaryColor: "#ff7f50", primaryColorHover: "#ee4f17" }, //珊瑚色
  { primaryColor: "#14bd58", primaryColorHover: "#0d8d42" }, //草绿色
  { primaryColor: "#4169E1", primaryColorHover: "#1c57cb" }, //皇家蓝色
  { primaryColor: "#d09700", primaryColorHover: "#bf8301" }, //金麒麟色
  { primaryColor: "#8A2BE2", primaryColorHover: "#8812be" }, //紫罗兰色
  { primaryColor: "#FF4500", primaryColorHover: "#c83406" }, //红橙色
  { primaryColor: "#ec0000", primaryColorHover: "#b80101" }, //罂粟红
  { primaryColor: "#213862", primaryColorHover: "#14223c" }, //高贵蓝
  { primaryColor: "#e4393c", primaryColorHover: "#e4393c" }, //大发红
];
// TEMPLATE废弃 => control.js
const TEMPLATE = {
  temp: {
    backgroundColor: "#ffffff",
    btnPrimaryBgImg: "none",
    ...THEME_CONFIG[configText.defaultTheme || 0],
  },
  temp1: {
    primaryColor: "#131522",
    primaryColorHover: "#414142",
    backgroundColor: "#131522",
    btnPrimaryBgImg: "none",
    index: ThemeIndex.v2,
    showPlayWay: false,
  }, //模板一 游戏
  temp2: {
    primaryColor: "#131522",
    primaryColorHover: "#414142",
    backgroundColor: "#131522",
    btnPrimaryBgImg: "none",
    index: ThemeIndex.v3,
    showPlayWay: false,
  }, //模板二 娱乐
  temp3: {
    primaryColor: "#0079fe",
    primaryColorHover: "#5279a3",
    backgroundColor: "#fff",
    btnPrimaryBgImg: "none",
    index: ThemeIndex.v4,
    showPlayWay: true,
  }, //模板三 体育
  temp4: {
    primaryColor: "#ff464b",
    primaryColorHover: "#e63e44",
    backgroundColor: "#f5f5f5",
    btnPrimaryBgImg: "none",
    index: ThemeIndex.v5,
    showPlayWay: false,
  }, //模板四
  temp5: {
    primaryColor: "#ddc17c",
    primaryColorHover: "#ddc17c",
    backgroundColor: "#000000",
    btnPrimaryBgImg: "linear-gradient(to top, #795d1b, #aa8743 40%, #f7df99)",
    index: ThemeIndex.v6,
    showPlayWay: false,
  }, //国际版
  temp6: {
    primaryColor: "#131522",
    primaryColorHover: "#414142",
    backgroundColor: "#131522",
    btnPrimaryBgImg: "none",
    index: ThemeIndex.v7,
    showPlayWay: false,
  }, //模板二 娱乐国际版
  temp7: {
    primaryColor: "#ddc17c",
    primaryColorHover: "#ddc17c",
    backgroundColor: "#000000",
    btnPrimaryBgImg: "linear-gradient(to top, #795d1b, #aa8743 40%, #f7df99)",
    index: ThemeIndex.v8,
    showPlayWay: false,
  }, // 国际电子版
  temp8: {
    primaryColor: "#ddc17c",
    primaryColorHover: "#ddc17c",
    backgroundColor: "#000000",
    btnPrimaryBgImg: "linear-gradient(to top, #795d1b, #aa8743 40%, #f7df99)",
    index: ThemeIndex.v9,
    showPlayWay: false,
  }, // 大陆电子版
  temp9: {
    primaryColor: "#1F6EFE",
    primaryColorHover: "#DDE8FF",
    backgroundColor: "F0F6FF",
    btnPrimaryBgImg: "linear-gradient(180deg, #3BE6E5 0%, #1F94FF 100%)",
    index: ThemeIndex.v10,
    showPlayWay: false,
  }, // 国际蓝白电子版
  temp10: {
    primaryColor: "#e4393c",
    primaryColorHover: "#da1d1d",
    backgroundColor: "#fff",
    btnPrimaryBgImg: "linear-gradient(180deg, #3BE6E5 0%, #1F94FF 100%)",
    index: ThemeIndex.v11,
    showPlayWay: false,
  }, // 大发
  // temp11: {
  //   primaryColor: "#e4393c",
  //   primaryColorHover: "#1c57cb",
  //   // backgroundColor: 'F0F6FF',
  //   // btnPrimaryBgImg: 'linear-gradient(180deg, #3BE6E5 0%, #1F94FF 100%)',
  //    index: ThemeIndex.v12,
  //   // showPlayWay: false,
  // },
};

export function getTemplateConfig() {
  const tpls = [];
  const { pageTemplate } = configText;
  if (pageTemplate) {
    for (const key in pageTemplate) {
      const item = pageTemplate[key];
      item["key"] = key;
      tpls.push({
        ...item,
        ...TEMPLATE[key],
      });
    }
  }
  return tpls;
}
