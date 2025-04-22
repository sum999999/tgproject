<template>
  <div class="buy-lottery buy-hall" ref="buyLottery">
    <lottery-head></lottery-head>
    <div class="lottery-body">
      <Spin
        size="large"
        v-if="!lotteryTypeList.length"
        fix
        class="first-spin"
      ></Spin>
      <!-- count-down获取倒计时组件以及info的数据 只用到getTimePerido方法获取数据-->
      <!-- <count-down :id="currentList.lotteryId" @on-change="getTimePerido" style="display:none"></count-down> -->
      <lottery-info
        :data="currentList"
        v-if="currentList.lotteryId"
        :routeName="$route.name"
        :code="view"
        @has-get-result="hasGetResult"
      ></lottery-info>
      <div class="warp">
        <div class="list lf">
          <div v-if="lotteryTypeList.length">
            <h5><i class="i-icon i-lottery"></i>{{ $tex("购彩大厅") }}</h5>
            <ul>
              <li
                v-for="(item, idx) in lotteryTypeList"
                :key="idx"
                :class="{ active: lotteryType === item.lotteryType }"
              >
                <div class="counst" @click="setlotteryType(item, idx)">
                  <i class=""
                    ><img :src="item.icon || '/static/images/hot.png'"
                  /></i>
                  <span>{{ item.lotteryTypeName }}</span>
                  <Icon
                    type="ios-arrow-down"
                    v-show="lotteryType === item.lotteryType"
                  ></Icon>
                  <Icon
                    type="ios-arrow-right"
                    v-show="lotteryType !== item.lotteryType"
                  ></Icon>
                </div>
                <div class="child nice-scroll">
                  <p v-for="value in item.lotteryList" :key="value.lotteryId">
                    <Button
                      type="default"
                      v-preventReClick="2000"
                      :disabled="value.status === '0'"
                      :class="{
                        active:
                          value.lotteryId === currentList.lotteryId &&
                          value.status !== '0',
                        disabled: value.status === '0',
                      }"
                      @click="setLottery(value, null, true)"
                    >
                      <i
                        ><img
                          :src="value.lotteryIcon"
                          alt=""
                          :class="{ disabled: value.status === '0' }"/></i
                      >{{ value.lotteryName }}
                    </Button>
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="child-content rf">
          <allLottery
            :is="view"
            :menuHeight="menuHeight"
            :code="view"
            :betLimRate="betLimRate"
            ref="directChild"
          ></allLottery>
        </div>
        <div class="clr"></div>
      </div>
    </div>
    <!-- 登录弹框 -->
    <loginDlg
      :isShow="showLoginDialog"
      @close-login-modal="closeLoginModal"
    ></loginDlg>
    <!-- 登录弹框 -->
    <!-- 提示登录框 -->
    <modal
      :modalShow="isLogin"
      :title="$tex('投注提示')"
      :width="440"
      @btn-cancel="cancelLogin"
      @btn-ok="goLogin"
    >
      <div slot="content">
        {{ $tex("该操作需要登录，是否登录？") }}
      </div>
    </modal>
    <!-- 提示登录框结束 -->
    <!-- 投注成功提示框 -->
    <modal
      :modalShow="isSuccessModal"
      :width="416"
      :hasFooter="false"
      claName="period-modal"
      @btn-cancel="closeSuccessModal"
    >
      <div slot="content">
        <p class="title">{{ $tex("下注提示") }}</p>
        <div class="content">
          <Icon type="checkmark-circled"></Icon>
          <span>{{ $tex("下注成功") }}</span>
        </div>
      </div>
    </modal>
    <!-- 投注成功提示框结束 -->
    <!-- 极速六合彩进入页面的提示 -->
    <!-- <modal
      :modalShow="isMarkSix"
      :width="872"
      :hasHeader="false"
      :hasFooter="false"
      claName="buy-lottery-mark-six"
      @btn-cancel="isMarkSix = false;"
    >
      <div
        slot="content"
        class="inner"
      >
        <img style="z-index:1;cursor:pointer;"
          @click="goFastLiuHe"
          src="/static/images/buyLottery/jslhc.png"
          alt=""
        >
        <div @click="isMarkSix=false;" style="z-index:2"><img
            src="/static/images/buyLottery/quit.png"
            alt=""
          ></div>
      </div>
    </modal> -->
    <!-- 极速六合彩进入页面的提示 -->
    <modal
      v-show="!closeOwner"
      v-if="checkChineseKey()"
      :modalShow="isMarkSix"
      :width="872"
      :hasHeader="false"
      :hasFooter="false"
      claName="buy-lottery-mark-six"
      @btn-cancel="isMarkSix = false"
    >
      <div slot="content" class="inner">
        <img
          :src="lotteryIcon"
          alt=""
          style="z-index:2;"
          :class="{ active: fromHkToFastLiuhe }"
          @click="goFastLiuHe"
        />
        <div @click="isMarkSix = false">
          <img
            src="/static/images/buyLottery/quit.png"
            alt=""
            style="z-index:1;"
          />
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import lotteryInfo from "./lottery_info";
import lotteryHead from "./lottery_head";
import allLottery from "./child_modal/index";
import loginDlg from "@/components/login_dlg.vue";
import modal from "@/components/modal.vue";
import { queryLotteryList } from "@/api/lottery";
import { hasPermission } from "@/utils/authority-utils";
import { checkChineseKey } from "@/lang";

export default {
  name: "buyLottery",
  components: Object.assign(
    {},
    allLottery,
    { lotteryInfo: lotteryInfo },
    { lotteryHead: lotteryHead },
    { loginDlg: loginDlg },
    { modal: modal }
  ),
  data() {
    return {
      view: "",
      lotteryTypeList: [],
      lotteryType: "",
      currentList: {},
      // lotteryName:'' , //彩票名称
      // height:0,     //左侧菜单高度
      menuHeight: 0,
      menuIndex: 0, //点击的菜单索引
      resultFlag: true,
      betLimRate: 10,
      isMarkSix: false,
      fromHkToFastLiuhe: false, //是否从香港六合跳到极速六合彩
      isUserClick: false,
      lotteryTypeRecords: [],
      lotteryIcon: "/static/images/buyLottery/jslhc.png",
    };
  },
  watch: {
    $route: {
      immediate: false,
      handler(to, from) {
        let id = to.params && to.params.id;
        if (
          !this.$configText.closeMarkSix &&
          hasPermission("buyLottery.markSix")
        ) {
          if (!this.$configText.FromHkLiuheToFastLiuhe) {
            if (id === "20") {
              this.isMarkSix = true;
            } else {
              this.isMarkSix && (this.isMarkSix = false);
            }
          } else {
            if (id === "17") {
              this.isMarkSix = true;
            } else {
              this.isMarkSix && (this.isMarkSix = false);
            }
          }
        }
        if (this.isUserClick) {
          this.isUserClick = false;
        } else {
          const orderInfo = this.$route.params.order;
          let filterArr = this.lotteryTypeList.filter((item) => {
            // 获取当前彩种
            return item.lotteryList.some((value) => id === value.lotteryId);
          });
          let item = filterArr[0].lotteryList.filter(
            (item) => id === item.lotteryId
          )[0];
          let lotteryType = this.lotteryTypeRecords[
            this.lotteryTypeRecords.length - 2
          ];
          if (lotteryType) {
            this.lotteryTypeRecords.splice(-2, 1);
          } else {
            lotteryType = filterArr[0].lotteryType;
          }
          this.lotteryType = lotteryType;
          this.setLottery(item, orderInfo);
          this.menuHeight =
            this.lotteryTypeList.length * 50 +
            this.lotteryTypeList[0].lotteryList.length * 40 +
            50;
        }
      },
    },
    view: {
      deep: true,
      immediate: true,
      handler(value) {
        if (!value) {
          return;
        }
        for (const item of this.lotteryTypeList) {
          if (value === item.code) {
            this.$store.commit(
              "SET_LOTTERY_BUY_LOTTERY_TYPE",
              `${item.lotteryType}`
            );
            // console.log("view", item.lotteryType, item, this.view);
            break;
          }
        }
      },
    },
  },
  computed: {
    closeOwner() {
      const owner = ["by327", "by330"].includes(
        this.$store.getters.sysPlatformFlag
      );
      return owner;
    },
    showLoginDialog() {
      return this.$store.state.showLoginDialog;
    },
    isLogin() {
      return this.$store.state.isLogin;
    },
    isSuccessModal() {
      return this.$store.state.isSuccessModal;
    },
  },
  methods: {
    checkChineseKey,
    goFastLiuHe() {
      //去极速六合彩
      if (!this.fromHkToFastLiuhe) {
        return;
      }
      let currentList = this.lotteryTypeList
        .filter((item) => item.code === "6hc")[0]
        .lotteryList.filter((item) => item.lotteryId === "20")[0];
      this.setLottery(currentList);
    },
    hasGetResult() {
      //通知可以请求数据了
      this.resultFlag = true;
    },
    closeSuccessModal() {
      this.$store.commit("getSuccessModal", false);
    },
    cancelLogin() {
      //取消登录提示框
      this.$store.commit("getShouldLogin", false);
    },
    closeLoginModal(result) {
      //登录框
      this.$store.commit("getShowLoginDialog", false);
      result && this.$refs["directChild"].reInit(); //刷新数据
    },
    goLogin() {
      //登录提示框
      this.$store.commit("getShouldLogin", false);
      this.$store.commit("getShowLoginDialog", true);
    },
    setlotteryType(item, idx = 0) {
      this.menuIndex = idx;
      if (this.lotteryType !== item.lotteryType) {
        this.lotteryType = item.lotteryType;
      } else {
        this.lotteryType = 0;
      }
    },
    setLottery(item, order, isUserClick) {
      // debugger;
      if (!this.resultFlag || this.currentList === item) {
        //阻止重复点击
        return;
      }
      this.isUserClick = isUserClick;
      if (isUserClick) {
        this.lotteryTypeRecords.push(this.lotteryType);
      }
      let id = item.lotteryId;
      let menuChildHeight =
        this.lotteryTypeList[this.menuIndex].lotteryList.length * 40;
      menuChildHeight = menuChildHeight > 350 ? 350 : menuChildHeight;
      this.menuHeight = this.lotteryTypeList.length * 50 + menuChildHeight + 50;
      // this.$store.commit('getLottery', item.code);
      this.$router.push({
        name: "buyLottery",
        params: { id: id, order: order },
      });
      this.currentList = item;
      this.view = item.code;
      // debugger;
      this.resultFlag = false;
      // }, 800);
    },
  },
  mounted() {
    if (this.$refs.buyLottery) {
      this.$refs.buyLottery.style.minHeight = window.innerHeight + "px";
      let wrap = this.$refs.buyLottery;
      let scrollTop = wrap.scrollTop;
      if (scrollTop === 0) {
        return;
      }
      let timer = setInterval(() => {
        wrap.scrollTop -= 30;
        if (wrap.scrollTop <= 0) {
          clearInterval(timer);
        }
      }, 10);
    }
    window.addEventListener("resize", () => {
      if (this.$refs.buyLottery) {
        this.$refs.buyLottery.style.minHeight = window.innerHeight + "px";
      }
    });
  },
  created() {
    let vm = this;
    let id = this.$route.params.id;
    // if (id === "17") this.isMarkSix = true;
    let fromHkToFastLiuhe = this.$configText.FromHkLiuheToFastLiuhe;
    if (fromHkToFastLiuhe && id === "17") {
      this.isMarkSix = true;
    } else if (!fromHkToFastLiuhe && id === "20") {
      this.isMarkSix = true;
    }
    this.fromHkToFastLiuhe = fromHkToFastLiuhe;
    let orderInfo = this.$route.params.order;
    queryLotteryList({ lotteryType: null }).then((response) => {
      if (response.data.code !== 0) return;
      vm.lotteryTypeList = response.data.data.lotteryTypeList;
      let filterArr = vm.lotteryTypeList.filter((item) => {
        // 获取当前彩种
        return item.lotteryList.some((value) => id === value.lotteryId);
      });
      let item = filterArr[0].lotteryList.filter(
        (item) => id === item.lotteryId
      )[0];
      vm.setlotteryType(filterArr[0]);
      this.setLottery(item, orderInfo);
      vm.menuHeight =
        vm.lotteryTypeList.length * 50 +
        vm.lotteryTypeList[0].lotteryList.length * 40 +
        50;
    });
    this.$store.dispatch("querySystemConfig").then((systemConfig) => {
      //获取投注限制的成数
      this.betLimRate = +systemConfig.BET_TOTAL_NOTE_LIMIT;
      if (systemConfig.LOTTERY_ICON) {
        this.lotteryIcon = systemConfig.LOTTERY_ICON;
      }
    });
  },
};
</script>

<style lang="less" scoped>
.buy-lottery {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  /*  background: linear-gradient(
    80deg,
    rgba(172, 96, 98, 0.8),
    @buy-lottery-gradient-bg-one,
    @buy-lottery-gradient-bg-two
  ); */
  padding-bottom: 20px;
}
.buy-lottery .lottery-body {
  width: 1360px;
  margin: 0 auto;
  box-shadow: 0px 0px 10px rgba(51, 51, 51, 0.7);
}
/* 加载中 */
.shared .ivu-spin-large {
  position: absolute;
  width: 1150px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform-origin: 50% 50%;
}
.buy-lottery .ivu-spin-large.first-spin {
  position: fixed;
  left: 50%;
  top: 50%;
  margin-top: 50px;
  transform: translate(-50%, -50%);
  -webkit-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform-origin: 50% 50%;
}
.buy-lottery .child-content {
  position: relative;
  width: 1200px;
}
.buy-lottery .warp {
  position: relative;
  box-shadow: 0 -2px 18px rgba(0, 0, 0, 0.24);
  background: #fff;
}
.buy-lottery .list {
  width: 160px;
}
.buy-lottery .list h5 {
  line-height: 44px;
  height: 44px;
  color: #fff;
  font-size: 16px;
  position: relative;
  padding-left: 35px;
}
.buy-lottery .list h5 i {
  position: absolute;
  top: 11px;
  left: 5px;
}
.buy-lottery .list ul {
  /*   border: 1px solid @buy-lottery-list-border-color; */
  border-left: 0;
  border-bottom: 0;
  box-shadow: 0px -8px 8px rgba(0, 0, 0, 0.2);
}
.buy-lottery .list li {
  line-height: 50px;
  font-size: 14px;
  max-height: 50px;
  transition: max-height ease-in 0.4s;
  color: #373434;
  overflow: hidden;
  cursor: pointer;
  /*   border-bottom: 1px solid @buy-lottery-list-border-color;
  background: @buy-lottery-list-bg; */
}
.buy-lottery .list li.active {
  max-height: none;
}
.buy-lottery .list li.active .counst {
  /*  color: @primary-color; */
}
.buy-lottery .list li .counst {
  position: relative;
  padding-left: 50px;
}
.buy-lottery .list li .counst i {
  width: 22px;
  display: block;
  position: absolute;
  top: 14px;
  left: 10px;
}
.buy-lottery .list li .counst i.ivu-icon {
  right: 10px;
  top: 0;
  left: inherit;
  height: 100%;
  width: auto;
  font-size: 20px;
  line-height: 50px;
  transition: all 1s;
}
.buy-lottery .list li .child {
  line-height: 40px;
  font-size: 14px;
  background: #fff;
  max-height: 350px;
  overflow: auto;
}
.buy-lottery .list li .child p {
  position: relative;
  /*height: 42px;*/
}

.buy-lottery .list li .child .ivu-btn {
  color: #333;
  display: block;
  height: 100%;
  width: 100%;
  padding-right: 10px;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 10px;
  text-align: left;
  border-radius: 0;
  white-space: normal;
  word-break: break-all;
}
.buy-lottery .list li .child .ivu-btn:hover,
.buy-lottery .list li .child .ivu-btn.active {
  box-shadow: none;
  box-shadow: none;
  -webkit-box-shadow: none;
  -ms-box-shadow: none;
  -moz-box-shadow: none;
  -o-box-shadow: none;
}
.buy-lottery .list li .child .ivu-btn.disabled {
  /*  color: @btn-disabled-color;
  background: @btn-disabled-bg; */
  border-color: transparent;
}
</style>
<style scoped>
.buy-lottery .list li .child p >>> .ivu-btn i img {
  width: 25px;
  height: 25px;
  margin-right: 17px;
}
.buy-lottery .list li .child p >>> .ivu-btn i .disabled {
  filter: gray;
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
}
.buy-lottery .list li .child p >>> .ivu-btn {
  transition: padding-left 0.2s linear, background-color 0.2s linear,
    color 0.2s linear, border 0.2s linear;
  -webkit-transition: padding-left 0.2s linear, background-color 0.2s linear,
    color 0.2s linear, border 0.2s linear;
  -moz-transition: padding-left 0.2s linear, background-color 0.2s linear,
    color 0.2s linear, border 0.2s linear;
  -ms-transition: padding-left 0.2s linear, background-color 0.2s linear,
    color 0.2s linear, border 0.2s linear;
  -o-transition: padding-left 0.2s linear, background-color 0.2s linear,
    color 0.2s linear, border 0.2s linear;
}
.buy-lottery .list li .child p >>> .ivu-btn:hover {
  padding-left: 18px;
}
.buy-lottery .list li .child p >>> .ivu-btn span {
  /*line-height: 26px;*/
  display: flex;
  align-items: center;
}
/* 期数提示弹框 */
.v-transfer-dom >>> .period-modal .ivu-modal-header {
  height: 0;
  padding: 0;
}
.v-transfer-dom >>> .period-modal .ivu-modal-header span {
  display: none;
}
.v-transfer-dom >>> .period-modal .ivu-modal-content {
  border: none;
  height: 150px;
  border-radius: 6px;
}
.v-transfer-dom >>> .period-modal .title {
  font-weight: bold;
}
.v-transfer-dom >>> .period-modal .content {
  position: relative;
  padding: 22px 0 0 48px;
  margin-top: 6px;
  font-size: 12px;
}
.v-transfer-dom >>> .period-modal .content i {
  position: absolute;
  left: 0;
  top: 10px;
  color: #19be6b;
  font-size: 36px;
}
.v-transfer-dom >>> .period-modal .content .period-no {
  /*   color: #be1204; */
  font-size: 20px;
}
/* 极速六合彩的弹框 */
.v-transfer-dom >>> .buy-lottery-mark-six .ivu-modal-content {
  background-color: transparent;
  border: none;
}
.v-transfer-dom >>> .buy-lottery-mark-six img {
  float: inherit;
}
.v-transfer-dom >>> .buy-lottery-mark-six .inner {
  position: relative;
}
.v-transfer-dom >>> .buy-lottery-mark-six .inner img.active {
  cursor: pointer;
}
.v-transfer-dom >>> .buy-lottery-mark-six .inner > div {
  position: absolute;
  right: 32px;
  top: 38px;
  cursor: pointer;
}
</style>
