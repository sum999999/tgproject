<template>
  <div class="longhelperlist">
    <ul ref="scrollBox" class="longhelperlist__box" @scroll="onBoxScroll">
      <li
        :ref="`dragon-${i}`"
        v-for="(dragon, i) in dragonList"
        :key="getDragonId(dragon)"
        class="longhelperlist-item"
      >
        <div class="longhelperlist-item__header">
          <span class="longhelperlist-item__title">{{
            dragon.lotteryName
          }}</span>
          <i18n class="longhelperlist-item__period" path="第{num}期" tag="span">
            <template slot="num">
              <span> {{ dragon.sellingPeriodNo }} </span>
            </template>
          </i18n>
        </div>
        <div class="longhelperlist-item__body">
          <div class="longhelperlist-item__startlotto">
            <img
              class="longhelperlist-item__lotimg"
              :src="dragon.lotteryIcon"
              alt="彩种图片"
            />
            <div class="longhelperlist-item__info">
              <countdown v-model="dragon.count" :stop="dragon.stopPeriod">
                <template slot="end">
                  <span v-if="dragon.stopPeriod">{{ $tex("已停期") }}</span>
                  <span v-else>{{ $tex("开奖中") }}</span>
                </template>
              </countdown>
              <div class="longhelperlist-item__pp">
                <span class="longhelperlist-item__p"
                  >{{ dragon.dragonCount }}{{ $tex("期") }}</span
                >
                <span class="longhelperlist-item__playname">{{
                  dragon.playName
                }}</span>
                <span
                  class="longhelperlist-item__dragonvalue"
                  :class="getDragonValueClass(dragon.dragonValue)"
                  >{{ dragon.dragonValue }}</span
                >
              </div>
            </div>
          </div>
          <div
            v-if="dragon.lotteryPlayValues"
            class="longhelperlist-item__balls"
            :class="{
              'longhelperlist-item__balls--disabled': disableBallsIfNeeded(
                dragon
              ),
            }"
          >
            <div
              class="longhelperlist-item__ball"
              :class="{
                'longhelperlist-item__ball--selected':
                  dragon.lotteryPlayValues[0].selected,
              }"
              @click="onBallClick(dragon, 0)"
            >
              <span class="longhelperlist-item__ballvalue">{{
                dragon.lotteryPlayValues[0].ball
              }}</span>
              <span class="longhelperlist-item__odds">{{
                dragon.lotteryPlayValues[0].odds
              }}</span>
            </div>
            <i class="longhelperlist-item__pk"></i>
            <div
              class="longhelperlist-item__ball"
              :class="{
                'longhelperlist-item__ball--selected':
                  dragon.lotteryPlayValues[1].selected,
              }"
              @click="onBallClick(dragon, 1)"
            >
              <span class="longhelperlist-item__ballvalue">{{
                dragon.lotteryPlayValues[1].ball
              }}</span>
              <span class="longhelperlist-item__odds">{{
                dragon.lotteryPlayValues[1].odds
              }}</span>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <div class="longhelperlist-toolbar">
      <div v-show="betCount" class="longhelperlist-toolbar__top">
        {{ $tex("每注金额") }}
        <zk-input v-model="singlePrice" type="number" :min="2" :max="1000000">
        </zk-input>
        <i18n path="最高可中{money}{unit}" :tag="false">
          <template slot="money">
            {{ maxWinMoney }}
          </template>
          <template slot="unit">
            {{ $scur("元") }}
          </template>
        </i18n>
      </div>
      <div class="longhelperlist-toolbar__main">
        <div
          class="longhelperlist-toolbar__clear"
          :class="{
            'longhelperlist-toolbar__clear--disabled': isDisableClearBtn,
          }"
          @click="onClearClick"
        >
          <span>{{ $tex("清除") }}</span>
        </div>
        <div class="longhelperlist-toolbar__dsc">
          <i18n path="共{num}注" :tag="false">
            <template slot="num">
              <span class="longhelperlist-toolbar__primary">{{
                betCount
              }}</span>
            </template> </i18n
          >,<span class="longhelperlist-toolbar__primary">{{ betAmount }}</span
          >{{ $scur("元") }}
        </div>
        <div
          class="longhelperlist-toolbar__sure"
          :class="{
            'longhelperlist-toolbar__sure--disabled': isDisableSureBtn,
          }"
          @click="onBetClick"
        >
          <vue-loaders-line-scale
            v-if="sureLoading"
            scale="0.5"
          ></vue-loaders-line-scale>
          <span v-else>{{ $tex("确认") }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import numeral from "numeral";
import EventBus from "@/utils/eventBus";
import Countdown from "../components/Countdown";
import throttle from "lodash/throttle";
import debounce from "lodash/throttle";
import { ZkInput } from "@/components/ZkInput";
import { queryDragon } from "@/api/lottery";
import { isInContainer } from "@/utils/domEx";
import algorithm from "@/views/buyLottery/child_modal/shared/children_modal/common_modal/index";
import VueLoadersLineScale from "vue-loaders/dist/loaders/line-scale";
import { mapGetters } from "vuex";

export default {
  name: "LongHelperList",
  components: {
    Countdown,
    ZkInput,
    VueLoadersLineScale: VueLoadersLineScale.component,
  },
  data() {
    return {
      dragonList: [],
      curDragon: null,
      debounceDragonHandler: debounce(this.dragonHandler, 1500),
      sureLoading: false,
      manualScroll2Outer: false,
      listPosition: 0,
      singlePrice: "",
    };
  },
  computed: {
    ...mapGetters(["user"]),
    balance() {
      return this.user.balance;
    },
    curDragonId() {
      return this.getDragonId(this.curDragon);
    },
    betCount() {
      if (!this.curDragon) {
        return 0;
      }
      const playValue = this.findPlayValueSelected(this.curDragon);
      if (!playValue) {
        return 0;
      }
      const result = algorithm(this.curDragon.lotteryPlayId, playValue.ball);
      if (!result) {
        return 1;
      }
      let length = result.length || 0;
      if (result.len || result.len === 0) length = result.len;
      return length;
    },
    betAmount() {
      const singlePrice = this.singlePrice || 0;
      return numeral(this.betCount)
        .multiply(singlePrice)
        .format("0.00", Math.floor);
    },
    maxWinMoney() {
      if (!this.curDragon) {
        return 0;
      }
      const playValue = this.findPlayValueSelected(this.curDragon);
      if (!playValue) {
        return 0;
      }
      return numeral(this.betAmount)
        .multiply(playValue.odds)
        .format("0.00", Math.floor);
    },
    isDisableClearBtn() {
      return !this.curDragon;
    },
    isDisableSureBtn() {
      return !(this.betAmount > 0) || !this.curDragon || this.sureLoading;
    },
    hasBalance() {
      return Number(this.balance) > this.betAmount;
    },
  },
  mounted() {
    EventBus.addEventListener(
      "updatePrizeHistory",
      this.debounceDragonHandler,
      this
    );
    this.dragonHandler();
  },
  beforeDestroy() {
    EventBus.removeEventListener(
      "updatePrizeHistory",
      this.debounceDragonHandler,
      this
    );
  },
  activated() {
    this.resumeListPosition();
  },
  methods: {
    onBoxScroll: throttle(function() {
      this.saveListPosition();
      if (!this.curDragon) {
        return void 0;
      }
      const dragonElArr = this.$refs[`dragon-${this.curDragon.index}`];
      if (this.curDragon && dragonElArr) {
        const dragonEl = dragonElArr[0];
        const inContainer = isInContainer(dragonEl, this.$refs.scrollBox);
        this.manualScroll2Outer = !inContainer;
      }
    }, 200),
    onBetClick() {
      if (this.isDisableSureBtn) {
        return void 0;
      }
      if (!this.hasBalance) {
        return this.balanceNotEnoughModal();
      }
      const params = this.geneBetParams();
      if (!params) {
        return void 0;
      }
      if (this.sureLoading) return;
      this.sureLoading = true;
      this.$http
        .post("/api/v2/lottery/betting", params, { userId: true })
        .then((response) => {
          this.sureLoading = false;
          if (response.data.code !== 0) {
            return;
          }
          this.successModal();
          this.clearSelectedByDragon(this.curDragon);
          return this.$store.dispatch("bettingRecord");
        });
    },
    onBallClick(dragon, playValueIndex) {
      if (this.disableBallsIfNeeded(dragon)) {
        return void 0;
      }
      const lotteryPlayValues = dragon.lotteryPlayValues;
      const lotteryPlayValue = lotteryPlayValues[playValueIndex];
      const isSelected = lotteryPlayValue.selected;
      this.clearSelectedByDragon(this.curDragon);
      lotteryPlayValue.selected = !isSelected;
      if (lotteryPlayValue.selected) {
        this.curDragon = dragon;
      }
    },
    onClearClick() {
      if (this.isDisableClearBtn) {
        return void 0;
      }
      this.clearSelected(this.curDragon);
    },
    async dragonHandler() {
      let lastContainerScrollTop = 0;
      let lastElOffsetTop = 0;
      if (this.curDragon) {
        lastContainerScrollTop = this.$refs.scrollBox.scrollTop;
        lastElOffsetTop = this.$refs[`dragon-${this.curDragon.index}`][0]
          .offsetTop;
      }
      const res = await queryDragon();
      if (res.data.code !== 0) {
        return void 0;
      }
      const { data = [], systime = 0 } = res.data.data;
      this.dragonList = data.map((dragon, index) => {
        const lotteryPlayValues = [];
        dragon.lotteryPlayValue.split(",").forEach((playValue) => {
          lotteryPlayValues.push({
            ball: playValue,
            odds: dragon.maxOdds,
            selected: false,
          });
        });
        if (this.curDragonId && this.curDragonId === this.getDragonId(dragon)) {
          dragon.lotteryPlayValues = this.curDragon.lotteryPlayValues;
          this.curDragon = dragon;
        } else {
          dragon.lotteryPlayValues = lotteryPlayValues;
        }
        dragon.stopPeriod = !dragon.sellingPeriodNo;
        dragon.count =
          dragon.prePeriodNo === dragon.periodNo
            ? (dragon.closeTimeTs - systime) / 1000
            : 0;
        dragon.index = index;
        return dragon;
      });
      this.resumeSelectedPositionIfNeeded(
        lastContainerScrollTop,
        lastElOffsetTop
      );
    },
    resumeSelectedPositionIfNeeded(lastContainerScrollTop, lastElOffsetTop) {
      this.$nextTick(() => {
        if (this.curDragon) {
          const curIndexSelected = this.curDragon.index;
          const selectedInContainer = isInContainer(
            this.$refs[`dragon-${curIndexSelected}`][0],
            this.$refs.scrollBox
          );
          if (!this.manualScroll2Outer && !selectedInContainer) {
            this.$refs.scrollBox.scrollTop =
              this.$refs[`dragon-${curIndexSelected}`][0].offsetTop +
              (lastContainerScrollTop - lastElOffsetTop);
          }
        }
      });
    },
    disableBallsIfNeeded(dragon) {
      const isNeeded = dragon.stopPeriod || dragon.count === 0;
      if (isNeeded) {
        this.clearSelected(dragon);
      }
      return isNeeded;
    },
    clearSelectedByDragon(dragon) {
      if (!dragon) {
        return void 0;
      }
      dragon.lotteryPlayValues.forEach((playValue) => {
        if (playValue.selected) {
          this.curDragon = null;
        }
        playValue.selected = false;
      });
    },
    clearSelected(dragon) {
      if (dragon) {
        this.clearSelectedByDragon(dragon);
      } else {
        this.dragonList.forEach((dragon) => {
          this.clearSelectedByDragon(dragon);
        });
      }
    },
    findPlayValueSelected(dragon) {
      if (!dragon) {
        return void 0;
      }
      return dragon.lotteryPlayValues.find((playValue) => playValue.selected);
    },
    getDragonId(dragon) {
      if (!dragon) {
        return void 0;
      }
      return `${dragon.lotteryId}-${dragon.lotteryPlayId}-${dragon.lotteryPlayValue}`;
    },
    balanceNotEnoughModal() {
      this.$emit("modal", {
        show: true,
        title: this.$tex("下注提示"),
        okText: this.$tex("充值"),
        ok: () => {
          this.$router.push({
            name: "personalCenter",
            params: { id: "recharge" },
          });
        },
        content: this.$tex("余额不足"),
        isOk: true,
        isCancel: true,
      });
    },
    successModal() {
      this.$emit("modal", {
        show: true,
        title: this.$tex("下注提示"),
        content: this.$tex("投注成功"),
        isOk: false,
        isCancel: false,
        isSuccessIcon: true,
      });
    },
    geneBetParams() {
      const playValue = this.findPlayValueSelected(this.curDragon);
      if (!playValue) {
        return void 0;
      }
      return {
        bettingInfoList: [
          {
            bettingMoney: this.betAmount,
            bettingNum: this.betCount,
            lotteryBettingId: `${this.curDragon.lotteryPlayId}`,
            lotteryId: this.curDragon.lotteryId,
            lotteryNumber: playValue.ball,
            lotteryPlayId: this.curDragon.lotteryPlayId,
            odds: playValue.odds,
            rebate: 0,
            singleMoney: this.singlePrice,
          },
        ],
        totalMoney: this.betAmount,
        bettingRecordList: [
          {
            lotteryRecordId: this.curDragon.lotteryRecordId,
            periodNo: this.curDragon.sellingPeriodNo,
            num: 1,
          },
        ],
      };
    },
    saveListPosition() {
      this.listPosition = this.$refs.scrollBox.scrollTop;
    },
    resumeListPosition() {
      this.$refs.scrollBox.scrollTop = this.listPosition;
    },
    getDragonValueClass(dragonValue) {
      return {
        "longhelperlist-item__dragonvalue--small":
          dragonValue === this.$tex("小"),
        "longhelperlist-item__dragonvalue--odd":
          dragonValue === this.$tex("单"),
        "longhelperlist-item__dragonvalue--big":
          dragonValue === this.$tex("大"),
        "longhelperlist-item__dragonvalue--even":
          dragonValue === this.$tex("双"),
      };
    },
  },
};
</script>

<style scoped lang="less">
@deep: ~">>>";

.longhelperlist {
  position: relative;
  height: 100%;
  width: 100%;
  padding-bottom: 50px;
}

.longhelperlist__box {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  padding-top: 3px;
  padding-bottom: 50px;
}

.longhelperlist-toolbar {
  position: absolute;
  bottom: 0;
  width: 100%;
}
.longhelperlist-toolbar__top {
  padding: 0 20px;
  background-color: #f9f7ea;
  border: 1px solid #dddddd;
  min-height: 40px;
  font-size: 13px;
  color: #555555;
  display: flex;
  align-items: center;
}
.longhelperlist-toolbar__main {
  height: 50px;
  background: #000000;
  display: flex;
  color: #ffffff;
  font-size: 16px;
}

.longhelperlist-toolbar__clear,
.longhelperlist-toolbar__dsc,
.longhelperlist-toolbar__sure {
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}

.longhelperlist-toolbar__clear {
  background: #404247;
  &&--disabled {
    opacity: 0.8;
    cursor: not-allowed;
  }
}

.longhelperlist-toolbar__dsc {
  flex: 1;
  font-size: 13px;
}

.longhelperlist-toolbar__sure {
  background: #ff464b;
  &&--disabled {
    opacity: 0.8;
    cursor: not-allowed;
  }
}

.longhelperlist-toolbar__clear,
.longhelperlist-toolbar__sure {
  width: 90px;
  cursor: pointer;
}
.longhelperlist-toolbar__primary {
  color: #ff464b;
}
.longhelperlist-item {
  padding: 10px;
  background: #ffffff;
  border-radius: 8px;
  margin: 7px;
  min-height: 104px;
}

.longhelperlist-item__title {
  font-size: 16px;
  color: #333333;
  vertical-align: middle;
}

.longhelperlist-item__period {
  font-size: 12px;
  color: #838383;
  margin-left: 5px;
  vertical-align: middle;
}

.longhelperlist-item__body {
  display: flex;
  margin-top: 10px;
  justify-content: space-between;
}

.longhelperlist-item__startlotto {
  display: flex;
}

.longhelperlist-item__lotimg {
  float: none;
  width: 52px;
  height: 52px;
  margin-right: 10px;
}

.longhelperlist-item__balls {
  display: flex;
  align-items: center;

  &--disabled {
    .longhelperlist-item__ball {
      border-color: #dddddd;
      background: #ffffff;
      cursor: not-allowed;

      .longhelperlist-item__ballvalue,
      .longhelperlist-item__odds {
        color: #aaaaaa;
      }
    }

    .longhelperlist-item__pk {
      background-image: url("~@/assets/images/longqueue/PK-hui.png");
    }
  }
}

.longhelperlist-item__pk {
  width: 30px;
  height: 27px;
  display: inline-block;
  background: url("~@/assets/images/longqueue/PK-cai.png") no-repeat center
    center;
  background-size: 100% 100%;
  margin: 0 8px;
}

.longhelperlist-item__pp {
  margin-top: 8px;
}

.longhelperlist-item__p,
.longhelperlist-item__playname,
.longhelperlist-item__dragonvalue {
  background: #eaeaea;
  border-radius: 2px;
  font-size: 12px;
  color: #666666;
  padding: 2px 4px;
}
.longhelperlist-item__dragonvalue--small,
.longhelperlist-item__dragonvalue--odd {
  background: #5596d4;
  color: #ffffff;
}
.longhelperlist-item__dragonvalue--big,
.longhelperlist-item__dragonvalue--even {
  background: #f2a03a;
  color: #ffffff;
}
.longhelperlist-item__ball {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #dddddd;
  border-radius: 8px;
  padding: 0 10px;
  text-align: center;
  cursor: pointer;
  width: 53px;

  &--selected {
    border-color: #ff464b;
    background: #ff464b;

    .longhelperlist-item__ballvalue,
    .longhelperlist-item__odds {
      color: #ffffff;
    }
  }
}

.longhelperlist-item__ballvalue {
  font-size: 22px;
  color: #555555;
}

.longhelperlist-item__odds {
  font-size: 12px;
  color: #838383;
}
.zk-input-wrap {
  margin: 0 8px;
  @{deep} {
    input {
      width: 75px;
    }
  }
}
</style>
