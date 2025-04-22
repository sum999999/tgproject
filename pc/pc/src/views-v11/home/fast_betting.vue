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
    <div class="award-number">
      <!--      <template v-if="currentQuick.nums && currentQuick.nums.length!=3"><ul><li v-for="item in currentQuick.nums" :key="item">{{ item }}</li></ul></template>-->
      <div style="flex-grow: 1;padding-left:10px;">
        <template v-if="currentQuick.nums && currentQuick.nums.length == 10">
          <ul>
            <li
              v-for="(item, index) in currentQuick.nums.slice(0, 5)"
              :key="index"
            >
              {{ item }}
            </li>
          </ul>
          <ul>
            <li
              v-for="(item, index) in currentQuick.nums.slice(5, 10)"
              :key="index"
            >
              {{ item }}
            </li>
          </ul>
        </template>
        <template
          v-else-if="currentQuick.nums && currentQuick.nums.length == 3"
        >
          <div class="dice ">
            <span :style="dice_style(currentQuick.nums[0])"></span><i>+</i>
            <span :style="dice_style(currentQuick.nums[1])"></span><i>+</i>
            <span :style="dice_style(currentQuick.nums[2])"></span>
            <i>=</i>
            <em>{{ sum() }}</em>
          </div>
        </template>
        <template v-else>
          <ul>
            <li v-for="(item, index) in currentQuick.nums" :key="index">
              {{ item }}
            </li>
          </ul>
        </template>
      </div>
      <div @click="golottery" class="go">立即投注</div>
    </div>
    <div class="ninfo">
      <div>
        当前期 : 第 <span>{{ currentQuick.periodNo }}</span> 期
      </div>
      <div>
        开奖号码 :
        <span v-for="(item, index) in currentQuick.nums" :key="index">{{
          item
        }}</span>
      </div>
      <div v-if="currentQuick.nums && currentQuick.nums.length == 3">
        和值 : <span>{{ sum() }}</span>
      </div>
      <div v-if="currentQuick.nums && currentQuick.nums.length == 3">
        形态 :
        <span v-if="sum() > 10" class="xingtai da">大</span>
        <span v-if="sum() < 11" class="xingtai xiao">小</span>
        <span v-if="sum() % 2 != 0" class="xingtai dan">单</span>
        <span v-if="sum() % 2 == 0" class="xingtai shuang">双</span>
      </div>
    </div>
    <loginDlg
      :isShow="showLoginDialog"
      @close-login-modal="closeLoginModal"
    ></loginDlg>
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
    golottery() {
      // console.log(this.currentQuick.lotteryId)
      this.$router.push({
        name: "buyLottery",
        params: { id: this.currentQuick.lotteryId },
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
      //let random = require(`@/utils/random/${this.currentQuick.code}.js`);
      //let layout = JSON.parse(this.currentQuick.layout);
      let balls = this.currentQuick.lotteryNumber; //random[this.currentQuick.lotteryPlayId](layout.optballs);
      balls = balls.replaceAll("+", ",");
      let arr = balls.split(",");
      if (balls.indexOf("|") > -1) {
        arr = balls.split("|");
      }
      arr = arr.filter((item) => item); // 去掉空的数组
      this.$set(this.currentQuick, "nums", arr);
      this.$set(this.currentQuick, "chaseNum", chaseNum);
      this.$set(this.currentQuick, "balls", balls);
    },
    sum() {
      let sum = 0;
      for (var i in this.currentQuick.nums) {
        sum += parseInt(this.currentQuick.nums[i]);
      }
      return sum;
    },
    sumdesc() {
      let sum = this.sum();
      let html = "";
      if (sum > 10) {
        html += '<span class="xingtai da">大</span>';
      } else {
        html += '<span class="xingtai xiao">小</span>';
      }
      if (sum % 2 == 0) {
        html += '<span class="xingtai shuang">双</span>';
      } else {
        html += '<span class="xingtai dan">单</span>';
      }
      return html;
    },
    dice_style(num) {
      let index = 0 - 61 * (parseInt(num) - 1);
      if (parseInt(num) == 0) {
        index = 0;
      }
      return "background-position: 0px " + index + "px;";
    },
  },
  created() {
    //  获取热门彩种
    this.$http
      .post("/api/v2/lottery/queryIndexQuickBettingList", "", { unenc: true })
      .then((response) => {
        if (response.data.code !== 0) return;
        $(".fast-betting")[0].style.opacity = 1;
        this.quickList = response.data.data.quickBettingList.slice(0, 6);
        this.selectedId = this.quickList[0].lotteryId;
        this.currentQuick = this.quickList[0];
        // console.log(55555, this.quickList);
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
  // width: 500px;
  width: 488px;
  & > div {
    padding: 0 15px;
  }
}
.fast-betting .detail-hot {
  height: 30px;
  line-height: 25px;
  text-align: center;
  font-size: 14px;
}
.fast-betting .detail-hot li {
  float: left;
  height: 100%;
  cursor: pointer;
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

.fast-betting .selected-lottery .rf {
  text-align: right;
  font-size: 12px;
}
.fast-betting .selected-lottery .rf p {
  height: 22px;
  margin-top: 12px;
}
.betting .selected-lottery .rf p span {
  display: inline-block;
}
.fast-betting .selected-lottery .rf p span a {
  color: #666;
}

.fast-betting .selected-lottery .rf p span.interval {
  margin-top: 1px;
  color: #999;
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
.fast-betting {
  .award-number {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto 0 auto;
    padding: 0px;
    height: 130px;
    ul {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      flex: 1;
      li {
        width: 41px;
        height: 41px;
        position: relative;
        line-height: 41px;
        text-align: center;
        border: 1px solid #b13032;
        background: linear-gradient(180deg, #e46062 2%, #c72c2e) !important;
        border-radius: 50%;
        color: #fff;
        font-size: 30px;
        margin: 5px;
      }
    }
    .go {
      flex-shrink: 0;
      display: inline-block;
      line-height: 30px;
      color: #fff;
      padding: 0 15px;
      border-radius: 3px;
      font-size: 14px;
      margin-left: 20px;
      margin-right: 20px;
      cursor: pointer;
      background: #e4393c;
    }
  }
  .ninfo {
    font-size: 12px;
    display: flex;
    justify-content: center;
    div {
      margin: 5px;
      span {
        color: red;
        margin: 0 3px;
      }
      .xingtai {
        cursor: pointer;
        display: inline-block;
        width: 18px;
        height: 18px;
        line-height: 18px;
        color: #fff;
        border-radius: 2px;
        margin-right: 6px;
        text-align: center;
      }
      .xiao,
      .shuang {
        background: #ff9726;
      }
      .da,
      .dan {
        background: #5691d7;
      }
    }
  }
}

.fast-betting .jackpot {
  font-size: 12px;
  margin: 14px 0 23px 0;
  color: #666;
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
.dice span {
  display: inline-block;
  background: url("~@/assets/images-v11/open_num.png");
  width: 60px;
  height: 60px;
  vertical-align: middle;
}
.dice i {
  margin: 10px;
  color: #999;
  font-size: 25px;
}
.dice em {
  margin: 10px;
  color: #333;
  font-size: 25px;
}
</style>
