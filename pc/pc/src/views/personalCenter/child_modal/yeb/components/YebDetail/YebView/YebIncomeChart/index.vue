<template>
  <div :style="{width, height}"
       id="yeb-income-chart"></div>
</template>
  
<script>

import { echarts, chatOption } from './options.js'

export default {
  name: 'YebIncomeChart',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '318px'
    },
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.createChart()
    },
    createChart () {
      const myChart = echarts.init(document.getElementById('yeb-income-chart'));
      myChart.showLoading();
      this.queryUserYebInterest().then(data => {
        myChart.hideLoading();
        const xAxisData = []
        const seriesData = []
        for (const item of data) {
          xAxisData.push(item.time)
          seriesData.push(item.interest)
        }
        chatOption.xAxis.data = xAxisData
        chatOption.series[0].data = seriesData
        myChart.setOption(chatOption);
      })
    },
    queryUserYebInterest () {
      return new Promise((resolve, reject) => {
        this.$http.post('/api/v2/user/queryUserYebInterest', {}, {
          userId: true,
          unenc: true
        }).then((res) => {
          if (res.data.code != 0) {
            return reject(res.data.msg)
          }
          resolve(res.data.data.details)
        }).catch(err => {
          reject(err)
        })
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
#yeb-income-chart {
  margin: auto;
}
</style>