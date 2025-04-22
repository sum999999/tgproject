<template>
  <div
    class="num-list"
    :class="{
      'num-list--big': hasPermission('buyLottery.bigBall'),
    }"
  >
    <div v-if="data.layout.positionbar" class="btns-position">
      <span>{{ $tex("位置") }}</span>
      <span>
        <CheckboxGroup v-model="btnsPosition" @on-change="positionSelect">
          <Checkbox
            v-for="item in data.layout.positionbar.btns"
            :label="item.operator"
            :key="item.operator"
          ></Checkbox>
        </CheckboxGroup>
      </span>
    </div>
    <ul v-if="type !== '3'">
      <li v-for="(item, itemIdx) in ballList" :key="itemIdx">
        <label v-if="item.name">{{ item.name }}</label>
        <!-- <div class="all-balls" >
                    <i class="ball" v-for="(vv, vvIdx) in item.balls" :key="vv.ball" :class="{selected: vv.selected}" @click="chooseBall(vv, vvIdx, item, itemIdx)">{{vv.ball}}</i>
                </div> -->
        <!--单赔率 -->
        <!-- v-if="data.layout.playType === '1'" -->
        <div class="all-balls" v-if="data.layout.rates.length === '1'">
          <i
            class="ball"
            v-for="(vv, vvIdx) in item.balls"
            :key="vv.ball"
            :class="{ selected: vv.selected }"
            @click="chooseBall(vv, vvIdx, item, itemIdx)"
            >{{ vv.ball }}</i
          >
        </div>
        <!-- 多赔率 -->
        <div class="all-balls" v-else>
          <i
            class="ball"
            v-for="(vv, vvIdx) in item.balls"
            :key="vv.ball"
            :class="{ selected: vv.selected }"
            @click="chooseBall(vv, vvIdx, item, itemIdx)"
          >
            {{ vv.ball }}
            <span
              class="ball-odds"
              v-if="$store.getters.sysShowOdds == '1' || user.userId"
              >{{ vv.odds }}</span
            >
          </i>
        </div>
        <div v-if="data.layout.toolbar" class="ball-bts">
          <!-- {type: value.methodName, item: item.balls} -->
          <span
            class="ball"
            v-for="(vv, idx) in data.layout.toolbar.btns"
            :key="idx"
            @click="chooseBall(vv, itemIdx)"
          >
            {{ vv.operator }}
          </span>
        </div>
        <div class="clr"></div>
      </li>
    </ul>
    <!-- 手动选号 -->
    <div v-else class="manual">
      <Input
        v-model="txtData"
        type="textarea"
        :rows="8"
        @on-change="inputSelect"
      ></Input>
      <p class="notes">
        <span>{{ $tex("注：") }}</span>
        <i>{{
          $tex(
            "每一注号码之间请用一个逗号或者|或者空格符号隔开（输入的号码会自动排序并去除不合格号码）。"
          )
        }}</i>
      </p>
    </div>
  </div>
</template>

<script>
import utils from "@/utils/utils";
import numeral from "numeral";
import { hasPermission } from "@/utils/authority-utils";

export default {
  props: {
    currentLottery: {
      type: Object,
    },
    refresh: {
      type: String,
    },
    oddDiff: {
      type: Number,
    },
  },
  data() {
    return {
      data: {}, // 数据
      ballList: [], // 选号列表
      selectedBalls: [], // 选中的球号
      type: "", // 判断选号类型
      txtData: "", // 手动选号的值,
      computeNote: "", // 计算注数
      btnsPosition: [], // 计算位置  目前只有时时彩任选 单选时有
      betLimRate: "1", //投注限制几成
      totalNoteFlag: true, //true限制，false不限制注数
      betNum: 0,
    };
  },
  watch: {
    // 监听选号类型改变 如果改变重新初始化
    currentLottery: {
      handler(newValue, oldValue) {
        this.init();
      },
      deep: true,
    },
    refresh(n, o) {
      this.ballList.forEach((item) => {
        item.balls.forEach((value) => {
          value.selected = false;
        });
      });
      this.txtData = "";
      this.btnsPosition = [];
    },
    oddDiff(newVal) {
      //滑块变化时
      // console.log(typeof newVal);
      let currentLottery = JSON.parse(JSON.stringify(this.currentLottery));
      let layout = JSON.parse(currentLottery.layout);
      this.ballList.forEach((item) => {
        item.balls.forEach((value, index) => {
          let curRates = layout.rates.find((item) => item.ball == value.ball);
          if (curRates) {
            let maxOdds = curRates.maxOdds;
            let odds = numeral(maxOdds)
              .subtract(curRates.minOdds)
              .divide(100)
              .value(); // (maxOdds - layout.rates[index].minOdds) / 100;
            let newOdds = numeral(maxOdds)
              .subtract(
                numeral(newVal)
                  .multiply(odds)
                  .value()
              )
              .value();
            value.odds = utils.splitDecimalOfN(newOdds, 3);
          }
        });
      });
      this.sendDiffBallOdds();
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    hasPermission,
    //发送滑轮变化后号码的赔率信息
    sendDiffBallOdds() {
      let moreOddsDiffBallInfo = this.ballList[0].balls; //2019.4.28
      this.$emit("send-diff-Ball-odds", moreOddsDiffBallInfo);
    },
    // 选择球号
    chooseBall(vv, vvIdx, item, itemIdx) {
      console.log("chooseBall", vv, vvIdx, item, itemIdx);
      let vm = this;
      let layout = this.data.layout;
      let limitNum = 0;
      this.selectedBalls = []; //11.1
      if (item && this.totalNoteFlag) {
        limitNum = Math.floor(item.balls.length * this.betLimRate);
      }
      // 区分快速选择号码与手动点击选择号码
      if (vv && !vv.methodName) {
        vv.selected = !vv.selected;
      }

      this.ballList.forEach((data, dataIdx) => {
        let arr = [];
        let flag = false; //toolbar超选的标志
        /**
         * 有toolbar
         */
        if (
          this.totalNoteFlag &&
          this.toolbar &&
          data.muti &&
          itemIdx === dataIdx
        ) {
          //11.1 判断是否超选
          let selectBalls = data.balls.filter((item) => item.selected);
          selectBalls.length > limitNum && (flag = true);
          // debugger;
        }
        data.balls.forEach((value, valueIdx) => {
          // 判断从点击位置处进来  只有时时彩任选时要处理
          if (vv) {
            if (vv.methodName) {
              //快速选号
              if (vvIdx === dataIdx)
                vm.quickSelect(vv.methodName, value, valueIdx, data);
            } else {
              /*! 去掉当前选项其他选中的球.
               * !data.muti字段 当前选项不能重复
               * value.ball !== vv.ball 字段 只处理不是当前选中的球
               * itemIdx === dataIdx 字段 只处理当前的选项
               */
              if (!data.muti && value.ball !== vv.ball && itemIdx === dataIdx) {
                //当前一行的球不能重复选,非当前点击的球取消选中。
                value.selected = false;
              }
              /*! 去掉其他选项的球。
               * !item.repeatable字段 所有选项中不可出现于其他选项重复的球
               * valueIdx === vvIdx 字段 当前选中的位置
               * itemIdx !== dataIdx 字段 只处理别的选项
               */
              if (
                "repeatable" in item &&
                valueIdx === vvIdx &&
                itemIdx !== dataIdx
              ) {
                //其它行的相同号码球不能重复
                value.selected = false;
              }
              /*! 判断是否全选
               *  选中一个全选中，取消一个全取消
               */
              if (data.chooseAll) {
                if (vv.selected) {
                  value.selected = true;
                } else {
                  value.selected = false;
                }
              }
              /**
               * toolbar的每一行，如果选了7个，则取消第一个选中不包括当前手选的号码
               */
              if (this.toolbar && data.muti && itemIdx === dataIdx) {
                if (flag && valueIdx !== vvIdx && value.selected) {
                  value.selected = false;
                  flag = false;
                }
              }
            }
          }
          // 获取选中的球
          if (value.selected) {
            arr.push(value.ball);
          }
        });
        if (layout.positionbar)
          vm.selectedBalls.unshift(vm.btnsPosition.join(","));
        vm.selectedBalls.push(arr.join(","));
      });
      this.handleCalculateLimitNote(vv, itemIdx);
    },
    /**
     * 计算总注数
     */
    computeLottery() {
      let balls = this.selectedBalls.join("|");
      console.log("computeLottery balls", balls);
      // let result = this.computeNote[this.data.id](balls); //4.25
      let result = this.computeNote[this.data.lotteryPlayId](balls);
      let odds;
      let len = result.length || 0;
      if (result.len || result.len === 0) len = result.len;
      // if (layout.playType === '2') odds = result;             // 处理多赔率 5.5
      if (this.data.layout.rates.length > 1) odds = result; //处理多赔率 5.5
      this.betNum = len;
      this.$emit("get-balls", { len, balls, odds });

      return len;
    },
    /**
     * 寻找可以删除的行信息
     * @param{selectedBall: 当前选中号码 }
     * @param{index: 排除当前行 }
     */
    findRemoveBall(index, selectedBall) {
      for (let i = 0, len = this.ballList.length; i < len; i++) {
        let ballLine = this.ballList[i];
        if (index !== i) {
          let ball = ballLine.balls.find(
            (it) => it.selected == true && it.ball != selectedBall.ball
          );
          if (ball) {
            return {
              ball,
              index: i,
            };
          }
        }
      }
    },
    /**
     * 判断号码球是否超出
     * @param {over 是否要超过}
     */
    handleCheckNoteOutstrip(note) {
      const { totalNote } = this.data,
        { betLimRate } = this;
      if (!this.data.layout.toolbar) {
        if (totalNote > 0 && betLimRate < 1) {
          let ballLen = Math.floor(totalNote * betLimRate);
          if (note > ballLen) {
            return true;
          }
        }
      }
      return false;
    },
    /**
     * 重新计算注数，清除超过号码球
     * @param{selectedBall: 当前选中号码 }
     * @param{itemIdx: 当前选中号码行 }
     */
    handleCalculateLimitNote(selectedBall, itemIdx) {
      let balls = this.selectedBalls.join("|");
      let ballLen = this.computeLottery(balls);
      console.log(
        "balls - ballLen - selectedBalls",
        balls,
        ballLen,
        this.selectedBalls
      );
      if (this.handleCheckNoteOutstrip(ballLen)) {
        let currentBalls,
          ballLine,
          ball,
          ballArr,
          removeIndex,
          removeLineIndex = itemIdx;

        /** 找到选中的第一个* */
        ballLine = this.ballList[itemIdx];
        currentBalls = ballLine.balls;
        ball = currentBalls.find(
          (it) => it.selected == true && it.ball != selectedBall.ball
        );

        if (ballLine.muti) {
          // 判断是否可以重复选择
          ball = currentBalls.find(
            (it) => it.selected == true && it.ball != selectedBall.ball
          );
        } else {
          let removeInfo = this.findRemoveBall(itemIdx, selectedBall);
          if (removeInfo) {
            removeLineIndex = removeInfo.index;
            ball = removeInfo.ball;
          }
        }
        if (ball) {
          ball.selected = false;
          /**删除选中的第一个**/
          ballArr = this.selectedBalls[removeLineIndex].split(",");
          removeIndex = ballArr.findIndex((it) => it == ball.ball);
          ballArr.splice(removeIndex, 1); // 去除最前面一个
          /**重新计算注数**/
          this.selectedBalls[removeLineIndex] = ballArr.join(",");
          //  balls = this.selectedBalls.join("|");
          this.handleCalculateLimitNote(selectedBall, itemIdx);
          //  this.computeLottery(balls)
        }
      }
    },
    // 手动输入选号
    inputSelect() {
      const txtData = this.txtData.trim();
      let content = txtData
        .replace(/^[^\d]*(.*?)[^\d]*$/gm, "$1")
        .replace(/\s*[，|,]+\s*/g, ",");
      if (this.data.layout.positionbar && this.btnsPosition.length) {
        content = this.btnsPosition.join(",") + "|" + content;
      }
      let result = this.computeNote[this.data.lotteryPlayId](content);
      // console.log(result);
      let len;
      let balls;
      // 特殊处理--返回一个注数 目前只有时时彩任选时
      if ("len" in result) {
        len = result.len;
        balls = result.balls;
      } else {
        balls = result.join("|");
        len = result.length;
      }
      // console.log(len);
      this.$emit("get-balls", { len: len, balls: balls });
    },
    // 选择位置发生改变 目前只有时时彩任选 单选时有
    positionSelect() {
      if (this.type !== "3") {
        this.chooseBall();
      } else {
        this.inputSelect();
      }
    },
    // 快捷操作
    quickSelect(type, item, idx, data) {
      let center = this.totalNoteFlag
        ? Math.floor(data.balls.length * this.betLimRate)
        : 5; //需要选中的号码个数
      let centerBall = Math.ceil(
        (+data.balls[0].ball + +data.balls[data.balls.length - 1].ball) / 2
      ); //选大的最小号码球
      let arr = [];
      let num = parseInt(item.ball);
      // if (data.balls.length === 11) {//bug_id:377 山东11选5-不定胆-不定胆-前三位，号码大号与cp99有差别 by Daniel at 2018/02/02
      //     center = 6;
      // }
      switch (type) {
        case "all":
          if (this.totalNoteFlag) {
            idx < center ? (item.selected = true) : (item.selected = false); //11.1
          } else {
            item.selected = true;
          }
          break;
        case "big":
          if (
            (num >= centerBall &&
              num + center > data.balls[data.balls.length - 1].ball &&
              /^[0-9]/.test(item.ball)) ||
            item.ball === "大"
          ) {
            item.selected = true;
          } else {
            item.selected = false;
          }
          break;
        case "small":
          if (
            (num < centerBall && idx < center && /^[0-9]/.test(item.ball)) ||
            item.ball === "小"
          ) {
            item.selected = true;
          } else {
            item.selected = false;
          }
          break;
        case "odd":
          if ((num % 2 === 1 || item.ball === "单") && idx < center * 2) {
            item.selected = true;
          } else {
            item.selected = false;
          }
          break;
        case "even":
          if ((num % 2 === 0 || item.ball === "双") && idx < center * 2) {
            item.selected = true;
          } else {
            item.selected = false;
          }
          break;
        case "clear":
          item.selected = false;
          break;
      }
    },
    // 初始化
    init() {
      this.data = JSON.parse(JSON.stringify(this.currentLottery));
      this.data.layout = JSON.parse(this.data.layout);
      this.type = this.data.layout.format;
      this.toolbar = this.data.layout.toolbar;
      this.selectedBalls = [];
      this.ballList = [];
      this.txtData = "";
      this.totalNoteFlag = !(this.data.totalNote <= 0 || !this.data.totalNote); //是否限制注数

      let note = this.$attrs.betLimRate * this.data.totalNote;
      // console.log("最多只能投：" + note, Math.floor(note));

      this.btnsPosition = [];
      if (this.type === "3") return;
      this.ballList = this.data.layout.layout;
      let rates = this.data.layout.rates; //判断是否多赔率 //4 25
      if (rates.length === 1) {
        //改为this.ballLis
        this.ballList.forEach((item) => {
          let list = [];
          item.balls.split("|").forEach((value) => {
            list.push({ ball: value, selected: false });
          });
          item.balls = list;
        });
      } else if (rates.length > 1) {
        //多赔率
        this.ballList.forEach((item) => {
          let list = [];
          item.balls.split("|").forEach((value, index) => {
            let currentBall = rates.filter(
              (curBall) => curBall.ball === value
            )[0];
            list.push({
              ball: value,
              selected: false,
              odds: currentBall.maxOdds,
            });
          });
          item.balls = list;
        });
        this.$emit("send-diff-Ball-odds", []);
      }
    },
  },
  created() {
    this.init();
    let lotteryCode = this.$attrs.code;
    this.computeNote = require(`./common_modal/${lotteryCode}.js`);
    this.betLimRate = this.$attrs.betLimRate;
  },
};
</script>

<style lang="less" scoped>
.num-list li {
  min-height: 70px;
  padding: 10px 0;
  &:hover {
    label {
      transform: translate3d(10px, 0, 0);
    }
  }
}

.num-list li label {
  width: 105px;
  height: 27px;
  line-height: 23px;
  border: 1px solid @balls-page-labe-border;
  font-size: 14px;
  float: left;
  background: @balls-page-label-bg;
  box-shadow: 0px 1px 6px rgba(153, 153, 153, 0.09) inset;
  color: #ae291a;
  border-radius: 27px;
  margin-right: 40px;
  font-weight: 600;
  float: left;
  margin-top: 11px;
  text-align: center;
  margin-bottom: 5px;
}
.num-list li .all-balls {
  float: left;
}
.num-list.num-list--big li .ball {
  width: 56px;
  height: 56px;
  line-height: 56px;
}
.num-list li .ball {
  display: block;
  float: left;
  border-radius: 50%;
  border: 1px solid @balls-page-ball-border;
  font-size: 18px;
  margin-right: 13px;
  width: 45px;
  height: 45px;
  line-height: 45px;
  text-align: center;
  cursor: pointer;
  margin-bottom: 5px;
  background: @balls-page-ball-bg;
  background: linear-gradient(
    to top,
    @balls-page-ball-gradient-bg-one,
    @balls-page-ball-gradient-bg-two
  );
  box-shadow: 1px 2px 4px rgba(51, 51, 51, 0.11);
  color: #505c66;
}
.num-list li .ball .ball-odds {
  display: block;
  font-size: 14px;
  color: #ae291a;
}
.num-list li .ball:last-child {
  margin-right: 0;
}
.num-list li .ball.selected,
.num-list li .ball:hover,
.num-list li .ball:focus {
  background: @balls-page-ball-active-bg;
  color: #fff;
  background: linear-gradient(
    to top,
    @balls-page-ball-active-gradient-bg-one 70%,
    @balls-page-ball-active-gradient-bg-two
  );
  box-shadow: 0px 1px 15px rgba(51, 51, 51, 0.32) inset;
  border: 1px solid rgba(0, 0, 0, 0);
}

.num-list li .ball-bts {
  float: left;
  height: 45px;
  margin-left: 40px;
  border-radius: 22px;
  background: @balls-page-label-bg;
  padding: 3px 10px;
  box-shadow: 0px 4px 15px rgba(51, 51, 51, 0.09) inset;
}
.num-list li .ball-bts .ball {
  width: 40px;
  height: 40px;
  line-height: 38px;
  margin: 0;
  font-size: 16px;
  transform: scale(0.8);
  -webkit-transform: scale(0.8);
  -moz-transform: scale(0.8);
  -ms-transition-duration: 0.3s;
  -o-transform: scale(0.8);
  transition-duration: 0.3s;
  -webkit-transition-duration: 0.3s;
  -moz-transition-duration: 0.3s;
  -ms-transition-duration: 0.3s;
  -o-transition-duration: 0.3s;
}
.num-list li .ball-bts .ball:hover {
  background: @balls-page-ball-active-bg;
  color: #fff;
  background: linear-gradient(
    to top,
    @balls-page-ball-active-gradient-bg-one 70%,
    @balls-page-ball-active-gradient-bg-two
  );
  box-shadow: 0px 1px 15px rgba(51, 51, 51, 0.32) inset;
  transform: scale(1);
  -webkit-transform: scale(1);
  -moz-transform: scale(1);
  -ms-transform: scale(1);
  -o-transform: scale(1);
}
.num-list .manual .notes {
  background: @balls-page-note-bg;
  padding: 5px 10px;
}
.num-list .manual .notes span {
  color: @balls-page-tip-color;
}
.num-list .btns-position span {
  display: inline-block;
  padding: 10px;
}
</style>
