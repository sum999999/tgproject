<template>

  <div
    class="nice-scroll"
    id="planMains1"
    v-loading="pageLoading"
  >

    <div
      class="tab-menu"
    >
      <div class="plan-header">
        <i
          @click="downRefresh"
          class="ivu-icon ivu-icon-refresh"
        ></i>
        <span>
          <i
            @click="showPlay()"
            class="iconfont icon-warn"
          ></i>
          <div
            class="tg-lottery"
            :class="{active: isShowLotteryTab}"
            @click.stop="onTabLotteryClick()"
          >
            {{currentLottery.lotteryName || $tex('暂无')}}
            <i class="iconfont icon-biaotou-daoxu"></i>
          </div>
        </span>
        <span
          class="balance"
          slot="h-right"
        >
          <span @click.stop="onTabPlanClick">
            {{$tex("切换计划")}}
            <i class="iconfont icon-arrowDown"></i>
          </span>
          <div
            class="child"
            v-click-out-slide="handlePlanClickOut"
            v-if="isShowPlanTab"
          >
            <ul>
              <li
                v-for="item in allPlan"
                :key="item.lotteryBetplanId"
                :class="{active: item.lotteryBetplanId == currentPlan.lotteryBetplanId}"
                @click="onTabPlanItemClick(item)"
              >{{item.betplanName}}</li>
            </ul>
          </div>
        </span>
      </div>
      <!-- <my-header id="tab-header">
                <div slot="h-left"
                     @click="exitBuy()">
                    <i class="iconfont icon-arrowLeft"
                       style="color: #fff; font-size:26px"></i>

                </div>
                <div slot="h-center"
                     class="tab-title">
                    <i @click="showPlay()"
                       class="iconfont icon-warn"></i>
                    <div class="tg-lottery"
                         :class="{active: isShowLotteryTab}"
                         @click="onTabLotteryClick()">
                        {{currentLottery.lotteryName || '无'}}
                        <i class="iconfont icon-biaotou-daoxu"></i>
                    </div>
                </div>
                <div slot="h-right"
                     class="tab-right">
                    <span @click="onTabPlanClick()"
                          :class="{active: isShowPlanTab}">
                        {{tabName}}
                        <i class="iconfont icon-arrowDown"></i>
                    </span>
                    <ul class="tg-plan-menu"
                        v-click-out-slide="handlePlanClickOut"
                        v-if="isShowPlanTab">
                        <li @click="onTabPlanItemClick(item)"
                            v-for="item in allPlan"
                            :key="item.lotteryBetplanId"
                            :class="{active: item.lotteryBetplanId == currentPlan.lotteryBetplanId}">{{item.betplanName}}</li>
                    </ul>
                </div>
            </my-header> -->
      <div
        class="tab-list"
        v-click-out-slide="handleLotteryClickOut"
        v-if="isShowLotteryTab"
      >
        <div class="common-tab">
          <ul class="pcdd-tab">
            <li
              v-for="item in allLotteryList"
              :key="item.lotteryId"
              :class="{active: currentLottery.lotteryId === item.lotteryId}"
              @click.stop="switchLottery(item)"
            >
              <span>{{item.lotteryName}}</span>
            </li>
          </ul>
          <div class="clr"></div>
        </div>
      </div>
      <div
        class="mask"
        @click="onTabLotteryMaskClick"
        v-show="isShowLotteryTab"
      ></div>
      <table>
        <tr class="header">
          <th>{{$tex("期号")}}</th>
          <th>{{$tex("号码")}}</th>
          <th>{{`${currentPlan.betplanName||''}${$tex("购彩计划")}` || $tex("购彩计划")}}</th>
          <th>{{$tex("当前成本")}}</th>
          <th>{{$tex("累计成本")}}</th>
          <th>{{$tex("盈利")}}/{{$tex("亏损")}}</th>
          <th>{{$tex("开奖时间")}}</th>
        </tr>
        <tr
          class="item"
          v-for="item in allPlanList"
          :key="item.lotteryBetplanBodyId"
        >
          <td>{{item.periodNo}}</td>
          <td>
            <template v-if="item.lotteryNumber">
              <span
                class="circle"
                :class="{active: unNumGroup(item.betplanNumber).indexOf(item.lotteryNumber) != -1}"
              >
                {{item.lotteryNumber}}
                <span class="zhong">{{$tex("贏")}}</span>
              </span>
            </template>
            <template v-else>
              <span class="unopen">{{$tex("待开")}}</span>
            </template>
          </td>
          <td>
            <template v-if="isNumGroup(item.betplanNumber)">
              <span
                class="circle"
                :class="{active: it == item.lotteryNumber}"
                v-for="(it, index) in unNumGroup(item.betplanNumber)"
                :key="index"
              >{{it}}<span class="zhong">{{$tex("贏")}}</span></span>
            </template>
            <template v-else>
              <span
                class="circle"
                :class="{active: item.betplanNumber == item.lotteryNumber}"
              >
                {{item.betplanNumber}}
                <span class="zhong">{{$tex("贏")}}</span>
              </span>
            </template>
          </td>
          <td>{{item.currentCost}}</td>
          <td>{{item.totalCost}}</td>
          <td>
            <span :class="{active: item.winLost > 0,'win-color': item.winLost != 0}">{{item.winLost}}</span>
          </td>
          <td>{{item.lotteryTimeTs | convert2LocalDateTime('HH:mm:ss')}}</td>
        </tr>
      </table>
    </div>
    <!-- <ConfirmFree :modalShow="true"></ConfirmFree> -->
    <div
      class="dialog-wrap"
      @touchmove.prevent="()=>{}"
      @click="onplayDialogClick"
      v-if="showPlayDialog"
    >
      <div
        class="play-dialog"
        @click.stop="()=>{}"
      >
        <div class="play-dialog-layout">
          <div class="play-dialog-header">
            <span>{{$tex("帮助说明")}}</span>
            <span
              class="ivu-icon ivu-icon-close-round"
              @click="closePlayDialog"
            ></span>
          </div>
          <div class="play-dialog-content nice-scroll">
            <div v-html="currentPlan.planDesc">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ConfirmFree from "@/components/modal";
export default {
  name: "plan2Version",
  components: { ConfirmFree },
  data() {
    return {
      pageLoading: false,
      isShowPlanTab: false,
      isShowLotteryTab: false,
      currentLottery: {},
      currentPlan: {},
      tabName: this.$tex("切换计划"),
      showPlayDialog: false,
      showMask: false,
      allLotteryList: [], // 切换彩种
      allPlan: [],
      allPlanList: []
    };
  },
  created() {
    this.pageLoading = true;
    this.handleBetplanLotterys()
      .then(() => {
        return this.handleBetplans();
      })
      .then(() => {
        return this.handleBetplanBodys();
      })
      .then(() => {
        this.pageLoading = false;
      });
  },
  methods: {
    downRefresh() {
      return new Promise((resolve, reject) => {
        this.pageLoading = true;
        return this.handleBetplanBodys().then(() => {
          this.pageLoading = false;
          resolve();
        });
      });
    },
    isNumGroup(val) {
      return `${val}`.split(" ").length > 1;
    },
    unNumGroup(val) {
      return `${val}`.split(" ");
    },
    handleBetplanLotterys() {
      return this.queryBetplanLotterys().then(data => {
        this.allLotteryList = data;
        this.currentLottery = this.allLotteryList[0];
      });
    },
    queryBetplanLotterys() {
      return new Promise((resolve, reject) => {
        this.$http
          .post("/api/v2/plan/queryBetplanLotterys", {}, { unenc: true })
          .then(response => {
            if (response.data.code !== 0) {
              return reject();
            }
            const { data } = response.data;
            resolve(data);
          });
      });
    },
    handleBetplans() {
      return this.queryBetplans().then(data => {
        this.allPlan = data;
        this.currentPlan = data[0];
      });
    },
    queryBetplans() {
      return new Promise((resolve, reject) => {
        this.$http
          .post(
            "/api/v2/plan/queryBetplans",
            { lotteryId: this.currentLottery.lotteryId },
            { unenc: true }
          )
          .then(response => {
            if (response.data.code !== 0) {
              return reject();
            }
            const { data } = response.data;
            resolve(data);
          });
      });
    },
    handleBetplanBodys() {
      return this.queryBetplanBodys().then(data => {
        this.allPlanList = data;
      });
    },
    queryBetplanBodys() {
      return new Promise((resolve, reject) => {
        this.$http
          .post(
            "/api/v2/plan/queryBetplanBodys",
            {
              lotteryId: this.currentLottery.lotteryId,
              lotteryBetplanId: this.currentPlan.lotteryBetplanId
            },
            { unenc: true }
          )
          .then(response => {
            if (response.data.code !== 0) {
              return reject();
            }
            const { data } = response.data;
            resolve(data);
          });
      });
    },
    handleLotteryClickOut() {
      this.isShowLotteryTab = false;
    },
    handlePlanClickOut() {
      this.isShowPlanTab = false;
    },
    exitBuy() {
      this.$router.back();
    },
    onTabPlanItemClick(item) {
      this.currentPlan = item;
      this.pageLoading = true;
      this.handleBetplanBodys().then(() => {
        this.pageLoading = false;
      });
      this.isShowPlanTab = !this.isShowPlanTab;
    },
    onTabPlanClick() {
      this.isShowPlanTab = !this.isShowPlanTab;
    },
    onTabLotteryClick(item) {
      this.isShowLotteryTab = !this.isShowLotteryTab;
    },
    onTabLotteryMaskClick() {
      this.isShowLotteryTab = false;
    },
    showPlay() {
      this.showPlayDialog = true;
    },
    onplayDialogClick() {
      this.closePlayDialog();
    },
    closePlayDialog() {
      this.showPlayDialog = false;
    },
    switchLottery(lotteryItem) {
      this.currentLottery = lotteryItem;
      this.pageLoading = true;
      this.handleBetplans()
        .then(() => {
          return this.handleBetplanBodys();
        })
        .then(() => {
          this.pageLoading = false;
        });
      this.isShowLotteryTab = false;
    }
  }
};
</script>
<style scoped lang="less">
@vw: 6.4vw;
@px: 1.8px;
@deep: ~">>>";
.icon-warn,
.tg-lottery {
  cursor: pointer;
}
#planMains1 {
  height: 100%;
  overflow: auto;
  @{deep} .lee-globaloading .load-3 {
    top: 250px;
  }
}
.tg-plan-menu {
  position: relative;
  padding: 0 14 / @px;
  border: 1px solid #bfbfbf;
  color: #000;
  line-height: 86 / @px;
  background-color: #fff;
  border-radius: 8 / @px;
  top: -14 / @px;
  font-size: 26 / @px;
  li {
    border-bottom: 1px solid #c2c2c2;
  }
  > li:nth-last-of-type(1) {
    border-bottom: none;
  }
  li.active {
    color: #ff6f07;
  }
}
#tab-header @{deep} .head-right {
  left: auto !important;
}
.tab-right {
  i {
    transition: all 0.2s;
    display: inline-block;
  }
  > span.active i {
    transform: rotate(180deg);
  }
}
table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  // margin-bottom: 115 / @px;
  th {
    height: 92 / @px;
    font-weight: normal;
  }
  th:nth-child(3) {
    min-width: 130 / @px;
  }
  td {
    color: #3e3e3e;
  }
  th,
  td {
    border-right: 1px solid #e5e5e5;
    padding: 0 6 / @px;
  }
  td .circle:nth-child(1) {
    margin-left: 0 / @px;
  }
  .circle {
    margin-left: 6 / @px;
    .zhong {
      display: none;
    }
  }
  .circle.active {
    border-radius: 50%;
    border: 1px solid #ec0022;
    display: inline-block;
    width: 34 / @px;
    height: 34 / @px;
    position: relative;
  }
  .circle.active .zhong {
    position: absolute;
    right: -(15 / @px);
    top: -(18 / @px);
    font-size: 20 / @px;
    color: #ec0022;
    display: inline-block;
  }
  .win-color {
    color: #005dcc;
  }
  .win-color.active {
    color: #ec0022;
  }
  .unopen {
    color: #ec0022;
  }
  .header {
    background-color: #f0f0f0;
    font-size: 24 / @px;
    color: #000;
    > th:nth-child(1) {
      min-width: 94 / @px;
    }
    > th:nth-child(2) {
      min-width: 72 / @px;
    }
    > th:nth-child(3) {
      // min-width: 140 / @px;
    }
    > th:nth-last-child(1) {
      padding: 0 20 / @px;
    }
  }
  .item {
    border-bottom: 1px solid #e5e5e5;
    height: 62 / @px;
    font-size: 20 / @px;
  }
}
.plan-table {
  display: flex;
  text-align: center;
}
.plan-table-list {
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    height: 62 / @px;
    padding: 0 6 / @px;
    overflow: hidden;
    text-overflow: clip;
    font-size: 20 / @px;
    color: #3e3e3e;
  }
  div:nth-child(1) {
    background-color: #f0f0f0;
    height: 92 / @px;
    font-size: 24 / @px;
    border-bottom: none;
  }
  &.lottery-num {
    min-width: 94 / @px;
  }
  &.ball-num {
    // max-width: 15vw;
    min-width: 80 / @px;
  }
  &.win-plan {
    // width: 140 / @px;
  }
  &.time > div:nth-child(1) {
    padding: 0 20 / @px;
  }
}
.tab-menu {
  .tg-lottery {
    display: inline-block;
    width: auto;
    line-height: 0.8rem;
    padding: 6px 6px;
    border: 1px solid #fff;
    border-radius: 3px;
  }
  .tg-lottery i {
    transform: rotate(360deg);
    transition: all 0.2s;
    display: inline-block;
  }
  .tg-lottery.active i {
    transform: rotate(180deg);
  }
  .tab-list {
    position: absolute;
    width: 100%;
    left: 0;
    z-index: 301;
  }
  .mask {
    background: rgba(3, 3, 3, 0.31);
    position: absolute;
    bottom: 0;
    top: 0;
    width: 100%;
    z-index: 300;
  }
}
.tab-list .common-tab {
  float: left;
  width: 100%;
  min-height: 170px;
  max-height: 300px;
  overflow: auto;
  padding-bottom: 0.5rem;
  background: #fff;
  box-shadow: 0 1px 16px rgba(0, 0, 0, 0.11);
  font-size: 14px;
  li.active,
  dd.active {
    /*    color: #be1204;
        border-color: #be1204; */
  }
  ul {
    margin-right: 2%;
    width: 98%;
    display: flex;
    align-content: center;
    flex-wrap: wrap;
  }
  li {
    cursor: pointer;
    padding: 4px;
    width: 31.33%;
    margin-left: 2%;
    min-height: 1.5rem;
    border: 1px solid #eee;
    border-radius: 3px;
    margin-top: 0.3rem;
    text-align: center;
    display: table;
    color: #999;
  }
  li span {
    display: table-cell;
    vertical-align: middle;
  }

  dl {
    width: 98%;
    position: relative;
    display: flex;
    align-content: center;
    flex-wrap: wrap;
    margin-right: 2%;
  }
  dt {
    width: 23%;
    margin-left: 2%;
    text-align: center;
    line-height: 1.2rem;
    color: #000;
    margin-top: 0.3rem;
  }
  dd {
    width: 23%;
    margin-left: 2%;
    min-height: 1.2rem;
    border: 1px solid #eee;
    border-radius: 3px;
    text-align: center;
    display: table;
    color: #999;
    margin-top: 0.3rem;
  }
  dd.row-first {
    margin-left: 27%;
  }
  dd span {
    display: table-cell;
    vertical-align: middle;
  }
}
.dialog-wrap {
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(8, 9, 8, 0.5);
  position: absolute;
  z-index: 999;
}
.play-dialog {
  position: absolute;
  left: 18 / @px;
  right: 18 / @px;
  top: 50%;
  transform: translateY(-50%);
  display: inline;
}
.play-dialog-layout {
  overflow: hidden;
  border-radius: 6px;
}
.play-dialog-header {
  background-color: #323c4b;
  line-height: 84 / @px;
  padding-left: 22 / @px;
  padding-right: 22 / @px;
  color: #fff;
  font-size: 30 / @px;
  display: block;
  text-align: center;
  .ivu-icon {
    line-height: inherit;
    cursor: pointer;
  }
  .ivu-icon-close-round {
    float: right;
  }
}
.play-dialog-content {
  background-color: #fff;
  font-size: 30 / @px;
  color: #989899;
  padding: 44 / @px 22 / @px;
  max-height: 400px;
  overflow: auto;
  white-space: pre-wrap;
  line-height: 1.6;
  font-size: 16px;
  span {
    color: #000;
  }
}
.plan-header {
  height: 40px;
  line-height: 40px;
  color: #fff;
  position: relative;
  background-color: #323c4b;
  text-align: center;
  font-size: 18px;
}
.plan-header .ivu-icon-refresh {
  position: absolute;
  left: 10px;
  line-height: inherit;
  cursor: pointer;
}
.plan-header .balance {
  position: absolute;
  right: 10px;
  cursor: pointer;
}
.plan-header .child {
  position: absolute;
  background-color: #fff;
  text-align: center;
  border-radius: 7px;
  background-color: #f7f7f7;
  opacity: 1;
  right: 0;
  top: 42px;
  color: #666;
  width: 130px;
  /* border-bottom: 1px solid #c8c7cc; */
  z-index: 100;
}

.plan-header .child ul {
  max-height: 300px;
  overflow: auto;
  padding: 0 10px;
}

.plan-header .child li {
  border-bottom: 1px solid #c8c7cc;
  position: relative;
  font-size: 14px;
  &.active {
    color: #ec0022;
  }
}

.plan-header .child li:last-child {
  border-bottom: none;
}

.plan-header .child::before {
  position: absolute;
  top: -4px;
  left: 50%;
  width: 26px;
  height: 26px;
  margin-left: 13px;
  content: " ";
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  border-radius: 3px;
  background: #f7f7f7;
  z-index: 0;
}

.plan-header .more {
  position: absolute;
  top: 0;
  right: 10px;
}
.refresh .ivu-icon {
  cursor: pointer;
  color: #fff;
  font-size: 20px;
}
.refresh::before {
  content: "";
  position: fixed;
  width: 2px;
  height: 50px;
  background-color: #2d97ff;
  right: 44px;
  top: 105px;
}
.refresh {
  position: fixed;
  right: 30px;
  z-index: 100;
  top: 150px;
  background: radial-gradient(#138aff, #409fff, #84c3ff);
  border-radius: 100%;
  width: 30px;
  height: 30px;
  line-height: 34px;
  text-align: center;
  text-indent: 2px;
  opacity: 0.5;
}
.refresh:hover {
  opacity: 1;
}
</style>
