<template>
  <div class="betting-wrap">
    <!-- 标题 -->
    <div class="title">
      <ul>
        <li
          v-for="(item, index) in category"
          :key="index"
          @click="changeTab(item)"
          :class="[item.label === label ? 'active' : '']"
        >
          <span>{{ item.name }}</span>
          <i></i>
        </li>
      </ul>
    </div>
    <!-- 标题结束 -->
    <!-- 搜索 -->
    <div class="search-wrap clearfix">
      <div class="lf">
        <div class="date">
          <Select
            ref="selectPicker"
            clearable
            v-model="choiceDate"
            style="width:80px"
            @on-change="changeSpecialDate"
            :disabled="canSpecialPick"
          >
            <Option
              v-for="(item, index) in dateText"
              :value="index === 0 ? '' : index - 1"
              :key="item.key"
              >{{ item }}</Option
            >
          </Select>
        </div>
        <div class="selectDate">
          <Row>
            <Col span="12">
              <DatePicker
                ref="datePicker"
                :options="option"
                :editable="false"
                @on-change="getSelectDate"
                :disabled="canDatePick"
                v-model="searchTime"
                type="daterange"
                placement="bottom-end"
                :placeholder="$tex('请选择查询时间')"
                style="width: 200px"
              ></DatePicker>
            </Col>
          </Row>
        </div>
        <div class="chooseLottery">
          <Button @click="getLotteryList" class="Lottery">{{
            lotteryValue
          }}</Button>
        </div>
      </div>
      <div class="rt">
        <div class="name">
          <Icon type="search"></Icon>
          <Input
            :value="params.userCode"
            @input="params.userCode = arguments[0].replace(/^\s+|\s+$/, '')"
            size="default"
            :placeholder="$tex('输入下级代理账号')"
            style="width:160px;"
          >
          </Input>
        </div>
        <div class="search">
          <Button type="primary" class="wxbutton" @click="search">{{
            $tex("搜索")
          }}</Button>
        </div>
      </div>
    </div>
    <!-- 搜索结束 -->
    <!-- 搜索结果 -->
    <div class="search-result">
      <Table :columns="columns" :data="resultList" stripe></Table>
      <div class="demo-spin-col" v-if="spinShow">
        <Spin fix> </Spin>
      </div>
      <page
        :total="total"
        :currentPage="params.current"
        :pageSize="params.size"
        @get-Page-Data="getPageData"
      ></page>
    </div>
    <!-- 分页 -->
    <!-- 搜索结果结束 -->
    <!-- 详情弹框 -->
    <modal
      class="betting-detail"
      :modalShow="detailFlag"
      :title="
        (detail.lotteryName || '') +
          ' ' +
          $tex('第{num}期详情', { num: detail.periodNo })
      "
      :width="896"
      :hasFooter="true"
      :maskClosable="true"
      @btn-cancel="detailFlag = false"
      :hasOkBtn="false"
      :noText="$tex('返回')"
    >
      <div slot="content">
        <div class="modal1">
          <div class="modal1img">
            <img :src="detail.lotteryIcon" />
          </div>
          <div class="modal1info">
            <span class="infotitle">{{ detail.lotteryName }}</span>
            <span class="infodate" style="">
              <span>{{
                $tex("第{num}期开奖号", { num: detail.periodNo })
              }}</span>
            </span>
          </div>
          <div class="modal2number">
            <div
              v-if="detail.code !== '6hc' && detail.code !== 'pcdd'"
              class="prize-ball"
              v-for="(ball, index) in detail.lotteryNumber"
              :key="index"
            >
              <span class="ball">{{ ball }}</span>
            </div>
            <!-- 六合彩 -->
            <div
              v-if="detail.code === '6hc'"
              class="prize-ball"
              :class="{ sum: index === 6 }"
              v-for="(ball, index) in detail.lotteryNumber"
              :key="index"
            >
              <span
                class="ball"
                :class="[index === 6 ? 'sum' : '', ball.clr]"
                >{{ ball.lotteryNumber ? ball.lotteryNumber : ball }}</span
              >
              <span class="sixhc">{{ ball.label }}</span>
            </div>
            <!-- pcdd -->
            <div
              v-if="detail.code === 'pcdd'"
              class="prize-ball"
              :class="{ sum: index % 2 !== 0 }"
              v-for="(ball, index) in detail.lotteryNumber"
              :key="index"
            >
              <span
                class="ball"
                :class="[
                  index % 2 !== 0 ? 'sum' : '',
                  index === 6 ? ball.clr : '',
                ]"
                >{{ ball.content }}</span
              >
            </div>
          </div>
        </div>
        <div class="modal1detail modal-detail">
          <div class="detailcss">
            <div class="title">{{ $tex("投注金额") }}</div>
            <Input
              :value="
                (detail.buyMoney * 1).toFixed(2) +
                  (sysExchangeInfo.scurIcon || '')
              "
              disabled
            ></Input>
          </div>
          <div class="detailcss">
            <div class="title">{{ $tex("中奖金额") }}</div>
            <Input
              :value="
                (detail.prize * 1).toFixed(2) + (sysExchangeInfo.scurIcon || '')
              "
              disabled
            ></Input>
          </div>
          <div class="detailcss">
            <div class="title">{{ $tex("投注号码") }}</div>
            <Input :value="detail.buyLotteryNumber" disabled></Input>
          </div>
          <div class="detailcss">
            <div class="title">{{ $tex("投注时间") }}</div>
            <Input
              :value="detail.createTime | convert2LocalDateTime"
              disabled
            ></Input>
          </div>
          <div class="detailcss">
            <div class="title">{{ $tex("玩法名称") }}</div>
            <Input :value="detail.playName" disabled></Input>
          </div>
          <div class="detailcss">
            <div class="title">{{ $tex("投注返点") }}</div>
            <Input
              :value="(detail.rebate * 1).toFixed(2) + '%'"
              disabled
            ></Input>
          </div>
          <div class="detailcss">
            <div class="title">{{ $tex("投注赔率") }}</div>
            <Input :value="detail.odds" disabled></Input>
          </div>
        </div>
      </div>
    </modal>
    <!-- 彩种选择弹窗 -->
    <modal
      :modalShow="chooseLottery"
      :title="$tex('选择彩种')"
      :hasFooter="false"
      :width="800"
      @btn-cancel="chooseLottery = false"
    >
      <div slot="content" class="lotteryList">
        <Button
          v-for="item in lotteryList.lotteryList"
          :key="item.lotteryId"
          @click="confirmLottery(item)"
          class="selectLottery"
        >
          {{ item.lotteryName }}
        </Button>
      </div>
    </modal>
  </div>
</template>
<script>
import dateUtil from "@/utils/format_date.js";
import dates from "@/utils/date.js";
import modal from "@/components/modal.vue";
import page from "@/components/page.vue";
import pcddUtil from "@/utils/format-ball/format_pcdd.js";
import zodica from "@/utils/format-ball/zodica.js";
import common from "../../common/mixin";
import { convert2LocalDateTime, convert2ServerDateTime } from "@/filters";
import { mapGetters } from "vuex";
import { queryLotteryList } from "@/api/lottery";

export default {
  components: { page, modal },
  mixins: [common],
  data() {
    return {
      label: "",
      category: [
        { name: this.$tex("全部"), label: "" },
        { name: this.$tex("已中奖"), label: "02" },
        { name: this.$tex("待开奖"), label: "00" },
        { name: this.$tex("已撤单"), label: "05" },
      ],
      dateText: [
        this.$tex("日期"),
        this.$tex("今天"),
        this.$tex("昨天"),
        this.$tex("本周"),
        this.$tex("上周"),
        this.$tex("本月"),
        this.$tex("上月"),
      ],
      choiceDate: "", //查询指定时间
      searchTime: [], //日期选择器时间
      resultList: [], //搜索结果
      spinShow: false,
      canDatePick: false, //是否禁用日期选择器
      canSpecialPick: false, //是否禁用指定日期选择
      detailFlag: false, //详情弹框标记
      chooseLottery: false, //彩种选择弹窗
      lotteryList: {},
      lotteryValue: "全部",
      detail: {}, //投注详情
      total: 0,
      params: {
        userCode: "",
        gtBuyTime: "",
        ltBuyTime: "",
        current: 1,
        lotteryId: "",
        size: 10,
        status: "",
      },
      columns: [
        {
          title: this.$tex("代理账号"),
          key: "userCode",
          width: 136,
          fixed: "left",
        },
        {
          title: this.$tex("玩法"),
          key: "playName",
          width: 146,
        },
        {
          title: this.$tex("期数"),
          key: "periodNo",
          width: 126,
        },
        {
          title: this.$tex("投注号码"),
          key: "lotteryNumber",
          width: 146,
          render: (h, params) => {
            return h(
              "ul",
              {
                class: "lotteryNumber",
              },
              params.row.lotteryNumber
            );
          },
        },
        {
          title: this.$tex("投注金额"),
          key: "buyMoney",
          width: 100,
        },
        {
          title: this.$tex("派彩金额"),
          key: "prize",
          width: 100,
        },
        {
          title: this.$tex("详情"),
          width: 85,
          render: (h, params) => {
            return h("span", {
              class: "detail",
              attrs: {
                title: this.$tex("详情"),
              },
              on: {
                click: () => {
                  this.showDetail(params.row.userBettingRecordId);
                },
              },
            });
          },
        },
        {
          title: this.$tex("状态"),
          width: 97,
          key: "statusDesc",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: "#be1204",
                },
              },
              params.row.statusDesc
            );
          },
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["sysExchangeInfo"]),
  },
  methods: {
    handlerLotteryNumber(detail) {
      let lotteryNumbers = detail.lotteryNumber.replace("+", ",").split(",");
      if (detail.code === "6hc") {
        let handlerResult = zodica();
        let ballInfo = [];
        for (let i = 0, len = lotteryNumbers.length; i < len; i++) {
          two: for (let j = 0, len2 = handlerResult.length; j < len2; j++) {
            for (
              let k = 0, len3 = handlerResult[j].data.length;
              k < len3;
              k++
            ) {
              if (lotteryNumbers[i] === handlerResult[j].data[k]) {
                let obj = {};
                if (i === len - 1) {
                  ballInfo.push("+");
                }
                obj.lotteryNumber = lotteryNumbers[i];
                obj.clr = handlerResult[j].clrs[k];
                obj.label = handlerResult[j].label;
                ballInfo.push(obj);
                break two;
              }
            }
          }
        }
        this.detail.lotteryNumber = ballInfo;
      } else if (detail.code === "pcdd") {
        this.detail.lotteryNumber = pcddUtil(lotteryNumbers);
      } else {
        this.detail.lotteryNumber = lotteryNumbers;
      }
    },
    changeTab(item) {
      //切换tab
      this.initStatus();
      this.label = item.label;
      this.params.status = item.label;
      this.params.current = 1;
      this.getAgentList();
    },
    getPageData(page) {
      //切换页数
      this.params.current = page;
      this.getAgentList();
    },
    showDetail(bettingId) {
      //查看详情
      this.detailFlag = true;
      this.$http
        .post(
          "/api/v2/betting/queryBettingInfoById",
          { userBettingRecordId: bettingId },
          { userId: true, unenc: true }
        )
        .then((res) => {
          if (res.data.code !== 0) return;
          this.detail = res.data.data.bettingInfo;
          this.handlerLotteryNumber(this.detail);
        });
    },
    getSelectDate(result) {
      //日期选择器
      if (result[0]) {
        this.canSpecialPick = true;
        const startTime = new Date(result[0]);
        const endTime = new Date(result[1]);
        startTime.setHours(0);
        startTime.setMinutes(0);
        startTime.setSeconds(0);
        endTime.setHours(23);
        endTime.setMinutes(59);
        endTime.setSeconds(59);
        this.params.gtBuyTime = convert2ServerDateTime(startTime);
        this.params.ltBuyTime = convert2ServerDateTime(endTime);
      } else {
        this.canSpecialPick = false;
        this.params.gtBuyTime = "";
        this.params.ltBuyTime = "";
      }
    },
    search() {
      //搜索
      this.params.current = 1;
      this.getAgentList();
    },
    initStatus() {
      //初始化搜索状态
      this.params.userCode = "";
      // this.params.gtBuyTime = '';
      // this.params.ltBuyTime = '';
      this.choiceDate = "";
      // this.searchTime = [];
      this.canDatePick = false;
      this.canSpecialPick = false;
    },
    changeSpecialDate() {
      //选择指定日期
      if (typeof this.choiceDate === "string") {
        //未选择指定日期
        this.canDatePick = false;
        this.params.gtBuyTime = "";
        this.params.ltBuyTime = "";
      } else if (typeof this.choiceDate === "number") {
        this.canDatePick = true;
        let dateArr = Array.from(dates);
        this.params.gtBuyTime = convert2ServerDateTime(
          dateArr[this.choiceDate]().startTime
        );
        this.params.ltBuyTime = convert2ServerDateTime(
          dateArr[this.choiceDate]().endTime
        );
        this.searchTime = [this.params.gtBuyTime, this.params.ltBuyTime];
      }
    },
    getAgentList() {
      //获取代理投注列表
      this.handlerSpin();
      this.resultList = [];
      this.$http
        .post("/api/v2/agent/queryAgentBettingList", this.params, {
          userId: true,
          unenc: true,
        })
        .then((res) => {
          this.spinShow = false;
          if (res.data.code !== 0) return;
          let data = res.data.data;
          this.resultList = data.bettingInfoList;
          console.log("resultList", this.resultList);
          this.total = data.total;
        })
        .catch(() => {
          this.spinShow = false;
          this.$Message.error("请求超时, 请重新请求");
        });
    },
    handlerSpin() {
      this.$emit("handler-spin", true);
      setTimeout(() => {
        this.$emit("handler-spin", false);
      }, 1000);
    },
    // 彩种列表
    async getLotteryList() {
      this.chooseLottery = true;
      if (this.lotteryList.lotteryList) return;
      const res = await queryLotteryList();
      const entire = { lotteryId: 1, lotteryName: "全部" };
      this.lotteryList = res.data.data.lotteryTypeList[0];
      this.lotteryList.lotteryList.unshift(entire);
    },
    confirmLottery(item) {
      this.spinShow = true;
      this.lotteryValue = item.lotteryName;
      // 请求全部不需要携带id
      if (item.lotteryId == 1) {
        this.params.lotteryId = "";
        this.getAgentList();
        this.chooseLottery = false;
        return;
      }
      this.params.lotteryId = item.lotteryId;
      this.getAgentList();
      this.chooseLottery = false;
    },
  },
  created() {
    const startTime = new Date();
    startTime.setHours(0);
    startTime.setMinutes(0);
    startTime.setSeconds(0);
    const endTime = new Date();
    endTime.setHours(23);
    endTime.setMinutes(59);
    endTime.setSeconds(59);
    this.searchTime = [startTime, endTime];
    this.params.gtBuyTime = convert2ServerDateTime(startTime);
    this.params.ltBuyTime = convert2ServerDateTime(endTime);
    this.getAgentList();
  },
};
</script>

<style lang="less">
.betting-wrap {
  padding-top: 2px;
  .title {
    /*height: 38px;*/
    border-bottom: 2px solid #e2e2e2;
    > ul {
      display: flex;
    }
    &:after {
      display: block;
      clear: both;
      visibility: hidden;
      content: "";
    }
    li {
      padding: 6px 0;
      position: relative;
      /*float: left;*/
      width: 115px;
      /*height: 38px;*/
      /*line-height: 38px;*/
      font-size: 16px;
      text-align: center;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-around;
      &.active {
        color: #be1204;
        border-bottom: 2px solid #be1204;
      }
      i {
        /*position: absolute;*/
        top: 13px;
        right: 0;
        width: 1px;
        height: 12px;
        background-color: #a1a1a1;
      }
    }
  }
  .search-wrap {
    /*height: 30px;*/
    margin-top: 14px;
    .lf {
      display: flex;
      font-size: 0;
      .date {
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
      }
      .selectDate {
        &:extend(.betting-wrap .search-wrap .lf .date);
        margin-left: 22px;
      }
      .chooseLottery {
        margin-left: 20px;
      }
      .Lottery {
        border: 1px solid #dcdee2;
        color: #313131;
        width: 110px;
      }
    }
    .rt {
      &:extend(.betting-wrap .search-wrap .lf);
      float: right;
      .name {
        &:extend(.betting-wrap .search-wrap .lf .date);
        i {
          position: relative;
          left: 22px;
          top: 2px;
          color: #949494;
          z-index: 2;
        }
        input {
          padding-left: 22px;
        }
      }
      .search {
        &:extend(.betting-wrap .search-wrap .lf .date);
        margin-left: 27px;
        .wxbutton {
          width: 66px;
          height: auto;
          white-space: normal;
          word-break: break-all;
        }
      }
    }
  }
  .search-result {
    padding-top: 14px;
    .detail {
      display: inline-block;
      vertical-align: middle;
      width: 20px;
      height: 20px;
      background: url("~@/assets/images/icon.png") no-repeat -499px -293px;
      cursor: pointer;
    }
    .lotteryNumber {
      width: 100%;
      height: 36px;
      overflow-y: auto;
      // white-space: nowrap;
      // text-align: center;
    }
  }
}
.betting-detail {
  .ivu-modal-body {
    padding: 16px 17px 0 17px;
  }
  .ivu-modal-footer {
    padding-top: 0;
  }
  .modal1 {
    padding-bottom: 18px;
    border-bottom: 1px solid #d2d0d0;
    font-size: 0;
    .modal1img {
      display: inline-block;
      vertical-align: middle;
      img {
        width: 74px;
        height: 74px;
        border-radius: 50%;
      }
    }
    .modal1info {
      margin-left: 14px;
      &:extend(.betting-detail .modal1 .modal1img);
      .infotitle {
        display: block;
        font-size: 28px;
        font-weight: bold;
        color: #313131;
        font-style: italic;
      }
      .infodate {
        font-size: 14px;
        display: block;
        color: #a9a9a9;
        span {
          &:nth-child(2) {
            color: #be1204;
          }
        }
      }
    }
    .modal2number {
      font-size: 14px;
      margin-left: 18px;
      &:extend(.betting-detail .modal1 .modal1img);
      .prize-ball {
        display: inline-block;
        vertical-align: middle;
        margin: 0 4px;
        text-align: center;
        &:first-child {
          margin-left: 0;
        }
        &.sum {
          width: 10px;
          margin: 0;
          vertical-align: top;
        }
        .ball {
          display: inline-block;
          width: 30px;
          height: 30px;
          line-height: 30px;
          font-size: 14px;
          border-radius: 50%;
          background: radial-gradient(#ff6050 7%, #e50000);
          color: #fff;
          &.red {
            background: radial-gradient(#ff6050 7%, #e50000);
          }
          &.blue {
            background: radial-gradient(#007ef9 27%, #0035ae);
          }
          &.green {
            background: radial-gradient(#1acb01 3%, #017019);
          }
          &.sum {
            width: 10px;
            margin-right: 0;
            background: none;
            color: #313131;
          }
        }
        .sixhc {
          display: block;
          width: 30px;
        }
      }
    }
  }
  .modal1detail.modal-detail {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 12px 5px 0 5px;
    .detailcss {
      font-size: 0;
      margin-bottom: 16px;
      .title {
        display: inline-block;
        font-size: 14px;
        vertical-align: middle;
        text-align: center;
        color: #a9a9a9;
      }
      .ivu-input-wrapper {
        &:extend(.betting-detail .modal-detail);
        width: 194px;
        margin-left: 6px;
        .ivu-input {
          color: #313131;
        }
      }
    }
  }
}
.lotteryList {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  .selectLottery {
    width: 100px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #dcdee2;
    color: #313131;
    // text-align: center;
    margin: 5px 2px;
  }
}
.demo-spin-col {
  display: flex;
  height: 100px;
  width: 760px;
  position: relative;
  border: none;
}
</style>
<style lang="less" scoped>
@deep: ~">>>";
.search-result {
  @{deep} .ivu-table-body {
    overflow-x: auto !important;
  }
  @{deep} .ivu-table-fixed-header {
    height: 36px;
    color: white;
  }
}
</style>
