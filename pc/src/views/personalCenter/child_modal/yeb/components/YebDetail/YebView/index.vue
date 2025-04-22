<template>
  <div>
    <Row :gutter="12">
      <Col span="12"
           class="yesterday-box">
      <div class="yesterday-earnings">
        <p class="yesterday-earnings__title">昨日收益(元)</p>
        <p class="yesterday-earnings__content">{{yebInfo.yesterdayEarn | filterNumer}}</p>
      </div>
      <Row class="transfer-group"
           :gutter="14">
        <Col span="12">
        <div class="transfer-group__in"
             @click="transferIn"><span>转入</span></div>
        </Col>
        <Col span="12">
        <div class="transfer-group__out"
             @click="transferOut"><span>转出</span></div>
        </Col>
      </Row>
      </Col>
      <Col span="12">
      <div class="price-info">
        <Row>
          <Col span="12">
          <div class="total-amount price-info-item">
            <p class="total-amount__title price-info-item__title">总余额(元)</p>
            <p class="total-amount__content price-info-item__content">{{yebInfo.balance | filterNumer}}</p>
          </div>
          </Col>
          <Col span="12">
          <div class="cum-income price-info-item">
            <p class="cum-income__title price-info-item__title">累计收益(元)</p>
            <p class="cum-income__content price-info-item__content">{{yebInfo.totalEarn | filterNumer}}</p>
          </div>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <div class="bench-yield price-info-item">
            <p class="bench-yield__title price-info-item__title">基准收益率(%)</p>
            <p class="bench-yield__content price-info-item__content">{{yebInfo.baseRate}}</p>
          </div>
          </Col>
          <Col span="12">
          <div class="floating-rate price-info-item">
            <p class="floating-rate__title price-info-item__title">浮动收益率(%)</p>
            <p class="floating-rate__content price-info-item__content">{{yebInfo.floatRate}}</p>
          </div>
          </Col>
        </Row>
      </div>
      </Col>
    </Row>
    <div class="chart card">
      <yeb-income-chart></yeb-income-chart>
    </div>
  </div>
</template>

<script>

import YebIncomeChart from './YebIncomeChart'
import numeral from 'numeral'

export default {
  name: 'YebView',
  components: { YebIncomeChart },
  filters: {
    filterNumer (val) {
      return val ? numeral(val).format('0,0.00', Math.floor) : '0.00'
    }
  },
  data () {
    return {
      yebInfo: {}
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.queryUserYebInfo()
    },
    queryUserYebInfo () {
      this.$http.post('/api/v2/user/queryUserYebInfo', {}, { userId: true, unenc: true }).then(response => {
        if (response.data.code !== 0) return void 0
        const { data } = response.data
        this.yebInfo = data
        this.$store.commit('getYebInfo', data)
      })
    },
    transferIn () {
      this.$emit('replace-view', 'YebTransferIn')
    },
    transferOut () {
      this.$emit('replace-view', 'YebTransferOut')
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  box-shadow: 0px 0px 16px 3px rgba(181, 0, 0, 0.08);
  border-radius: 4px;
}
.chart {
  margin-top: 24px;
}
.yesterday-earnings {
  height: 122px;
  background-color: #f96b1e;
  box-shadow: 0px 0px 16px 3px rgba(181, 0, 0, 0.08);
  background: url(/static/images/yeb/shouyi.png) no-repeat;
  background-size: cover;
  border-radius: 4px;
  text-align: center;
  color: #ffffff;
  .yesterday-earnings__title {
    padding-top: 20px;
    font-size: 24px;
  }
  .yesterday-earnings__content {
    font-size: 32px;
  }
}
.transfer-group {
  margin-top: 12px;
  color: #ffffff;
  .transfer-group__in,
  .transfer-group__out {
    border-radius: 4px;
    text-align: center;
    font-size: 18px;
    line-height: 46px;
    cursor: pointer;
    box-shadow: 0px 0px 16px 3px rgba(181, 0, 0, 0.08);
  }
  .transfer-group__in {
    background-color: #ff7614;
  }
  .transfer-group__out {
    background-color: #dd1f17;
  }
}
.price-info {
  height: 180px;
  box-shadow: 0px 0px 16px 3px rgba(181, 0, 0, 0.08);
  border-radius: 4px;
  .price-info-item {
    text-align: center;
    padding-top: 26px;
  }
  .price-info-item__title {
    font-size: 16px;
    // margin-bottom: 6px;
  }
  .price-info-item__content {
    font-size: 18px;
    color: #ff7614;
  }
}
</style>