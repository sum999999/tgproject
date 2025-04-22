<template>
  <div id="app">
    <router-view v-if="!netStatus && !iPInfo" />
    <div class="net-error" v-if="netStatus">{{ $tex("系统维护中") }}...</div>
    <!-- ip限制 -->
    <ip-forbid v-if="iPInfo"></ip-forbid>
    <SysTextModal />
    <longqueue v-model="showLongqueue"></longqueue>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ipForbid from "@/components/ipforbid.vue";
import SysTextModal from "@/components/SysTextModal";
import isEmpty from "lodash/isEmpty";
import { addClass, removeClass } from "@/utils/domEx";
import Longqueue from "@/components/Longqueue";
import { ThemeIndex } from "@/constant/theme.js";
import { getInvite } from "@/api/app";

let socket;
export default {
  components: { ipForbid, SysTextModal, Longqueue },
  name: "app",
  computed: {
    ...mapGetters(["user", "regAddDefaultExpandStatus", "pageTemplate"]),
    isLogin() {
      return !!this.user.userId;
    },
    netStatus() {
      return this.$store.state.netStatus;
    },
    iPInfo() {
      return !isEmpty(this.$store.state.isIpForbid);
    },
    showLongqueue: {
      get() {
        return this.$store.state.app.showLongqueue;
      },
      set(value) {
        this.$store.commit("SET_APP_LONGQUEUE", value);
      },
    },
  },
  watch: {
    regAddDefaultExpandStatus(value) {
      if (!value) {
        this.$store.commit("setRegAddDefaultExpandStatus", true);
        this.$Modal.confirm({
          title: this.$tex("系统提示"),
          content: this.$tex(
            "您的默认邀请码已被它人占用，请即时创建新的邀请码！"
          ),
          onOk: () => {
            this.$router.push("/personalCenter/expand");
          },
        });
      }
    },
    pageTemplate: {
      immediate: true,
      handler(value, oldValue) {
        let newIndex = value && value.index;
        let oldIndex = oldValue && oldValue.index;
        newIndex = this.sameUseNewIndex(newIndex, ThemeIndex.v9, ThemeIndex.v8);
        oldIndex = this.sameUseNewIndex(oldIndex, ThemeIndex.v9, ThemeIndex.v8);
        newIndex = this.sameUseNewIndex(
          newIndex,
          ThemeIndex.v11,
          ThemeIndex.v10
        );
        oldIndex = this.sameUseNewIndex(
          oldIndex,
          ThemeIndex.v11,
          ThemeIndex.v10
        );
        oldValue && removeClass(document.body, `v${oldIndex}-layout-theme`);
        value && addClass(document.body, `v${newIndex}-layout-theme`);
      },
    },
    user(n = {}, o = {}) {
      if (!this.isLogin) {
        this.$store.commit("SET_APP_LONGQUEUE", false);
      }
    },
  },
  created() {
    this.render();
    // 商户标识
    this.$store.dispatch("querySystemConfig");
    this.getInvitationCode();
  },
  methods: {
    sameUseNewIndex(value, index, newIndex) {
      return value != index ? value : newIndex;
    },
    render() {
      const VERSION = process.env.VERSION;
      const themeColorList = this.$store.state.theme.themeColorList;
      const basePath = `${window.location.origin}/static/css/theme.less?v=`;
      const themeCache = localStorage.getItem(basePath + VERSION);

      if (themeCache && VERSION == themeColorList.version) {
        const themeStyle = document.createElement("style");
        themeStyle.type = "text/css";
        themeStyle.id = "themeStyle";
        themeStyle.appendChild(document.createTextNode(themeCache));
        document.body.insertBefore(themeStyle, document.body.firstChild);
      } else {
        const locKey = basePath + themeColorList.version;
        localStorage.removeItem(locKey);
        localStorage.removeItem(locKey + ":timestamp");
        localStorage.removeItem(locKey + ":vars");
      }
    },
    // 邀请码进入记录
    async getInvitationCode() {
      const hash = window.location.hash;
      const startIndex = hash.indexOf("?");
      const endIndex = hash.indexOf("&");
      if (startIndex !== -1) {
        const exp = hash.slice(startIndex + 1, endIndex);
        await getInvite(exp);
      }
    },
  },
};
</script>

<style lang="less">
@import "./styles/theme/components/base.less";
@import "./styles/loading.less";
//loading动画
@import "./styles/animation.less"; //动画
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

table[align="left"] {
  margin-inline-start: 0;
  margin-inline-end: 0;
}
table[align="center"] {
  margin-inline-start: auto;
  margin-inline-end: auto;
}
table[align="right"] {
  margin-inline-start: auto;
  margin-inline-end: auto;
}

#app .net-error {
  padding-top: 100px;
  font-size: 18px;
  text-align: center;
}

ul,
li {
  list-style: none;
}

i {
  font-style: normal;
}

a {
  text-decoration: none;
}

.w-full {
  width: 100%;
}

.lf {
  float: left;
}

.rf {
  float: right;
}

html,
body {
  min-height: 100%;
  font-size: 14px;
  //background: linear-gradient(80deg, #4c8bfe26, #4c8bfe26, #4c8bfe26);
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

input[type="number"] {
  -moz-appearance: textfield;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #313131;
  -webkit-touch-callout: none;
  -webkit-user-select: text;
  -ms-user-select: text;
  -moz-user-select: text;
  -khtml-user-select: text;
  user-select: text;
}

.clr {
  width: 0;
  height: 0;
  clear: both;
  display: block;
}

.btn {
  border: 1px solid #ccc;
  background: none;
  padding: 5px 10px;
  border-radius: 3px;
  outline: none;
}

.btn.primary {
  color: #fff;
}

/* input样式 */
.input-line {
  display: inline-block;
}

.input-wrapper .btn {
  padding: 9px 10px;
  cursor: pointer;
}

.input-wrapper .btn.primary {
  color: #fff;
}

input::-webkit-input-safebox-button {
  display: none;
}

/* 过渡效果 */
.down-fade-enter-active {
  transition: all 0.3s ease;
}

.down-fade-enter,
.down-fade-enter {
  transform: translateY(-5px);
  opacity: 0;
}

/* 滚动条样式 */
#app .ivu-table-body {
  overflow-y: auto;
  overflow-x: hidden;
}

[no-select="true"] {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently */
}

.tab-body::-webkit-scrollbar,
.ivu-scroll-container::-webkit-scrollbar,
dd::-webkit-scrollbar,
.ivu-select-dropdown::-webkit-scrollbar,
ul::-webkit-scrollbar,
.nice-scroll::-webkit-scrollbar,
.ivu-table-body::-webkit-scrollbar,
.road-analy-content::-webkit-scrollbar,
.trend-content-wrap::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.tab-body::-webkit-scrollbar-button,
.ivu-scroll-container::-webkit-scrollbar-button,
dd::-webkit-scrollbar-button,
.ivu-select-dropdown::-webkit-scrollbar-button,
ul::-webkit-scrollbar-button,
.nice-scroll::-webkit-scrollbar,
.ivu-table-body::-webkit-scrollbar-button,
.road-analy-content::-webkit-scrollbar-button,
.trend-content-wrap::-webkit-scrollbar-button {
  background: #fff;
  width: 6px;
  height: 0;
  /* display:none;
          height:0; */
}

.nice-scroll::-webkit-scrollbar-track,
.ivu-scroll-container::-webkit-scrollbar-track,
.tab-body::-webkit-scrollbar-track,
dd::-webkit-scrollbar-track,
.ivu-select-dropdown::-webkit-scrollbar-track,
ul::-webkit-scrollbar-track,
.ivu-table-body::-webkit-scrollbar-track,
.road-analy-content::-webkit-scrollbar-track,
.trend-content-wrap::-webkit-scrollbar-track {
  background: #fff;
  border-radius: 3px;
}

.nice-scroll::-webkit-scrollbar-track-piece,
.ivu-scroll-container::-webkit-scrollbar-track-piece,
.tab-body::-webkit-scrollbar-track-piece,
dd::-webkit-scrollbar-track-piece,
.ivu-select-dropdown::-webkit-scrollbar-track-piece,
ul::-webkit-scrollbar-track-piece,
.ivu-table-body::-webkit-scrollbar-track-piece,
.road-analy-content::-webkit-scrollbar-track-piece,
.trend-content-wrap::-webkit-scrollbar-track-piece {
  background: #eeebeb;
  border-radius: 3px;
}

.nice-scroll::-webkit-scrollbar-thumb,
.ivu-scroll-container::-webkit-scrollbar-thumb,
.tab-body::-webkit-scrollbar-thumb,
dd::-webkit-scrollbar-thumb,
.ivu-select-dropdown::-webkit-scrollbar-thumb,
ul::-webkit-scrollbar-thumb,
.ivu-table-body::-webkit-scrollbar-thumb,
.road-analy-content::-webkit-scrollbar-thumb,
.trend-content-wrap::-webkit-scrollbar-thumb {
  background: #b5b5b5;
  border-radius: 3px;
}

.nice-scroll::-webkit-scrollbar-corner,
.ivu-scroll-container::-webkit-scrollbar-corner,
.tab-body::-webkit-scrollbar-corner,
dd::-webkit-scrollbar-corner,
.ivu-select-dropdown::-webkit-scrollbar-corner,
ul::-webkit-scrollbar-corner,
.ivu-table-body::-webkit-scrollbar-corner,
.road-analy-content::-webkit-scrollbar-corner,
.trend-content-wrap::-webkit-scrollbar-corner {
  /*边角（位置6）*/
  background: transparent;
}

.nice-scroll::-webkit-scrollbar-resizer,
.ivu-scroll-container::-webkit-scrollbar-resizer,
.tab-body::-webkit-scrollbar-resizer,
dd::-webkit-scrollbar-resizer,
.ivu-select-dropdown::-webkit-scrollbar-resizer,
ul::-webkit-scrollbar-resizer,
.ivu-table-body::-webkit-scrollbar-resizer,
.road-analy-content::-webkit-scrollbar-resizer,
.trend-content-wrap::-webkit-scrollbar-resizer {
  background: #ff0bee;
}

#app {
  scrollbar-arrow-color: #f4ae21; /**/ /*三角箭头的颜色*/
  scrollbar-face-color: #333; /**/ /*立体滚动条的颜色*/
  scrollbar-3dlight-color: #666; /**/ /*立体滚动条亮边的颜色*/
  scrollbar-highlight-color: #666; /**/ /*滚动条空白部分的颜色*/
  scrollbar-shadow-color: #999; /**/ /*立体滚动条阴影的颜色*/
  scrollbar-darkshadow-color: #666; /**/ /*立体滚动条强阴影的颜色*/
  scrollbar-track-color: #666; /**/ /*立体滚动条背景颜色*/
  scrollbar-base-color: #f8f8f8; /**/ /*滚动条的基本颜色*/
}

/* icon */
.i-icon {
  background: url(~@/assets/images/icon.png) no-repeat;
  display: inline-block;
}

.i-notice {
  width: 25px;
  height: 20px;
  background-position: -10px -11px;
}

.i-three {
  height: 20px;
  width: 22px;
  background-position: -77px -105px;
}

.i-android {
  width: 28px;
  height: 28px;
  background-position: -454px -59px;
}

.i-android-gray {
  width: 20px;
  height: 20px;
  background-position: -148px -167px;
}

.i-android-red {
  width: 20px;
  height: 20px;
  background-position: -148px -191px;
}

.i-android-white {
  width: 18px;
  height: 18px;
  background-position: -424px -115px;
}

.i-ios {
  width: 23px;
  height: 23px;
  background-position: -482px -11px;
}

.i-ios-white {
  width: 16px;
  height: 18px;
  background-position: -390px -115px;
}

.i-ios-gray {
  width: 20px;
  height: 20px;
  background-position: -174px -192px;
}

.i-ios-red {
  width: 20px;
  height: 20px;
  background-position: -174px -168px;
}

/* .i-phone {
        width: 18px;
        height: 27px;
        background-position: -448px -8px;
    } */
.i-big-three {
  width: 32px;
  height: 27px;
  background-position: -320px -8px;
}

.i-file {
  width: 25px;
  height: 27px;
  background-position: -300px -59px;
}

.i-telephone {
  width: 28px;
  height: 27px;
  background-position: -368px -8px;
}

.i-telephone2 {
  width: 16px;
  height: 16px;
  background-position: -167px -45px;
}

.i-advantage {
  width: 28px;
  height: 27px;
  background-position: -194px -10px;
}

.i-tick {
  width: 18px;
  height: 16px;
  background-position: -160px -16px;
}

.i-net-police {
  height: 46px;
  width: 122px;
  background-position: -9px -728px;
}

.i-commom-info {
  height: 46px;
  width: 122px;
  background-position: -9px -219px;
}

.i-net-trade {
  height: 46px;
  width: 122px;
  background-position: -9px -274px;
}

.i-credit {
  height: 46px;
  width: 122px;
  background-position: -10px -329px;
}

.i-identity {
  height: 46px;
  width: 122px;
  background-position: -9px -384px;
}

.i-high {
  width: 26px;
  height: 28px;
  background-position: -211px -60px;
}

.i-low {
  width: 26px;
  height: 26px;
  background-position: -255px -59px;
}

.i-arrow-right {
  height: 22px;
  width: 15px;
  background-position: -174px -112px;
}

.i-arrow-big-left {
  width: 20px;
  height: 28px;
  background-position: -200px -110px;
}

.i-arrow-big-right {
  width: 20px;
  height: 28px;
  background-position: -228px -110px;
}

/* .i-arrow-small-right {
        width: 24px;
        height: 24px;
        background-position: -291px -288px;
    } */
/* .i-arrow-small-down {
        width: 24px;
        height: 24px;
        background-position: -266px -288px;
    } */
.i-refresh {
  width: 20px;
  height: 23px;
  background-position: -260px -113px;
}

.i-refresh-white {
  width: 20px;
  height: 18px;
  background-position: -410px -182px;
}

.i-main-code {
  height: 43px;
  width: 44px;
  background-position: -11px -110px;
}

/* .i-special-code {
        height: 43px;
        width: 44px;
        background-position: -11px -56px;
    } */
.i-small-box {
  width: 4px;
  height: 4px;
}

.i-trophy {
  width: 25px;
  height: 22px;
  background-position: -167px -65px;
}

/* .i-trophy-small {
        width: 17px;
        height: 16px;
        background-position: -545px -250px;
    }
    .i-trophy-small-white {
        width: 17px;
        height: 16px;
        background-position: -570px -250px;
    } */
.i-new {
  width: 22px;
  height: 22px;
  background-position: -120px -10px;
}

.i-rank {
  width: 22px;
  height: 22px;
  background-position: -76px -10px;
}

.i-ren {
  width: 33px;
  height: 33px;
  background-position: -236px -6px;
}

.i-step {
  width: 76px;
  height: 15px;
  background-position: -75px -70px;
}

.i-file-red {
  width: 40px;
  height: 30px;
  background-position: -345px -58px;
}

.i-buy {
  width: 32px;
  height: 31px;
  background-position: -401px -56px;
}

.i-young {
  width: 32px;
  height: 32px;
  background-position: -125px -106px;
}

.i-account {
  height: 20px;
  width: 20px;
  background-position: -286px -10px;
}

/* .i-password {
        height: 20px;
        width: 20px;
        background-position: -410px -13px;
    } */
.i-suspend-head {
  width: 114px;
  height: 40px;
  background-position: -214px -171px;
}

.i-suspend-bt {
  height: 40px;
  width: 112px;
  background-position: -145px -231px;
}

.i-line-service {
  height: 40px;
  width: 30px;
  background-position: -297px -108px;
}

.i-help-service {
  height: 40px;
  width: 30px;
  background-position: -347px -108px;
}

.i-logo {
  width: 28px;
  height: 29px;
  background: url(/configstatic/pc/images/logo-icon.png) center center no-repeat;
}

.i-demo {
  background: url(/static/images/icon.png) center center no-repeat;
  width: 20px;
  height: 28px;
  background-position: -20px -72px;
}

.i-buylottery {
  background: url(/static/images/icon.png) center center no-repeat;
  width: 20px;
  height: 28px;
  background-position: -52px -72px;
}

.i-qq-service {
  width: 24px;
  height: 31px;
  background-position: -465px -109px;
}

.i-home {
  width: 28px;
  height: 28px;
  background-position: -444px -176px;
}

.i-custom {
  width: 28px;
  height: 28px;
  background-position: -483px -179px;
}

.i-user-center {
  width: 28px;
  height: 28px;
  background-position: -520px -176px;
}

.i-recharge {
  width: 28px;
  height: 28px;
  background-position: -556px -177px;
}

.i-draw-money {
  width: 28px;
  height: 28px;
  background-position: -276px -237px;
}

/* .i-sign-out {
        width: 24px;
        height: 23px;
        background-position: -314px -242px;
    } */

.i-down-count,
.i-min-down-count,
.i-sec-down-count {
  height: 54px;
  width: 52px;
  background-position: -10px -510px;
}

.i-min-down-count {
  background-position: -374px -506px;
}

.i-sec-down-count {
  background-position: -434px -506px;
}

/* .i-ball {
        width: 45px;
        height: 50px;
        background-position: -146px -273px;
    } */
.i-lottery {
  width: 24px;
  height: 24px;
  background-position: -238px -288px;
}

.i-record {
  width: 28px;
  height: 28px;
  background-position: -341px -545px;
}

.i-lottery-record {
  width: 17px;
  height: 20px;
  background-position: -509px -416px;
}

/* 个人中心 */
/* 我的账户 */
.i-account,
.i-account-active,
.i-funds,
.i-funds-active,
.i-bett-record,
.i-bett-record-active,
.i-transaction-details,
.i-transaction-details-active,
.i-personal-report,
.i-personal-report-active,
.i-new-info,
.i-new-info-active,
.i-user-manager,
.i-user-manager-active,
.i-promote-management,
.i-promote-management-active,
.i-acting-commission,
.i-acting-commission-active,
.i-report-description,
.i-report-description-active,
.i-online-withdrawal,
.i-online-withdrawal-active,
.i-agent-betting,
.i-agent-betting-active,
.i-yeb,
.i-yeb-active,
.i-agent-trade,
.i-agent-trade-active,
.i-free-charge,
.i-free-charge-active {
  width: 19px;
  height: 17px;
  background: url("~@/assets/images/icon.png") no-repeat;
}

/*我的账号*/
.i-account-active {
  background-position: -253px -382px;
}

.i-account {
  background-position: -282px -419px;
}

/* 资金管理 */
.i-funds {
  background-position: -368px -419px;
}

.i-funds-active {
  background-position: -337px -382px;
}

.i-free-charge {
  background-position: -138px -417px;
}

.i-free-charge-active {
  background-position: -138px -382px;
}

/* 投注记录 */
.i-bett-record {
  background-position: -397px -419px;
}

.i-bett-record-active {
  background-position: -366px -382px;
}

/* 交易明细 */
.i-transaction-details {
  background-position: -339px -419px;
}

.i-transaction-details-active {
  background-position: -308px -382px;
}

/* 个人报表,报表统计*/
.i-personal-report {
  background-position: -254px -419px;
}

.i-personal-report-active {
  background-position: -223px -381px;
}

/* 最新信息 */
.i-new-info {
  background-position: -168px -418px;
}

.i-new-info-active {
  background-position: -280px -382px;
}

/* 用户管理 */
.i-user-manager {
  background-position: -453px -419px;
}

.i-user-manager-active {
  background-position: -422px -382px;
}

/*推广管理*/
.i-promote-management {
  background-position: -199px -419px;
}

.i-promote-management-active {
  background-position: -168px -382px;
}

/* 代理佣金*/
.i-acting-commission {
  background-position: -225px -419px;
}

.i-acting-commission-active {
  background-position: -195px -382px;
}

/* 报表说明 */
.i-report-description {
  background-position: -482px -419px;
}

.i-report-description-active {
  background-position: -482px -382px;
}

/*在线提现*/
.i-online-withdrawal {
  background-position: -425px -419px;
}

.i-online-withdrawal-active {
  background-position: -394px -382px;
}

// 代理投注明细
.i-agent-betting {
  background-position: -417px -289px;
}

.i-agent-betting-active {
  background-position: -417px -315px;
}

//代理交易明细
.i-agent-trade {
  background-position: -449px -290px;
}

.i-agent-trade-active {
  background-position: -449px -316px;
}

/* 余额宝 */
.i-yeb {
  background: url("/static/images/yeb/yu_er_gray.png") no-repeat;
}

.i-yeb-active {
  background: url("/static/images/yeb/yu_er_wirte.png") no-repeat;
}

/* 删除 */
.i-red-delete {
  width: 12px;
  height: 14px;
  background: url("~@/assets/images/icon.png") no-repeat;
  background-position: -531px -119px;
}

/* 表格样式 */
#app .ivu-table .ivu-table-header th,
.v-transfer-dom .ivu-table-header th {
  height: 36px;
  color: #fff;
  font-weight: normal;
}

#app .ivu-table:before {
  height: 0;
}

.ivu-table-wrapper > .ivu-spin-fix {
  border: none;
}

.v-transfer-dom .ivu-table:before {
  height: 0;
}

#app .ivu-table:after {
  width: 0;
}

.v-transfer-dom .ivu-table:after {
  height: 0;
}

#app .ivu-table-wrapper {
  border: none;
}

.v-transfer-dom .ivu-table-wrapper {
  border: none;
}

#app .ivu-table-cell {
  padding-right: 0;
  padding-left: 13px;
  padding-top: 5px;
  padding-bottom: 5px;
  word-break: break-word;
}

.v-transfer-dom .ivu-table-cell {
  padding-right: 0;
}

#app .ivu-table td,
#app .ivu-table th.v-transfer-dom .ivu-table td,
#app .ivu-table-th {
  height: 36px;
  border-bottom: none;
}

.v-transfer-dom .ivu-table td {
  border-bottom: none;
}

.v-transfer-dom .ivu-modal-footer {
  border: none;
  text-align: center;
}

.ivu-table th,
.ivu-table td {
  border-bottom: none;
}

/* 表格结束 */
/* 按钮 */
.ivu-btn {
  height: 30px;
  line-height: 16px !important;
}

/* slide和switch样式 */

/* 日期选择器 */
/*.ivu-date-picker .ivu-select-dropdown {*/
/*    left: 0 !important;*/
/*}*/

.clearfix:after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}

.clearfix {
  zoom: 1;
}

.ui-empty {
  padding: 20px;
  color: #999;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}

.w {
  width: 1200px;
  min-width: 1200px;
  margin: 0 auto;
}

body {
  // background-color: @background-color;
}

.ivu-table table {
  width: 100% !important;
}
</style>
