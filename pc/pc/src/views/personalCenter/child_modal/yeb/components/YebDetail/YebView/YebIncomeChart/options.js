const echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/line');
require('echarts/lib/component/title');
require('echarts/lib/component/tooltip');
import numeral from 'numeral'

const chatOption = {
  grid: {
    left: 80,
    top: 20,
    right: 30,
    bottom: 50,
  },
  tooltip: {
    show: true,
    trigger: 'axis',
    backgroundColor: '#fff',
    axisPointer: {
      lineStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: '#ff9a9e' // 0% 处的颜色
          }, {
            offset: 1,
            color: '#ffdab1' // 100% 处的颜色
          }],
          globalCoord: false // 缺省为 false
        },
      }
    },
    // position: function (point, params, dom, rect, size) {
    //   return [point[0], '10%'];
    // },
    textStyle: {
      color: '#b1b5b8'
    },
    padding: [10, 25, 10, 25],
    extraCssText: 'box-shadow:0px 0px 16px 3px rgba(181, 0, 0, 0.08);',
    formatter: function (params) {
      return `
        ${numeral(params[0].value).format('0,0.00') || '0.00'}
      `
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    axisTick: {
      show: false
    },
    axisLine: {
      lineStyle: {
        color: '#fff3e5',
        width: 2
      }
    },
    axisLabel: {
      margin: 20,
      color: '#b1b5b8'
    },
    data: []
  },
  yAxis: {
    offset: 20,
    scale: true,
    type: 'value',
    axisTick: {
      show: false
    },
    axisLine: {
      lineStyle: {
        color: '#ffe9d1',
        width: 2
      }
    },
    axisLabel: {
      color: '#404447'
    },
    //网格样式
    splitLine: {
      show: true,
      lineStyle: {
        color: ['#fff3e5'],
        width: 1,
        type: 'dashed'
      }
    },
  },
  series: [{
    data: [0, 0, 0, 0, 0, 0],
    type: 'line',
    lineStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 1,
        y2: 0,
        colorStops: [{
          offset: 0,
          color: '#ffb767' // 0% 处的颜色
        }, {
          offset: 1,
          color: '#ff3a4c' // 100% 处的颜色
        }],
        globalCoord: false // 缺省为 false
      },
    },
    symbolSize: 10,
    itemStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 1,
        y2: 0,
        colorStops: [{
          offset: 0,
          color: '#ffb767' // 0% 处的颜色
        }, {
          offset: 1,
          color: '#ff3a4c' // 100% 处的颜色
        }],
        globalCoord: false // 缺省为 false
      },
      borderWidth: 2
    },
    areaStyle: {
      color: {
        type: 'linear',
        x: 1,
        y: 0,
        x2: 1,
        y2: 1,
        colorStops: [{
          offset: 0,
          color: '#ffeced' // 0% 处的颜色
        }, {
          offset: 1,
          color: '#fffdfa' // 100% 处的颜色
        }],
        globalCoord: false // 缺省为 false
      }
    },
  }]
};
export {
  echarts,
  chatOption
}