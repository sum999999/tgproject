<template>
  <div class="profitloss-wrap">
    <div class="profitloss">
      <div class="search">
        <div class="selectWay">
          <Select v-model="data.rechargeType"
                  clearable>
            <Option v-for="item in menuList"
                    :value="item.itemValue"
                    :key="item.itemValue">{{ item.itemKey }}</Option>
          </Select>
        </div>
        <div class="datetext">起始日期：</div>
        <div class="selectDate">
          <Row>
            <Col span="12">
            <DatePicker v-model="data.rechargeTime"
                        type="daterange"
                        :options="option"
                        :editable="false"
                        placement="bottom-end"
                        placeholder="请选择查询时间"
                        style="width: 200px"></DatePicker>
            </Col>
          </Row>
        </div>
        <div class="button">
          <Button type="primary"
                  class="wxbutton"
                  @click="search">搜索</Button>
        </div>
      </div>
      <div class="table">
        <Table :columns="columns"
               :data="rechargeList"
               stripe></Table>
        <page :total="pageParams.total"
              :current="pageParams.currentPage"
              :pageSize="10"
              @get-Page-Data="queryRechargeList"></page>
      </div>
    </div>
  </div>
</template>

<script>
import dateUtil from '@/utils/format_date.js'
import page from '@/components/page.vue'
import common from '../../../../common/mixin'
export default {
  name: 'ProfitLossDetail',
  components: { page },
  mixins: [common],
  data () {
    return {
      menuList: [],
      rechargeList: [],
      data: {
        rechargeType: '',
        rechargeTime: ''
      },
      pageParams: {
        total: 0,
        currentPage: 1
      },
      columns: [
        {
          title: '订单',
          key: 'typeDesc',
          width: 150
        },
        {
          title: '金额',
          key: 'tradeMoney',
        },
        {
          title: '余额',
          key: 'money',
        },
        {
          title: '日期',
          key: 'tradeTime',
        },
      ]
    }
  },
  methods: {
    queryType () {
    },
    search () {
      this.queryRechargeList(1);
    },
    formatDate (value) {
      return dateUtil.getFormatDate(value)
    },
    queryRechargeList (page) {
      this.$emit('handler-spin', true);
      var startTime = '', endTime = '';
      if (this.data.rechargeTime.length > 0) {
        if (this.data.rechargeTime[0] !== null) {
          startTime = dateUtil.getFormatDate(this.data.rechargeTime[0]);
        }
        if (this.data.rechargeTime[1] !== null) {
          endTime = dateUtil.getFormatDate(this.data.rechargeTime[1]);
        }
      }
      //账户明细
      this.$http.post('/api/v2/user/queryYebTradeList', { current: page, startTime: startTime, endTime: endTime, tradeTypeArray: this.data.rechargeType == '' ? [] : [this.data.rechargeType] }, { userId: true, unenc: true }).then(response => {
        this.$emit('handler-spin', false);
        if (response.data.code !== 0) return;
        this.pageParams.currentPage = page;
        this.rechargeList = response.data.data.details;
        this.pageParams.total = response.data.data.total;
      })
    }
  },
  created () {
    let d = new Date();
    this.data.rechargeTime = [d, new Date(d.getTime())];
    this.queryRechargeList(1);
    this.$http.post('/api/v2/sysDict/queryItemList', { 'dictName': 'YEB_TRADE_TYPE' }).then(response => {
      if (response.data.code !== 0) return;
      let list = response.data.data.itemList;
      list.unshift({ itemKey: '交易类型', itemValue: '' });
      this.menuList = list;
    })
  }
}
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
  color: @primary-color;
  border-bottom: 2px solid @primary-color;
}
.tab li.active span {
  color: @primary-color;
}
.tab li i {
  position: absolute;
  right: 0;
  top: 15px;
  height: 10px;
  width: 1px;
  background: #c0c0c0;
}
.profitloss .search {
  height: 30px;
  line-height: 30px;
}
.profitloss .selectWay {
  width: 100px;
  float: left;
}
.profitloss .datetext {
  float: left;
  line-height: 30px;
  margin-left: 5%;
}
.profitloss .selectDate {
  float: left;
  margin-left: 2px;
}
.profitloss .button {
  float: right;
}
.profitloss .wxbutton {
  width: 66px;
}
.profitloss .table {
  margin-top: 14px;
}
.profitloss .page-wrapper {
  margin-top: 25px;
}
</style>
