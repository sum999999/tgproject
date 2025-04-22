<template>
  <div class="record">
    <div class="search">
      <div class="datetext">{{$tex("起始日期")}}：</div>
      <div class="selectDate">
        <Row>
          <Col span="12">
          <DatePicker
            type="daterange"
            placement="bottom-end"
            v-model="selectTime"
            :placeholder="$tex('请选择查询时间')"
            :options="option"
            :editable="false"
            style="width: 187px"
          ></DatePicker>
          </Col>
        </Row>
      </div>
      <div class='lottery-cate'>{{$tex("彩种")}}：</div>
      <div class='all-lottery'>
        <Select
          v-model="lotteryCategory"
          style="width:110px"
          clearable
          @on-change='changeLotteryCategory'
        >
          <Option
            v-for="item in lotteryCategoryList"
            :value="item.lotteryId ? item.lotteryId : ''"
            :key="item.lotteryId"
          >{{ item.lotteryName }}
          </Option>
        </Select>
      </div>
      <div class='status'>{{$tex("状态")}}：</div>
      <div class='all-status'>
        <Select
          v-model="lotteryStatus"
          style="width:85px"
          clearable
          @on-change='changeLotteryStatus'
        >
          <Option
            v-for="(item ,index) in lotteryStatusList"
            :value="item.status? item.status : ''"
            :key="index"
          >{{ item.name }}
          </Option>
        </Select>
      </div>
      <div class="feature-box">
        <div class="button">
          <Button
            type="primary"
            class="wxbutton"
            @click="changePage(1)"
            icon="search"
          >{{$tex("搜索")}}
          </Button>
        </div>
        <div class="button">
          <Button
            type="primary"
            class="wxbutton"
            @click="resetData('')"
            icon="ios-loop"
          >{{$tex("重置")}}
          </Button>
        </div>
      </div>
    </div>
    <modal
      :modalShow='detailFlag'
      :title="(detail.lotteryName || '') + $tex('第{num}期', { num: detail.periodNo || '' })"
      :width="1024"
      :hasFooter="detailAllowShared"
      :maskClosable="true"
      :okText="$tex('炫耀一下')"
      :noText="$tex('返回')"
      @btn-ok="onDetailOk"
      @btn-cancel="onDetailCancel"
    >
      <div slot="content">
        <div class="modal1">
          <div class="modal1img">
            <img :src="detail.lotteryIcon">
          </div>
          <div class="modal1info">
            <span class="infotitle">{{detail.lotteryName}}</span>
            <span
              class="infodate"
              style=""
            >
              <span>{{$tex("第{num}期开奖号", { num: detail.periodNo })}}</span>
            </span>
          </div>
          <div
            v-if='detail.status =="00"'
            class="modal1Status"
          >
            <span>{{$tex("待开奖")}}</span>
          </div>
          <div
            v-else-if="detail.status!=='00'"
            class="modal2Status"
          >
            <span
              class='prize-ball'
              v-for='(ball,index) in detail.lotteryNumber'
              :key='index'
              height="108"
            > {{ball}}</span>
          </div>
        </div>
        <div class="modal1detail">
          <span class="detailcss">
            {{$tex("金额")}}：
            <Input
              :value="`${(detail.buyMoney || '')}${hasPermission('element.unit') ? sysExchangeInfo.scurIcon : ''}`"
              disabled
            ></Input>
          </span>
          <span class="detailcss">
            {{$tex("期号")}}：
            <Input
              :value="detail.periodNo"
              disabled
            ></Input>
          </span>
          <span class="detailcss">
            {{$tex("状态")}}：
            <Input
              :value="detail.statusDesc"
              disabled
            ></Input>
          </span>
          <span class="detailcss">
            {{$tex("时间")}}：
            <Input
              :value="convert2LocalDateTime(detail.createTime)"
              disabled
            ></Input>
          </span>
        </div>
        <div class="modal1detail">
        </div>
        <div class='price-detail'>
          <Table
            :columns="detailColumns"
            :data="detailData"
            stripe
          ></Table>
        </div>
      </div>
    </modal>
    <div class="table">
      <Table
        stripe
        :data="bettingInfoListData"
        :columns="bettingInfoListColumns"
      ></Table>
      <unBoxingBtn @click="onUnBoxingClick" />
      <page
        :total="paramData.total"
        :currentPage="paramData.current"
        :pageSize="paramData.size"
        @get-Page-Data="getPageData"
      ></page>
    </div>
    <unBoxingModal
      v-model="isShowUnBoxingModal"
      @shared-click="onSharedClick"
    />
    <unBoxingSendModal
      v-model="isShowUnBoxingSendModal"
      :loading="sharedSendLoading"
      :userBettingRecordId="curRow.userBettingRecordId"
      @send-click="onSharedSendClick"
    />
  </div>
</template>
<script>
import page from '@/components/page.vue'
import modal from '@/components/modal.vue'
import common from '../../common/mixin'

import unBoxingBtn from './unBoxingBtn'
import unBoxingModal from './unBoxingModal'
import unBoxingSendModal from './unBoxingSendModal'
import { hasPermission } from '@/utils/authority-utils'
import { convert2LocalDateTime, convert2ServerDateTime } from '@/filters'
import { mapGetters } from 'vuex'
import Store from '@/store'

const SHARED_TYPE = {
  TODAY_BET_WIN: '1',
  RECORD: '2',
}

export default {
  components: { page, modal, unBoxingBtn, unBoxingModal, unBoxingSendModal },
  mixins: [common],
  data() {
    return {
      allowShare: true,
      curRow: {},
      sharedType: SHARED_TYPE.TODAY_BET_WIN,
      sharedSendLoading: false,
      isShowUnBoxingModal: false,
      isShowUnBoxingSendModal: false,
      forCancelBet: false, // true禁止
      hasMoreClick: false,
      lotteryStatusList: [
        { name: this.$tex('全部'), status: '' },
        { name: this.$tex('未开奖'), status: '00' },
        { name: this.$tex('未中奖'), status: '01' },
        { name: this.$tex('中奖'), status: '02' },
        { name: this.$tex('追号退还'), status: '03' },
        { name: this.$tex('和值注单'), status: '04' },
        { name: this.$tex('已撤单'), status: '05' },
      ], //彩种状态列表
      lotteryStatus: '', //彩票状态
      lotteryCategoryList: '', //彩种列表
      bettingInfoListDataOrigin: '', //彩种列表
      lotteryCategory: '', //彩种
      cancelOrder: false,
      selectTime: '',
      paramData: {
        status: '',
        current: 1,
        // size:5,
        size: 10,
        total: 0,
        gtBuyTime: '',
        ltBuyTime: '',
      },
      detailFlag: false,
      model1: '',
      dateList: [{ name: '一周' }, { name: '一月' }],
      detail: {},
      detailAllowShared: false,
      detailColumns: [
        {
          title: this.$tex('游戏玩法'),
          // width: 150,
          width: 120,
          key: 'playName',
        },
        {
          title: this.$tex('下注号码'),
          width: 524,
          key: 'buyLotteryNumber',
          render: (h, params) => {
            return h('span', params.row.buyLotteryNumber)
          },
        },
        {
          title: this.$tex('赔率'),
          // width: 80,
          width: 58,
          key: 'odds',
          render: (h, params) => {
            let odds = params.row.odds
            odds = odds && odds.includes(',') ? odds : odds * 1
            return h('div', odds || '0')
          },
        },
        {
          title: this.$tex('投注金额'),
          // width: 147,
          width: 85,
          key: 'buyMoney',
          // render: (h, params) => {
          //     return h('div', (params.row.odds * 1).toFixed(2) || '');
          // }
        },
        {
          title: this.$tex('注数'),
          // width: 76,
          width: 60,
          key: 'buyNum',
        },
        {
          title: this.$tex('返利'),
          // width: 89,
          width: 60,
          key: 'rebate',
          render: (h, params) => {
            return h('span', (params.row.rebate * 100).toFixed(2) + '%')
          },
        },
        {
          title: this.$tex('中奖金额'),
          // width: 140,
          width: 85,
          key: 'prize',
          render: (h, params) => {
            var text = null
            if (params.row.prize) {
              text = Number(params.row.prize).toFixed(2)
            }
            return h('span', text)
          },
        },
      ],
      detailData: [],
      bettingInfoListData: [],
      bettingInfoListColumns: this.getBetInfoListColumns(),
    }
  },
  computed: {
    ...mapGetters(['sysExchangeInfo']),
    updateRecord() {
      return this.$store.state.updateRecord
    },
  },
  watch: {
    updateRecord(n) {
      let obj = JSON.parse(n)
      this.resetData(obj.userBettingRecordId)
    },
  },
  methods: {
    hasPermission,
    convert2LocalDateTime,
    getBetInfoListColumns() {
      const columns = [
        {
          title: this.$tex('时间'),
          key: 'buyTime',
          render: (h, params) => {
            return h('span', convert2LocalDateTime(params.row.buyTime))
          },
        },
        { title: this.$tex('彩种'), key: 'lotteryName' },
        { title: this.$tex('期号'), key: 'periodNo' },
        { title: this.$tex('玩法'), key: 'playName' },
        {
          title: this.$tex('下注号码'),
          key: 'lotteryNumber',
          width: 99,
          render: (h, params) => {
            let lotteryNumber = params.row.lotteryNumber
            if (lotteryNumber.length > 99) {
              lotteryNumber = `${lotteryNumber.slice(0, 100)}......`
            }
            return h(
              'span',
              {
                style: {
                  color: '#be1204',
                },
              },
              lotteryNumber
            )
          },
        },
        { title: this.$tex('金额'), key: 'buyMoney' },
        {
          title: this.$tex('状态'),
          width: 63,
          key: 'ballstatus',
          render: (h, params) => {
            return h(
              'span',
              {
                style: {
                  color: params.row.status === '02' ? '#be1204' : params.row.status === '05' ? '#ff7614' : '#7f7f7f',
                },
              },
              params.row.statusDesc
            )
          },
        },
        {
          title: this.$tex('详情'),
          width: 60,
          key: 'balldetails',
          render: (h, params) => {
            return h('div', [
              h(
                'span',
                {
                  // props: {
                  //     type: 'primary',
                  //     size: 'small'
                  // },
                  style: {
                    color: '#be1204',
                    cursor: 'pointer',
                  },
                  on: {
                    click: () => {
                      this.show(params.row)
                    },
                  },
                },
                this.$tex('详情')
              ),
            ])
          },
        },
        {
          title: this.$tex('取消订单'),
          width: 88,
          key: 'ballcancle',
          width: 85,
          render: (h, params) => {
            const row = params.row
            if (row.status == '00' && !this.forCancelBet && row.orderFollow != 3 && row.orderFollow != 4) {
              // 3 4是抢庄房跟单和投注不允许撤单
              return h('div', [
                h('span', {
                  class: ['action'],
                  style: {
                    color: '#eb1204',
                  },
                  on: {
                    click: () => {
                      this.cancel(params.row)
                    },
                  },
                }),
              ])
            } else {
              return h('span', this.$tex('不可操作'))
            }
          },
        },
      ]
      if (Store.getters.isInternational) {
        const index = columns.findIndex((item) => {
          return item.key === 'buyMoney'
        })
        if (index !== -1) {
          // columns.splice(index + 1, 0, {title: this.$tex("用户金额"), key: "localAmount"}, {title: this.$tex("当前汇率"), key: "exchangeRate"})
          columns.splice(index + 1, 0, {
            title: this.$tex('单位'),
            render: (h, params) => {
              return h('div', this.sysExchangeInfo.scurIcon)
            },
          })
        }
      }
      return columns
    },
    onDetailOk() {
      this.onDetailCancel()
      setTimeout(() => {
        this.sharedType = SHARED_TYPE.RECORD
        this.isShowUnBoxingSendModal = true
      }, 500)
    },
    onDetailCancel() {
      console.log('onDetailCancel')
      this.detailFlag = false
    },
    onSharedClick() {
      this.curRow = {}
      this.isShowUnBoxingModal = false
      setTimeout(() => {
        this.sharedType = SHARED_TYPE.TODAY_BET_WIN
        this.isShowUnBoxingSendModal = true
      }, 500)
    },
    async onSharedSendClick(ryRoomIds) {
      this.sharedSendLoading = true
      if (SHARED_TYPE.TODAY_BET_WIN === this.sharedType) {
        const flag = await this.$store.dispatch('shareTodayBetWin', { ryRoomId: ryRoomIds })
        if (flag) {
          this.$Message.success(this.$tex('分享成功'))
        } else {
          this.$Message.error(this.$tex('分享失败'))
        }
      } else if (SHARED_TYPE.RECORD === this.sharedType) {
        const flag = await this.$store.dispatch('shareRecord', {
          userBettingRecordId: this.curRow.userBettingRecordId,
          ryRoomId: ryRoomIds,
        })
        if (flag) {
          this.$Message.success(this.$tex('分享成功'))
        } else {
          this.$Message.error(this.$tex('分享失败'))
        }
      }
      this.sharedSendLoading = false
      this.isShowUnBoxingSendModal = false
    },
    onUnBoxingClick({ betMoney, prizeMoney }) {
      this.isShowUnBoxingModal = true
    },
    resetData(detail) {
      //重置
      !!this.lotteryStatus ? (this.lotteryStatus = '') : ''
      !!this.lotteryCategory ? (this.lotteryCategory = '') : ''
      !!this.selectTime
        ? (function () {
            const startTime = new Date()
            startTime.setHours(0)
            startTime.setMinutes(0)
            startTime.setSeconds(0)
            const endTime = new Date()
            endTime.setHours(23)
            endTime.setMinutes(59)
            endTime.setSeconds(59)
            return [startTime, endTime]
          })()
        : ''
      this.getPageData(1, detail)
    },
    changePage(page) {
      this.getPageData(page)
    },
    changeLotteryCategory() {
      //选择彩种类型
      // console.log(this.lotteryCategory);
      if (!this.lotteryCategory) {
        this.bettingInfoListData = JSON.parse(JSON.stringify(this.bettingInfoListDataOrigin))
      } else {
        this.bettingInfoListData = this.bettingInfoListDataOrigin.filter(
          (item) => item.lotteryId === this.lotteryCategory
        )
      }
      if (!this.lotteryStatus) {
        return
      }
      this.bettingInfoListData = this.bettingInfoListData.filter((item) => item.status === this.lotteryStatus)
    },
    changeLotteryStatus() {
      //选择彩种状态
      if (!this.lotteryStatus) {
        this.bettingInfoListData = JSON.parse(JSON.stringify(this.bettingInfoListDataOrigin))
      } else {
        this.bettingInfoListData = this.bettingInfoListDataOrigin.filter((item) => item.status === this.lotteryStatus)
      }
      if (!this.lotteryCategory) {
        return
      }
      this.bettingInfoListData = this.bettingInfoListData.filter((item) => item.lotteryId === this.lotteryCategory)
    },
    getPageData(page, detail) {
      this.$emit('handler-spin', true)
      let vm = this
      let times = vm.selectTime
      if (times && times[0] && times[1]) {
        times[1].setHours(23)
        times[1].setMinutes(59)
        times[1].setSeconds(59)
        vm.$set(vm.paramData, 'gtBuyTime', convert2ServerDateTime(times[0]))
        vm.$set(vm.paramData, 'ltBuyTime', convert2ServerDateTime(times[1]))
      } else {
        vm.$set(vm.paramData, 'gtBuyTime', '')
        vm.$set(vm.paramData, 'ltBuyTime', '')
      }
      vm.$set(vm.paramData, 'status', this.lotteryStatus)
      vm.$set(vm.paramData, 'lotteryId', this.lotteryCategory)
      this.paramData.current = page
      // console.log('vm.paramData', vm.paramData)
      // if (!vm.paramData.gtBuyTime && !vm.paramData.ltBuyTime) {
      //     vm.allowShare = true;
      // } else if ((vm.paramData.gtBuyTime === vm.paramData.ltBuyTime) && (vm.paramData.gtBuyTime === convert2ServerDateTime(new Date))) {
      //     vm.allowShare = true;
      // } else {
      //     vm.allowShare = false;
      // }
      this.$http
        .post('/api/v2/betting/queryBettingInfoList', vm.paramData, {
          userId: true,
          unenc: true,
        })
        .then((response) => {
          this.$emit('handler-spin', false)
          if (response.data.code !== 0) return
          let data = response.data.data
          vm.bettingInfoListData = data.bettingInfoList
          vm.bettingInfoListDataOrigin = data.bettingInfoList
          // console.log(vm.bettingInfoListData);
          vm.bettingInfoListData.forEach((item, index) => {
            vm.$set(item, 'buyMoney', item.buyMoney.toFixed(2))
          })
          vm.$set(vm.paramData, 'total', data.total)
          // console.log(vm.bettingInfoListData, '===========')
          // 推送消息进来
        })
      if (detail) {
        this.$route.params.detail = '' // 清空detail
        this.show({ userBettingRecordId: detail })
      }
    },
    queryBettingInfo(id) {
      let vm = this
      vm.$http
        .post(
          '/api/v2/betting/queryBettingInfoById',
          { userBettingRecordId: id },
          { userId: true, unenc: true, loading: true }
        )
        .then((response) => {
          if (response.data.code !== 0) return
          vm.show(response.data.data.bettingInfo)
        })
    },
    async show(row) {
      this.curRow = row
      this.detailFlag = true
      this.detail = {}
      this.detailAllowShared = false
      let detailAllowShared = await this.$store.dispatch('queryAllowShare', {
        userBettingRecordId: row.userBettingRecordId,
      })
      if (detailAllowShared) {
        // detailAllowShared = hasPermission("personalCenter.record.detailAllowShared");
      }
      const response = await this.$http.post(
        '/api/v2/betting/queryBettingInfoById',
        { userBettingRecordId: row.userBettingRecordId },
        { userId: true, unenc: true }
      )
      if (response.data.code !== 0) return
      let data = response.data.data
      if (data.bettingInfo) {
        this.detail = data.bettingInfo
        if (data.bettingInfo.status === '02' && detailAllowShared) {
          this.detailAllowShared = detailAllowShared
        }
      } else {
        this.detail = {}
      }
      if (this.detail.lotteryNumber) {
        if (typeof this.detail.lotteryNumber === 'string') {
          let num = null
          if (/\d/.test(this.detail.lotteryNumber)) {
            if (this.detail.lotteryNumber.includes(',')) {
              num = this.detail.lotteryNumber.replace('+', ',').split(',')
            } else if (this.detail.lotteryNumber.includes('|')) {
              num = this.detail.lotteryNumber.split('|')
            }
            this.detail.lotteryNumber = num
          }
        }
      }
      this.detailData = []
      this.detailData.push(this.detail)
    },
    cancel(row) {
      let vm = this
      this.$Modal.confirm({
        title: this.$tex('取消订单'),
        content: `<p>${this.$tex('确定要取消订单吗？')}</p>`,
        onOk: () => {
          if (this.hasMoreClick) {
            //阻止连续点击
            return
          }
          this.hasMoreClick = true
          this.$http
            .post(
              '/api/v2/betting/cancleBettingRecord',
              { userBettingRecordId: row.userBettingRecordId },
              { userId: true }
            )
            .then((response) => {
              this.hasMoreClick = false
              if (response.data.code !== 0) return
              this.$Message.info(this.$tex('操作成功'))
              let page = this.paramData.current
              this.getPageData(page)
            })
        },
        onCancel: () => {},
      })
      return
    },
  },
  created() {
    let vm = this
    const startTime = new Date()
    startTime.setHours(0)
    startTime.setMinutes(0)
    startTime.setSeconds(0)
    const endTime = new Date()
    endTime.setHours(23)
    endTime.setMinutes(59)
    endTime.setSeconds(59)
    this.selectTime = [startTime, endTime]
    // vm.paramData.current=1;
    vm.getPageData(1, this.$route.params.detail)
    this.$http.post('/api/v2/lottery/queryLottery', {}, { unenc: true }).then((response) => {
      if (response.data.code !== 0) return
      this.lotteryCategoryList = response.data.data
      this.lotteryCategoryList.unshift({ lotteryName: this.$tex('全部') })
    })
    this.$store.dispatch('querySystemConfig').then((data) => {
      if (data['FORBIT_USER_CANCEL_BET'] === '1') {
        //1表示禁止撤单
        this.forCancelBet = true
      }
    })
    this.$store.dispatch('queryTodayBetWin')
  },
}
</script>

<style scoped>
.record {
  margin-top: 14px;
}

.center-modal .ivu-modal-content {
  padding: 20px;
}

.record .search {
  line-height: 30px;
  text-align: left;
  white-space: nowrap;
  display: flex;
}

.record .selectWay {
  width: 100px;
  float: left;
}

.record .datetext,
.record .lottery-cate,
.record .all-lottery,
.record .status,
.record .all-status {
  display: inline-block;
  height: 30px;
  vertical-align: top;
  color: #313131;
}

.record .selectDate {
  display: inline-block;
  vertical-align: top;
}

.record .lottery-cate,
.record .status {
  margin-left: 10px;
}

.record .button {
  display: inline-block;
  height: 30px;
  vertical-align: top;
  margin-bottom: 5px;
}

.record .search .ivu-select,
.record .search .ivu-date-picker {
  vertical-align: top;
}

.record .button button {
  display: flex;
  height: 100%;
  line-height: 16px;
  margin-left: 10px;
  padding: 6px 8px;
}

.record .infotitle {
  display: block;
  font-size: 28px;
  font-weight: bold;
  color: #313131;
  font-style: italic;
}

.record >>> .ivu-select {
  text-align: center;
}

.record >>> .ivu-input,
.record >>> .ivu-select-selection {
  height: 30px;
}

.record .table {
  margin-top: 13px;
}

.v-transfer-dom >>> .modal1 {
  height: 90px;
  width: 100%;
  margin-bottom: 16px;
  border-bottom: 1px solid #d2d0d0;
}

.v-transfer-dom >>> .modal1 .modal1img img {
  display: block;
  width: 74px;
  height: 74px;
}

.v-transfer-dom >>> .modal1info {
  float: left;
  padding-top: 6px;
  margin-left: 14px;
}

.v-transfer-dom >>> .modal1info .infotitle {
  display: block;
  font-size: 28px;
  font-weight: bold;
  color: #313131;
  font-style: italic;
}

.v-transfer-dom >>> .infodate {
  color: grey;
}

.v-transfer-dom >>> .modal1Status,
.v-transfer-dom >>> .modal2Status {
  float: left;
  margin-top: 15px;
  margin-left: 22px;
  line-height: 23px;
  text-align: center;
}

.v-transfer-dom >>> .modal1Status {
  padding: 0 15px;
  height: 23px;
  color: #fff;
  background-color: #a9a9a9;
  border-radius: 23px;
  -moz-border-radius: 23px;
  -ms-border-radius: 23px;
  -o-border-radius: 23px;
  -webkit-border-radius: 23px;
}

.v-transfer-dom >>> .modal2Status {
  color: #505c66;
  line-height: 23px;
}

.v-transfer-dom >>> .infodate:first-child,
.v-transfer-dom >>> .infodate:last-child {
  color: #a9a9a9;
}

.record .infodate span:nth-child(2) {
  /*   color: #be1204; */
  margin: 0 5px;
}

.record .table .ivu-table-wrapper >>> .ivu-table tbody td .ivu-table-cell {
  background-color: inherit;
  font-size: 12px;
}

.v-transfer-dom >>> .modal1detail {
  width: 990px;
  line-height: 38px;
  /* margin-left: -40px; */
  font-size: 0;
}

.v-transfer-dom >>> .modal1detail :first-child {
  margin-bottom: 16px;
}

.v-transfer-dom >>> .modal1detail:last-child {
  margin: 14px 0;
}

.record .modal1status span {
  color: white;
}

.v-transfer-dom >>> .modal1detail .detailcss {
  display: inline-block;
  margin-left: 41px;
  color: #a9a9a9;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
}

.v-transfer-dom >>> .modal1detail .detailcss input {
  font-size: 14px;
}

.v-transfer-dom >>> .modal1detail .detailcss .ivu-input-wrapper {
  width: 160px;
  height: 30px;
  vertical-align: inherit;
}

.v-transfer-dom >>> .price-detail .ivu-table-body {
  overflow-x: hidden;
  max-height: 220px;
}

.v-transfer-dom >>> .price-detail .ivu-table td {
  min-height: 36px;
  padding: 10px 0;
}

.ivu-table-wrapper >>> .ivu-table tbody td .ivu-table-cell span.action {
  background: url(~@/assets/images/icon.png) no-repeat -531px -119px;
  cursor: pointer;
  color: #e2e2e2;
  display: block;
  height: 14px;
  width: 12px;
}

/* .ivu-table-wrapper >>> .ivu-table tbody td:nth-child(9) .ivu-table-cell span {
    } */
.modal1detail >>> .ivu-input {
  border: none;
  background: #f2f2f2;
  color: #313131;
}

.v-transfer-dom >>> .prize-ball {
  display: inline-block;
  width: 42px;
  height: 42px;
  line-height: 42px;
  border-radius: 50%;
  color: #505c66;
  font-size: 18px;
  margin-right: 4px;
  background: -webkit-radial-gradient(#fcfcfc 21%, #c0bfbf);
  box-shadow: 0 3px 5px #787878;
  -webkit-box-shadow: 0 3px 5px #787878;
  -moz-box-shadow: 0 3px 5px #787878;
  -ms-box-shadow: 0 3px 5px #787878;
  -o-box-shadow: 0 3px 5px #787878;
}

.v-transfer-dom >>> .ivu-modal-footer {
  padding-top: 0;
}

.record >>> .lotteryNumber {
  background-color: inherit;
  position: relative;
  max-height: 40px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  /*   color: #be1204; */
  cursor: pointer;
}

.record >>> .lotteryNumber-tip .ivu-poptip-body-content-inner {
  max-width: 200px;
  white-space: normal;
}
.feature-box {
  display: flex;
  flex-wrap: wrap;
}
</style>
