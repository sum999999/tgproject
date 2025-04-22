<template>
  <div class="override">
    <div class="search">
      <div class="datetext">{{ $tex("起始日期") }}：</div>
      <div class="selectDate">
        <Row>
          <Col span="12">
          <DatePicker v-model="query.queryTime"
                      @on-clear="setFromate"
                      type="daterange"
                      :options="option"
                      :editable="false"
                      placement="bottom-end"
                      :placeholder="$tex('请选择查询时间')"
                      style="width: 200px"></DatePicker>
          </Col>
        </Row>
      </div>
      <div class="button">
        <Button type="primary"
                class="wxbutton"
                @click="changePage(1)">{{$tex("搜索")}}</Button>
      </div>
    </div>
    <!-- 详情弹窗 -->
    <modal :modalShow="showModel"
           :width="890"
           :title="$tex('第{num}期详情', {num: currentInfo.periodNo})"
           claName="lee-override-modal-wrap"
           :hasFooter="false"
           @btn-cancel="showModel = false">
      <div slot="content"
           style="width:842px;">
        <Table :columns="columnsDetail"
               :data="rebateInfoList"
               stripe
               height="360"
               class="lee-override-modal"></Table>
      </div>
      <div slot="lee-footer"
           class="lee-footer">
        <Button type="ghost"
                @click="modalhide">{{$tex("返回")}}</Button>
      </div>
    </modal>
    <div class="table">
      <Table :columns="columns"
             :data="rebateList"
             :loading="leeWrapSpinShow"
             stripe></Table>
      <div class='total-money'
           v-if='rebateList.length'>
        <!-- <p>
                    <span>总结</span>
                    <span>{{total.buyMoneyTotal.toFixed(2)}}</span>
                    <span>{{total.rebateSumTotal.toFixed(2)}}</span>
                </p> -->
      </div>
    </div>
    <!-- <Spin fix
              v-show="leeWrapSpinShow">
            <Icon type="load-c"
                  size=24
                  class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin> -->
    <page :total="pageParams.total"
          :current="pageParams.currentPage"
          :pageSize="pageParams.size"
          @get-Page-Data="queryList"></page>
  </div>
</template>
<script>
import dateUtil from '@/utils/format_date.js'
import page from '@/components/page.vue'
import modal from '@/components/modal.vue';
import common from '../../common/mixin'
import { convert2LocalDateTime, convert2ServerDateTime } from "@/filters";

export default {
  components: { page, modal },
  mixins: [common],
  data () {
    return {
      total: {},
      modelTitle: '',
      pageParams: {
        total: 0,
        currentPage: 1,
        size: 10
      },
      infoPageParams: {
        total: 0,
        currentPage: 1
      },
      query: {
        queryTime: ''
      },
      showModel: false,
      rebateList: [],
      rebateInfoList: [],
      currentInfo: {
        periodNo: '',
        lotteryRecordId: ''
      },
      leeWrapSpinShow: false,
      // columns: [
      //     {
      //         title: '交易期号',
      //         key: 'periodNo',
      //         width: 161
      //     },
      //     {
      //         title: '彩种名称',
      //         key: 'lotteryName',
      //         width: 98
      //     },
      //     {
      //         title: '投注人数',
      //         key: 'bettingUserCount',
      //         width: 98
      //     },
      //     {
      //         title: '投注金额',
      //         key: 'buyMoney',
      //         width: 98,
      //         render: (h, params) => {
      //             return h('span', params.row.buyMoney.toFixed(2))
      //         }
      //     },
      //     {
      //         title: '佣金',
      //         key: 'rebateSum',
      //         width: 98,
      //         render: (h, params) => {
      //             return h('span', params.row.rebateSum.toFixed(2));
      //         }
      //     },
      //     {
      //         title: '状态',
      //         key: 'status',
      //         width: 98
      //     },
      //     {
      //         title: '详情',
      //         key: 'takeFeeTotal',
      //         width: 100,
      //         render: (h, params) => {
      //             return h('div', [
      //                 h('span', {
      //                     style: {
      //                         color: '#be1204',
      //                         cursor: 'pointer'
      //                     },
      //                     on: {
      //                         click: () => {
      //                             this.show(params.row)
      //                         }
      //                     }
      //                 }, '详情')
      //             ]);
      //         }
      //     }
      // ],
      columns: [
        {
          title: this.$tex('代理名称'),
          key: 'userCode',
          width: 240
        },
        {
          title: this.$tex('投注金额'),
          key: 'buyMoney',
          width: 240
        },
        {
          title: this.$tex('代理佣金'),
          key: 'rebateSum',
          width: 280
        }
      ],
      columnsDetail: [
        {
          title: this.$tex('期号'),
          key: 'periodNo',
          width: 137
        },
        {
          title: this.$tex('账号'),
          key: 'userCode',
          width: 137
        },
        {
          title: this.$tex('投注金额'),
          key: 'buyMoney',
          width: 137
        },
        {
          title: this.$tex('彩种'),
          key: 'lotteryName',
          width: 137
        },
        {
          title: this.$tex('玩法'),
          key: 'playName',
          width: 137
        },
        {
          title: this.$tex('佣金'),
          key: 'rebate',
          width: 157
        }
      ]
    }
  },
  methods: {
    modalhide () {
      this.showModel = false
    },
    changePage (page) {
      this.queryList(page);
    },
    changePageInfo (page) {
      this.queryInfoList(page, this.currentInfo);
    },
    show (row) {
      this.currentInfo = row;
      this.changePageInfo(1, this.currentInfo);
    },
    setFromate () {
      this.query.queryTime = '';
    },
    queryList (page) {
      var gtBuyTime = '', ltBuyTime = '';
      if (this.query.queryTime.length > 0) {
        this.query.queryTime[1].setHours(23);
        this.query.queryTime[1].setMinutes(59);
        this.query.queryTime[1].setSeconds(59);
        gtBuyTime = convert2ServerDateTime(this.query.queryTime[0]);
        ltBuyTime = convert2ServerDateTime(this.query.queryTime[1]);
      }
      this.leeWrapSpinShow = true
      this.$http.post('/api/v2/agent/subuser/rebate', { current: page, userId: this.userInfo.userId, gtBuyTime: gtBuyTime, ltBuyTime: ltBuyTime, size: this.pageParams.size }, { userId: true, unenc: true }).then(response => {
        this.leeWrapSpinShow = false
        if (response.data.code !== 0) return;
        // console.log(response)
        this.pageParams.currentPage = page;
        this.total = response.data.data;
        this.rebateList = response.data.data.rebateList;
        this.pageParams.total = response.data.data.total;
      })
    },
    queryInfoList (page, row) {
      this.$http.post('/api/v2/agent/subuser/rebate/info', { current: page, lotteryRecordId: row.lotteryRecordId }, { userId: true, unenc: true }).then(response => {
        if (response.data.code !== 0) return;
        this.showModel = true;
        this.modelTitle = row.periodNo;
        this.rebateInfoList = response.data.data.rebateInfoList;
        this.infoPageParams.total = response.data.data.total;
      });
    }

  },
  created () {
    const startTime = new Date();
    startTime.setHours(0);
    startTime.setMinutes(0);
    startTime.setSeconds(0);
    const endTime = new Date();
    endTime.setHours(23);
    endTime.setMinutes(59);
    endTime.setSeconds(59);
    this.query.queryTime = [startTime, endTime];
    this.userInfo = localStorage.getItem('user');
    // console.log(this.userInfo);
    this.queryList(1);
  }
}
</script>

<style lang="less">
.lee-override-modal {
  .ivu-table-body {
    overflow-x: hidden;
  }
}
.lee-override-modal-wrap {
  .lee-footer {
    padding-top: 20px;
    text-align: center;
    button {
      display: block;
      margin: auto;
    }
  }
  .ivu-modal-footer {
    display: none;
  }
}
.override {
  margin-top: 12px;
  .search {
    text-align: right;
    height: 30px;
    line-height: 30px;
    .selectDate {
      display: inline-block;
      vertical-align: top;
      .ivu-date-picker .ivu-select-dropdown {
        left: -232px!important;
      }
    }
    .datetext {
      &:extend(.override .search .selectDate);
      margin-left: 5%;
    }
    .button {
      &:extend(.override .search .selectDate);
      margin-left: 22px;
      button {
        /*width: 66px;*/
      }
    }
  }
  .table {
    margin-top: 13px;
    .total-money {
      height: 35px;
      line-height: 35px;
      font-size: 0;
      p {
        span {
          display: inline-block;
          width: 47px;
          color: #313131;
          font-size: 14px;
          font-weight: bold;
          margin-left: 70px;
          &:first-child {
            width: 28px;
            margin-left: 272px;
          }
          &:last-child {
            margin-left: 51px;
          }
        }
      }
    }
  }
}
</style>
