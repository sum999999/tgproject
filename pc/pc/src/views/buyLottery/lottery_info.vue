<template>
  <div class="lottery-info">
    <div class="lottery-title">
      <div class="lottery-logo">
        <img class="w-full" :src="data.lotteryIcon" />
      </div>
      <div class="title-wrap">
        <h4 class="title">{{ data.lotteryName }}</h4>
      </div>
    </div>
    <div class="next-time">
      <div class="stop-period" v-if="stopPeriod">
        {{ $tex("已停期") }}
      </div>
      <div class="next-time-period" v-else>
        <p class="series">
          <i18n path="第{num}期" :tag="false">
            <template slot="num">
              <span> {{ recordList.periodNo }} </span>
            </template>
          </i18n>
          <br />{{ $tex("投注还剩") }}
        </p>
        <div class="timing">
          <i class="i-icon i-down-count">{{ timeTxt[0] }}</i>
          <i class="i-icon i-min-down-count">{{ timeTxt[1] }}</i>
          <i class="i-icon i-sec-down-count">{{ timeTxt[2] }}</i>
        </div>
      </div>
      <!-- 声音部分 -->
      <div class="sound-set-wp">
        <sound
          @open-close-voice="openCloseVoice"
          @send-select-voice="receiveSelectVoice"
        ></sound>
      </div>
    </div>
    <div class="last-result">
      <audio id="prizeVoice" @ended="isAudioOver" preload="false">
        <source :src="`/static/voices/${voiceSrc}.wav`" type="audio/wav" />
        {{ $tex("您的浏览器不支持 audio 元素。") }}
      </audio>
      <p class="last-time lf">
        <!-- 开奖 -->
        <i v-if="isTarBall">
          <i18n path="第{num}期" :tag="false">
            <template slot="num">
              <span> {{ recordList.prePeriodNo }} </span>
            </template>
          </i18n>
          <br />
        </i>
        <!-- 未开奖 -->
        <i v-if="!isTarBall">
          <i18n path="第{num}期" :tag="false">
            <template slot="num">
              <span> {{ recordList.prePeriodNo }} </span>
            </template>
          </i18n>
          <br />{{ $tex("正在开奖") }}...
        </i>
        <i class="history-ball">
          <div class="txt">
            <span class="his-prize">{{ $tex("历史开奖") }}</span>
            <span class="prize-icon"></span>
          </div>
          <div class="history" :class="{ 'short-padding': !isTarBall }">
            <div class="history-inside-wrapper">
              <!-- <prize-list :code="$attrs.code" :prePrizeList="prePrizeList"></prize-list> -->
              <prize-list
                v-bind="$attrs"
                @getRefresh="getPrePrizeResult"
                :prePrizeList="prePrizeList"
              ></prize-list>
            </div>
          </div>
        </i>
      </p>
      <div class="ball lf qwc" v-if="data.code === 'qwc'">
        <transition-group name="list" tag="div">
          <qwc-ball
            v-for="(item, i) in btnList"
            :key="`${data.code}_${i}`"
            :ball="item.ball"
          >
          </qwc-ball>
        </transition-group>
      </div>
      <div
        class="ball newBall"
        v-else-if="data.code !== 'pcdd' && data.code !== '6hc'"
      >
        <transition-group name="list" tag="div">
          <span
            v-for="(item, i) in btnList"
            :key="`${data.code}_${i}`"
            :class="[btnList.length > 7 ? 'large' : '']"
            :style="{ animationDelay: 0.08 * i + 's' }"
          >
            <i>{{ item.ball }}</i>
          </span>
        </transition-group>
        <span
          v-show="sizeParity.size"
          :class="[
            sizeParity.size === '大'
              ? 'history-prize-infos__big'
              : 'history-prize-infos__small',
          ]"
          >{{ sizeParity.size }}</span
        >
        <span
          v-show="sizeParity.num"
          :class="[
            sizeParity.num === '双'
              ? 'history-prize-infos__even'
              : 'history-prize-infos__odd',
          ]"
          >{{ sizeParity.num }}</span
        >
      </div>
      <div class="ball lf pcdd" v-else-if="data.code === 'pcdd'">
        <transition-group name="list" tag="div">
          <span
            v-for="(item, i) in btnList"
            :key="`${data.code}_${i}`"
            :style="{ animationDelay: 0.08 * i + 's' }"
          >
            <i>{{ item.ball }}</i>
            <em v-if="i < 2">+</em>
            <em v-if="i === 2">=</em>
            <i class="sum" v-if="i === 2" :class="pcggSum.clr">{{
              pcggSum.sum
            }}</i>
          </span>
        </transition-group>
        <div style="display: flex; justify-content: center;">
          <span
            v-show="sizeParity.size"
            :class="[
              sizeParity.size === '大'
                ? 'history-prize-infos__big'
                : 'history-prize-infos__small',
            ]"
            >{{ sizeParity.size }}</span
          >
          <span
            v-show="sizeParity.num"
            :class="[
              sizeParity.num === '双'
                ? 'history-prize-infos__even'
                : 'history-prize-infos__odd',
            ]"
            >{{ sizeParity.num }}</span
          >
        </div>
      </div>
      <div class="ball lf sixhc" v-else>
        <transition-group name="list" tag="div">
          <span
            v-for="(item, i) in btnList"
            :key="`${data.code}_${i}`"
            :class="[item.clr, i === 6 ? 'left-margin' : '']"
            :style="{ animationDelay: 0.08 * i + 's' }"
          >
            <i>
              <span>{{ item.ball }}</span>
            </i>
            <em v-if="i === 5">+</em>
          </span>
        </transition-group>
        <div class="zodiac">
          <animal
            v-for="(item, i) in btnList"
            :key="i"
            :text="item.zodiac"
          ></animal>
          <!--            <span-->
          <!--                    v-for="(item, i) in btnList"-->
          <!--                    :key="i"-->
          <!--            >{{item.zodiac}}</span>-->
        </div>
      </div>
    </div>
    <!-- 暂时注释，测试 -->
    <!-- <modal
      :modalShow="isShowModal"
      :width="452"
      :hasFooter="false"
      claName="period-modal"
      @btn-cancel="isShowModal = false"
    >
      <div slot="content">
        <p class="title">期数提示</p>
        <div class="content">
          <Icon type="information-circled"></Icon>
          <p>
            <span>期数已发生改变，当前期数为</span> :
            <span class="period-no">{{recordList.periodNo}}</span>
          </p>
        </div>
      </div>
    </modal> -->
  </div>
</template>

<script>
let pcdd = {
  green: ["1", "4", "7", "10", "16", "19", "22", "25"],
  blue: ["2", "5", "8", "11", "17", "20", "23", "26"],
  red: ["3", "6", "9", "12", "15", "18", "21", "24"],
  gray: ["0", "13", "14", "27"],
};
import getZodiac from "@/utils/format-ball/zodica.js";
import prizeList from "./child_modal/common_vue/prize_list.vue";
import modal from "@/components/modal.vue";
import sound from "./lottery_sound";
import EventBus from "@/utils/eventBus";
import Animal from "@/components/Animal";
import QwcBall from "./components/QwcBall";
import { mapGetters } from "vuex";
import countdown from "@/utils/countdown";
import formatKsan from "@/utils/format-ball/format_ksan.js";
import formatPcdd from "@/utils/format-ball/format_pcdd.js";
import { formatSsc } from "@/utils/format-ball/format_ssc.js";

export default {
  props: {
    data: {
      type: Object,
    },
  },
  components: { prizeList, modal, sound, Animal, QwcBall },
  data() {
    return {
      prePrizeList: [],
      isShowModal: false,
      btnList: [],
      recordList: {},
      timer: null,
      animatedTimer: null,
      surplusTime: 0,
      timeTxt: ["00", "00", "00"],
      downNum: 0,
      lotteryId: 0,
      sizeParity: [], // 开奖大小单双
      pcggSum: { sum: 0, clr: "red" }, //pcgg的特码
      isTarBall: false, //开奖号码
      // inf:'', //声音控件
      voiceComponent: "", //铃声控件
      isCloseVoice: false, //是否设置了关闭声音,true表示关闭声音
      voiceSrc: "ring_01", //声音源
      stopPeriod: false,
    };
  },
  computed: {
    ...mapGetters(["user"]),
    isLogin() {
      return !!this.user.userId;
    },
  },
  watch: {
    data: {
      handler(newValue, oldValue) {
        // debugger;
        if (!this.isCloseVoice) {
          //切换彩种,音乐处于打开状态时重新加载audio
          this.reloadSound();
        }
        this.btnList = [];
        this.sizeParity = [];
        if (this.timer) clearInterval(this.timer);
        this.getData();
      },
      deep: true,
    },
  },
  methods: {
    updatePrizeHistory(event) {
      let extra = event.target;
      if (typeof extra === "string") {
        extra = JSON.parse(extra);
      }
      let prePrizeInfo = extra;

      if (
        prePrizeInfo.periodNo === this.recordList.prePeriodNo &&
        this.$route.params.id === prePrizeInfo.lotteryId
      ) {
        if (!this.isCloseVoice) {
          this.playSound();
        }
        this.getBalls(prePrizeInfo.lotteryNumber.replace(/\|/, ","));
        this.isTarBall = true;
        this.prePrizeList[0].periodNo = prePrizeInfo.periodNo;
        this.prePrizeList[0].lotteryNumber = prePrizeInfo.lotteryNumber;
      }
    },
    receiveSelectVoice(src) {
      //设置选择的音乐
      this.voiceSrc = src;
      this.voiceComponent.load();
    },
    openCloseVoice(flag) {
      //打开或者关闭声音
      this.isCloseVoice = flag;
      if (flag) {
        //播放状态时点击关闭则停止播放
        this.pauseSound();
        return;
      }
      //打开声音则重置声音
      this.reloadSound();
    },
    playSound() {
      //播放声音
      if (!this.voiceComponent) return;
      if (!this.voiceComponent.paused) return;
      try {
        this.voiceComponent.play();
      } catch (error) {
        console.log("播放声音时:", error);
        // this.voiceComponent.play();
      }
      // var media = document.getElementById("YourVideo");
      // const playPromise = media.play();
      // if (playPromise !== null){
      //     playPromise.catch(() => { media.play(); })
      // }
    },
    pauseSound() {
      //暂停声音
      if (!this.voiceComponent) return;
      if (this.voiceComponent.paused) return;
      try {
        this.voiceComponent.pause();
      } catch (error) {
        console.log("暂停声音时:", error);
      }
    },
    reloadSound() {
      //重置声音
      if (!this.voiceComponent) return;
      if (this.voiceComponent.ended) return;
      try {
        this.voiceComponent.load();
      } catch (error) {
        console.log("重置声音时:", error);
      }
    },
    getData() {
      let vm = this;
      // debugger;
      if (this.$route.params.id !== this.data.lotteryId) {
        if (this.timer) {
          clearInterval(this.timer);
          return;
        }
      }
      vm.$http
        .post(
          "/api/v2/lottery/queryLotteryRecordListV2",
          {
            lotteryId: this.data.lotteryId,
            num: 1,
          },
          { unenc: true }
        )
        .then((response) => {
          if (response.data.code !== 0) {
            setTimeout(vm.getData(), 3000);
            return;
          }
          if (vm.lotteryId === vm.data.lotteryId) {
            //切换彩票不提示
            vm.isShowModal = true;
            setTimeout(() => {
              vm.isShowModal = false;
            }, 2000);
          }
          this.$emit("has-get-result"); //通知父组件切换菜单有效了
          if (this.timer) clearInterval(this.timer);
          this.isTarBall = false; //初始化
          let data = response.data.data;
          vm.prePrizeList = data.prizeHistoryList;
          // 大小，单双
          let listArray = vm.prePrizeList[0].lotteryNumber.split(",");
          let info = {};
          if (this.data.code === "ksan") {
            info = formatKsan(listArray);
          } else if (this.data.code === "ssc") {
            info = formatSsc(listArray);
          } else if (this.data.code === "pcdd") {
            listArray = formatPcdd(listArray)
              .at(-1)
              .desc.split("|");
            info = {
              size: String(listArray[0]).trim(),
              num: String(listArray[1]).trim(),
            };
          }
          this.sizeParity = info;

          if (data.recordList.length) {
            vm.recordList = data.recordList[0];
            vm.recordList.stopPeriod = vm.stopPeriod = false;
          } else {
            vm.recordList.stopPeriod = vm.stopPeriod = true;
            vm.recordList.prePeriodNo = "";
            vm.recordList.preLotteryTime = "";
            vm.recordList.preLotteryNumber = "";
          }
          if (data.prizeHistoryList.length) {
            vm.recordList.prePeriodNo = data.prizeHistoryList[0].periodNo;
            vm.recordList.preLotteryTime = data.prizeHistoryList[0].prizeTime;
            vm.recordList.preLotteryNumber =
              data.prizeHistoryList[0].lotteryNumber;
          }
          vm.recordList.lotteryName = this.data.lotteryName; // 5.25
          // console.log('vm.recordList', vm.recordList)
          vm.$store.commit("getPreiodInfo", vm.recordList);
          vm.$store.commit("getPrizeEndTime", vm.recordList.endTime); //2.26
          // vm.lotteryId = vm.data.lotteryId //彩种改变
          vm.downNum = 0;
          let preLotteryNumber = vm.recordList.preLotteryNumber;
          if (preLotteryNumber) {
            //上期开奖
            vm.getBalls(preLotteryNumber.replace(/\|/g, ","));
            this.isTarBall = true;
            //发出声音
            // debugger;
            if (!vm.isCloseVoice && vm.lotteryId === vm.data.lotteryId) {
              this.playSound();
            }
          } else {
            //上期没开奖
            this.btnList = [];
            this.isTarBall = false;
            // if (!Object.keys(vm.$store.state.user).length) {
            //     vm.getPrePrizeResult();
            // }
          }
          vm.lotteryId = vm.data.lotteryId; //彩种改变
          if (vm.recordList) {
            if (vm.timer) clearInterval(vm.timer);
            vm.setFirstTime();
          }
        })
        .catch(() => {
          setTimeout(() => {
            vm.getData();
          }, 3000);
        });
    },
    //未登录状态请求上期结果
    getPrePrizeResult() {
      if (this.downRefreshFinish) {
        this.downRefreshFinish = false;
        this.$http
          .post(
            "/api/v2/lottery/queryLotteryNumberByPeriod",
            {
              lotteryId: this.lotteryId,
              periodNo: [this.recordList.prePeriodNo],
            },
            { unenc: true }
          )
          .then((response) => {
            this.downRefreshFinish = true;
            if (response.data.code !== 0) return;
            let preLotteryNumber = response.data.data[0].lotteryNumber;
            if (preLotteryNumber) {
              this.getBalls(preLotteryNumber.replace(/\|/g, ","));
              this.isTarBall = true;
              this.prePrizeList[0].periodNo = response.data.data[0].periodNo;
              this.prePrizeList[0].lotteryNumber =
                response.data.data[0].lotteryNumber;
            }
          });
      }
    },
    setFirstTime() {
      let vm = this;
      let startTime = vm.recordList.sysDate;
      vm.surplusTime = vm.recordList.endTime - startTime;
      const avgTime = vm.surplusTime / 2;
      let avgGetDataFlag = false;
      // 得到计算结果
      this.countDown();
      this.timer = countdown(vm.surplusTime / 1000, (s, ms) => {
        vm.surplusTime = ms;
        vm.downNum++;
        vm.countDown();
        if (
          !vm.isLogin &&
          !avgGetDataFlag &&
          ms < avgTime &&
          (!vm.btnList || !vm.btnList.length)
        ) {
          avgGetDataFlag = true;
          vm.getData();
        }
        if (
          s === 0 ||
          (parseInt(vm.data.lotteryId) === 17 && vm.downNum >= 3600)
        ) {
          clearInterval(vm.timer);
          // 停留1秒为开奖时间
          vm.timeTxt = ["00", "00", "00"];
          //   setTimeout(vm.getData, 1000)
          vm.getData(); // 2018.12.29 by xiaojiji
        }
      });
    },
    //  倒计时结束
    countDown() {
      let vm = this;
      let obj = {};
      let days = Math.floor(this.surplusTime / (24 * 3600 * 1000));
      //计算出小时数
      let leave1 = this.surplusTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
      obj.hours = Math.floor(leave1 / (3600 * 1000)) + days * 24;
      //计算相差分钟数
      let leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
      obj.minutes = Math.floor(leave2 / (60 * 1000));
      //计算相差秒数
      let leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
      obj.seconds = Math.round(leave3 / 1000);
      ["hours", "minutes", "seconds"].forEach((item) => {
        if (obj[item] < 10) obj[item] = "0" + obj[item];
      });
      this.timeTxt = [obj.hours, obj.minutes, obj.seconds];
    },
    getBalls: function(ball) {
      if (!ball) return;
      let btns = ball.split(",");
      let btnList = [];
      let label = "";
      let zTxt = "";
      let clr = "";
      let zodiac;

      //   if (this.data.lotteryId === '17' || this.data.lotteryId === '20' || this.data.lotteryId === '43') {

      if (this.data.code == "6hc") {
        let pop = btns.pop();
        let arr = pop.split("+");
        btns = btns.concat(arr);
        label = "liuhe";
        zodiac = getZodiac(this.recordList.preLotteryTime);
      } else if (
        this.data.lotteryId === "19" ||
        this.data.lotteryId === "2" ||
        this.data.code === "pcdd"
      ) {
        label = "pcdd";
      }
      let sum = 0; //pcgg特码
      btns.forEach((item) => {
        if (label === "liuhe") {
          // 计算生肖
          let index = null;
          zodiac.forEach((value) => {
            if (
              value.data.some((vvv, idx) => {
                index = idx;
                return vvv === item;
              })
            ) {
              zTxt = value.label;
              clr = value.clrs[index];
            }
          });
        } else if (label === "pcdd") {
          sum += parseInt(item);
          for (var key in pcdd) {
            if (pcdd[key].some((value) => item === value)) {
              clr = key;
            }
          }
        }
        btnList.push({ clr: clr, ball: item, zodiac: zTxt });
      });
      this.pcggSum.sum = sum; //pcgg的特码
      for (var key in pcdd) {
        if (pcdd[key].some((value) => this.pcggSum.sum === parseInt(value))) {
          this.pcggSum.clr = key;
        }
      }
      this.btnList = btnList;
    },
    isAudioOver() {
      this.voiceComponent.load();
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.voiceComponent = document.getElementById("prizeVoice");
    });
  },
  created() {
    EventBus.addEventListener(
      "updatePrizeHistory",
      this.updatePrizeHistory,
      this
    );
    this.downRefreshFinish = true;
    this.getData();
  },
  beforeDestroy() {
    EventBus.removeEventListener(
      "updatePrizeHistory",
      this.updatePrizeHistory,
      this
    );
    this.pauseSound();
  },
  destroyed() {
    if (this.timer) clearInterval(this.timer);
  },
};
</script>

<style lang="less" scoped>
@deep: ~">>>";
.list-enter-active {
  animation-duration: 1s;
  animation-fill-mode: both;
  animation-name: zoomInDown;
}
.list-leave-to {
  animation-duration: 0s;
  animation-delay: 0s !important;
}
@keyframes zoomInDown {
  from {
    opacity: 0;
    -webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);
    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);
    -webkit-animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }
  60% {
    opacity: 1;
    -webkit-transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);
    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);
    -webkit-animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
  }
}
.lottery-info {
  font-size: 16px;
  display: flex;
  align-items: center;
  padding: 10px 0;
}
/* 左边部分 */
.lottery-info .lottery-title {
  display: flex;
  flex: 1;
}
.lottery-info .container {
  display: flex;
}
.lottery-info .container > * {
  display: inline-block;
}
.lottery-info .container audio {
  width: 0;
}
.lottery-info .interval {
  position: absolute;
  right: 0;
  top: 10px;
  height: 70px;
  width: 2px;
  /* background: @lottery-info-interval-bg;
  border-right: 1px solid @lottery-info-interval-border; */
}
.lottery-title .lottery-logo {
  vertical-align: top;
  width: 70px;
  height: 70px;
  margin-left: 22px;
}
.lottery-title .title-wrap {
  display: flex;
  align-items: center;
  padding-left: 20px;
}
.lottery-title .title {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-weight: bold;
  font-size: 24px;
  font-style: italic;
  color: #fff;
  letter-spacing: 2px;
}
/* 左边部分结束 */
/* 中间部分 */
.lottery-info .next-time {
  color: #fff;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.lottery-info .next-time-period {
  display: flex;
}
.lottery-info .next-time .container,
.lottery-info .last-result .container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.lottery-info .next-time .series {
  width: 140px;
  font-size: 14px;
  text-align: center;
  line-height: 18px;
  margin-right: 15px;
}
.lottery-info .next-time .series span {
  /* color: @buy-lottery-common-color; */
}
.lottery-info .next-time .timing i {
  height: 54px;
  width: 52px;
  line-height: 60px;
  border-radius: 3px;
  text-align: center;
  font-size: 18px;
  /*   color: @lottery-info-i-color; */
  font-weight: bold;
}
.lottery-info .next-time .sound-set-wp {
  margin-left: 50px;
  height: 49px;
}

/* 中间部分结束 */
/* 右边部分 */
.lottery-info .last-result {
  color: #fff;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.lottery-info .last-result .container {
  position: relative;
}
.lottery-info .last-result .container .ball,
.lottery-info .last-result .container .lee-set-container-inside {
  width: auto;
}
.lottery-info .last-result .container .history-prize {
  overflow: hidden;
}
.lottery-info .last-result .history {
  position: absolute;
  width: 452px;
  right: 0;
  padding-top: 18px;
  visibility: hidden;
  z-index: 11;
}
.lottery-info .last-result .short-padding {
  padding-top: 9px;
}
.lottery-info .last-result .history-inside-wrapper {
  height: 0;
  overflow: hidden;
  transition: all 0.3s;
  box-shadow: 0px 0px 6px -5px rgba(0, 0, 0, 0.2),
    0px 0px 0px rgba(0, 0, 0, 0.2), 0px 6px 5px rgba(0, 0, 0, 0.2);
}
.lottery-info .last-result .history-ball:hover .history {
  visibility: visible;
}
.lottery-info
  .last-result
  .history-ball:hover
  .history
  .history-inside-wrapper {
  height: 465px;
}
.last-result .last-time {
  display: inline-block;
  // width: 132px;
  width: 140px;
  font-size: 14px;
  text-align: center;
  line-height: 18px;
  margin: 5px 10px 0 10px;
}
.lottery-info .last-result .last-time i {
  display: block;
  width: 100%;
}
.last-result .last-time i.history-ball {
  width: 126px;
  margin: auto;
  cursor: default;
}
.lottery-info .last-result .no-result {
  padding-top: 15px;
}
.last-result .last-time .history-ball .txt {
  margin: 5px auto 0;
  line-height: 23px;
  text-align: center;
}
.last-result .last-time .history-ball .his-prize {
  margin-left: 3px;
}
.last-result .last-time i:last-child span {
  color: #fffcfe;
}
.last-result .last-time i .prize-icon {
  display: inline-block;
  vertical-align: middle;
  margin-left: 3px;
  width: 20px;
  height: 14px;
  background: url("~@/assets/images/icon.png") no-repeat -574px -350px;
}
.last-result .last-time span {
  color: #ffea00;
}
/* 开奖历史结束 */
/* 上期开奖号码 */
.last-result .ball {
  /*width: 448px;*/
}
.last-result .ball.sixhc > div:nth-child(1) {
  display: flex;
}
.last-result .ball.sixhc .zodiac {
  word-break: break-all;
  line-height: 1;
  display: flex;
  padding-top: 5px;
  .animal.animal--7 {
    @{deep} {
      img {
        filter: invert();
      }
    }
  }
}
.last-result .ball span {
  position: relative;
  display: inline-block;
  font-size: 16px;
  width: 35px;
  margin-right: 12px;
  text-align: center;
  border-radius: 50%;
  cursor: pointer;
}
.last-result .ball span:hover i {
  animation-duration: 1s;
  animation-fill-mode: both;
  animation-name: bounceIn;
}
@keyframes bounceIn {
  0%,
  20%,
  40%,
  60%,
  80%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  20% {
    transform: scale3d(1.1, 1.1, 1.1);
  }
  40% {
    transform: scale3d(0.9, 0.9, 0.9);
  }
  60% {
    opacity: 1;
    transform: scale3d(1.03, 1.03, 1.03);
  }
  80% {
    transform: scale3d(0.97, 0.97, 0.97);
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
}
.last-result .ball.pcdd span {
  margin-right: 15px;
}
.last-result .ball .left-margin {
  margin-left: 5px;
}
.last-result .ball span i {
  display: block;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  line-height: 35px;
  font-size: 16px;
  text-align: center;
  background: #fff;
  /*   background: radial-gradient(
    @lottery-info-ball-gradient-bg-one 21%,
    @lottery-info-ball-gradient-bg-two
  );
  color: @lottery-info-ball-color; */
  font-weight: 700;
  margin: 2px 0;
}
.last-result .ball .sum {
  position: absolute;
  right: -51px;
  top: 0;
}
.last-result .ball em {
  position: absolute;
  top: 9px;
  right: -1px;
  width: 12px;
  height: 24px;
  font-style: normal;
}
.last-result .ball.pcdd em {
  right: -13px;
}
/* pcdd */
.last-result .ball .large {
  width: 35px;
}
.last-result .ball .large i {
  height: 35px;
  line-height: 35px;
  font-size: 16px;
  margin-right: 6px;
}
.last-result .ball span:nth-child(6).green,
.last-result .ball span:nth-child(6).red,
.last-result .ball span:nth-child(6).blue {
  width: 50px !important;
  margin-right: 0;
  border-radius: 0;
  background: none;
}
/* pcdd 结束*/
/* 6hc */
.last-result .ball .zodiac span:last-child {
  margin: 0 10px;
}
.last-result .ball > span.sixhc-red {
  background: #e50000;
}
.last-result .ball span i.sixhc {
  background: #c0bfbf;
  background: radial-gradient(#fcfcfc 21%, #c0bfbf);
}
/* 6hc结束 */
/* pcdd和六合彩号码颜色*/
.last-result .ball .blue,
.last-result .ball .blue i,
.last-result .pcdd .sum.blue {
  background: #0035ae;
  background: radial-gradient(#007ef9 27%, #0035ae);
  color: #fff;
}
.last-result .ball .green,
.last-result .ball .green i,
.last-result .pcdd .sum.green {
  background: #017019;
  background: radial-gradient(#1acb01 3%, #017019);
  color: #fff;
}
.last-result .ball .red,
.last-result .ball .red i,
.last-result .pcdd .sum.red,
.last-result .ball.pcdd i {
  background: #e50000;
  background: radial-gradient(#ff6050 7%, #e50000);
  color: #fff;
}
.last-result .ball .gray {
  background: #aaa;
}
.last-result .ball .sum.gray {
  background: #aaa;
}
/* pcdd和六合彩号码颜色结束 */
// .lottery-title,
.next-time,
.last-result {
  position: relative;
  height: 100%;
  text-align: center;
}
// 大小 单双
.newBall {
  display: flex;
  align-items: center;
  width: 250px;
}
.last-result .ball .history-prize-infos__big,
.last-result .ball .history-prize-infos__small,
.last-result .ball .history-prize-infos__odd,
.last-result .ball .history-prize-infos__even {
  font-size: 16px;
  color: #333333;
  width: 35px;
  height: 35px;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  flex-shrink: 0;
}
.history-prize-infos__small,
.history-prize-infos__odd {
  background-color: #5596d4;
}
.history-prize-infos__big,
.history-prize-infos__even {
  background-color: #f2a03a;
}
</style>
<style scoped>
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
  padding: 18px 0 0 48px;
  margin-top: 6px;
  font-size: 16px;
}
.v-transfer-dom >>> .period-modal .content i {
  position: absolute;
  left: 0;
  top: 10px;
  color: #2d8cf0;
  font-size: 36px;
}
.v-transfer-dom >>> .period-modal .content .period-no {
  /*  color: #be1204; */
  font-size: 20px;
}
.stop-sale {
  position: absolute;
  left: 0;
  right: 0;
  top: 15px;
  width: 200px;
  height: 60px;
  line-height: 60px;
  font-size: 36px;
  color: #d0594f;
  margin: 0 auto;
  background-color: #980c00;
  border: 1px solid #980c00;
  border-radius: 6px;
}
.rt {
  float: right;
}
.stop-period {
  font-size: 34px;
  margin-right: 135px;
}
</style>
