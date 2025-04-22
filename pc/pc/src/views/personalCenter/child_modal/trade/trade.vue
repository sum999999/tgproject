<template>
  <div class="my-account">
    <div class="account-content">
      <div class="trecharge">
        <div class="search">
          <div class="selectWay">
            <Select v-model="data.rechargeType" clearable>
              <Option
                v-for="item in menuList"
                :value="item.itemValue"
                :key="item.itemValue"
                >{{ item.itemKey }}</Option
              >
            </Select>
          </div>
          <div class="datetext">{{ $tex("起始日期") }}：</div>
          <div class="selectDate">
            <Row>
              <Col span="12">
                <DatePicker
                  v-model="data.rechargeTime"
                  type="daterange"
                  :options="option"
                  :editable="false"
                  placement="bottom-end"
                  :placeholder="$tex('请选择查询时间')"
                  style="width: 200px"
                ></DatePicker>
              </Col>
            </Row>
          </div>
          <div class="button">
            <Button type="primary" class="wxbutton" @click="search">{{
              $tex("搜索")
            }}</Button>
          </div>
        </div>
        <div class="table">
          <Table :columns="columns" :data="rechargeList" stripe></Table>
          <page
            :total="pageParams.total"
            :current="pageParams.currentPage"
            :pageSize="10"
            @get-Page-Data="queryRechargeList"
          ></page>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dateUtil from "@/utils/format_date.js";
import util from "@/utils/utils";
import page from "@/components/page.vue";
import common from "../../common/mixin";
import { convert2LocalDateTime, convert2ServerDateTime } from "@/filters";
import { hasPermission } from "@/utils/authority-utils";

export default {
  components: { page },
  mixins: [common],
  data() {
    const columns = [
      {
        title: this.$tex("交易时间"),
        key: "tradeTime",
        width: 150,
        render: (h, params) => {
          return h("span", convert2LocalDateTime(params.row.tradeTime));
        },
      },
      {
        title: this.$tex("交易类型"),
        key: "tradeTypeDesc",
        width: 103,
      },
      {
        title: this.$tex("收支情况"),
        key: "amount",
        width: 110,
        render: (h, params) => {
          return h("span", Number(params.row.amount).toFixed(3));
        },
      },
      {
        title: this.$tex("余额"),
        key: "userBalance",
        width: 136,
        render: (h, params) => {
          return h("span", util.splitDecimalOfN(params.row.userBalance, 2));
        },
      },
    ];

    columns.splice(2, 0, {
      title: this.$tex("交易描述"),
      key: "tradeDesc",
      width: 260,
    });

    return {
      menuList: [],
      rechargeList: [],
      data: {
        rechargeType: "", // 充值方式
        rechargeTime: "",
      },
      pageParams: {
        total: 0,
        currentPage: 1,
      },
      columns,
    };
  },
  methods: {
    search() {
      this.queryRechargeList(1);
    },
    formatDate(value) {
      return dateUtil.getFormatDate(value);
    },
    queryRechargeList(page) {
      this.$emit("handler-spin", true);
      var startTime = "",
        endTime = "";
      if (this.data.rechargeTime.length > 0) {
        if (this.data.rechargeTime[0] !== null) {
          startTime = convert2ServerDateTime(this.data.rechargeTime[0]);
        }
        if (this.data.rechargeTime[1] !== null) {
          this.data.rechargeTime[1].setHours(23);
          this.data.rechargeTime[1].setMinutes(59);
          this.data.rechargeTime[1].setSeconds(59);
          endTime = convert2ServerDateTime(this.data.rechargeTime[1]);
        }
      }
      //账户明细
      this.$http
        .post(
          "/api/v2/user/queryBalanceDetailList",
          {
            current: page,
            startTime: startTime,
            endTime: endTime,
            tradeTypeArray:
              this.data.rechargeType == "" ? [] : [this.data.rechargeType],
          },
          { userId: true, unenc: true }
        )
        .then((response) => {
          this.$emit("handler-spin", false);
          if (response.data.code !== 0) return;
          this.pageParams.currentPage = page;
          this.rechargeList = response.data.data.balanceDetailList;
          this.pageParams.total = response.data.data.total;
        });
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
    this.data.rechargeTime = [startTime, endTime];
    this.queryRechargeList(1);
    this.$http
      .post("/api/v2/sysDict/queryItemList", { dictName: "TRADE_TYPE" })
      .then((response) => {
        if (response.data.code !== 0) return;
        let list = response.data.data.itemList;
        list.unshift({ itemKey: this.$tex("交易类型"), itemValue: "" });
        this.menuList = list;
      });
  },
};
</script>

<style lang="less" scoped>
.tab {
  height: 40px;
  font-size: 16px;
  border-bottom: 2px solid #e2e2e2;
}
.tab li {
  float: left;
  padding: 0 20px;
  cursor: pointer;
  height: 40px;
  line-height: 40px;
  position: relative;
}
.tab li.active {
  /* color: @primary-color;
  border-bottom: 2px solid @primary-color; */
}
.tab li.active span {
  /*  color: @primary-color; */
}
.tab li i {
  position: absolute;
  right: 0;
  top: 15px;
  height: 10px;
  width: 1px;
  background: #c0c0c0;
}
.account-content {
  padding-top: 12px;
}
.trecharge .search {
  height: 30px;
  line-height: 30px;
}
.trecharge .selectWay {
  width: 100px;
  float: left;
}
.trecharge .datetext {
  float: left;
  line-height: 30px;
  margin-left: 5%;
}
.trecharge .selectDate {
  float: left;
  margin-left: 2px;
}
.trecharge .button {
  float: right;
}
.trecharge .wxbutton {
}
.trecharge .table {
  margin-top: 14px;
}
.trecharge .page-wrapper {
  margin-top: 25px;
}
</style>
