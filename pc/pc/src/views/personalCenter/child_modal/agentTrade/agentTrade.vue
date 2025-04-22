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
            v-model="choiceDate"
            clearable
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
                @on-change="getSelectDate"
                :disabled="canDatePick"
                :editable="false"
                v-model="searchTime"
                type="daterange"
                :options="option"
                placement="bottom-end"
                :placeholder="$tex('请选择查询时间')"
                style="width: 200px"
              ></DatePicker>
            </Col>
          </Row>
        </div>
        <!-- 类型选择 -->
        <div class="selectWay">
          <Select
            v-model="resultType"
            @on-change="changeResultType"
            placeholder="请选择类型"
            clearable
          >
            <Option
              v-for="item in resultTypeList"
              :value="item.itemValue"
              :key="item.itemValue"
            >
              {{ item.itemKey }}
            </Option>
          </Select>
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
  </div>
</template>
<script>
import dateUtil from "@/utils/format_date.js";
import dates from "@/utils/date.js";
import page from "@/components/page.vue";
import common from "../../common/mixin";
import { convert2LocalDateTime, convert2ServerDateTime } from "@/filters";
import { queryItemList } from "@/api/sysDict.js";

export default {
  components: { page },
  mixins: [common],
  data() {
    return {
      label: "",
      category: [
        { name: this.$tex("所有类型"), label: "" },
        { name: this.$tex("提现记录"), label: "00" },
        { name: this.$tex("充值记录"), label: "04" },
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
      resultTypeList: [], // 搜索类型
      resultType: "", // 搜索结果
      canDatePick: false, //是否禁用日期选择器
      canSpecialPick: false, //是否禁用指定日期选择
      detailFlag: false, //弹框标记
      detail: {}, //投注详情
      total: 0,
      params: {
        userCode: "",
        startTime: "",
        endTime: "",
        current: 1,
        size: 10,
        tradeTypeArray: [],
      },
      columns: [
        {
          title: this.$tex("代理账号"),
          key: "userCode",
          width: 203,
        },
        {
          title: this.$tex("时间"),
          key: "tradeTime",
          width: 258,
          render: (h, params) => {
            return h("span", convert2LocalDateTime(params.row.tradeTime));
          },
        },
        {
          title: this.$tex("状态"),
          key: "tradeTypeDesc",
          width: 186,
        },
        {
          title: this.$tex("金额"),
          key: "amount",
          width: 93,
          render: (h, params) => {
            let amount = params.row.amount * 1;
            return h(
              "span",
              {
                style: {
                  color: amount > 0 ? "#be1204" : "#16bb00",
                },
              },
              amount.toFixed(2)
            );
          },
        },
      ],
      spinShow: false,
    };
  },
  methods: {
    // 获取类型
    async getQueryItemList() {
      const res = await queryItemList({
        dictName: "TRADE_TYPE",
      });
      this.resultTypeList = res.data.data.itemList.sort((a, b) => {
        if (a.itemValue < b.itemValue) return -1;
        if (a.itemValue > b.itemValue) return 1;
        return 0;
      });

      this.resultTypeList.splice(0, 0, { itemKey: "所有", itemValue: "-1" });
    },
    // 切换类型
    changeResultType(key) {
      this.params.current = 1;
      this.label = key && key != -1 ? key : "";
      this.params.tradeTypeArray = key && key != -1 ? [key] : [];
      this.getTradList();
    },
    changeTab(item) {
      // 切换类型展示
      // -1：所有
      this.resultType = item.label ? item.label : "-1";
      //切换tab
      this.initStatus();
      this.label = item.label;
      this.params.tradeTypeArray = item.label ? [item.label] : [];
      this.params.current = 1;
      this.getTradList();
    },
    getPageData(page) {
      //切换页数
      this.params.current = page;
      this.getTradList();
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
        this.params.startTime = convert2ServerDateTime(startTime);
        this.params.endTime = convert2ServerDateTime(endTime);
      } else {
        this.canSpecialPick = false;
        this.params.startTime = "";
        this.params.endTime = "";
      }
    },
    search() {
      //搜索
      this.params.current = 1;
      this.getTradList();
    },
    initStatus() {
      //初始化搜索状态
      this.params.userCode = "";
      // this.params.startTime = '';
      // this.params.endTime = '';
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
        this.params.startTime = "";
        this.params.endTime = "";
      } else if (typeof this.choiceDate === "number") {
        this.canDatePick = true;
        let dateArr = Array.from(dates);
        this.params.startTime = convert2ServerDateTime(
          dateArr[this.choiceDate]().startTime
        );
        this.params.endTime = convert2ServerDateTime(
          dateArr[this.choiceDate]().endTime
        );
        this.searchTime = [this.params.startTime, this.params.endTime];
        // debugger;
      }
    },
    getTradList() {
      this.handlerSpin();
      // 参数只携带年月日 时间由服务端提供
      this.spinShow = true;
      this.resultList = [];
      let { startTime, endTime } = this.params;
      let indexOne = startTime.indexOf(" ");
      let indexTwo = endTime.indexOf(" ");
      this.params.startTime =
        indexOne !== -1 ? startTime.slice(0, indexOne) : startTime;
      this.params.endTime =
        indexOne !== -1 ? endTime.slice(0, indexTwo) : endTime;
      this.$http
        .post("/api/v2/agent/queryAgentBalanceDetailList", this.params, {
          userId: true,
          unenc: true,
        })
        .then((res) => {
          this.spinShow = false;
          if (res.data.code !== 0) return;
          this.resultList = res.data.data.balanceDetailList;
          this.total = res.data.data.total;
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
    this.params.startTime = convert2ServerDateTime(startTime);
    this.params.endTime = convert2ServerDateTime(endTime);
    this.getTradList();
    this.getQueryItemList();
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
        /*   color: #be1204;
        border-bottom: 2px solid #be1204; */
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
      float: left;
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
      .selectWay {
        width: 100px;
        display: inline-block;
        margin-left: 20px;
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
  }
  .demo-spin-col {
    display: flex;
    height: 100px;
    width: 760px;
    position: relative;
    border: none;
  }
}
</style>
