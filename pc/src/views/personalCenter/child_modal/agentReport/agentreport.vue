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
          class="lotteryType "
          :class="{ active: tab === 0 }"
          @click="changeTab('lottery')"
        >
          {{ $tex("彩票") }}
        </div>
        <div
          class="game lotteryType"
          :class="{ active: tab === 1 }"
          @click="changeTab('game')"
        >
          {{ $tex("第三方") }}
        </div>
      </div>
      <div class="lf">
        <Select
          v-model="reportType"
          clearable
          class="report-type"
          @on-change="onReportTypeChange"
        >
          <Option
            v-for="(item, index) in reportTypeSelect"
            :value="item.value"
            :key="index"
            >{{ item.label }}</Option
          >
        </Select>
      </div>
      <div class="rt">
        <div class="name">
          <Icon type="search"></Icon>
          <Input
            :value="params.userCode"
            @input="params.userCode = arguments[0].replace(/^\s+|\s+$/, '')"
            size="default"
            :placeholder="$tex('输入下级代理账号')"
            style="width:100px"
          ></Input>
        </div>
        <div class="search">
          <Button type="primary" class="wxbutton" @click="search(tab)">{{
            $tex("搜索")
          }}</Button>
        </div>
      </div>
    </div>
    <!-- 搜索结束 -->
    <!-- 查询列表 -->
    <div class="search-content">
      <Row type="flex" :gutter="19">
        <Col span="6" v-for="(item, index) in resultList" :key="index">
          <div
            :style="{
              cursor: jumpList.includes(item.key) ? 'pointer' : ' default ',
            }"
            class="item"
            @click.prevent="reportDetails(item)"
          >
            <span>{{ item.value }}</span>

            <a v-if="jumpList.includes(item.key)">{{ item.name }} </a>
            <span v-else>{{ item.name }}</span>
          </div>
        </Col>
      </Row>
    </div>
    <!-- 弹窗 -->
    <modal
      :title="reportTitle"
      :width="700"
      :modalShow="isShowImgPreview"
      :scrollable="true"
      :hasFooter="false"
      :hasOkBtn="false"
      :hasNoBtn="false"
      @btn-cancel="onImgPreviewCancel"
    >
      <div slot="content">
        <Table
          :columns="columns"
          :data="teamDetailReport.records"
          :height="420"
          :loading="spinShow"
          stripe
        >
        </Table>
        <!-- <div class="demo-spin-col" v-show="spinShow"><Spin fix> </Spin></div> -->
        <page
          :total="teamDetailReport.total"
          :currentPage="params.current"
          :pageSize="params.size"
          show-elevator
          @get-Page-Data="getPageData"
          class="page-wrapper"
        ></page>
      </div>
    </modal>
  </div>
</template>

<script>
import dateUtil from "@/utils/format_date.js";
import dates from "@/utils/date.js";
import common from "../../common/mixin";
import { convert2LocalDateTime, convert2ServerDateTime } from "@/filters";
import modal from "@/components/modal.vue";
import page from "@/components/page.vue";
import { mapGetters } from "vuex";
export default {
  mixins: [common],
  components: {
    modal,
    page,
  },
  computed: {
    ...mapGetters(["user"]),
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
      reportTypeSelect: [
        {
          label: this.$tex("直属报表"),
          value: 1,
        },
        {
          label: this.$tex("团队报表"),
          value: 2,
        },
      ],
      reportType: 1,
      choiceDate: 0, //查询指定时间
      searchTime: [startTime, endTime], //日期选择器时间
      totalList: [], //彩票和第三方数据总和
      resultList: [], //搜索结果
      canDatePick: true, //是否禁用日期选择器
      canSpecialPick: false, //是否禁用指定日期选择
      params: {
        userCode: "",
        gtTime: convert2ServerDateTime(startTime),
        ltTime: convert2ServerDateTime(endTime),
        type: 1,
        teamDetailType: "",
        size: 8,
        current: 1,
      },
      tab: 0, // 切换彩票和第三方
      jumpList: [
        "dayFirstRechargeUser", ////首充人数
        "dayUserNum", //当日充值人数
        "newRegisterUser", //注册人数
        "bettingCount", //彩票投注人数
        "userNum", //下级人数
      ],
      isShowImgPreview: false, // 是否展示弹窗
      spinShow: true, // loading
      // 详细数据
      teamDetailReport: [],
      reportTitle: "",
      columns: [], // 表 标头
    };
  },
  watch: {
    tab(index) {
      this.tabChangeHandler(index);
    },
    "$route.params.userCode"() {
      if (this.$route.params.userCode) {
        this.params.userCode = this.$route.params.userCode;
        this.getAgentList();
        return;
      }
    },
  },
  methods: {
    // 团队报表 点击具体数据
    reportDetails(item) {
      // console.log("item", item, this.params, this.user);
      if (!this.jumpList.includes(item.key)) return;
      this.teamDetailReport = []; // 弹窗报表 内容
      this.columns = []; // 弹窗报表 表头
      this.reportTitle = item.name;
      this.params.teamDetailType = item.key;
      this.params.current = 1;
      this.getTeamDetailReport();
      this.isShowImgPreview = true;
    },
    getPageData(page) {
      //切换页数
      this.params.current = page;
      this.getTeamDetailReport();
    },
    getTeamDetailReport() {
      this.spinShow = true;
      this.$http
        .post("/api/v2/agent/queryTeamDetailReport", this.params, {
          userId: true,
          unenc: true,
        })
        .then((res) => {
          if (res.data.code !== 0) return;
          this.teamDetailReport = res.data.data.userTeamReportRspPage;
          this.columns = res.data.data.columns;

          // console.log("团队报表 点击具体数据", res);
          this.spinShow = false;
        })
        .catch(() => {
          this.spinShow = false;
        });
    },
    onImgPreviewCancel() {
      this.isShowImgPreview = false;
    },
    tabChangeHandler(index) {
      if (index === 0) {
        this.resultList = this.totalList.filter((item) => item.type === "1");
      } else if (index === 1) {
        this.resultList = this.totalList.filter((item) => item.type === "2");
      }
    },
    changeTab(tabBar) {
      if (tabBar === "lottery") {
        this.tab = 0;
      } else if (tabBar === "game") {
        this.tab = 1;
      }
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
    search(tab) {
      this.getAgentList();
    },
    onReportTypeChange() {
      this.params.type = this.reportType;
      this.getAgentList();
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
    getAgentList() {
      this.$emit("handler-spin", true);
      this.$http
        .post("/api/v2/agent/queryTeamReport", this.params, {
          userId: true,
          unenc: true,
        })
        .then((res) => {
          this.$emit("handler-spin", false);
          if (res.data.code !== 0) return;
          this.totalList = res.data.data;
          this.tabChangeHandler(this.tab);
        });
    },
  },
  created() {
    if (this.$route.params.userCode) {
      this.params.userCode = this.$route.params.userCode;
      this.getAgentList();
      return;
    }
    this.getAgentList();
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
    display: flex;
    width: 140px;
    height: 31px;
    margin: -1px 18px;
    border-radius: 5px;
    font-size: 14px;
    overflow: hidden;
    border: 1px solid #dddee1;
    & > div {
      display: inline-block;
      width: 100%;
      font-size: 14px;
      text-align: center;
      cursor: pointer;
      word-break: break-word;
      justify-content: center;
      align-items: center;
      // padding: 0px 2px;
      &.active {
        color: #fff;
      }
      &.lotteryType {
        // border-right: 1px solid rgb(226, 226, 226);
        line-height: 31px;
      }
    }
  }
  .search-wrap {
    /*height: 30px;*/
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
      a {
        font-size: 18px;
      }
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

.page-wrapper {
  margin-top: 20px;
}
.demo-spin-col {
  display: flex;
  height: 100px;
  position: relative;
  border: none;
}
</style>
