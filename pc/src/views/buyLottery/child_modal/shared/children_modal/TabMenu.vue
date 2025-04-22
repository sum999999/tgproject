<template>
  <div class="tab-menu">
    <div class="top-tab">
      <ul>
        <li
          v-for="item in tabList"
          :key="item.id"
          :style="{ width: 100 / tabList.length + '%' }"
          :class="{ active: item.lotteryPlayId === currentTabId }"
          @click="changeTab(item)"
        >
          <span>{{ item.playName }}</span>
        </li>
      </ul>
    </div>
    <div class="sub-tab">
      <ul>
        <li v-for="item in subList" :key="item.lotteryPlayId">
          <span class="title">{{ item.playName }}:</span>
          <div class="sub-tab-child">
            <label
              v-for="vv in item.lotteryPlayList"
              :key="vv.lotteryPlayId"
              :for="vv.lotteryPlayId"
            >
              <span
                class="lf"
                :class="{
                  active: vv.lotteryPlayId === currentSub.lotteryPlayId,
                }"
                @click="changeRadioValue(vv)"
                >{{ vv.playName }}</span
              >
            </label>
          </div>
        </li>
      </ul>
      <!-- 范例中奖说明 -->
      <div class="tip">
        <play-example
          :bettingExample="currentSub.bettingExample"
          :prizeDesc="currentSub.prizeDesc"
        ></play-example>
      </div>
      <!-- 范例中奖说明结束 -->
    </div>
    <!-- 玩法提示 -->
    <div class="play-tip">
      <play-tip :playDesc="currentSub.playDesc"></play-tip>
    </div>
    <!-- 玩法提示结束 -->
  </div>
</template>

<script>
import playTip from "../../common_vue/play_tip.vue";
import playExample from "../../common_vue/betting_example.vue";
export default {
  components: {
    playTip,
    playExample,
  },
  data() {
    return {
      tabList: [], // 一级玩法菜单
      currentTabId: "", // 当前选中的一级玩法
      subList: [], // 二级玩法菜单
      currentSub: {}, // 当前选中的二级玩法
    };
  },
  methods: {
    // 切换一级玩法
    changeTab(item) {
      if (this.currentTabId === item.lotteryPlayId) {
        return;
      }
      let info = item.lotteryPlayList[0].lotteryPlayList[0]; //di
      this.getData(info);
      this.currentTabId = item.lotteryPlayId;
      this.subList = item.lotteryPlayList;
      this.currentSub = item.lotteryPlayList;
    },
    // 切换二级玩法
    changeRadioValue(item) {
      if (this.currentSub.lotteryPlayId === item.lotteryPlayId) {
        return;
      }
      this.getData(item);
    },
    getData(item) {
      this.$http
        .post(
          "/api/v2/lottery/queryPlayLayoutByBettingId",
          {
            lotteryId: this.$route.params.id,
            lotteryPlayId: item.lotteryPlayId,
          },
          { unenc: true }
        )
        .then((response) => {
          if (response.data.code !== 0) return;
          this.currentSub = response.data.data; //数据里layout不为空
          this.$emit("get-currentLottery", this.currentSub);
        });
    },
    setCurrentSubDsc(lotteryPlayId) {
      this.$http
        .post(
          "/api/v2/lottery/queryPlayLayoutByBettingId",
          { lotteryId: this.$route.params.id, lotteryPlayId },
          { unenc: true }
        )
        .then((response) => {
          if (response.data.code !== 0) return;
          const { playDesc, prizeDesc, bettingExample } = response.data.data; //数据里layout不为空
          this.currentSub.playDesc = playDesc;
          this.currentSub.prizeDesc = prizeDesc;
          this.currentSub.bettingExample = bettingExample;
        });
    },
  },
  created() {
    this.tabList = this.$attrs.lotteryData.lotteryPlayList;
    let order = this.$route.params.order;
    let pidLen = this.tabList[0].lotteryPlayId.length;
    if (!this.tabList.length) return;
    if (order) {
      //首页快捷投注
      this.currentTabId = order.lotteryPlayId.slice(0, pidLen);
      this.tabList.forEach((item, index) => {
        item.lotteryPlayList.forEach((list, idx) => {
          list.lotteryPlayList.forEach((rs, ix) => {
            if (rs.lotteryPlayId === order.lotteryPlayId) {
              this.subList = this.tabList[index].lotteryPlayList; //定位胆
              this.currentSub = this.subList[idx].lotteryPlayList[ix];
              this.setCurrentSubDsc(this.currentSub.lotteryPlayId);
              this.currentSub.layout = order.layout;
              this.$emit("get-currentLottery", this.currentSub);
            }
          });
        });
      });
    } else {
      //购彩大厅进来
      this.currentTabId = this.$attrs.lotteryData.defaulPlay.lotteryPlayId.slice(
        0,
        pidLen
      );
      this.subList = this.tabList.filter(
        (item) => item.lotteryPlayId === this.currentTabId
      )[0].lotteryPlayList;
      for (let i = 0, len = this.subList.length; i < len; i++) {
        for (
          let j = 0, len2 = this.subList[i].lotteryPlayList.length;
          j < len2;
          j++
        ) {
          if (this.subList[i].lotteryPlayList[j].layout !== null) {
            this.currentSub = this.subList[i].lotteryPlayList[j];
            this.$emit("get-currentLottery", this.currentSub);
            break;
          }
        }
      }
    }
  },
};
</script>

<style lang="less" scoped>
.tab-menu .top-tab ul {
  height: 44px;
  line-height: 44px;
}
.tab-menu .top-tab ul li {
  float: left;
  color: #fff;
  text-align: center;
  cursor: pointer;
}
/* .tab-menu .top-tab ul li.active {
  background: @primary-color-hover;
} */
.tab-menu .sub-tab {
  border-bottom: 1px solid #d2d0d0;
  border-left: 0;
  padding: 5px 0;
  margin: 0 15px;
  position: relative;
}
.tab-menu .sub-tab li {
  height: 40px;
  line-height: 30px;
  padding: 5px 0;
  color: #5f5d5d;
}
.tab-menu .sub-tab li .title {
  display: inline-block;
  float: left;
  font-weight: 600;
}
.tab-menu .sub-tab li .sub-tab-child {
  display: inline-block;
  height: 30px;
  float: left;
}
.tab-menu .sub-tab li .sub-tab-child label {
  margin-left: 8px;
  display: block;
  height: 100%;
  float: left;
}
.tab-menu .sub-tab li .sub-tab-child label span {
  /*   border-bottom: 2px solid #fff; */
  display: inline-block;
  padding: 0 3px;
  cursor: pointer;
}
.tab-menu .sub-tab li .sub-tab-child label .active {
  /*  border-color: @primary-color; */
}
.tab-menu .sub-tab .tip {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
}
.tab-menu .play-tip {
  margin: 10px 0;
  padding-left: 15px;
  color: #5f5d5d;
}
</style>
