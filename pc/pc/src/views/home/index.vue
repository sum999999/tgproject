<template>
  <div>
    <component :is="view"></component>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getLogos } from "@/api/app.js";
import Util from "@/utils/utils";
const home = () => import(/* webpackChunkName: "home" */ "@/views/home/home");
const home2 = () =>
  import(/* webpackChunkName: "home2" */ "@/views-v2/content/home/home");
const home3 = () =>
  import(/* webpackChunkName: "home3" */ "@/views-v3/content/home/home");
const home4 = () =>
  import(/* webpackChunkName: "home4" */ "@/views-v4/content/home/home");
const home5 = () =>
  import(/* webpackChunkName: "home5" */ "@/views-v5/home/home");
const home6 = () => import(/* webpackChunkName: "home6" */ "@/views-v6/home");
const home7 = home3;
const home8 = () => import(/* webpackChunkName: "home8" */ "@/views-v8/home");
const home9 = home8;
const home10 = () =>
  import(/* webpackChunkName: "home10" */ "@/views-v10/home");
const home11 = () =>
  import(/* webpackChunkName: "home10" */ "@/views-v11/home/home");

export default {
  components: {
    home,
    home2,
    home3,
    home4,
    home5,
    home6,
    home7,
    home8,
    home9,
    home10,
    home11,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["pageTemplate"]),
    view() {
      let verseion = this.pageTemplate.index || "";
      return "home" + verseion;
    },
  },
  // 获取logo
  created() {
    getLogos().then((response) => {
      if (response.data.code !== 0) return;
      localStorage.setItem("getLogos", JSON.stringify(response.data.data));
    });
  },
};
</script>

<style></style>
