<template>
  <div class="lianma">
    <odds></odds>
    <div class="tab">
      <ul>
        <li
          v-for="item in tabList"
          :key="item.id"
          @click="changeList(item)"
          :class="{active: tabId === item.id}"
        >
          <span>{{item.name}}</span>
        </li>
      </ul>
      <!--中奖提示 -->
      <div class='prize_example'>
        <play-example
          :bettingExample="playTipInfo.bettingExample"
          :prizeDesc="playTipInfo.prizeDesc"
        ></play-example>
      </div>
      <!-- 中奖提示说明 -->
      <!-- 玩法说明 -->
      <div class='tip-wrap'>
        <play-tip
          :playDesc="playTipInfo.playDesc"
          :tip="playTipInfo.layout.tips && playTipInfo.layout.tips"
          :isLiuHe="true"
          :maxOdd="maxOdd"
          :minOdd="minOdd"
          :is2zhongTe="is2zhongTe"
          :hasLogin="!!user.userId"
        ></play-tip>
      </div>
      <!-- 玩法说明结束 -->
    </div>
    <div class="detail-thead nav-bg">
      <ul>
        <li
          v-for="item in 5"
          :key="item"
        >
          <div class="container">
            <span class="num">{{$tex("号码")}}</span>
            <span class="price">{{$tex("勾选")}}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="detail-body">
      <ul>
        <li
          v-for="(item, idx) in listData"
          :key="idx"
        >
          <div class="container">
            <span class="num">
              <i
                class="ball"
                :style="{background: item.clr}"
              >{{item.ball}}</i>
            </span>
            <span class="price">
              <!-- <input type="checkbox" class="check-price" v-model="item.selected" @change="checkboxChange()" :disabled="selected.length >= 10 && !item.selected"> -->
              <Checkbox
                class="check-price"
                v-model="item.selected"
                @on-change="checkboxChange()"
                :disabled="selected.length >= 10 && !item.selected"
              ></Checkbox>
            </span>
          </div>
        </li>
        <li>
          <div class="container"></div>
        </li>
      </ul>
      <div class="clr"></div>
    </div>
    <div class="operation">
      <div class="price lf">
        <span
          class="minus icon-m-p lf"
          @click="minusPlus(-1)"
        >
          <Icon type="minus"></Icon>
        </span>
        <span class="price-input lf">
          <zk-input v-model="price"
                    type="digit"
                    :digitilen="2"
                    :max="parseInt(singleLimit)"
                    :min="1">
        </zk-input>
<!--          <InputNumber-->
<!--                  :precision="precision"-->
<!--                  :step="step"-->
<!--            :max="parseInt(singleLimit)"-->
<!--            :min="1"-->
<!--            v-model="price"-->
<!--          ></InputNumber>-->
        </span>
        <span
          class="plus icon-m-p lf"
          @click="minusPlus(1)"
        >
          <Icon type="plus"></Icon>
        </span>
        <div class="clr"></div> -->
      </div>
      <div v-if="!hasPermission('element.currencyExchange')" class="company lf">
        <span
          v-for="(item, idx) in companyList"
          :class="{active: item.value === companyValue}"
          :key="idx"
          @click="getCompanyValue(item.value)"
        >
          {{item.label}}
        </span>
      </div>
      <div
        class="total lf"
        v-if="num"
      >
        <prize-tip
          :count="num"
          :money="money"
          :singlePrizeMoney="singlePrizeMoney"
          :hasLogin="!!user.userId"
        ></prize-tip>
      </div>
      <div
        class="add-note lf"
        @click="add"
      >
        <span>
          <Icon
            type="plus-round"
            size="12"
          ></Icon>
        </span>
        <b>{{$tex("添加注单")}}</b>
      </div>
    </div>
  </div>
</template>

<script>
import liuhe from "./common_modal/handle_data.js";
// import popupModal from './common_modal/popup.vue'
import odds from "./common_modal/odds.vue";
import playTip from "../../common_vue/play_tip.vue";
import playExample from "../../common_vue/betting_example.vue";
import prizeTip from "../../common_vue/prize_tip.vue";
import numeral from "numeral";
import { hasPermission } from "@/utils/authority-utils";
import { ZkInput } from '@/components/ZkInput'

export default {
  props: {
    data: {
      type: [Array, Object]
    },
    betLimRate: {
      type: String,
      default: "1"
    }
  },
  components: {
    // popupModal,
    odds,
    playTip,
    playExample,
    prizeTip,
    ZkInput
  },
  data() {
    return {
      tabList: [],
      tabId: "",
      tabNum: "",
      listData: [],
      price: 0,
      selected: [],
      orderList: [],
      companyList: [
        // 金额单位
        { value: 1, label: this.$tex("元") },
        { value: 10, label: this.$tex("角") },
        { value: 100, label: this.$tex("分") }
      ],
      singleLimit: 0,
      companyValue: 1, // 当前选中的company
      hasClick: false, //添加单注判断
      playTipInfo: {},
      num: 0,
      totalNote: 0
    };
  },
  computed: {
    money() {
      //总金额
      return numeral(this.num)
        .multiply(this.price)
        .divide(this.companyValue)
        .value();
    },
    singlePrizeMoney() {
      //单注最高中奖金额
      return numeral(this.price)
        .divide(this.companyValue)
        .multiply(this.maxOdd)
        .value();
    },
    newSingleMoney() {
      //投注单价
      return numeral(this.price)
        .divide(this.companyValue)
        .value();
    },
    maxOdd() {
      //最高赔率
      return this.listData[0].maxOdds;
    },
    minOdd() { // 最小赔率,二中特用
      if(!this.is2zhongTe) return 0;
      return this.listData[0].minOdds;
    },
    is2zhongTe() { // 二中特的玩法提示的赔率展示部分改为中特赔率是__，中二赔率是__
      return this.tabId === '70705';
    },
    user() {
      return this.$store.state.user;
    },
    limTotalNote() {
      return this.totalNote <= 0 || !this.totalNote
        ? 0
        : this.totalNote * this.betLimRate;
    },
    precision() {
      if (hasPermission("buyLottery.decimals")) {
        return 2;
      }
      return void 0;
    },
    step() {
      if (hasPermission("buyLottery.decimals")) {
        return 0.01;
      }
      return 1
    }
  },
  methods: {
    hasPermission,
    minusPlus(num) {
      //操作单注金额
      num += Number(this.price);
      if (num < 1 || num > parseInt(this.singleLimit)) {
        return;
      }
      this.price = num;
    },
    // 元角分发生变化时
    getCompanyValue(num) {
      this.companyValue = num;
    },
    add() {
      //添加注单
      if (this.limTotalNote && this.num > this.limTotalNote) {
        this.$Message.error(this.$tex("违规投注"));
        return;
      }
      if (this.user && !this.user.userId) {
        this.$store.commit("getShouldLogin", true);
        return;
      }
      this.commit();
      this.$emit("add-note", this.orderList);
      this.cancel();
    },
    // 计算注数
    bettingAmount(betballs, size) {
      var allResult = [];
      var arr = betballs.split(",");
      function getResult(arr, size, result) {
        var arrLen = arr.length;
        if (size > arrLen) {
          return;
        }
        if (size == arrLen) {
          allResult.push([].concat(result, arr));
        } else {
          for (var i = 0; i < arrLen; i++) {
            var newResult = [].concat(result);
            newResult.push(arr[i]);
            if (size == 1) {
              allResult.push(newResult);
            } else {
              var newArr = [].concat(arr);
              newArr.splice(0, i + 1);
              getResult(newArr, size - 1, newResult);
            }
          }
        }
      }
      getResult(arr, size, []);
      return allResult;
    },
    changeList(item) {
      //切换玩法
      if (this.tabId === item.id) return;
      this.hasClick = false;
      this.listData = item.children[0].layout.rates;
      this.playTipInfo = item.children[0];
      this.tabId = item.id;
      this.tabNum = item.num;
      this.price = item.children[0].layout.costAmount;
      this.singleLimit = item.children[0].singleLimit; //单注最大金额
      this.totalNote = item.children[0].totalNote;
      this.cancel();
      this.$emit("has-change-menu", Math.random()); //切换二级菜单提示空投
    },
    checkboxChange() {
      this.selected = this.listData.filter(item => item.selected);
      let balls = this.selected.map(item => item.ball); //计算注数和金额
      let noteNum = this.bettingAmount(balls.join(","), this.tabNum);
      this.num = noteNum.length; //总注数
    },
    getSelected(data) {
      let arr = [];
      let vm = this;
      let { lotteryId, lotteryPlayId, lotteryBettingId } = this.listData[0];
      let odds = [];
      if (this.tabId === "70703" || this.tabId === "70705") {
        //三中二和二中特有大小赔率
        odds = [this.selected[0].maxOdds, this.selected[0].minOdds];
      } else {
        odds = [this.selected[0].maxOdds];
      }
      data.forEach(item => {
        arr.push({
          lotteryId: lotteryId,
          lotteryPlayId: lotteryPlayId,
          lotteryBettingId: lotteryBettingId,
          odds:
            this.tabId === "70703" || this.tabId === "70705"
              ? `${odds[0]},${odds[1]}`
              : odds[0], // 4.24
          lotteryNumber: item.join(","),
          singleMoney: this.newSingleMoney,
          bettingMoney: this.newSingleMoney * 1,
          bettingNum: 1,
          rebate: 0
        });
      });
      return arr;
    },
    getResult(clear) {
      if (clear) this.cancel("clear");
    },
    commit() {
      let vm = this;
      if (!this.selected.length || this.selected.length < this.tabNum) {
        if (!this.hasClick) {
          this.$Message.warning(this.$tex("没有投注或注数不够"));
          this.hasClick = true;
        }
        return;
      }
      let balls = this.selected.map(item => item.ball);
      let noteNum = this.bettingAmount(balls.join(","), this.tabNum);
      this.orderList = this.getSelected(noteNum);
      this.cancel();
    },
    cancel() {
      this.num = 0;
      this.price = this.tabList[0].children[0].layout.costAmount;
      this.companyValue = 1;
      this.selected.forEach(item => {
        item.selected = false;
      });
      this.selected = [];
    }
  },
  created() {
    let data = this.data;
    this.singleLimit = data[0].children[0].singleLimit; //单注最大金额
    data.forEach(item => {
      if (item.id === "70701") {
        item.num = 4;
      } else if (item.id === "70702" || item.id === "70703") {
        item.num = 3;
      } else {
        item.num = 2;
      }
      item.rebate = item.children[0].layout.rates[0].maxOdds;
    });
    this.tabList = data;
    this.tabId = data[0].id;
    this.tabNum = data[0].num;
    this.price = this.tabList[0].children[0].layout.costAmount;
    this.listData = this.tabList[0].children[0].layout.rates;
    this.playTipInfo = this.tabList[0].children[0];
    this.totalNote = this.tabList[0].children[0].totalNote;
  }
};
</script>

<style lang="less" scoped>
  @deep: ~">>>";
.lianma .tab {
  position: relative;
}
.lianma .tab ul {
  float: left;
  height: 32px;
  line-height: 32px;
}
.lianma .tab .prize_example {
  position: absolute;
  right: 15px;
  top: 50%;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  z-index: 10;
}
.lianma .tab .tip-wrap {
  width: 90%;
  clear: both;
  padding: 5px 0;
  word-wrap: break-word;
}
.lianma .detail-thead li,
.lianma .detail-body li {
  width: 20%;
}
.lianma span.num {
  width: 35%;
}
.lianma span.price {
  width: 50%;
}
.lianma .detail-body li .check-price {
  width: 16px;
}
.lianma .detail-body li .price {
  line-height: 20px;
}
.lianma .operation {
  position: relative;
  height: 35px;
  margin-top: 40px;
}
.lianma .operation .price {
  /* border: 1px solid @primary-color; */
  height: 35px;
  overflow: hidden;
}
.lianma .operation .price .icon-m-p {
  display: inline-block;
  height: 100%;
  width: 35px;
  text-align: center;
  line-height: 35px;
  /*   color: @primary-color; */
  cursor: pointer;
}
/*
.picked-result .current-info .price .minus {
  border-right: 1px solid @add-note-price-color;
}
.picked-result .current-info .price .plus {
  border-left: 1px solid @add-note-price-color;
}
.picked-result .current-info .company {
  border-left: 1px solid @add-note-border;
} */
/* .lianma .operation .price .minus {
  border-right: 1px solid @primary-color;
}
.lianma .operation .price .plus {
  border-left: 1px solid @primary-color;
} */
/* .picked-result .current-info .price input{
        width: 80px;
        height: 100%;
        border: 0;
        outline: none;
        color: #be1204;
        text-align: center;
    } */
.lianma .operation .company {
  height: 35px;
  margin-left: 10px;
  border-left: 1px solid #d2d0d0;
}
.lianma .operation .company span {
  display: inline-block;
  height: 100%;
  width: 35px;
  text-align: center;
  line-height: 35px;

  cursor: pointer;
  &:not(.active) {
    border-left:none;
  }
  /*   border: 1px solid #d2d0d0;
  color: #949494; */
  /* margin-left:-1px; */
}
.lianma .operation .company span.active {
  /*   border: 1px solid @primary-color;
  color: @primary-color; */
  z-index: 2;
  margin-left: -1px;
}
.lianma .operation .odd-compute {
  font-size: 12px;
  height: 35px;
  margin-left: 10px;
}
.lianma .operation .odd-compute > span {
  display: inline-block;
  float: left;
}
.lianma .operation .odd-compute span.odds,
.lianma .operation .odd-compute span.rebate {
  line-height: 18px;
  min-width: 60px;
  max-width: 80px;
  text-align: center;
  color: @primary-color;
}
.lianma .operation .odd-compute span.slider {
  width: 160px;
  margin: 0 8px;
}
.lianma .operation .odd-compute span.slider .ivu-slider {
  line-height: 15px;
}
.lianma .operation .add-note span {
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
.lianma .operation .total {
  font-size: 16px;
  margin-left: 10px;
  line-height: 35px;
  margin-top: -2px;
}
.lianma .operation .total strong {
  color: @primary-color;
}
.lianma .operation .add-note {
  position: absolute;
  left: 990px;
  text-align: center;
  margin-bottom: 20px;
  color: #fff;
  padding: 5px 10px;
  border-radius: 3px;
  /*  background: @result-page-chase-num-bg;
  border: 1px solid @result-page-order-border;
  box-shadow: -1px 1px 1px @result-page-detail-shadow-color inset; */
  cursor: pointer;
}
.lianma .operation .add-note span {
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
.lianma .operation .add-note b {
  font-weight: normal;
  display: inline-block;
  margin-top: 1px;
}
/* 覆盖ivu-input-number样式 */
.lianma .price-input {
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
.lianma .price-input .ivu-input-number-handler-wrap {
  display: none;
}
.lianma .price-input .ivu-input-number {
  border: 0;
  width: 100%;
  height: 100%;
  box-shadow: none;
  padding: 0;
}
.lianma .price-input .ivu-input-number-input-wrap {
  height: 100%;
}
.lianma .ivu-input-number-input {
  border: 0;
  outline: none;
  color: @primary-color;
  text-align: center;
  height: 34px;
  line-height: 34px;
  font-size: 16px;
}
</style>
<style scoped>
.lianma .price-input .ivu-input-number >>> .ivu-input-number-input {
  text-align: center;
  height: 33px;
  line-height: 33px;
}
</style>

