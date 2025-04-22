<template>
  <div class="my-account themeColor">
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
                style="width: 185px"
              ></DatePicker>
            </Col>
          </Row>
        </div>
      </div>
      <div class="switchBar lf">
        <div
          v-for="(item, index) in tabs"
          :class="{ active: curTabIndex === index }"
          @click="onTabClick(index)"
        >
          {{ item.name }}
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
          ></Input>
        </div>
        <div class="search">
          <Button type="primary" class="wxbutton" @click="search()">{{
            $tex("搜索")
          }}</Button>
        </div>
      </div>
    </div>
    <!-- 搜索结束 -->
    <!-- 查询列表 -->
    <div class="search-content">
      <Table
        stripe
        :columns="reportColums"
        :data="reportList"
        :loading="isLoading"
      ></Table>
    </div>

    <page
      v-if="reportColums.length"
      :total="total"
      :currentPage="params.current"
      :pageSize="params.size"
      @get-Page-Data="search"
    ></page>
    <modal
      title="下级报表"
      :modalShow="showSubordinate"
      width="320px"
      :hasFooter="false"
      scrollable
      @btn-cancel="showSubordinate = false"
    >
      <div class="modal-report" slot="content">
        <p>用户账号: {{ subordinateId }}</p>
        <a @click.prevent="teamReports">团队报表</a>
        <a>查看上级</a>
        <a>查看下级</a>
      </div></modal
    >
  </div>
</template>

<script>
import DateUtil from "@/utils/format_date.js";
import dates from "@/utils/date.js";
import common from "../../common/mixin";
import page from "@/components/page.vue";
import isEmpty from "lodash/isEmpty";
import { convert2LocalDateTime, convert2ServerDateTime } from "@/filters";
import modal from "@/components/modal.vue";

export default {
  mixins: [common],
  components: {
    page,
    modal,
  },
  data() {
    const startTime = new Date();
    startTime.setHours(0);
    startTime.setMinutes(0);
    startTime.setSeconds(0);
    const endTime = new Date();
    endTime.setHours(23);
    endTime.setMinutes(59);
    endTime.setSeconds(59);
    return {
      dateText: [
        this.$tex("日期"),
        this.$tex("今天"),
        this.$tex("昨天"),
        this.$tex("本周"),
        this.$tex("上周"),
        this.$tex("本月"),
        this.$tex("上月"),
      ],
      choiceDate: 0, //查询指定时间
      searchTime: [startTime, endTime], //日期选择器时间
      canDatePick: true, //是否禁用日期选择器
      canSpecialPick: false, //是否禁用指定日期选择
      total: 0,
      params: {
        userType: "2",
        userCode: "",
        gtTime: convert2ServerDateTime(startTime),
        ltTime: convert2ServerDateTime(endTime),
        current: 1,
        size: 10,
      },
      reportColums: [],
      reportList: [],
      curTabIndex: 0,
      tabs: [
        { name: this.$tex("直属下级"), userType: "2" },
        { name: this.$tex("所有下级"), userType: "1" },
      ],
      isLoading: true,
      showSubordinate: false,
      subordinateId: "",
    };
  },
  methods: {
    onTabClick(index) {
      if (this.curTabIndex === index) {
        return;
      }
      this.curTabIndex = index;
      this.search();
    },
    teamReports() {
      this.$router.push({
        name: "personalCenter",
        params: {
          id: "agentReport",
          userCode: this.subordinateId,
        },
      });
      this.showSubordinate = false;
    },
    getSelectDate(result) {
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
        this.params.gtTime = convert2ServerDateTime(startTime);
        this.params.ltTime = convert2ServerDateTime(endTime);
      } else {
        this.canSpecialPick = false;
        this.params.gtTime = "";
        this.params.ltTime = "";
      }
    },
    clearParam() {
      const tab = this.tabs[this.curTabIndex];
      this.reportList = [];
      this.isLoading = true;
      this.params.current = 1;
      this.params.userType = tab.userType;
      const startTime = new Date();
      startTime.setHours(0);
      startTime.setMinutes(0);
      startTime.setSeconds(0);
      const endTime = new Date();
      endTime.setHours(23);
      endTime.setMinutes(59);
      endTime.setSeconds(59);
      this.params.gtTime = convert2ServerDateTime(startTime);
      this.params.ltTime = convert2ServerDateTime(endTime);
      this.params.userCode = "";
      this.canDatePick = true;
      this.canSpecialPick = false;
      this.choiceDate = 0;
    },
    async search(page = 1) {
      this.params.current = page;
      this.isLoading = true;

      const tab = this.tabs[this.curTabIndex];
      if (this.params.userType !== tab.userType) {
        this.clearParam();
      }
      const res = await this.$store.dispatch(
        "queryListTeamSubUsers",
        this.params
      );
      if (res.data.code !== 0) {
        this.isLoading = false;
        return;
      }
      const { total, list = [] } = res.data.data;
      if (!this.reportColums.length) {
        this.reportColums = this.getReportColums(list[0]);
      }
      this.rspsFlatHandler(list);
      this.total = total;
      this.reportList = list;
      this.isLoading = false;
    },
    getReportColums(report = {}) {
      const result = [];
      if (isEmpty(report)) {
        return result;
      }
      const beforeFourth = [
        {
          title: this.$tex("会员账号"),
          key: "userCode",
          width: 100,
          // render: (h, params) => {
          //   return h(
          //     "a",
          //     {
          //       on: {
          //         click: () => {
          //           this.subordinateId = params.row.userCode;
          //           this.showSubordinate = true;
          //           console.log("直属下级执行");
          //         },
          //       },
          //     },
          //     params.row.userCode
          //   );
          // },
        },
        {
          title: this.$tex("代理等级"),
          key: "agentLevel",
          width: 100,
        },
        {
          title: this.$tex("盈亏"),
          key: "win",
          width: 100,
        },
        {
          title: this.$tex("投注金额"),
          key: "bettingSum",
          width: 100,
        },
        {
          title: this.$tex("中奖金额"),
          key: "prizeSum",
          width: 100,
        },
        {
          title: this.$tex("充值金额"),
          key: "rechargeTotal",
          width: 100,
        },
      ];
      const { userTeamListRsps } = report;
      for (let key in report) {
        const index = beforeFourth.findIndex((item) => {
          return item.key === key;
        });
        if (index >= 0) {
          result.push(beforeFourth[index]);
        }
      }
      for (let index in userTeamListRsps) {
        const rsps = userTeamListRsps[index];
        result.push({
          title: rsps.name,
          key: rsps.key,
          width: 100,
        });
      }
      return result;
    },
    rspsFlatHandler(reportList) {
      for (let i in reportList) {
        const report = reportList[i];
        const { userTeamListRsps } = report;
        for (let rspsIndex in userTeamListRsps) {
          const rsps = userTeamListRsps[rspsIndex];
          report[rsps.key] = rsps.value;
        }
      }
    },
    changeSpecialDate() {
      //选择指定日期
      if (typeof this.choiceDate === "string") {
        //未选择指定日期
        this.canDatePick = false;
        this.params.gtTime = "";
        this.params.ltTime = "";
        this.searchTime = "";
      } else if (typeof this.choiceDate === "number") {
        this.canDatePick = true;
        let dateArr = Array.from(dates);
        this.params.gtTime = convert2ServerDateTime(
          dateArr[this.choiceDate]().startTime
        );
        this.params.ltTime = convert2ServerDateTime(
          dateArr[this.choiceDate]().endTime
        );
        this.searchTime = [this.params.gtTime, this.params.ltTime];
      }
    },
  },
  created() {
    this.search();
  },
};
</script>

<style lang="less">
.report-type {
  margin-left: 10px;
  width: 80px;
}
.my-account.themeColor .switchBar > div.active {
  color: #fff;
}
.my-account {
  padding-top: 12px;
  .switchBar {
    width: 150px;
    height: 30px;
    line-height: 28px;
    border-radius: 5px;
    margin-left: 18px;
    font-size: 14px;
    overflow: hidden;
    border: 1px solid #dddee1;
    & > div {
      display: inline-block;
      width: 50%;
      font-size: 14px;
      text-align: center;
      cursor: pointer;
      &.active {
        color: #fff;
      }
      &.lotteryType {
        border-right: 1px solid rgb(226, 226, 226);
      }
      &:nth-child(1) {
        border-right: 1px solid rgb(226, 226, 226);
      }
    }
  }
  .search-wrap {
    .lf {
      float: left;
      font-size: 0;
      .date {
        display: inline-block;
        vertical-align: top;
        font-size: 14px;
      }
      .selectDate {
        &:extend(.my-account .search-wrap .lf .date);
        margin-left: 22px;
      }
    }
    .rt {
      &:extend(.my-account .search-wrap .lf);
      float: right;
      .name {
        position: relative;
        &:extend(.my-account .search-wrap .lf .date);
        i {
          position: absolute;
          left: 8px;
          top: 9px;
          color: #949494;
          z-index: 2;
        }
        input {
          padding-left: 22px;
        }
      }
      .search {
        &:extend(.my-account .search-wrap .lf .date);
        margin-left: 17px;
        .wxbutton {
          width: 66px;
          height: auto;
          white-space: normal;
          word-break: break-all;
        }
      }
    }
  }
  .search-content {
    padding-top: 14px;
    .item {
      margin-bottom: 19px;
      padding: 14px 0;
      line-height: 26px;
      text-align: center;
      background-color: @agent-report-item-bg;
      span {
        display: block;
        &:first-child {
          font-size: 14px;
          color: @agent-report-item-fund-color;
        }
        &:last-child {
          line-height: 30px;
          font-size: 18px;
        }
      }
    }
    ul {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      /* display:grid;
                      grid-template-columns: repeat(4, 170px);
                      grid-template-rows: repeat(3, 84px);
                      align-items: center;
                      grid-gap: 22px 20px;
                       */
    }
  }
}
.modal-report {
  display: grid;
  text-align: center;
  justify-content: center;
  align-items: center;
  color: grey;
  font-size: 18px;
}
</style>
<style lang="less" scoped>
@deep: ~">>>";
.search-content {
  @{deep} .ivu-table-body {
    overflow-x: auto !important;
  }
}
</style>
