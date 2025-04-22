<template>
  <div class="fast-betting lf">
    <ul class="detail-hot">
      <li
        class="color-hover"
        v-for="(item, idx) in quickList"
        @mouseenter="changeHotLettery(item)"
        :key="idx"
        :style="{ width: 100 / quickList.length + '%' }"
        :class="{ active: item.lotteryId === selectedId }"
      >
        <span>{{ item.lotteryName }}</span>
      </li>
    </ul>
    <div class="selected-lottery">
      <div class="lf">
        <img :src="currentQuick.lotteryIcon" />
        <!-- count-down获取倒计时组件 只用到getTimePerido方法获取的数据-->
        <!-- <count-down :id="selectedId" v-if="quickList.length" @on-change="getTimePerido" style="display:none"></count-down> -->
        <div class="txt">
          <h5>
            <span>{{ currentQuick.lotteryName }}&nbsp;&nbsp;</span>
            <span v-if="downTime.record.data"
              >第 <i>{{ downTime.record.data.recordList[0].periodNo }}</i
              >期</span
            >
          </h5>
          <!-- <p>{{downTime.hours}}时 {{downTime.minutes}}分 {{downTime.seconds}}秒后截止</p> -->
          <down-time
            :id="selectedId"
            v-if="quickList.length"
            :routeName="$route.name"
          ></down-time>
        </div>
      </div>
      <div class="rf">
        <div @click="goLottery" class="go">立即投注</div>
        <!-- <p>
          <span>
            <router-link
              :to="{
                name: 'trend_detail',
                params: { id: currentQuick.lotteryId },
                query: { code: currentQuick.code },
              }"
              v-if="currentQuick.lotteryId"
              >走势图</router-link
            >
          </span>
          <span class="interval">&nbsp;|&nbsp;</span>
          <span><router-link :to="''">手动自选</router-link></span>
        </p>
        <span class="change-one" @click="setQuick()">
          <i class="i-icon i-refresh"></i>换一注</span
        > -->
      </div>
    </div>
    <div class="clr"></div>
    <div class="award-number">
      <ul>
        <li v-for="(item, index) in currentQuick.lotteryNumber" :key="index">
          <i class="i-icon i-main-code"></i>
          <span>{{ item }}</span>
        </li>
      </ul>
    </div>
    <!-- <p class="jackpot">当前奖池：<span>{{prizeMoney}}</span>&nbsp;元</p> -->
    <!-- <div class="multiple">
      <div class="lf fill">
        <span
          class="btn sign"
          @click="setOdds(-1)"
        >¯</span>
        <input
          type="number"
          v-model="currentQuick.chaseNum"
          @blur="changeInput()"
          @input="changeMoney($event)"
        >
        <span
          class="btn plus"
          @click="setOdds(1)"
        >+</span>
      </div>
      <div class="txt lf">
        &nbsp;&nbsp;倍，共&nbsp;
        <span>{{totalOdds}}</span>&nbsp;元
      </div>
      <div class="input-wrapper rf">
        <Button
          type='primary'
          v-preventReClick="2000"
          @click="goLottery()"
          style='width:152px;height:40px;line-height:20px;font-size:18px;text-align:center;border:none;'
        >立即投注</Button>
      </div>
    </div> -->
    <!-- 登录弹框 -->
    <loginDlg
      :isShow="showLoginDialog"
      @close-login-modal="closeLoginModal"
    ></loginDlg>
    <!-- 登录弹框 -->
  </div>
</template>

<script>
import downTime from "./down_time.vue";
import loginDlg from "@/components/login_dlg.vue";
export default {
  data() {
    return {
      showLoginDialog: false,
      selectedId: "",
      quickList: [],
      currentQuick: {},
      downTime: {
        record: {},
        hours: "",
        minutes: "",
        seconds: "",
      },
      totalOdds: 2,
      totalPrizeMoney: 0, //奖金池
    };
  },
  computed: {
    prizeMoney() {
      return this.formatPrize();
    },
    user() {
      return this.$store.state.user;
    },
  },
  components: {
    downTime,
    loginDlg,
  },
  methods: {
    formatPrize() {
      let money = `${this.totalPrizeMoney.toFixed(0)}`.split("");
      let count = Math.floor(money.length / 3);
      let arr = [];
      for (let i = 0; i < count; i++) {
        let splitArr = money.splice(-3, 3);
        splitArr.unshift(",");
        arr.push(splitArr);
      }
      return money.concat(...arr).join("");
    },
    closeLoginModal(flag) {
      this.showLoginDialog = false;
      flag && this.goLottery();
    },
    // 下单
    goLottery() {
      // if (!localStorage.getItem('user')) {
      //    sessionStorage.setItem('path',`buyLottery&${this.currentQuick.lotteryId}&${JSON.stringify(this.currentQuick)}`);
      // }
      // debugger;
      if (!this.user.userId) {
        this.showLoginDialog = true;
        return;
      }
      this.$router.push({
        name: "buyLottery",
        params: { id: this.currentQuick.lotteryId, order: this.currentQuick },
      });
    },
    // 获取倒计时
    getTimePerido(obj) {
      let vm = this;
      for (let key in obj) {
        vm.$set(vm.downTime, key, obj[key]);
      }
    },
    // 切换彩种
    changeHotLettery(item) {
      let chaseNum = this.currentQuick.chaseNum || 1;
      this.totalPrizeMoney = 1000000 + Math.random() * 9000000;
      if (this.selectedId !== item.lotteryId) {
        this.selectedId = item.lotteryId;
        this.currentQuick = item;
        this.currentQuick.chaseNum = chaseNum;
        this.setQuick();
      }
    },
    setOdds(num) {
      let odds = this.currentQuick.chaseNum + num;
      if (odds <= 0) odds = 1;
      this.$set(this.currentQuick, "chaseNum", odds);
      this.totalOdds = odds * 2;
    },
    changeInput() {
      let num = parseInt(this.currentQuick.chaseNum) || 1;
      if (num > 10000) num = 10000;
      this.$set(this.currentQuick, "chaseNum", num);
    },
    changeMoney(e) {
      //添加
      let money = parseFloat(e.target.value);
      if (Number.isNaN(money) || money < 1) {
        money = 1;
        this.currentQuick.chaseNum = 1;
      } else if (money > 10000) {
        money = 10000;
        this.currentQuick.chaseNum = 10000;
      }
      this.totalOdds = money * 2;
    },
    // 获取随机数
    setQuick() {
      let chaseNum = this.currentQuick.chaseNum || 1;
      let random = require(`@/utils/random/${this.currentQuick.code}.js`);
      let layout = JSON.parse(this.currentQuick.layout);
      let balls = random[this.currentQuick.lotteryPlayId](layout.optballs);
      let arr = balls.split(",");
      if (balls.indexOf("|") > -1) {
        arr = balls.split("|");
      }
      arr = arr.filter((item) => item); // 去掉空的数组
      this.$set(this.currentQuick, "nums", arr);
      this.$set(this.currentQuick, "chaseNum", chaseNum);
      this.$set(this.currentQuick, "balls", balls);
    },
  },
  created() {
    //  获取热门彩种
    this.$http
      .post("/api/v2/lottery/queryIndexQuickBettingList", "", { unenc: true })
      .then((response) => {
        if (response.data.code !== 0) return;
        $(".fast-betting")[0].style.opacity = 1;
        this.quickList = response.data.data.quickBettingList
          .slice(0, 6)
          .map((item) => ({
            ...item,
            lotteryNumber: item.lotteryNumber.split(","),
          }));
        this.selectedId = this.quickList[0].lotteryId;
        this.currentQuick = this.quickList[0];
        this.setQuick();
      });
    this.totalPrizeMoney = 1000000 + Math.random() * 9000000;
  },
};
</script>

<style lang="less" scoped>
.fast-betting {
  opacity: 0;
  transition: 1.2s;
  height: 100%;
  /*  border: 1px solid @home-component-border; */
  // padding: 8px;
  width: 500px;
  & > div {
    padding: 0 15px;
  }
}
.fast-betting .detail-hot {
  height: 30px;
  line-height: 25px;
  text-align: center;
  font-size: 14px;
  /*   border-bottom: 1px solid @home-component-border; */
}
.fast-betting .detail-hot li {
  float: left;
  height: 100%;
  cursor: pointer;
}
.fast-betting .detail-hot li.active {
  /*   border-bottom: 2px solid @primary-color;
  color: @primary-color; */
}
.fast-betting .selected-lottery {
  margin-top: 15px;
}
.fast-betting .selected-lottery .lf {
  width: 300px;
}
.betting .selected-lottery .lf img {
  width: 64px;
  height: 64px;
  margin-right: 10px;
}
.fast-betting .selected-lottery .lf .txt h5 {
  color: #313131;
  font-size: 16px;
  font-weight: normal;
  margin-top: 10px;
  margin-bottom: 5px;
}
.fast-betting .selected-lottery .lf .txt h5 i {
  /*   color: @primary-color; */
}
.fast-betting .selected-lottery .rf {
  text-align: right;
  font-size: 12px;
  .go {
    flex-shrink: 0;
    display: inline-block;
    line-height: 30px;
    color: #fff;
    padding: 0 15px;
    border-radius: 3px;
    font-size: 14px;
    // margin-left: 20px;
    // margin-right: 20px;
    margin: 25px;
    cursor: pointer;
    background: #e4393c;
  }
}
.fast-betting .selected-lottery .rf p {
  height: 22px;
  margin-top: 12px;
}
.betting .selected-lottery .rf p span {
  /* float: left; */
  display: inline-block;
  /* margin-top:-5px; */
}
.fast-betting .selected-lottery .rf p span a {
  color: #666;
}
.fast-betting .selected-lottery .rf p span a:hover {
  /*  color: @primary-color; */
}
.fast-betting .selected-lottery .rf p span.interval {
  margin-top: 1px;
  color: #999;
}
.fast-betting .selected-lottery .rf .change-one:hover {
  /*   color: @primary-color; */
}
.fast-betting .selected-lottery .rf .change-one {
  cursor: pointer;
  float: right;
  color: #666;
}
.fast-betting .selected-lottery .rf .i-refresh {
  background-size: 500px;
  width: 20px;
  height: 18px;
  background-position: -216px -95px;
  float: left;
}
.fast-betting .award-number {
  height: 44px;
  // margin-top: 10px;
  margin-bottom: 54px;
}
.fast-betting .award-number li {
  float: left;
  width: 38px;
  height: 38px;
  position: relative;
  margin-right: 8px;
  line-height: 44px;
  text-align: center;
}
.fast-betting .award-number li span {
  position: absolute;
  left: 0;
  top: 0;
  color: #fff;
  display: block;
  width: 105%;
  height: 100%;
  font-size: 18px;
}
.fast-betting .jackpot {
  font-size: 12px;
  margin: 14px 0 23px 0;
  color: #666;
}
.fast-betting .jackpot span {
  // color: @primary-color;
}
.fast-betting .multiple {
  height: 32px;
  line-height: 32px;
  font-size: 16px;
}
.fast-betting .multiple .lf.fill {
  margin-top: 1px;
}
.fast-betting .multiple .fill .btn,
.multiple .fill input {
  float: left;
  height: 32px;
  outline: none;
  border-radius: 0;
  display: block;
}
.fast-betting .multiple .fill .btn {
  /*   color: @primary-color;
  border: 1px solid @primary-color; */
  padding: 0 10px;
  font-size: 26px;
  cursor: pointer;
  overflow: hidden;
  line-height: 26px;
}
.fast-betting .multiple .fill .sign {
  line-height: 50px;
}
.fast-betting .multiple input {
  width: 80px;
  border-left: 0;
  border-right: 0;
  /*   border-top: 1px solid @primary-color;
  border-bottom: 1px solid @primary-color;
    color: @primary-color; */
  padding-left: 5px;
  text-align: center;

  font-size: 14px;
}
.fast-betting .multiple .primary {
  outline: none;
  font-size: 14px;
  padding: 6px 30px;
  color: #f2f2f2;
}
.fast-betting .multiple .txt {
  margin-top: 1px;
  font-size: 14px;
}
.fast-betting .multiple .txt span {
  /*  color: @primary-color; */
}
</style>
