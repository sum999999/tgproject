<template>
  <div class="lobby-item">
    <div class="detal">
      <div class="info">
        <img
          :src="data.lotteryIcon"
          alt="logo"
          :class="{'disabled' : data.status === '0'}"
        >
        <div class="ct">
          <div class="lottery-name">{{data.lotteryName}}</div>
          <div class="issue-cd-stop" v-if="stopPeriod">
            {{$tex("已停期")}}
          </div>
          <div class="issue-cd" v-else>
            <div class="">{{this.$tex("第{num}期", { num: periodNo })}}</div>
            <div>{{timeTxt}}</div>
          </div>
        </div>
      </div>
      <div v-if="stopPeriod"></div>
      <div class="results" v-else>
        <span>{{$tex("上期开奖")}}</span>
        <div
          v-if="!hasBalls"
          class="zzkj"
        >{{$tex("正在开奖")}}...</div>
        <div
          class="sBall"
          v-if='hasBalls'
          v-for="(item, idx) in balls"
          :key="idx"
        >{{item}}</div>
        <!-- <div class="sBall">09</div>
                <div class="sBall">45</div>
                <div class="sBall">01</div>
                <div class="sBall">02</div>
                <div class="sBall">27</div>
                <div class="sBall">38</div> -->
      </div>
    </div>
    <div class="bottom">
      <router-link
        class="fun"
        :to="'/trendDetail/' + data.lotteryId +'?code='+data.code"
      >
        <Icon
          type="arrow-graph-up-right"
          :size="18"
          color="#f74d4d"
        ></Icon>
        &nbsp;&nbsp;
        <span>{{$tex("号码走势")}}</span>
      </router-link>
      <a v-if="isInternational" class="fun" href="javascript:void(0)" @click="jump2BuyLottery">
        <Icon
                type="ios-paper-outline"
                :size="18"
                color="#999"
        ></Icon>
        &nbsp;&nbsp;
        <span>{{$tex("玩法规则")}}</span>
      </a>
      <router-link
              v-else
        class="fun"
        :to="'/role/'+ data.lotteryId"
      >
        <Icon
          type="ios-paper-outline"
          :size="18"
          color="#999"
        ></Icon>
        &nbsp;&nbsp;
        <span>{{$tex("玩法规则")}}</span>
      </router-link>
      <!-- <router-link class="bet-btn" @click.native = "goBetting" :to="'/buyLottery/' + data.lotteryId">立即投注</router-link> -->
      <!-- <a class="bet-btn" @click.prevent = "goBetting()">立即投注</a> -->
      <Button
        type="primary"
        class="bet-btn"
        :class="[data.status === '0' ? 'disabled' : '']"
        @click="goBetting()"
        :disabled="data.status === '0'"
      >{{$tex("立即投注")}}</Button>
    </div>
  </div>
</template>

<script>
  import isArray from "lodash/isArray";
  import isEmpty from "lodash/isEmpty";
  import EventBus from "@/utils/eventBus";
  import { mapGetters } from "vuex";
  import countdown from "@/utils/countdown";

export default {
  props: {
    data: {
      type: Object
    },
    routeName: {
      type: String
    }
  },
  data() {
    return {
      totalRecordList: {},
      timer: null,
      surplusTime: 0,
      timeTxt: "00:00:00",
      balls: [],
      periodNo: "",
      downNum: 0,
      status: ""
    };
  },
  computed: {
    ...mapGetters(["isInternational", "user"]),
    isLogin() {
      return !!this.user.userId;
    },
    stopPeriod() {
      if (this.status === "2") {
        if (!this.periodNo) {
          return true;
        }
      }
      return false;
    },
    hasBalls() {
      if (isArray(this.balls) && this.balls.length) {
        return true;
      }
      return false;
    }
  },
  methods: {
    updatePrizeHistory(event) {
      let extra = event.target;
      if (typeof extra === 'string') {
        extra = JSON.parse(extra);
      }
      let result = extra;
      if (this.data.lotteryId === result.lotteryId) {
        this.balls = this.getBalls(result.lotteryNumber);
      }
    },
    goBetting() {
      // let user = localStorage.getItem('user');
      // if(!user) {
      //     sessionStorage.setItem('path',`buyLottery&${this.data.lotteryId}`);
      // }
      this.$router.push({
        name: "buyLottery",
        params: { id: `${this.data.lotteryId}` }
      });
    },
    getData() {
      let vm = this;
      if (vm.routeName !== this.$route.name) {
        if (vm.timer) {
          clearInterval(vm.timer);
          return;
        }
      }
      vm.$http
        .post(
          "/api/v2/lottery/queryLotteryRecordList",
          { lotteryId: this.data.lotteryId, num: 1 },
          { unenc: true }
        )
        .then(response => {
          if (response.data.code !== 0) {
            vm.getData();
            return;
          }
          let info = response.data;
          vm.totalRecordList = info.data.recordList[0];
          if(!vm.totalRecordList) {
            return;
          }
          vm.periodNo = vm.totalRecordList.periodNo;
          vm.downNum = 0;
          vm.getBalls(vm.totalRecordList.preLotteryNumber);
          if (vm.totalRecordList) {
            if (vm.timer) clearInterval(vm.timer);
            vm.setFirstTime();
          }
        });
      // .catch(response => {
      //     setTimeout(vm.getData,3000);
      // })
    },
    setFirstTime() {
      if (this.stopPeriod) {
        return;
      }
      let vm = this;
      let startTime = vm.totalRecordList.sysDate;
      vm.surplusTime = vm.totalRecordList.endTime - startTime;
      const avgTime = vm.surplusTime / 2;
      let avgGetDataFlag = false;
      // 得到计算结果
      this.countDown();
      this.timer = countdown(vm.surplusTime / 1000, (s, ms) => {
        vm.surplusTime = ms;
        vm.downNum++;
        vm.countDown();
        if (!vm.isLogin && !avgGetDataFlag && (ms < avgTime) && (!vm.balls || !vm.balls.length)) {
          avgGetDataFlag = true;
          vm.getData();
        }
        if (
                s === 0 ||
                (parseInt(vm.data.lotteryId) === 17 && vm.downNum >= 3600)
        ) {
          clearInterval(vm.timer);
          vm.timeTxt = `${vm.$tex("开奖中")}...`;
          vm.getData();
        }
      });
    },
    //  倒计时结束
    countDown() {
      let vm = this;
      let obj = {};
      let days = Math.floor(vm.surplusTime / (24 * 3600 * 1000));
      //计算出小时数
      let leave1 = vm.surplusTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
      obj.hours = Math.floor(leave1 / (3600 * 1000)) + days * 24;
      //计算相差分钟数
      let leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
      obj.minutes = Math.floor(leave2 / (60 * 1000));
      //计算相差秒数
      let leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
      obj.seconds = Math.round(leave3 / 1000);

      ["hours", "minutes", "seconds"].forEach(item => {
        if (obj[item] < 10) obj[item] = "0" + obj[item];
      });
      this.timeTxt = obj.hours + ":" + obj.minutes + ":" + obj.seconds;
    },
    getBalls(ball) {
      if (!ball) {
        return this.balls = [];
      }
      ball = ball.split(",");
      if (this.data.code === "6hc") {
        let pop = ball.pop();
        let arr = pop.split("+");
        ball = ball.concat(arr);
      }
      return this.balls = ball;
    },
    jump2BuyLottery() {
      this.$store.commit("SET_LOTTERY_BUY_LOTTERY_SHOW_PLAY_RULE", true);
      this.goBetting();
    }
  },
  created() {
    this.totalRecordList = Object.assign({}, this.data);
    this.totalRecordList.endTime = this.data.nextPrizeTime;
    this.periodNo = this.data.nextPeriodNo;
    this.status = this.data.status;
    this.getBalls(this.data.preLotteryNumber);
    this.setFirstTime();
    // this.getData()
  },
  mounted() {
    EventBus.addEventListener('updatePrizeHistory', this.updatePrizeHistory, this);
  },
  beforeDestroy() {
    EventBus.removeEventListener('updatePrizeHistory', this.updatePrizeHistory, this);
    if (this.timer) clearInterval(this.timer);
  }
};
</script>

<style lang="less" scoped>
.lobby-item {
  background-color: #222;
  width: 319px;
  height: 160px;
  border-color: #333;
  /*   border: 4px solid @lottery-item-border; */
  margin: 15px 5px 0px 5px;
  display: flex;
  flex-direction: column;
  flex-basis: 319px;
  flex-shrink: 0;
  transition: all 0.2s linear;
}
.lobby-item:hover {
  transform: scale(1.05);
  // box-shadow: 3px 4px 6px #c1c1c1;
}
.lobby-item .detal {
  height: 120px;
  display: flex;
  flex-direction: column;
  padding: 10px 10px 0px 10px;
}
.lobby-item .detal .info {
  display: flex;
  flex-direction: row;
}
.lobby-item .detal .info > img {
  width: 57px;
  height: 57px;
}
.lobby-item .detal .info > .disabled {
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: grayscale(100%);
  -webkit-filter: gray;
  filter: gray;
}
.lobby-item .detal .info .ct .issue-cd-stop {
  color: #ffffff;
}
.lobby-item .detal .info .ct {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding-left: 10px;
}
.lobby-item .detal .info .ct .lottery-name {
  flex: 1;
  font-size: 1.2rem;
  color: @textLightColor;
  font-weight: bold;
}
.lobby-item .detal .info > .disabled + .ct .lottery-name,
.lobby-item .detal .info > .disabled + .ct .issue-cd div:last-child {
  color: gray;
}
.lobby-item .detal .info .ct .issue-cd {
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-right: 10px;
}
.lobby-item .detal .info .ct .issue-cd div {
  font-size: 0.975rem;
  color: #fff;
}
.lobby-item .detal .results {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 39px;
  padding-left: 5px;
}
.lobby-item .detal .results .zzkj {
  font-size: 0.75rem;
  color: #999;
}

.lobby-item .detal .results span {
  display: inline-block;
  width: 63px;
  font-size: 0.75rem;
  color: #999;
  // padding-right: 7px;
  padding-right: 5px;
}
.lobby-item .detal .results .sBall {
  width: 18px;
  height: 18px;
  /*   background-color: @lotter-item-ball-bg; */
  border-radius: 50%;
  font-size: 0.75rem;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
}
.lobby-item .bottom {
  height: 40px;
  display: flex;
  flex-direction: row;
  border-top: 1px solid #333;
  overflow: hidden;
}
.lobby-item .bottom .fun {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  /*   background-color: @lottery-list-li-bg;
  border-top: 1px solid @lottery-item-border; */
  font-size: 12px;
  color: #999;
  background-color:@btnTxtColor;
  // border-top-color: #333;
  border: none;
  border-right: 1px solid #333;
}
.lobby-item .bottom .fun + .fun {
  /*   border-left: 1px solid @lottery-item-border; */
  border-left-color: #333;
  border-right: 1px solid #333;
}
.lobby-item .bottom .bet-btn {
  height: 100%;
  border-radius: 0;
  -webkit-border-radius: 0;
  -ms-border-radius: 0;
  -moz-border-radius: 0;
  -o-border-radius: 0;
  flex: 1;
  color: @btnTxtColor;
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: @textLightColor;
  border: none;
  // border-top: 1px solid #333;
  &:hover{
    opacity: .9;
  }
}
.lobby-item .bottom .bet-btn.disabled {
  color: #bbbec4;
  /*   background-color: @lottery-list-li-bg;
  border-color: @lottery-item-border; */
  border-bottom: none;
  border-right: none;
}
.lobby-item .bottom span:hover {
  /*   color: @primary-color; */
  color: @textLightColor;
}
.lobby-item .detal .results .wating-result {
  color: #666;
}
</style>
