<template>
  <div class="chase-num">
    <modal
      :modalShow="modelStatus"
      :width="820"
      :title='`${periodInfo.lotteryName}\n\r${$tex("追加详情")}`'
      claName="chase-num"
      @btn-ok="ok"
      @btn-cancel="cancel"
    >
      <div slot="content">
        <div class="h-label">
          <div class="tabs">
            <span
              :class="{active: tabType === 1}"
              @click="tabTypeChange(1)"
            >{{$tex("普通追号")}}</span>
            <span class='line'></span>
            <span
              :class="{active: tabType === 2}"
              @click="tabTypeChange(2)"
            >{{$tex("高级追号")}}</span>
          </div>
          <div class="h-control">
            <Checkbox v-model="autoStop">{{$tex("中奖后停止追号")}}</Checkbox>
          </div>
        </div>
        <div
          class="normal-chase"
          v-if="tabType === 1"
        >
          <div class="odds">
            <span>{{$tex("倍数")}}：</span>
            <span>
              <InputNumber
                style='width:90px;height:30px;line-height:30px;color:#7f7f7f'
                v-model="basic.odds"
                size="small"
                :max="100000"
                :min="1"
                :precision="0"
                @on-change="changePeriodList"
              ></InputNumber>
            </span>
          </div>
          <div class="period">
            <span class="">
              <InputNumber
                style='width:90px;height:30px;line-height:30px'
                v-model="basic.periodNum"
                size="small"
                :max="1000"
                :min="1"
                :precision="0"
                @on-change="getInputPeriod"
              ></InputNumber>
            </span>
            <span style='margin-left:6px'>{{$tex("期")}}</span>
          </div>
          <div class="period-num">
            <Select
              v-model='basic.periodNum'
              style="width:100px;height:30px;color:#7f7f7f"
              @on-change='tabPeriodChange'
            >
              <Option
                v-for="item in setPeriodList"
                :value="item"
                :key="item"
                style='height:30px'
              >{{ item }}{{$tex("期")}}</Option>
            </Select>
          </div>
        </div>
        <div
          class="query-conditions clearfix"
          v-else
        >
          <div class="query-title">{{$tex("同倍追号")}}</div>
          <div class="basic-query common-query">
            <div class="basic-set">
              <span>{{$tex("追号期数")}}：</span>
              <span class="">
                <InputNumber
                  style='height:30px;width:70px'
                  v-model="basic.periodNum"
                  size="small"
                  :max="100"
                  :min="1"
                  :precision="0"
                  @on-change="getInputPeriod"
                ></InputNumber>
              </span>
              <span style='margin-left:6px'>{{$tex("期")}}</span>
            </div>
            <div class="basic-set">
              <span>{{$tex("起始倍数")}}：</span>
              <span class="">
                <InputNumber
                  style='height:30px;width:70px'
                  v-model="basic.odds"
                  size="small"
                  :max="100"
                  :min="1"
                  :precision="0"
                  @on-change="changePeriodList"
                ></InputNumber>
              </span>
              <span style='margin-left:6px'>{{$tex("倍")}}</span>
            </div>
          </div>
          <div class="query-title">
            {{$tex("翻倍追号")}}
          </div>
          <div class="advanced-query common-query">
            <div class="advanced-content">
              <RadioGroup v-model="senior.radioChoose">
                <Radio
                  label="one"
                  style='padding: 6px 0'
                >
                  <span style='display:inline-block;width:34px;margin-right:4px;text-align:right;white-space: normal;vertical-align: middle;word-break: break-all;'>{{$tex("每隔")}}</span>
                  <span class="">
                    <InputNumber
                      style="width:70px"
                      v-model="senior.periodNum"
                      size="small"
                      :disabled="senior.radioChoose !== 'one'"
                      :max="100"
                      :min="1"
                      :precision="0"
                      @on-change="changePeriodList"
                    ></InputNumber>
                  </span>
                  <span style='margin-left:6px;'>{{$tex("期")}}
                    <span style='margin:0 8px 0 20px;'>{{$tex("倍数")}}x</span>
                  </span>
                  <span class="">
                    <InputNumber
                      style="width:70px;"
                      v-model="senior.odds"
                      size="small"
                      :disabled="senior.radioChoose !== 'one'"
                      :max="100"
                      :min="1"
                      :precision="0"
                      @on-change="changePeriodList"
                    ></InputNumber>
                  </span>
                </Radio>
                <Radio
                  label="two"
                  style='height:45px;'
                >
                  <span style='display:inline-block;width:34px;margin-right:4px;text-align:right;white-space: normal;vertical-align: middle;word-break: break-all;'>{{$tex("前")}}</span>
                  <span class="">
                    <InputNumber
                      style='height:30px;width:70px;'
                      v-model="senior.beforePeriod"
                      size="small"
                      :disabled="senior.radioChoose !== 'two'"
                      :max="100"
                      :min="1"
                      :precision="0"
                      @on-change="changePeriodList"
                    ></InputNumber>
                  </span>
                  <span style='margin-left:6px;'>{{$tex("期")}}
                    <span style='margin:0 8px 0 20px;max-width: 168px;display: inline-block;white-space: normal;word-break: break-all;vertical-align: middle;'>{{$tex("倍数")}}={{$tex("起始倍数")}}，{{$tex("之后倍数")}}=</span>
                  </span>
                  <span class="">
                    <InputNumber
                      style="width:70px;"
                      v-model="senior.afterOdds"
                      size="small"
                      :precision="0"
                      :disabled="senior.radioChoose !== 'two'"
                      :max="100"
                      :min="1"
                      @on-change="changePeriodList"
                    ></InputNumber>
                  </span>
                </Radio>
              </RadioGroup>
            </div>
          </div>
        </div>
        <div class="ct-body">
          <div class="ct-header">
            <div
              class="serial"
              style='width:114px;'
            >{{$tex("序号")}}</div>
            <div
              class="degree"
              style='width:172px;'
            >
              <span>{{$tex("追号期次")}}</span>
            </div>
            <div
              class="odds"
              style='width:124px;'
            >{{$tex("倍数")}}</div>
            <div
              class="price"
              style='width:136px;'
            >{{$tex("金额")}}</div>
            <div
              class="time"
              style='width:191px;'
            >{{$tex("预计开奖时间")}}</div>
          </div>
          <ul class="ct-content">
            <li
              v-for="(item, idx) in periodList"
              :key="idx"
            >
              <div
                class="serial"
                v-if='item'
              >{{idx + 1}}</div>
              <div class="degree">
                <span style='position:relative;top:2px;'>{{item.periodNo}}</span>
              </div>
              <div
                class="odds"
                v-if='item'
              >
                <InputNumber
                  style="width: 92px;"
                  v-model="item.odds"
                  size="small"
                  :max="100000"
                  :min="1"
                  :precision="0"
                  @on-change="modifyList(item,idx)"
                ></InputNumber>
              </div>
              <div class="price">{{item.bettingMoney.toFixed(2)}}</div>
              <div class="time">{{item.lotteryTime}}</div>
            </li>
          </ul>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import modal from "@/components/modal.vue";
import { convert2LocalDateTime } from "@/filters";

export default {
  props: {
    money: {
      type: Number
    },
    status: {
      type: Boolean
    }
  },
  components: {
    modal
  },
  data() {
    return {
      firstPeriodNo: "", //第一期期号
      firstInto: 0, // 判断第一次进入
      startPeriod: 0,
      modelStatus: true,
      tabType: 1,
      autoStop: true,
      setPeriodList: [5, 10, 15, 20],
      periodList: [],
      // checkAll: false,
      // 基本参数
      basic: {
        periodNum: 10,
        odds: 1,
        startPeriod: ""
      },
      selectPeriodList: [],
      // 高级参数
      senior: {
        radioChoose: "one",
        periodNum: 2,
        odds: 2,
        beforePeriod: 5,
        afterOdds: 3
      }
    };
  },
  watch: {
    status(n) {
      this.modelStatus = n;
    },
    "senior.radioChoose": {
      handler: function(n) {
        if (n) {
          this.changePeriodList();
        }
      }
    }
  },
  computed: {
    periodInfo() {
      //获取当前期号
      // console.log(this.$store.state.preiodInfo);
      return this.$store.state.preiodInfo;
    }
  },
  methods: {
    // 模态框确认按钮
    ok() {
      if (this.periodList.length === 1) {
        //追号一期
        if (this.periodList[0].periodNo !== this.periodInfo.periodNo) {
          this.$Message.info({
            content: this.$tex("当前期数已改变,之前期号将被清除!"),
            duration: 3
          });
          this.periodList[0].periodNo = this.periodInfo.periodNo;
          this.periodList[0].lotteryRecordId = this.periodInfo.lotteryRecordId;
        }
      } else {
        // 追号多期
        for (let i = 0, len = this.periodList.length; i < len; i++) {
          if (
            this.periodList[i].periodNo === this.periodInfo.periodNo &&
            i !== 0
          ) {
            this.$Message.info({
              content: this.$tex("当前期数已改变,之前期号将被清除!"),
              duration: 3
            });
            this.periodList = this.periodList.slice(i);
            break;
          }
        }
      }
      let list = [];
      let chaseMoney = this.periodList.reduce((val, item) => {
        list.push(item);
        return val + item.bettingMoney;
      }, 0);
      if (chaseMoney > 9999999.99) {
        this.modelStatus = true;
        this.$Message.warning(this.$tex("投注金额不能大于{money}", { money: 9999999.99 }));
        return;
      }
      if (chaseMoney.toString().indexOf(".") !== -1) {
        chaseMoney = chaseMoney.toFixed(2);
      }
      this.$emit("get-chase-result", {
        list: list,
        chaseMoney: Number(chaseMoney),
        autoStop: this.autoStop
      });
      this.modelStatus = false;
    },
    // 模态框取消按钮
    cancel() {
      this.$emit("get-chase-result", "");
      this.modelStatus = false;
    },
    // tab切换
    tabTypeChange(num) {
      this.tabType = num;
      this.changePeriodList();
    },
    // tab期数切换
    tabPeriodChange(num) {
      this.$set(this.basic, "periodNum", num);
      this.getPeriodInfo(this.startPeriod, this.startPeriod + num);
    },
    // 期数列表改变
    changePeriodList() {
      let vm = this;
      let odds = parseInt(this.basic.odds);
      let data = JSON.parse(JSON.stringify(this.periodList));
      data.forEach((item, idx) => {
        item.lotteryTime = convert2LocalDateTime(item.prizeTime);
        if (vm.senior.radioChoose === "one") {
          if (vm.tabType === 2) {
            if (idx % vm.senior.periodNum === 0 && idx > 0) {
              odds = odds * parseInt(vm.senior.odds);
            }
          }
        } else {
          if (idx >= parseInt(vm.senior.beforePeriod)) {
            odds = parseInt(vm.senior.afterOdds);
          }
        }
        item.odds = odds;
        item.bettingMoney = (odds * (vm.money * 100)) / 100;
      });
      this.periodList = data;
    },
    // 修改list列表
    modifyList(item, idx) {
      let vm = this;
      this.$nextTick(() => {
        let obj = JSON.parse(JSON.stringify(item));
        obj.bettingMoney = (obj.odds * (vm.money * 100)) / 100;
        vm.$set(this.periodList, idx, obj);
      });
    },
    // input期数发生改变时
    getInputPeriod(num) {
      this.getPeriodInfo(this.startPeriod, this.startPeriod + num);
    },
    // 当前期数信息
    getPeriodInfo(start, end) {
      let vm = this;
      if (this.selectPeriodList.length < end) {
        vm.$http
          .post(
            "/api/v2/lottery/queryLotteryRecordList",
            { lotteryId: this.$route.params.id, num: end },
            { unenc: true }
          )
          .then(response => {
            if (response.data.code !== 0) return;
            this.selectPeriodList = response.data.data.recordList;
            if (this.selectPeriodList.length < end) {
              this.$set(this.basic, "periodNum", this.selectPeriodList.length);
            }
            console.log('this.selectPeriodList', this.selectPeriodList)
            this.periodList = this.selectPeriodList.slice(start, end);
            this.changePeriodList();
          });
      } else {
        this.periodList = this.selectPeriodList.slice(start, end);
        this.changePeriodList();
      }
    }
  },
  created() {
    this.getPeriodInfo(0, 10);
  }
};
</script>

<style lang="less">
.chase-num {
  color: #313131;
}
.chase-num .ivu-modal-body .normal-chase .ivu-input-number-input-wrap,
.chase-num .ivu-modal-body .query-conditions .ivu-input-number-input-wrap {
  height: 30px;
  line-height: 30px;
}
.chase-num .ivu-input-number-input {
  color: #7f7f7f;
  padding-right: 26px;
}
.chase-num .ivu-select-arrow {
  top: 15px;
  margin-left: 9px;
}
.chase-num .normal-chase .period-num span {
  padding-left: 9px !important;
}
.chase-num .ivu-input-number-small {
  border-radius: 4px;
}
.chase-num
  .normal-chase
  .ivu-input-number-small
  .ivu-input-number-input-wrap
  input,
.chase-num
  .query-conditions
  .ivu-input-number-small
  .ivu-input-number-input-wrap {
  line-height: 30px;
  height: 30px;
  text-align: center;
}
.chase-num .ivu-input-number-small .ivu-input-number-handler {
  height: 15px;
}
.chase-num
  .normal-chase
  .ivu-input-number-small
  .ivu-input-number-handler-up-inner,
.chase-num
  .query-conditions
  .ivu-input-number-small
  .ivu-input-number-handler-down-inner {
  top: 2px;
}
.chase-num .ivu-select-single .ivu-select-selection {
  height: 30px;
}
.chase-num .ivu-checkbox-wrapper {
  margin-right: 0;
}

.chase-num .ivu-checkbox-focus {
  box-shadow: 0 0 0 0 #fff;
  -webkit-box-shadow: 0 0 0 0 #fff;
}
.chase-num .ivu-modal-body {
  padding: 0;
  font-size: 14px;
}
.chase-num .ivu-modal-footer {
  margin-top: 6px;
}
.chase-num .ivu-modal-body {
  padding: 10px 24px;
}
.chase-num .h-label {
  height: 40px;
  line-height: 40px;
  border-bottom: 2px solid #e2e2e2;
}
.chase-num .h-label .tabs {
  float: left;
  font-size: 16px;
}
.chase-num .h-label .tabs span {
  display: inline-block;
  padding: 0 15px;
  cursor: pointer;
}
.chase-num .h-label .tabs span.line {
  width: 1px;
  height: 12px;
  padding: 0;
  background: #a1a1a1;
}
.chase-num .h-label .tabs span.active {
  background: #fff;
  height: 40px;
}
.chase-num .h-label .h-control {
  float: right;
  font-size: 14px;
}
.chase-num .normal-chase {
  height: 65px;
  line-height: 30px;
  padding: 15px 0 10px;
}
.chase-num .normal-chase > div {
  float: right;
}
.chase-num .normal-chase .period-num {
  height: 30px;
}
.chase-num .normal-chase .period-num span {
  display: inline-block;
  padding: 0 5px;
  cursor: pointer;
}
.chase-num .normal-chase .period-num span.active {
  background: @chase-num-span-active-bg;
  color: #fff;
}
.chase-num .normal-chase .period,
.chase-num .normal-chase .odds {
  margin-left: 22px;
  height: 30px;
}
.chase-num .normal-chase .period span,
.chase-num .normal-chase .odds span {
  display: inline-block;
}
.chase-num .ct-body .ct-content {
  width: 100%;
  max-height: 230px;
  overflow: auto;
}
.chase-num .ct-body .ct-header {
  /*   background: @chase-num-tb-header-bg; */
  color: #fff;
}
.chase-num .ct-body .ct-header,
.chase-num .ct-body .ct-content li {
  line-height: 36px;
  height: 36px;
  overflow: hidden;
}
.chase-num .ct-body .ct-content li:hover {
  background: #ebf7ff;
}
.chase-num .ct-body .ct-content li:nth-child(even) {
  background: @chase-num-tb-body-even-bg;
  text-align: left;
}
.chase-num .ct-body .ct-content li:last-child {
  border-bottom: 1px solid #ebebeb;
}
.chase-num .ct-body .ct-header > div,
.chase-num .ct-body .ct-content li > div {
  float: left;
  text-align: left;
}
.chase-num .ct-body .serial {
  width: 15.3%;
  padding-left: 22px;
}
.chase-num .ct-body .degree {
  width: 23.26%;
}
.chase-num .ct-body .odds {
  width: 16.71%;
}
.chase-num .ct-body .price {
  width: 18.45%;
}
.chase-num .ct-body .time {
  width: 24%;
}
.chase-num .query-conditions {
  margin-bottom: 16px;
  color: #313131;
  font-size: 12px;
  /*   border-bottom: 2px solid @primary-color-hover; */
}
.chase-num .query-conditions > div {
  float: left;
  height: 100%;
}
.chase-num .common-query {
  // width: 284px;
  width: 260px;
  padding: 14px;
  padding-bottom: 0;
}
.chase-num .common-query.advanced-query {
  // width: 404px;
  width: 428px;
}
.chase-num .common-query .radio-choose span,
.chase-num .common-query .basic-set span {
  display: inline-block;
}
.chase-num .common-query .basic-set .analog-select {
  width: 120px;
}
.chase-num .advanced-query .radio-choose,
.chase-num .common-query .basic-set {
  height: 44px;
}
.chase-num .basic-set .ivu-select-selection .ivu-select-placeholder {
  height: 30px;
  line-height: 30px;
}
.chase-num .advanced-query .radio-choose span label input {
  float: left;
  margin-top: 7px;
}
.chase-num .query-conditions .query-title {
  width: 30px;
  line-height: 20px;
  text-align: center;
  padding: 15px 3px;
  border-right: 1px solid #f4e9de;
  border-left: 1px solid #f4e9de;
  word-break: break-word;
}
.chase-num .advanced-query .advanced-title {
  padding-left: 10px;
  height: 35px;
  background-color: #f1f1f1;
  border-bottom: 1px solid #f4e9de;
  line-height: 35px;
}
.chase-num .ivu-modal-body .normal-chase .ivu-input-number,
.chase-num .ivu-modal-body .query-conditions .ivu-input-number {
  width: 60px;
  height: 30px;
}
.chase-num .ivu-input-number-small input {
  height: 30px;
}
.chase-num .odds .ivu-input-number-small input {
  line-height: 24px;
  height: 24px;
}
.chase-num .ct-content .ivu-input-number-small .ivu-input-number-handler {
  height: 12px;
}
</style>

