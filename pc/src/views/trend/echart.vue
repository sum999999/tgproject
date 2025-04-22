<template>
  <div class="chart-wrap">
    <div id="myChart"
         style="width:1000px;height:220px;"></div>
  </div>
</template>
<script>
const echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/line');//引入折线图组件
require('echarts/lib/component/tooltip');// 引入提示框和title组件
require('echarts/lib/component/title');
export default {
  props: {
    xData: {
      type: Array
    },
    maxLabel: { //最大刻度值
      type: Number
    },
    splitNumber: {//刻度个数
      type: Number
    },
    seriesData: {
      type: Array
    }
  },
  methods: {
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('myChart'));
      // 绘制图表
      myChart.setOption({
        tooltip: {},
        grid: {
          left: 40,
          top: 20
        },
        xAxis: {
          type: 'category',
          name: this.$tex('echarts.号'),
          nameLocation: 'start',
          data: [''].concat(this.xData),
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#b4b4b4',
              type: 'solid',
              width: 1
            }
          },
          axisTick: {
            inside: true,
            alignWithLabel: false//刻度与折点对齐
          },
          axisLabel: {
            interval: 0
          },
          splitMumber: 20
        },
        yAxis: {
          name: this.$tex('echarts.期'),
          type: 'value',
          nameLocation: 'start',
          splitLine: {//分割线
            lineStyle: {
              color: '#e7e7e7',
              type: 'dotted'
            },
          },
          axisLine: { //坐标轴线
            lineStyle: {
              color: '#b4b4b4',
              width: 2
            }
          },
          axisLabel: {
            formatter (value, index) { //设置坐标原点为期号
              return index === 0 ? null : value;
            }
          },
          // min: 0,
          max: this.maxLabel,
          splitNumber: this.splitNumber,
          axisTick: { //刻度线
            show: false
          },
          grid: {
            bottom: 60
          },
        },
        series: [{
          data: [''].concat(this.seriesData),
          type: 'line',
          symbolSize: 6,
          symbol: 'circle',
          smooth: false,
          color: ['#bf233c'],
          label: {
            normal: {
              show: true,
              position: 'top',
              textStyle: {
                fontWeight: 'normal',
                fontSize: '12',
                color: '#545454'
              }
            }
          },
          splitLine: {
            lineStyle: {
              type: 'dotted'
            },
          },
        }]
      });
    },
  },
  watch: {
    'seriesData' () {
      this.drawLine();
    }
  },
  mounted () {
    this.drawLine();
  }
}
</script>

<style lang="less">
.chart-wrap {
  width: 100%;
  height: 100%;
}
</style>


