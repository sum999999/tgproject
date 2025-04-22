<template>
  <div class="result-page" id="resultPage">
    <div class="lf result-list">
      <Table
        :columns="columns"
        :loading="loading"
        :data="reslutList"
        :no-data-text="$tex('暂无注单')"
        height="260"
        stripe
      ></Table>
      <div class="totale-num" v-show="reslutList.length">
        <prize-tip
          :code="'liuhe'"
          :count="totalBettingNum"
          :money="totalMoney"
          :singlePrizeMoney="singlePrizeMoney"
          :verticalLayout="false"
        ></prize-tip>
      </div>
    </div>
    <div class="rf result-operation">
      <!-- <div @click="randomBetting(1)"><span><i>1</i>&nbsp;&nbsp;随机一注</span></div> -->
      <!-- <div @click="randomBetting(5)"><span><i>5</i>&nbsp;&nbsp;随机五注</span></div> -->
      <div @click="remove()" class="remove item">
        <span>
          <Icon type="trash-a"></Icon>&nbsp;&nbsp;{{ $tex("全部删除") }}
        </span>
      </div>
      <div class="order" @click="order()">
        <span>
          <Icon type="android-done"></Icon>&nbsp;&nbsp;{{ $tex("确认投注") }}
        </span>
      </div>
    </div>
    <div class="clr"></div>
    <!-- 追号页 -->
    <!-- <chase-num :lotteryName='lotteryName' :money="total.money" @get-chase-result="getChaseResult" :status="chaseDetail" v-if="openStatus" ></chase-num> -->
  </div>
</template>

<script>
import prizeTip from "../common_vue/prize_tip.vue";
import numeral from "numeral";
import { hasPermission } from "@/utils/authority-utils";
import { mapGetters } from "vuex";
import Animal from "@/components/Animal";

export default {
  props: {
    list: {
      type: Array,
    },
    data: {
      //从liuhe.vue获取的所有玩法
      type: Array,
    },
    // bettingTime: { //开始投注时间和系统时间
    //     type: Object,
    //     default: []
    // },
    isChangeSubMenu: {
      //切换二级菜单判断是否空投
      type: Number,
      default: 0,
    },
    itemLimit: {
      default: 1000000,
    },
    selfFlag: {
      type: String,
    },
    handleOddIfNeeded: {
      type: Function,
      default() {
        return () => false;
      },
    },
  },
  components: {
    prizeTip,
  },
  data() {
    return {
      singlePrizeMoney: 0, //单注最大中奖金额
      timer: null, //计时器
      countDown: 0, //进入页面开始计时
      loading: false,
      // autoStop: '0',                // 中奖后是否停止追号
      // openStatus: false,            // 追期开关
      // chaseResult: [],              // 追号结果
      // chaseMoney: 0,                // 追号总金额
      // chaseDetail: false,           // 显示追号详情
      // data: '',                     // 数据
      random: {}, // 随机数
      reslutList: [], // 结果列表
      // totalMoney: 0,                   //总金额
      allLottery: [], //某一彩种所有玩法
      // total: {                      // 总金额与总注数
      //     money: 0,
      //     num: 0
      // },
      params: {
        // 单注的参数
        bettingMoney: "", //
        singleMoney: "", //
        bettingNum: 1, //
        odds: "", //
        rebate: 0, //
        lotteryNumber: "", //
        // company: 1
        lotteryBettingId: "", //
        lotteryPlayId: 0, //
        lotteryId: 0, //
      },
      columns: [
        // table数据
        {
          title: this.$tex("号码"),
          width: 110,
          key: "lotteryNumber",
          render: (h, params) => {
            return h(Animal, { props: { text: params.row.lotteryNumber } });
          },
        },
        {
          title: this.$tex("注数"),
          width: 110,
          key: "bettingNum",
        },
        {
          title: this.$tex("单注金额"),
          width: 110,
          key: "singleMoney",
          render: (h, params) => {
            return h("span", params.row.singleMoney.toFixed(2));
          },
        },
        // {
        //     title: '单位',
        //     key: 'company',
        //     render: (h, params) => {
        //         let txt;
        //         if (params.row.company === 1) {
        //             txt = '元'
        //         } else if (params.row.company === 10) {
        //             txt = '角'
        //         } else {
        //             txt = '分'
        //         }
        //         return h('span', txt);
        //     }
        // },
        {
          title: this.$tex("返利"),
          width: 110,
          key: "rebate",
          render: (h, params) => {
            return h("span", params.row.rebate * 100 + "%");
          },
        },
        {
          title: this.$tex("赔率"),
          width: 110,
          key: "odds",
          render: (h, params) => {
            let odds = params.row.odds;
            if (typeof odds === "number") {
              //单赔率
              return h("span", params.row.odds.toFixed(2));
            }
            return h("span", params.row.odds);
          },
        },
        {
          title: this.$tex("金额"),
          key: "bettingMoney",
          width: 110,
          render: (h, params) => {
            return h("span", params.row.bettingMoney.toFixed(2));
          },
        },
        {
          title: this.$tex("删除"),
          key: "action",
          width: 140,
          render: (h, params) => {
            return h(
              "div",
              {
                on: {
                  click: () => {
                    this.remove(params.index);
                  },
                },
                style: {
                  cursor: "pointer",
                },
              },
              [
                h("Icon", {
                  props: {
                    type: "trash-a",
                    size: "18",
                    color: "#be1204",
                  },
                  on: {
                    click: () => {
                      this.remove(params.index);
                    },
                  },
                }),
              ]
            );
          },
        },
      ],
      hasClick: false,
    };
  },
  watch: {
    list: {
      handler(newVal, oldVal) {
        if (!newVal.length) {
          // 切换一级菜单
          this.reslutList = [];
        } else {
          this.reslutList = [...this.reslutList, ...newVal];
        }
        this.hasClick = false;
      },
      deep: true,
    },
    isChangeSubMenu() {
      this.hasClick = false;
    },
    $route(newVal, oldVal) {
      this.reslutList = [];
    },
    //     // 监听选号类型改变 如果改变重新初始化
    //     currentLottery: {
    // 　　　　handler(newValue, oldValue) {
    //             this.data = newValue;
    // 　　　　},
    // 　　　　deep: true
    // 　　},
    //     // 监听添加单柱的数据
    //     list: {
    //         handler(newValue, oldValue) {
    //             this.addNote(newValue)
    // 　　　　},
    // 　　　　deep: true
    //     },
    //     // 监听金额，赔率，返利发生变化
    //     status: {
    //         handler(newValue, oldValue) {
    //             this.$set(this.params, 'singleMoney', newValue.singleMoney ? newValue.singleMoney : 2);
    //             this.$set(this.params, 'company', newValue.company);
    //             this.$set(this.params, 'odds', newValue.odds);
    //             this.$set(this.params, 'rebate', newValue.rebate);
    //             this.$set(this.params, 'bettingMoney', this.params.singleMoney / newValue.company);
    // 　　　　},
    // 　　　　deep: true
    //     },
    //     refresh (n, o) {
    //         this.reslutList = [];
    //         this.openStatus = false;
    //         this.loading = false;
    //         this.getTotal();
    //     },
    //     closeLoading (n, o) {
    //         this.loading = false;
    //     }
  },
  computed: {
    ...mapGetters(["getSysUserAmountBySelfFlag"]),
    stopPeriod() {
      return this.preiodInfo.stopPeriod;
    },
    preiodInfo() {
      return this.$store.state.preiodInfo;
    },
    totalMoney() {
      //总金额
      let maxPrizeMoney = [];
      let money = 0;
      this.reslutList.forEach((item) => {
        // money += Number(item.bettingMoney);buyLottery
        money = numeral(Number(item.bettingMoney))
          .add(money)
          .value();
        if (typeof item.odds === "string") {
          //多赔率
          // let maxOdds = Number(item.odds.split(",")[0]);
          const odds = item.odds.split(",").map((odd) => Number(odd));
          const odd = this.handleOddIfNeeded()
            ? this.reslutList.length > 1
              ? Math.max(...odds)
              : Math.min(...odds)
            : Math.max(...odds);
          maxPrizeMoney.push(
            numeral(odd)
              .multiply(item.singleMoney)
              .value()
          );
        } else {
          maxPrizeMoney.push(
            numeral(item.odds)
              .multiply(item.singleMoney)
              .value()
          );
        }
      });
      this.singlePrizeMoney = Math.max.apply(null, maxPrizeMoney); //单注最大中奖金额
      return Number(money.toFixed(2));
    },
    totalBettingNum() {
      //总注数
      let num = 0;
      this.reslutList.forEach((item) => {
        num += item.bettingNum;
      });
      return num;
    },
  },
  methods: {
    // 随机添加注数
    randomBetting(num) {
      let balls = [];
      let ball;
      let vm = this;
      getBalls(num);

      function getBalls(len) {
        for (let i = 0; i < len; i++) {
          // 调用随机注数的共用方法
          let result = vm.random[vm.data.id](vm.data.layout.optballs);
          let obj = Object.assign({}, vm.params);

          // 特殊情况处理 因随机的一个号码有可能够成多注所有会返回一个对象
          if (typeof result === "object") {
            ball = result.ball;
            obj.bettingNum = result.len;
          } else {
            ball = result;
          }
          // 处理多赔率情况 目前只有快三--和值会出现
          // if (vm.data.layout.playType === '2') {
          //     let value = vm.data.layout.rates.filter(value => value.ball === ball);
          //     obj.odds = value[0].maxOdds;
          // }
          obj.lotteryNumber = ball;
          // TODO 如果要去重复的 注意所有号码为一注的情况

          // balls.push(obj);
          // this.reslutList .push(obj);
        }
      }
      // this.addNote(balls, true);
    },
    // 删除注数
    remove(index) {
      if (index || index === 0) {
        // 删除一注
        this.reslutList.splice(index, 1);
      } else {
        // 删除全部
        this.reslutList = [];
      }
      // if (!this.reslutList.length) this.openStatus = false;
      // this.getTotal();
    },
    // 添加单注
    addNote(data) {
      // data = JSON.parse(JSON.stringify(data));
      // data.forEach(item => {
      //     item.lotteryId = this.$route.params.id;
      //     item.lotteryPlayId = this.data.id;
      //     item.lotteryBettingId = this.data.lotteryBettingId;
      //     item.chase = this.chaseResult.length ? this.chaseResult.length : '无';
      //     item.autoStop = this.autoStop;
      //     this.reslutList.push(item);
      // })
      // this.getTotal();
    },
    // 计算下单时的总金额与总注数
    getTotal() {
      // let money = 0;
      // let num = 0;
      // // 下面乘除100是为了防止 js浮点数计算的Bug
      // this.reslutList.forEach(item => {
      //     money += item.bettingMoney * 100;
      //     num += item.bettingNum;
      // })
      // this.$set(this.total, 'money', money / 100);
      // this.$set(this.total, 'num', num);
      // // 处理追号
      // let chaseMoney = 0;
      // if (!this.reslutList.length) this.chaseResult = [];
      // if (this.chaseResult.length) {
      //     this.chaseResult.forEach(item => {
      //         chaseMoney += item.odds * this.total.money;
      //     });
      // }
      // this.chaseMoney = chaseMoney;
    },
    order() {
      //投注
      if (this.stopPeriod) {
        return this.$Message.error(this.$tex("已停期"));
      }
      if (
        parseInt(this.preiodInfo.sysDate) + this.countDown * 1000 <
        parseInt(this.preiodInfo.beginTime)
      ) {
        this.$Modal.warning({
          title: this.$tex("投注提示"),
          content: this.$tex("当前期数未开始"),
        });
        return;
      }
      if (!this.reslutList.length) {
        if (!this.hasClick) {
          this.$Message.error(this.$tex("请先投注"));
          this.hasClick = true;
        }
        return;
      }
      if (hasPermission("buyLottery.itemLimit")) {
        if (this.totalMoney > this.itemLimit) {
          this.$Message.error(
            this.$tex("投注金额不能大于{money}", { money: this.itemLimit })
          );
          return;
        }
      } else {
        const { max, min } = this.getSysUserAmountBySelfFlag(this.selfFlag);
        for (let i = 0; i < this.reslutList.length; i++) {
          const singleMoney = this.reslutList[i].singleMoney;
          if (singleMoney < min || singleMoney > max) {
            this.$Message.error(
              this.$tex("单注金额在{min}~{max}之间", { min, max })
            );
            return;
          }
        }
      }
      // debugger;
      let vm = this;
      var params = {
        bettingInfoList: vm.reslutList,
        totalMoney: vm.totalMoney,
        bettingRecordList: [
          {
            lotteryRecordId: vm.preiodInfo.lotteryRecordId,
            periodNo: vm.preiodInfo.periodNo,
            num: 1,
          },
        ],
      };
      // 防止重复点击
      if (this.loading) return;
      this.loading = true;
      vm.$http
        .post("/api/v2/lottery/betting", params, { userId: true })
        .then((response) => {
          this.loading = false;
          if (response.data.code !== 0) {
            return;
          }
          this.$store.commit("getSuccessModal", true);
          setTimeout(() => {
            this.$store.commit("getSuccessModal", false);
          }, 1500);
          this.reslutList = [];
        });
    },
    created() {
      this.timer = setInterval(() => {
        this.countDown++;
      }, 1000);
      this.reslutList = this.list;
      this.allLottery = this.data;
    },
    beforeDestroy() {
      this.timer ? clearInterval(this.timer) : null;
    },
  },
};
</script>

<style lang="less" scoped>
.result-page .red-font {
  color: @primary-color;
}
.result-page {
  padding: 20px 0;
  margin-top: 20px;
  font-size: 16px;
}
.result-page .result-list {
  width: 800px;
}
.result-page .result-operation {
  width: 150px;
  margin-right: 60px;
}
.result-page .result-operation .item {
  margin-top: 15px;
  background: @result-page-btn-bg;
  border: 1px solid @result-page-btn-border-color;
  color: @result-page-result-operation;
  background: linear-gradient(
    to top,
    @result-page-btn-gradient-bg-one,
    @result-page-btn-gradient-bg-two
  );
  text-align: center;
  padding: 6px;
  border-radius: 20px;
  cursor: pointer;
}
.result-page .result-operation .order {
  color: #fff;
  font-weight: 600;
  font-size: 16px;
  margin-top: 15px;
  text-align: center;
  height: 40px;
  line-height: 38px;
  border-radius: 20px;
  /*  border-color: @result-page-order-border;
  background: linear-gradient(
    to top,
    @result-page-order-gradient-bg-one,
    @result-page-order-gradient-bg-two
  );
  box-shadow: -2px 1px 1px @result-page-order-shadow inset; */
}
.result-page .result-operation .order:hover {
  cursor: pointer;
}
.result-page .result-operation .order span i {
  border: 0;
  color: #fff;
  font-size: 22px;
}
.result-page .result-operation div span {
  display: flex;
  justify-content: center;
  align-items: center;
}
.result-page .result-operation div span i {
  display: inline-block;
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  color: @result-page-i-color;
  border: 1px solid @result-page-i-border;
  border-radius: 50%;
  font-size: 14px;
  float: left;
  flex-shrink: 0;
}
.result-page .result-operation div.remove i {
  border: 0;
  font-size: 20px;
  /* margin-top: 11px; */
}

.result-page .totale-num {
  padding: 10px;
  text-align: right;
}
// .result-page .totale-num .txt-title {
//     font-size: 14px;
// }
// .result-page .totale-num .txt-title .detail {
//     display: inline-block;
//     height: 33px;
//     line-height: 33px;
//     margin-left: 10px;
//     background: #f11313;
//     color: #fff;
//     padding: 0px 10px;
//     border-radius: 3px;
//     box-shadow: -1px 1px 1px #fb8383 inset;
// }
// .result-page .totale-num .txt-title .detail span {
//     display: inline-block;
//     border-radius: 50%;
//     border: 2px solid #fff;
//     width: 18px;
//     height: 17px;
//     line-height: 12px;
//     float: left;
//     margin-top: 8px;
//     margin-right: 4px;
//     text-align: center;
// }
</style>
<style scoped>
.result-page >>> .ivu-table th {
  /* background: #be1204; */
  color: #fff;
  font-size: 14px;
  font-weight: normal;
}
.result-page >>> .ivu-table:before {
  height: 1px !important;
}
.result-page >>> .ivu-table-body {
  margin-right: 0 !important;
}
.result-page >>> .ivu-table th,
.result-page >>> .ivu-table td {
  border-bottom: none;
}
</style>
