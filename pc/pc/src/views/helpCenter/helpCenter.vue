<template>
  <div
    class="help-center"
    ref='content'
  >
    <div
      class="nav lf"
      ref='nav'
    >
      <ul>
        <li>{{$tex("帮助中心")}}</li>
        <li
          v-for="(item,idx) in helpList"
          :key="item.label"
          :class="{'active': item.name === view,'no-border':idx ===helpList.length-1&& noBottomBorder}"
          @click="changeTab(item.name,idx)"
        >
          <img :src='item.netUrl' />
          <span>{{$tex(item.name)}}</span>
          <Icon type="chevron-right" />
        </li>
      </ul>
    </div>
    <div class="help-content rf">
      <component
        :is="view"
        :questionIndex='questionIndex'
        @getListHeight='getListHeight'
      ></component>
    </div>
    <div class="clr"></div>
  </div>
</template>

<script>
import helpContent from "./child_modal/index";
// import windowClientSize from '@/views/common/module_js/window_clientSize'
import eleInfo from "@/utils/dom.js";
// import escapeHtml from '@/utils/escapeHtml'
const aboveHeight = 279; //从文档顶部到问题区域的上边缘
// import modal from '@/components/modal/modal.vue'
export default {
  components: helpContent,
  data() {
    return {
      view: "注册",
      index: "",
      helpList: [],
      helpContent: [],
      noBottomBorder: true,
      lists: {
        register: "注册",
        bet: "购彩",
        play: "玩法",
        recharge: "充值",
        withdrawal: "提现",
        question: "常见问题",
        security: "账号安全",
        contact: "联系我们",
        prize: "中奖"
      },
      questionIndex: 0
    };
  },
  watch: {
    $route() {
      this.view = this.lists[this.$route.params.id];
      let index = this.$route.query.index;
      if (index !== undefined) {
        this.questionIndex = Number(index);
      }
    }
  },
  methods: {
    getListHeight() {
      let wrap = this.$refs.content;
      let nav = this.$refs.nav;
      if (wrap.offsetHeight - nav.offsetHeight === 2) {
        this.noBottomBorder = true;
      } else {
        this.noBottomBorder = false;
      }
    },
    changeTab(name, idx) {
      for (let [k, v] of Object.entries(this.lists)) {
        if (v === name) {
          if (this.view === v) {
            return;
          }
          this.view = v;
          this.$router.push({ params: { id: k } });
          break;
        }
      }
    },
    scrollTo() {
      let tarEle = this.$refs.helptype.$refs["slot" + this.index];
      let oStyle = eleInfo.getEleSize(tarEle);
      let oheight = parseInt(oStyle.height);
      window.scrollTo(0, aboveHeight + oheight * (parseInt(this.index) - 1));
    }
  },
  created() {
    let index = this.$route.query.index;
    let id = this.$route.params.id;
    this.view = this.lists[id];
    if (index !== undefined) {
      this.questionIndex = Number(index);
    }
    this.$http
      .post(
        "/api/v2/cms/queryHelpCenterByIdGuideList",
        { id: "3" },
        { unenc: true }
      )
      .then(response => {
        if (response.data.data === 1) return;
        this.helpList = response.data.data;
      });
  }
};
</script>

<style lang="less">
.help-center {
  width: 1000px;
  margin: 42px auto 42px;
  /*     border: 1px solid @common-border-color; */
}
.help-center .nav {
  width: 178px;
  background-color: #fff;
  border-radius: 3px;
  height: 100%;
}
.help-center .nav ul {
  height: 100%;
  color: #fff;
  /*     background: @help-center-ul-bg; */
}
.help-center .nav li {
  position: relative;
  padding: 10px 19px 10px 10px;
  border-bottom: 1px solid #e2e2e2;
  border-top: 1px solid #fcfcfc;
  border-right: 1px solid #e2e2e2;
  color: #313131;
  display: flex;
  align-items: center;
}
.help-center .nav .active {
  border-right: 1px solid transparent;
  font-weight: bold;
  background: #fff;
}
.help-center .nav .active i {
  display: none;
}
.help-center .nav ul li:first-child {
  height: 46px;
  line-height: 45px;
  border-top: none;
  /*   background: @help-center-title-bg; */
  color: #fff;
  font-size: 16px;
  text-align: center;
}
.help-center .nav li.no-border {
  border-bottom: none;
}
.help-center .nav li img {
  display: block;
  width: 20px;
  height: 22px;
  margin-left: 10px;
}
.help-center .nav li i {
  display: block;
  font-size: 12px;
  color: #dbdbdb;
}
.help-center .nav li span {
  font-size: 16px;
  margin-left: 10px;
  cursor: pointer;
  flex: 1;
  word-break: break-all;
  margin-right: 10px;
}
.help-center .nav li span:hover {
  /*   color: @primary-color; */
}
.help-center .help-content {
  background-color: #fff;
  width: 780px;
  min-height: 422px;
  border: 1px solid #e2e2e2;
  padding: 20px;
}
.help-center .rf {
  float: left;
  margin-left: 20px;
}
.help-center .help-page {
  // width: 780px;
}
.help-center .help-page .top-title {
  height: 45px;
  line-height: 44px;
  color: #7f7f7f;
  font-size: 14px;
  border-bottom: 1px solid #eaeaea;
}
</style>

