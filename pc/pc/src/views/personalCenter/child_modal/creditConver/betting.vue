<template>
  <div class="betting-record">
    <!-- 表格 -->
    <div class="table-wrap">
      <Table :columns="columns"
             :data="recordList"
             stripe></Table>
    </div>
    <div class="page-wrap">
      <page :total="params.total"
            :current="params.currentPage"
            :pageSize="10"
            @get-Page-Data="getBetRecList"></page>
    </div>
  </div>
</template>

<script>
import page from '@/components/page.vue'
import util from '@/utils/utils'
import { convert2LocalDateTime } from "@/filters";
import { mapGetters } from 'vuex';

export default {
  components: {
    page
  },
  data () {
    return {
      columns: [
        {
          title: this.$tex('时间'),
          key: 'createTime',
          width: 240,
          render: (h, params) => {
            return h('span', convert2LocalDateTime(params.row.createTime))
          }
        },
        {
          title: this.$tex('游戏平台'),
          key: 'platformName',
          width: 180
        },
        {
          title: this.$tex('投注'),
          key: 'bettingMoney',
          width: 220,
          render: (h, params) => {
            return h('span', {
              'class': 'conver-plate'
            }, `${util.splitDecimalOf2(params.row.bettingMoney)}${this.sysExchangeInfo.tcurIcon}`)
          }
        },
        {
          title: this.$tex('奖金'),
          key: 'changeAmount',
          width: 100,
          render: (h, params) => {
            return h('span', `${util.splitDecimalOf2(params.row.winMoney)}${this.sysExchangeInfo.tcurIcon}`)
          }
        }
      ],
      params: {
        num: 10,
        index: 1,
        total: 0
      },
      recordList: []
    }
  },
  computed: {
    ...mapGetters(['sysExchangeInfo'])
  },
  methods: {
    getBetRecList (page) {
      this.$emit('handler-spin', true);
      this.$http.post('/party/v2/game/queryGameBettingList', { num: this.params.num, index: page ? page : 1 }, { userId: true, unenc: true }).then(res => {
        this.$emit('handler-spin', false);
        if (res.data.code !== 0) return;
        let { total, list } = res.data.data;
        this.recordList = list;
        this.params.index = page;
        this.params.total = total;
      })
    }
  },
  created () {
    this.getBetRecList();
  }
}
</script>

<style class="less" scoped>
.betting-record {
    padding-top: 20px;
}
</style>
