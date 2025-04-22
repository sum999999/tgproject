<template>
  <div class="news-page content">
    <div class="nav lf">
      <ul>
        <li
          v-for="item in nav"
          :key="item.label"
          :class="{active: item.label == view}"
          @click="changeTab(item.label)"
        >
          <span></span>
          <span>{{item.name}}</span>
          <i></i>
        </li>
      </ul>
    </div>
    <div class="new-content rf">
      <!-- <component :is="view" ref='helptype' :type='view'></component> -->
      <list-content :typeId="view"></list-content>
    </div>
    <div class="clr"></div>
  </div>
</template>

<script>

import listContent from "./list_content";
export default {
  components: { listContent },
  data() {
    return {
      view: "news",
      nav: [
        { name: this.$tex("新闻资讯"), label: "news" },
        { name: this.$tex("购彩技巧"), label: "skills" },
        { name: this.$tex("网站公告"), label: "announce" },
        { name: this.$tex("新手指导"), label: "guide" }
      ]
    };
  },
  watch: {
    $route: {
      handler: "setView",
      immediate: true
    }
  },
  methods: {
    changeTab(label) {
      this.$router.push({ params: { id: label } });
      this.view = label;
      sessionStorage.setItem("newsView", "/newsList/" + this.view);
    },
    setView() {
      this.view = this.$route.params.id;
    }
  }
};
</script>

<style lang="less" scoped>
.news-page {
  width: 1000px;
  padding: 42px 0;
  margin: 0 auto;
  border-radius: 2px;
}
.news-page .nav {
  width: 192px;
  border-radius: 4px;
  font-size: 16px;
  color: #313131;
  background-color: #fff;
}
.nav ul li {
  display: flex;
  align-items: center;
}
.nav ul li>span:nth-child(2) {
  flex: 1;
  word-break: break-all;
  padding: 12px 0;
}
.nav ul li:hover {
  cursor: pointer;
}
.nav ul li:hover span:first-child {
  background: url("/static/images/red_star.png") no-repeat;
}
.nav ul li:hover i {
  background: url("/static/images/right_redarrow.png") no-repeat;
}
.nav ul li:first-child {
  border-top: none;
}
.nav ul li i {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-left: 36px;
  vertical-align: middle;
  background: url("/static/images/right_grayarrow.png") no-repeat;
}
.nav ul li.active i {
  background: url("/static/images/right_redarrow.png") no-repeat;
}
.nav ul li.active span {
  /*  color: @primary-color; */
}
.nav ul li span:first-child {
  display: inline-block;
  width: 16px;
  height: 18px;
  margin: 0 17px 0 18px;
  vertical-align: -3px;
  background: url("/static/images/gray_star.png") no-repeat;
}
.nav ul li.active span:first-child {
  background: url("/static/images/red_star.png") no-repeat;
}
.news-page .new-content {
  width: 782px;
  background-color: #fff;
  /* border: 1px solid @news-list-nav-border; */
}
</style>


