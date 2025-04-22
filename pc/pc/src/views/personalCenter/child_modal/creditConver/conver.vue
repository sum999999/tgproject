<template>
  <div class="conver-record">
    <div class="table-wrap">
      <Table :columns="columns"
             :data="recordList"
             stripe></Table>
    </div>
    <div class="page-wrap">
      <page :total="params.total"
            :current="params.currentPage"
            :pageSize="10"
            @get-Page-Data="getConRecList"></page>
    </div>
  </div>
</template>

<script>
import page from '@/components/page.vue'
import util from '@/utils/utils'
import { hasPermission } from "@/utils/authority-utils";
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
          width: 298,
          render: (h, params) => {
            return h('span', convert2LocalDateTime(params.row.createTime))
          }
        },
        {
          title: this.$tex('游戏平台'),
          key: 'gamePlate',
          render: (h, params) => {
            return h('div', {
              'class': 'conver-plate'
            }, [
                h('span', params.row.platformCode),
                h('span', ''),
                h('span', params.row.toPlatformCode)
              ]
            )
          }
        },
        {
          title: this.$tex('金额'),
          key: 'changeAmount',
          width: 150,
          render: (h, params) => {
            return h('span', `${params.row.changeAmount}`)
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
    getConRecList (page) {
      this.$emit('handler-spin', true);
      this.$http.post('/party/v2/game/queryTransformList', { num: this.params.num, index: page ? page : 1 }, { userId: true, unenc: true }).then(res => {
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
    this.getConRecList();
  }
}
</script>

<style lang="less" scoped>
@deep: ~'>>>';
.conver-record {
    padding-top: 20px;
    @{deep} .conver-plate {
        font-size: 0;
        span {
            display: inline-block;
            vertical-align: middle;
            font-size: 12px;
            &:nth-child(2) {
                position: relative;
                width: 16px;
                height: 16px;
                background-color: #d6d6d6;
                transform: scale(0.5);
                margin: 0 12px 0 6px;
                &:after {
                    display: block;
                    content: '';
                    position: absolute;
                    top: -4px;
                    right: -24px;
                    border: 12px solid transparent;
                    border-left-color: #d6d6d6;
                }
            }
        }
    }
    .page-wrap {
        margin-top: 24px;
        text-align: center;
    }
}
</style>
