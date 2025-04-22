<template>
  <!--  跟单弹框 -->
  <Modal
    v-model="showChaseBetting"
    :mask-closable="false"
    class="chat-model"
  >
    <div
      class="chaseBetting-detail"
      v-if="bettingData.betting"
    >

      <div class="betting-hd">
        <img
          class="img"
          :src="bettingData.betting.lotteryIcon"
        >
        <div class="info">
          <p class="name">{{bettingData.betting.lotteryName}}</p>
          <p class="period">{{$tex("期号")}}：{{bettingData.betting.periodNo | cutStrByLength(3)}}{{$tex("期")}}</p>
        </div>
        <div class="playName">
          <span class="key">{{$tex("封盘时间")}}：</span>
          <span class="val">{{downTimeText}}</span>
        </div>

      </div>
      <div class="betting-bd">
        <div class="item">
          <span class="key">{{$tex("投注玩法")}}</span>
          <p>{{bettingData.betting.playName}}</p>
        </div>
        <div class="item">
          <span class="key">{{$tex("投注内容")}}</span>
          <p>{{bettingData.betting.lotteryNumber}}</p>
        </div>
        <div class="item">
          <span class="key">{{$tex("投注注数")}}</span>
          <p class="bettingNum">{{bettingData.betting.bettingNum}}</p>
        </div>
        <div class="item">
          <span class="key">{{$tex("总金额")}}</span>
          <p>{{convert2UserMoney(buyMoney)}}</p>
        </div>

      </div>
      <div class="betting-fd">
        <p class="lb">{{$tex("单注金额")}}</p>
        <div
          class="input-wrap"
          :class="{disabled:inputDisabled}"
        >
          <span class="yuan">{{$scur("¥")}}</span>
          <input
            v-model="singleMoney"
            :disabled="inputDisabled || !allowFollowInput"
            type="text"
            @keyup="checkInputNum($event,'singleMoney')"
            @blur="blurNumber"
            :placeholder="$tex('输入金额')"
          />
        </div>
        <span
          class="btn"
          @click="chaseBetting"
          :class="{'disabled':followDisabled || moneyDisabled}"
        >{{$tex("跟单")}}</span>
      </div>
      <div v-if="showCurrencyExchange" class="currency-exchange">
        <img src="~@/assets/images-v6/jinggao.png" alt="">
        {{ singleMoney }}{{sysExchangeInfo.scur}}={{ sysExChangeMoney }}{{sysExchangeInfo.tcur}}
      </div>
    </div>

  </Modal>
</template>

<script>
import Util from "@/utils/utils";
import numeral from "numeral";
import {
  UserTypes
} from "@/constant/user";
import {hasPermission} from "@/utils/authority-utils";
import { mapGetters } from "vuex"

const LIMIT_MONEY = 1000000;

export default {
  props: {
    joinRoomSuccess: false,
    allowFollowInput: true,
    ryChatRoomId: "",
    roomId: ""
  },
  data() {
    return {
      followDisabled: false,
      moneyDisabled: false,
      downTimeText: "00:00:00",
      showChaseBetting: false,
      bettingData: {},
      singleMoney: 0,
      inputDisabled: true
    };
  },
  computed: {
    ...mapGetters(["sysExchangeInfo"]),
    user() {
      return this.$store.state.user;
    },
    buyMoney() {
      if (!this.singleMoney) {
        return 0;
      }
      let singleMoney = numeral(this.singleMoney);
      let allMoney = singleMoney.multiply(this.bettingData.betting.bettingNum)
        ._value;
      if (allMoney > LIMIT_MONEY) {
        this.moneyDisabled = true;
      } else {
        this.moneyDisabled = false;
      }
      return allMoney.toFixed(2);
    },
    showCurrencyExchange() {
      return hasPermission('element.currencyExchange') && this.singleMoney && this.sysExchangeInfo.scur && this.sysExchangeInfo.tcur;
    },
    sysExChangeMoney () {
      const exchangeRate = this.sysExchangeInfo.exchangeRate || 1;
      const money = this.singleMoney || 0;
      return numeral(money).multiply(exchangeRate).format('0.00', Math.floor);
    },
  },
  methods: {
    hasPermission,
    convert2UserMoney(price) {
      const exchangeRate = this.sysExchangeInfo.exchangeRate || 1;
      const money = Number(price).toFixed(2) || 0;
      return numeral(money).divide(exchangeRate).format('0.00');
    },
    checkInputNum($event, data) {
      let target = $event.target,
        v = target.value + "";
      if (!v) return;
      let ret = /^\d+(\.\d{0,2})?$/;
      if (!ret.test(v)) {
        v = parseFloat(v).toFixed(2);
        if (isNaN(v)) {
          this[data] = 0;
        } else {
          this[data] = v;
        }
      } else {
        this[data] = v;
      }

      if (Number(v) >= LIMIT_MONEY) {
        this[data] = LIMIT_MONEY;
      }
    },
    blurNumber() {
      if (Number(this.singleMoney) >= LIMIT_MONEY) {
        this.singleMoney = LIMIT_MONEY;
      } else {
        this.singleMoney = Number(this.singleMoney).toFixed(2);
      }
    },
    /**   追号   **/
    chaseBetting() {
      if (
        !this.user.userCode ||
        this.user.userType === UserTypes.TRY_PLAY ||
        this.followDisabled ||
        this.isChaseIng ||
        this.moneyDisabled
      )
        return;
      if (this.singleMoney <= 0 || !this.singleMoney) {
        this.$Message.info(this.$tex("请输入投注金额"));
        return;
      }
      this.showChaseBetting = false;
      // this.$emit('value', false)
      this.isChaseIng = true;
      this.bettingParam.bettingInfoList.forEach(item => {
        item.bettingMoney = this.buyMoney;
        item.orderFollow = 1;
      });
      this.bettingParam.totalMoney = this.buyMoney;
      this.bettingParam.ryRoomId = this.ryChatRoomId;
      this.bettingParam.chatRoomId = this.roomId;
      this.$http
        .post("/api/v2/lottery/betting", this.bettingParam, { userId: true })
        .then(response => {
          this.isChaseIng = false;
          if (response.data.code !== 0) {
            return;
          }
          this.$Message.success(this.$tex("下注成功"));
        });
    },
    clkChaseBetting(item) {
      // 点击投注单
      if (!this.user.userCode) {
        //this.$parent.showLoginDialog = true;
        this.$store.commit("getShowLoginDialog", true);
        return;
      }
      this.bettingData = {
        betting: {
          ...item.content.extra.data
        },
        user: item.content.user
      };

      if (
        this.user.userType === UserTypes.TRY_PLAY ||
        !this.joinRoomSuccess ||
        !this.bettingData.betting
      )
        return;
      const betting = this.bettingData.betting;
      let buyMoney = numeral(betting.buyMoney);
      this.singleMoney = buyMoney.divide(betting.bettingNum)._value;
      const param = {
        lotteryId: betting.lotteryId,
        lotteryPlayId: betting.lotteryPlayId,
        lotteryNumber: betting.lotteryNumber,
        bettingMoney: betting.buyMoney,
        bettingUserId: this.bettingData.user.id,
        odds: betting.odds,
        rebate: betting.rebate,
        bonusGroupId: betting.bonusGroupId,
        bettingNum: betting.bettingNum
      };
      this.$http
        .post("/api/v2/betting/follow", param, { userId: true })
        .then(res => {
          if (res.data.code != 0) return;

          this.bettingParam = res.data.data;
          this.followDisabled = false;
          let bettingRecordList = this.bettingParam.bettingRecordList;
          if (bettingRecordList && bettingRecordList.length) {
            this.bettingData.betting.periodNo = bettingRecordList[0].periodNo;
          }
          this.showChaseBetting = true;
          this.countDown(
            this.bettingParam.sysTime,
            this.bettingParam.closeTime,
            () => {
              this.followDisabled = true;
            }
          );
        });
    },
    countDown(startTime, endTime, callback) {
      // 倒计时
      let downTime = endTime - startTime;
      if (downTime <= 0) {
        this.downTimeText = "00:00:00";
        callback && callback();
        return;
      }
      let obj = Util.countDownTime(downTime);
      this.downTimeText = obj.hours + ":" + obj.minutes + ":" + obj.seconds;

      clearInterval(this.countDownTimer);
      this.countDownTimer = setInterval(() => {
        if (downTime < 1000) {
          callback && callback();
          this.downTimeText = "00:00:00";
          clearInterval(this.countDownTimer);
          return;
        }
        downTime -= 1000;
        obj = Util.countDownTime(downTime);
        this.downTimeText = obj.hours + ":" + obj.minutes + ":" + obj.seconds;
      }, 1000);
    }
  },
  created() {
    this.$store.dispatch("querySystemConfig").then(data => {
      if (data["FOLLOW_ENTERAMOUNT"] === "1") {
        this.inputDisabled = false;
      } else {
        this.inputDisabled = true;
      }
    });
  }
};
</script>

<style lang="less">
.chaseBetting-detail {
  margin-bottom: 30px;
  padding: 0 20px;
  font-size: 16px;
  .betting-hd {
    overflow: hidden;
    padding: 20px 0;
    border-bottom: 1px solid #e6e6e6;
    .img {
      float: left;
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }
    .info {
      float: left;
      width: 100px;
      margin-right: 10px;
      .name {
        color: #323232;
      }
      .period {
        font-size: 10px;
      }
    }
    .playName {
      float: left;
      width: 274px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      padding-top: 10px;
      text-align: right;
      .val {
        color: #fc7a11;
      }
    }
  }
  .betting-bd {
    margin-bottom: 10px;
    .item {
      width: 100%;
      /* min-height: 50px; */
      padding: 10px 0;
      overflow: hidden;
      border-bottom: 1px solid #e6e6e6;
      .key {
        float: left;
      }
      p {
        float: right;
        text-align: right;
        color: #fc7a11;
        width: 350px;
        max-height: 68px;
        overflow: hidden;
        word-break: break-all;
        word-wrap: break-word;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
      .bettingNum {
      }
    }
  }
  .betting-fd {
    //height: 40px;
    overflow: hidden;
    .lb {
      margin-bottom: 10px;
    }
    .input-wrap {
      float: left;
      width: 250px;
      border: 1px solid #e6e6e6;
      height: 42px;
      border-radius: 5px;
      padding: 0 10px;
      color: #fc7a11;
      font-size: 16px;
      display: flex;
      align-items: center;
      &.disabled {
        background: #e6e6e6;
      }
      .yuan {
        display: inline-block;
        vertical-align: middle;
      }
      input {
        border: 1px solid transparent;
        background: transparent;
        padding: 7px 0;
        display: inline-block;
        vertical-align: middle;
        color: #fc7a11;
        outline: 0;
        font-size: 16px;
        &:focus {
          box-shadow: none;
        }
      }
    }
    .btn {
      background-color: #fc7a11;
      border: 1px solid #fc7a11;
      color: #fff;
      width: 150px;
      float: right;
      border-radius: 5px;
      margin-top: 2px;
      text-align: center;
      cursor: pointer;
      &.disabled {
        background: #999;
        border: 1px solid #999;
        cursor: not-allowed;
      }
    }
  }
  .ivu-input-wrapper {
    width: 90%;
    &:focus {
      outline: 0;

      .ivu-input-icon-clear {
        top: 5px;
        color: #d1d1d1;
        font-size: 22px;
        cursor: pointer;
      }
    }
  }
}
.chat-model {
  .ivu-modal {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
  }
}
.currency-exchange {
  font-size: 14px;
  color: #b2b2b2;
  padding-top: 4px;
  img {
    width: 15px;
    height: 15px;
    margin-right: 4px;
    float: none;
    vertical-align: text-bottom;
  }
}
</style>
