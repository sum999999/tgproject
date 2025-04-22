<template>
  <div class="picked-result">
    <!-- 赔率-返利-预设-->
    <div
      class="pre-set clearfix"
      v-if="$store.getters.sysShowOdds == '1' || user.userId"
    >
      <!-- 赔率返利tbar -->
      <div v-if="hasPermission('buyLottery.odds')" class="odd-compute lf">
        <span class="odds">
          <!-- <span v-show="playType !== '2'">{{data.odds}}</span> -->
          <!-- 5.5 -->
          <span v-show="rates.length === 1">{{ data.odds }}</span>
          <br />
          <span>{{ $tex("赔率") }}</span>
        </span>
        <span class="slider">
          <Slider
            v-model="sliderNum"
            :disabled="isDisabledSlider"
            @on-input="getRates"
          ></Slider>
        </span>
        <span class="rebate">
          <span>{{ data.rebate }}%</span>
          <br />
          <span>{{ $tex("返利") }}</span>
        </span>
      </div>
      <div class="lf total" style="margin-left:28px">
        <prize-tip
          :count="data.bettingNum"
          :money="data.bettingMoney"
          :singlePrizeMoney="singlePrizeMoney"
          :hasLogin="!!user.userId"
        ></prize-tip>
      </div>
      <!-- 预设单注金额 -->
      <div v-if="hasPermission('buyLottery.preset')" class="set lf">
        <div class="txt">
          <span>{{ $tex("预设单注金额") }}&nbsp;:</span>
        </div>
        <!-- <InputNumber :max="parseInt(currentLottery.singleLimit)"
                     :min="10"
                     v-model="preSetMoney"
                     @on-focus="getPreSetMoneyEvent"
                     @on-change="iptPreSetMoney"
                     @on-blur="setBlurPreSetMoney"
                     :precision="0"></InputNumber> -->
        <input
          class="ivu-input"
          type="number"
          v-model="preSetMoney"
          :max="maxSingleLimit"
          :min="10"
          @keydown="downPreSetIpt($event)"
          @input="iptPreSetMoney($event)"
          @blur="blurIptPreSetMoney($event)"
        />
        <div class="txt yuan">
          <span>
            <template v-if="hasPermission('element.currencyExchange')">{{
              sysExchangeInfo.scurIcon
            }}</template>
            <template v-else>{{ $tex("元") }}</template>
          </span>
        </div>
        <Checkbox v-model="isPreSetMoney" @on-change="changePreSetMoney">{{
          $tex("预设")
        }}</Checkbox>
      </div>
    </div>
    <!-- buttom -->
    <div class="current-info">
      <!-- <span>单注金额</span>  -->
      <div class="price lf">
        <span class="minus icon-m-p lf" @click="minusPlus(-1)">
          <Icon type="minus"></Icon>
        </span>
        <span class="price-input lf">
          <zk-input
            v-model="data.singleMoney"
            type="digit"
            :digitilen="2"
            :max="maxSingleLimit"
            :min="minSingleLimit"
            @change="getSingleMoney"
          >
          </zk-input>
          <!--          <InputNumber-->
          <!--                  :precision="precision"-->
          <!--            :step="step"-->
          <!--            :max="maxSingleLimit"-->
          <!--            :min="minSingleLimit"-->
          <!--            v-model="data.singleMoney"-->
          <!--            @on-change="getSingleMoney"-->
          <!--            v-if="currentLottery"-->
          <!--          ></InputNumber>-->
        </span>
        <span class="plus icon-m-p lf" @click="minusPlus(1)">
          <Icon type="plus"></Icon>
        </span>
        <div class="clr"></div>
      </div>
      <div v-if="!hasPermission('element.currencyExchange')" class="company lf">
        <span
          v-for="(item, idx) in unitList"
          :class="{ active: item.value === companyValue }"
          :key="idx"
          @click="getCompanyValue(item.value)"
        >
          {{ item.label }}
        </span>
      </div>
      <!-- 筹码 -->
      <jetton-box
        v-model="data.singleMoney"
        size="small"
        :match="true"
        :min="minSingleLimit"
        :max="maxSingleLimit"
        :reset-value="minSingleLimit"
      ></jetton-box>
      <!--      <div class="hold-money lf">-->
      <!--        <div-->
      <!--          v-for="(imgInfo,idx) of holdMoneysImgs"-->
      <!--          :key="idx"-->
      <!--          :class="{'active':holdMoneys.includes(imgInfo.money)}"-->
      <!--          @click="choiceHoldMoneys(imgInfo.money,idx)"-->
      <!--        >-->
      <!--          <i></i>-->
      <!--          <img-->
      <!--            :src="imgInfo.src"-->
      <!--            alt=""-->
      <!--          >-->
      <!--        </div>-->
      <!--      </div>-->
      <!--      <div-->
      <!--        class="dele-hold lf"-->
      <!--        @click="clearHoldMoneys"-->
      <!--      ><Button type="default">{{$tex("删除筹码")}}</Button></div>-->
      <div class="add-note lf" @click="addNote()">
        <span>
          <Icon type="plus-round" size="12"></Icon>
        </span>
        <i>{{ $tex("添加注单") }}</i>
      </div>
      <!-- <Button type = "primary" class = "add-note lf" icon = "plus-round" @click="addNote()">添加注单</Button> -->
    </div>
  </div>
</template>

<script>
import prizeTip from "../../common_vue/prize_tip.vue";
import utils from "@/utils/utils";
import numeral from "numeral";
import { mapGetters } from "vuex";
import { hasPermission } from "@/utils/authority-utils";
import { ZkInput } from "@/components/ZkInput";
import JettonBox from "@/components/JettonBox";

export default {
  props: {
    currentLottery: {
      type: Object,
    },
    balls: {
      type: Object,
    },
    refresh: {
      type: String,
    },
    bettingDiffTime: {
      type: Number,
    },
    selfFlag: {
      type: String,
    },
  },
  components: { prizeTip, ZkInput, JettonBox },
  data() {
    return {
      sliderNum: 0, // 拖拉条的值
      companyList: [
        // 金额单位
        { value: 1, label: this.$tex("元") },
        { value: 10, label: this.$tex("角") },
        { value: 100, label: this.$tex("分") },
      ],
      companyValue: 1, // 当前选中的company
      data: {
        odds: 0,
        singleMoney: 0,
      }, // 单注数据
      // playType: '',                  // 判断多赔率    5.5
      rates: [], // 判断多赔率 5.5
      odds: [], // 多赔率数据
      hasClick: false, //判断是否多次点击添加注单
      maxOdds: null, //多赔率的最大赔率
      minOdds: null, //多赔率的最小赔率
      totalNote: 0, //总注数,
      holdMoneysImgs: [], //筹码图片
      preSetMoney: 10, //预设金额
      isPreSetMoney: false, //是否选择预设金额
      holdMoneys: [], //筹码金额,
      // preSetEvent: ''
    };
  },
  computed: {
    ...mapGetters(["sysExchangeInfo", "getSysUserAmountBySelfFlag"]),
    unitList() {
      const list = ["by322", "by319"]; // 不展示角和分的盘口
      const list2 = ["by343"]; // 不展示分的盘口
      const handicap = list.includes(this.$store.getters.sysPlatformFlag);
      const handicap2 = list2.includes(this.$store.getters.sysPlatformFlag);
      if (handicap) {
        return this.companyList.slice(0, 1);
      } else if (handicap2) {
        return this.companyList.slice(0, 2);
      } else {
        return this.companyList;
      }
    },
    isDisabledSlider() {
      if (!this.currentLottery) return;
      let { rates } = JSON.parse(this.currentLotterys.layout);
      return rates && rates.length && rates[0].rebate <= 0;
    },
    diffTime() {
      console.log("bettingDiffTime", this.bettingDiffTime);
      return this.bettingDiffTime;
    },
    currentLotterys() {
      return JSON.parse(JSON.stringify(this.currentLottery));
    },
    singlePrizeMoney() {
      //单注最大中奖金额
      let odds = this.rates.length > 1 ? this.data.odds : this.maxOdds;
      return Number(
        numeral(odds)
          .multiply(this.data.singleMoney / this.companyValue)
          .value()
      );
    },
    user() {
      return this.$store.state.user;
    },
    minSingleLimit() {
      if (hasPermission("buyLottery.singleLimit")) {
        const { min } = this.getSysUserAmountBySelfFlag(this.selfFlag) || {};
        return min;
      } else {
        return 1;
      }
    },
    maxSingleLimit() {
      if (hasPermission("buyLottery.singleLimit")) {
        const { max } = this.getSysUserAmountBySelfFlag(this.selfFlag) || {};
        return max;
      } else {
        return parseInt(this.currentLottery.singleLimit);
      }
    },
    precision() {
      if (hasPermission("buyLottery.decimals")) {
        return 2;
      }
      return 0;
    },
    step() {
      if (hasPermission("buyLottery.decimals")) {
        return 0.01;
      }
      return 1;
    },
  },
  watch: {
    // 监听选号类型改变 如果改变重新初始化
    currentLottery: {
      handler(newValue, oldValue) {
        this.getPreSetMoney();
        this.init();
        this.hasClick = false;
        this.holdMoneys = [];
      },
      deep: true,
    },
    balls: {
      handler(newValue, oldValue) {
        this.getBalls(newValue);
      },
      deep: true,
    },
    refresh() {
      this.init();
    },
    data: {
      deep: true,
      handler() {
        this.$nextTick(() => {
          this.getSingleMoney();
        });
      },
    },
  },
  methods: {
    hasPermission,
    // handlerOdds(diffOdds) {
    //   // 处理赔率 12.27 by xiaojiji
    //   let one = `${diffOdds}`.split(".")[1];
    //   if (!one) {
    //     return `${diffOdds}`;
    //   } else if (one.length <= 3) {
    //     return `${diffOdds}`;
    //   } else {
    //     return utils.splitDecimalOfN(`${diffOdds}`, 3);
    //   }
    // },
    // 输入单注金额
    getSingleMoney() {
      this.$set(
        this.data,
        "bettingMoney",
        (this.data.bettingNum * this.data.singleMoney) / this.data.company
      );
      // 传递当前的状态
      this.$emit("get-status", this.data);
    },
    minusPlus(num) {
      this.holdMoneys.length && (this.holdMoneys = []);
      num = Number(this.data.singleMoney) + num;
      if (num < this.minSingleLimit || num > this.maxSingleLimit) {
        return;
      }
      this.$set(this.data, "singleMoney", num);
      this.getSingleMoney();
    },
    // 计算返利
    getRates(num) {
      // console.log(num);
      let layout = JSON.parse(this.currentLotterys.layout);
      let rates = layout.rates;
      if (rates && rates.length && rates[0].rebate <= 0) {
        //返利为0不改变赔率
        return;
      }
      if (rates.length > 1) {
        //待完
        this.$emit("rates-to-balls", num);
      }
      let odds = numeral(layout.rates[0].maxOdds)
        .subtract(layout.rates[0].minOdds)
        .divide(100)
        .value(); //(layout.rates[0].maxOdds - layout.rates[0].minOdds) / 100;

      let rebate = numeral(100)
        .divide(layout.rates[0].rebate)
        .value(); // 100 / layout.rates[0].rebate;

      // this.$set(this.data, 'odds', (layout.rates[0].maxOdds - (num * odds)).toFixed(2));
      // this.maxOdds = (layout.rates[0].maxOdds - (num * odds)).toFixed(2);//12.26
      let maxOdds = layout.rates[0].maxOdds;
      // if (num === 100) {
      //   this.maxOdds = layout.rates[0].minOdds;
      // } else {
      // let splitOdds = `${(maxOdds - num * odds)}`.split('.')[1];
      // if (!splitOdds) {
      //   this.maxOdds = maxOdds - num * odds;
      // } else if (splitOdds.length <= 3) {
      //   this.maxOdds = maxOdds - num * odds;
      // } else {
      //   this.maxOdds = utils.splitDecimalOfN(`${maxOdds - num * odds}`, 3)
      // }
      const relOdd = numeral(maxOdds)
        .subtract(
          numeral(num)
            .multiply(odds)
            .value()
        )
        .value();
      // this.maxOdds = this.handlerOdds(relOdd);
      // console.log(relOdd);
      this.maxOdds = utils.splitDecimalOfN(relOdd, 3);
      // }

      // this.maxOdds = (layout.rates[0].maxOdds - (num * odds)).toFixed(3);//12.27
      // if (rates.length > 1) {
      //多赔率的最大赔率 6.5
      // let maxOdds = Math.max(...rates.map(item => item.maxOdds)); //7.6
      // this.maxOdds = (maxOdds - (maxOdds - this.minOdds) * num / 100).toFixed(2); //7.6
      // }
      const relRebate = utils.splitDecimalOfN(
        numeral(num)
          .divide(rebate)
          .multiply(100)
          .value(),
        1
      );
      this.$set(this.data, "rebate", relRebate);

      // 处理多赔率

      if (this.odds.length) {
        // 2019.4.28这部分
        let moreOdds = JSON.parse(JSON.stringify(this.odds));
        // debugger;
        let value = 0;
        moreOdds.forEach((item) => {
          let o = numeral(item.maxOdds)
            .subtract(item.minOdds)
            .divide(100)
            .value(); //(item.maxOdds - item.minOdds) / 100;
          let odd = numeral(item.maxOdds)
            .subtract(
              numeral(num)
                .multiply(o)
                .value()
            )
            .value(); //item.maxOdds - num * o;
          let currOdd = utils.splitDecimalOfN(odd, 3);
          if (value < Number(currOdd)) {
            value = Number(currOdd);
          }
        });
        this.$set(this.data, "odds", value);
        // console.log(this.data);
      } else {
        this.$set(this.data, "odds", this.maxOdds);
        // console.log(this.data);
      }
      // 传递当前的状态
      this.$emit("get-status", this.data);
    },
    // 元角分发生变化时
    getCompanyValue(num) {
      this.$set(this.data, "company", num);
      this.$set(
        this.data,
        "bettingMoney",
        numeral(this.data.bettingNum)
          .multiply(this.data.singleMoney)
          .divide(num)
          .value()
      );
      this.companyValue = num;
      // 传递当前的状态
      this.$emit("get-status", this.data);
    },
    // 获取号码球与注数
    getBalls(result) {
      this.$set(this.data, "bettingNum", result.len);
      this.$set(
        this.data,
        "bettingMoney",
        (this.data.singleMoney * result.len) / this.data.company
      ); // this.data.company 为元角分
      this.$set(this.data, "lotteryNumber", result.balls);
      // this.playType处理多赔率情况  目前只有快三--和值会出现
      // if (this.playType === '2') this.moreOdds(result.odds);

      if (this.rates.length > 1) this.moreOdds(result.odds); // 5.5
    },
    moreOdds(odds) {
      let layout = JSON.parse(this.currentLotterys.layout);
      let arr = [];
      let vm = this;
      let va = 0;
      odds.forEach((item) => {
        layout.rates.forEach((value) => {
          if (item.join("") === value.ball) {
            arr.push(value);
            if (va < Number(value.maxOdds)) va = Number(value.maxOdds);
          }
        });
      });
      this.$set(this.data, "odds", va);
      this.odds = JSON.parse(JSON.stringify(arr));
    },
    // 添加单注
    addNote() {
      if (this.totalNote > 0 && this.data.bettingNum > this.totalNote) {
        //判断非toolbar、单式
        this.$Message.error(
          this.$tex("投注{num}码违规", { num: this.$attrs.betLimRate * 10 })
        );
        return;
      }
      if (this.user && !this.user.userId) {
        this.$store.commit("getShouldLogin", true);
        return;
      }
      if (this.diffTime < 0) {
        this.$Modal.warning({
          title: this.$tex("投注提示"),
          content: this.$tex("当前期数未开始"),
        });
        return;
      }
      if (!this.data.bettingNum) {
        if (!this.hasClick) {
          this.$Message.error(this.$tex("注数不够"));
          this.hasClick = true;
        }
        return;
      }
      if (this.data.singleMoney <= 0) {
        this.$Message.error(
          this.$tex("单注金额不能小于{money}", { money: this.minSingleLimit })
        );
        return;
      }
      let data = [];
      // 处理多赔率
      if (this.odds.length) {
        this.odds.forEach((item) => {
          let value = (item.maxOdds - item.minOdds) / 100;
          let obj = Object.assign({}, this.data);
          // obj.odds = (item.maxOdds - (this.sliderNum * value));
          obj.odds = utils.splitDecimalOfN(
            item.maxOdds - this.sliderNum * value,
            3
          );
          obj.bettingMoney = numeral(obj.singleMoney)
            .divide(obj.company)
            .value();
          obj.lotteryNumber = item.ball;
          obj.bettingNum = 1;
          data.push(obj);
        });
      } else {
        data.push(this.data);
      }
      // console.log(data);
      this.$emit("add-note", data);
      // 清空当前数据
      this.init();
      this.clearHoldMoneys();
      this.holdMoneys = [];
      // 传递当前的状态
      this.$emit("get-status", this.data);
    },
    //删除筹码
    clearHoldMoneys() {
      if (this.holdMoneys.length) {
        this.holdMoneys = [];
        this.initHoldMoneysInfo2();
      }
    },
    //筹码为空时，设定金额为初始值
    initHoldMoneysInfo2() {
      let layout = JSON.parse(this.currentLotterys.layout);
      if (this.isPreSetMoney) {
        // 2019.6.24 by xiaojiji
        this.$set(this.data, "singleMoney", this.preSetMoney);
      } else {
        this.$set(
          this.data,
          "singleMoney",
          hasPermission("buyLottery.singleLimit")
            ? this.minSingleLimit
            : layout.costAmount
        );
      }
      this.getSingleMoney();
    },
    choiceHoldMoneys(money, idx) {
      //选择筹码
      if (this.holdMoneys.includes(money)) {
        this.holdMoneys.splice(
          this.holdMoneys.findIndex((itm) => itm === money),
          1
        );
        if (!this.holdMoneys.length) {
          this.initHoldMoneysInfo2();
          return;
        }
      } else {
        this.holdMoneys.push(money);
      }
      let totalMoney = this.holdMoneys.reduce((cur, pre) => {
        return cur + pre;
      }, 0);
      this.$set(this.data, "singleMoney", totalMoney);
      this.getSingleMoney();
    },
    //预设金额输入框按下时
    downPreSetIpt(e) {
      let { keyCode } = e;
      if (keyCode === 190 || keyCode === 110) {
        event.preventDefault();
      }
    },
    //预设金额输入框失焦时
    blurIptPreSetMoney(e) {
      let val = event.target.value;
      if (val < 10) {
        this.preSetMoney = 10;
      }
    },
    //预设金额输入框输入时
    iptPreSetMoney(e) {
      let val = e.target.value;
      if (isNaN(val) || val.startsWith("0")) {
        this.preSetMoney = 10;
      } else if (val > this.maxSingleLimit) {
        this.preSetMoney = this.maxSingleLimit;
      }

      if (this.isPreSetMoney)
        localStorage.setItem(
          "preSetMoney",
          this.preSetMoney >= 10 ? this.preSetMoney : 10
        );
    },
    //改变预设金额勾选框
    changePreSetMoney(val) {
      val
        ? localStorage.setItem("preSetMoney", this.preSetMoney)
        : localStorage.removeItem("preSetMoney");
    },
    //获取预设金额
    getPreSetMoney() {
      let money = +localStorage.getItem("preSetMoney");
      if (money) {
        this.preSetMoney = money;
        this.$set(this.data, "singleMoney", money);
        this.isPreSetMoney = true;
        return;
      }
      this.preSetMoney = 10;
    },
    //初始化筹码
    initHoldMoneysInfo() {
      let cacheMoney = 1;
      for (let i = 1; i <= 6; i++) {
        switch (i) {
          case 1:
            cacheMoney = 10;
            break;
          case 2:
            cacheMoney = 100;
            break;
          case 3:
            cacheMoney = 1000;
            break;
          case 4:
            cacheMoney = 5000;
            break;
          case 5:
            cacheMoney = 10000;
            break;
          case 6:
            cacheMoney = 50000;
            break;
        }
        this.holdMoneysImgs.push({
          money: cacheMoney,
          src: require(`@/assets/images/buy-lottery/chat-price-${i}.png`),
        });
      }
    },
    init() {
      // console.log(this.$attrs.betLimRate);
      let layout = JSON.parse(this.currentLotterys.layout);
      this.$set(this.data, "bettingMoney", 0);
      if (!this.isPreSetMoney) {
        this.$set(
          this.data,
          "singleMoney",
          hasPermission("buyLottery.singleLimit")
            ? this.minSingleLimit
            : layout.costAmount
        );
      }
      //  else {
      //   this.getPreSetMoney();
      // }
      this.$set(this.data, "bettingNum", 0);
      this.rates = layout.rates;
      if (this.rates.length === 1) {
        //7.6单赔率
        // this.$set(this.data, 'odds', (layout.rates[0].maxOdds).toFixed(2)); //单赔率的赔率
        this.maxOdds = layout.rates[0].maxOdds;
      }
      this.$set(this.data, "rebate", 0);
      this.$set(this.data, "lotteryNumber", "");
      this.$set(this.data, "company", 1);
      // this.playType = layout.playType; //安徽快三： 5.5
      this.sliderNum = 0;
      this.companyValue = 1;
      this.odds = [];
      // if (!layout.toolbar && layout.format !== '3' && this.currentLotterys.totalNote > 0) { //单式的先不判断
      //     this.totalNote = Math.floor(this.currentLotterys.totalNote * this.$attrs.betLimRate); //总注数
      // } else if (this.currentLotterys.totalNote < 0) {
      //     this.totalNote = 0;
      // }

      if (this.currentLotterys.totalNote > 0) {
        this.totalNote = Math.floor(
          this.currentLotterys.totalNote * this.$attrs.betLimRate
        );
      } else {
        this.totalNote = 0;
      }
      if (this.rates.length > 1) {
        //多赔率的最大赔率 6.5
        // this.maxOdds = Math.max(...this.rates.map(item => item.maxOdds));
        this.data.odds = Math.max(...this.rates.map((item) => item.maxOdds));
        // console.log('多赔率');
        this.rates.forEach((item) => {
          if (item.maxOdds === this.data.odds) {
            this.minOdds = item.minOdds;
          }
        });
      } else {
        this.data.odds = this.rates[0].maxOdds;
      }
    },
  },
  created() {
    this.getPreSetMoney();
    this.init();
    this.initHoldMoneysInfo();
    // console.log("商户标识", this.$store.getters.sysPlatformFlag);
  },
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.picked-result {
  margin-top: 40px;
}
.picked-result .red-font {
  color: @add-note-price-color;
}
.picked-result .pre-set {
  /*height: 30px;*/
  margin-bottom: 26px;
}
.picked-result .current-info {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  // height: 106px;
}
.picked-result .current-info .price {
  /*   border: 1px solid @add-note-price-color; */
  height: 35px;
  overflow: hidden;
}
.picked-result .current-info .price .icon-m-p {
  display: inline-block;
  height: 100%;
  width: 35px;
  text-align: center;
  line-height: 35px;
  /* color: @add-note-price-color; */
  cursor: pointer;
}
/* .picked-result .current-info .price .minus {
  border-right: 1px solid @add-note-price-color;
}
.picked-result .current-info .price .plus {
  border-left: 1px solid @add-note-price-color;
} */
.picked-result .current-info .company {
  height: 35px;
  margin-left: 10px;
  margin-right: 14px;
  // border-left: 1px solid @add-note-border;
}
.picked-result .current-info .company span {
  display: inline-block;
  height: 100%;
  text-align: center;
  line-height: 35px;
  cursor: pointer;
  padding: 0 10px;
}
.picked-result .current-info .company span.active {
  /*   border: 1px solid @add-note-price-color;
  color: @add-note-price-color; */
  z-index: 2;
  margin-left: -1px;
}
.picked-result .current-info .hold-money {
  display: flex;
  align-items: center;
  margin-left: 10px;
}
.picked-result .current-info .hold-money > div {
  position: relative;
  margin-right: 20px;
}
.picked-result .current-info .hold-money > div i {
  display: none;
  position: absolute;
  content: "";
  width: 10px;
  height: 10px;
  background-color: #fff114;
  border-radius: 100%;
  right: 0;
  bottom: 0;
  z-index: 2;
}
.picked-result .current-info .hold-money > div.active i {
  display: block;
}
.picked-result .current-info .hold-money > div i:before {
  content: "";
  position: absolute;
  width: 2px;
  height: 6px;
  display: block;
  border-right: 1px solid #000;
  border-bottom: 1px solid #000;
  left: 54%;
  top: 44%;
  -webkit-transform-origin: center;
  transform-origin: center;
  -webkit-transform: translate(-50%, -30%) rotate(45deg);
  transform: translate(-50%, -30%) rotate(45deg);
}
.picked-result .current-info .hold-money img {
  width: 35px;
  height: 35px;
  cursor: pointer;
  // filter: gray;
  // -webkit-filter: grayscale(100%);
  // -moz-filter: grayscale(100%);
  // -ms-filter: grayscale(100%);
  // -o-filter: grayscale(100%);
}
.picked-result .current-info .hold-money .active img {
  filter: initial;
  // -webkit-filter: grayscale(0);
  // -moz-filter: grayscale(0);
  // -ms-filter: grayscale(0);
  // -o-filter: grayscale(0);
}
// .picked-result .current-info .dele-hold {
//   margin-top: 2px;
// }
.picked-result .current-info .dele-hold button {
  width: 80px;
  height: 30px;
  padding: 0;
  border: 0;
  background: rgb(102, 102, 102);
  color: #fff;
  box-shadow: none;
  border-radius: 30px;
}
.picked-result .current-info .dele-hold button:hover {
  opacity: 0.9;
}
.picked-result .pre-set .odd-compute {
  font-size: 12px;
  /*height: 35px;*/
  // margin-left: 10px;
}
.picked-result .pre-set .odd-compute > span {
  display: inline-block;
  float: left;
}
.picked-result .pre-set .odd-compute span.odds,
.picked-result .pre-set .odd-compute span.rebate {
  line-height: 18px;
  // min-width: 60px;
  min-width: 46px;
  max-width: 80px;
  text-align: center;
  color: #ae291a;
}
.picked-result .pre-set .odd-compute span.slider {
  width: 160px;
  margin: 0 8px;
}
.picked-result .pre-set .odd-compute span.slider .ivu-slider {
  line-height: 15px;
}
.picked-result .current-info .add-note {
  color: #fff;
  padding: 5px 10px;
  border-radius: 3px;
  /*  background: @add-note-add-bg;
  border: 1px solid @add-note-add-border;
  box-shadow: -1px 1px 1px @add-note-add-shadow-insert inset; */
  cursor: pointer;
}
.picked-result .current-info .add-note span {
  display: inline-block;
  border-radius: 50%;
  border: 2px solid #fff;
  width: 18px;
  height: 17px;
  line-height: 12px;
  text-align: center;
  float: left;
  margin-top: 3px;
  margin-right: 4px;
}
.picked-result .current-info .add-note i {
  display: inline-block;
  margin-top: 1px;
}
.picked-result .pre-set .total {
  width: 250px;
  max-width: 380px;
  /*height: 40px;*/
  margin-top: -2px;
  font-size: 14px;
  /*line-height: 20px;*/
}
.picked-result .pre-set .set {
  display: flex;
  height: 30px;
  line-height: 30px;
  margin-left: 214px;
  font-size: 14px;
}
.picked-result .pre-set .set .txt {
  color: rgb(190, 18, 4);
}
.picked-result .pre-set .set > div:first-child {
  margin-right: 10px;
}
.picked-result .pre-set .set > .yuan {
  margin: 0 14px 0 10px;
}
/* 覆盖ivu-input-number样式 */
.picked-result .price-input {
  width: 80px;
  height: 100%;
  display: inline-block;
  .zk-input-wrap {
    height: 100%;
    @{deep} {
      input {
        height: 100%;
        width: 100%;
        border: none;
        &:focus {
          border: none;
          box-shadow: none;
        }
      }
    }
  }
}
.picked-result .price-input .ivu-input-number-handler-wrap {
  display: none;
}
.picked-result .price-input .ivu-input-number {
  border: 0;
  width: 100%;
  height: 32px;
  box-shadow: none;
  padding: 0;
}
.picked-result .price-input .ivu-input-number-input-wrap {
  height: 100%;
}
</style>
<style scoped>
.picked-result .price-input >>> .ivu-input-number-input {
  border: 0;
  outline: none;
  /* color: @balls-page-label-color; */
  text-align: center;
  height: 34px;
  line-height: 34px;
  /* font-size: 16px; */
}
.picked-result .pre-set .set >>> .ivu-input {
  width: 84px;
  height: 30px;
  border-radius: 30px;
  border: none;
}
.picked-result .pre-set .set >>> .ivu-input:focus {
  box-shadow: none;
}
.picked-result .pre-set .set >>> .ivu-input {
  background: rgb(238, 238, 238);
  text-align: center;
  color: rgb(105, 105, 105);
  font-size: 14px;
}

.picked-result .pre-set .set >>> .ivu-checkbox-wrapper {
  font-size: 14px;
  color: rgb(51, 51, 51);
}
</style>
