import { queryDiscountInternational, queryAnnounceEssayList } from "@/api/cms";
import { SAVE_CMS_DISCOUNTS } from "../mutation_types";

export default {
  state: {
    cmsDiscounts: [],
  },
  getters: {
    cmsCurDiscounts: (state, getters) => {
      const cmsDiscounts = state.cmsDiscounts;
      // const key = getters.isInternational ? "ImgResourcePlatTypeInternational" : "lotCcGameTypeConfig";
      const key = "ImgResourcePlatTypeInternational";
      let curDiscountStr = null;
      for (let i in cmsDiscounts) {
        const cmsDiscount = cmsDiscounts[i];
        if (cmsDiscount.key === key) {
          curDiscountStr = cmsDiscount.value;
          break;
        }
      }
      try {
        return JSON.parse(curDiscountStr);
      } catch (e) {
        console.log(e);
        return [];
      }
    },
  },
  mutations: {
    [SAVE_CMS_DISCOUNTS](state, playload = []) {
      state.cmsDiscounts = playload;
    },
  },
  actions: {
    async queryDiscountInternational({ state, commit, dispatch }, playload) {
      const res = await queryDiscountInternational();
      if (res.data.code !== 0) return;
      commit(SAVE_CMS_DISCOUNTS, res.data.data);
      return res.data.data;
    },
    async queryAnnounceEssayList({ state, commit, dispatch }, playload) {
      const res = await queryAnnounceEssayList(playload);
      return res;
    },
  },
};
