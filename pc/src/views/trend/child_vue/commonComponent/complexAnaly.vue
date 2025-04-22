<template>
  <div class="complex-analy"
       v-loading="loading">
<!--    <BackTop></BackTop>-->
    <div class="title-tab">
      <ul class="title">
        <li>{{$tex("综合分析")}}</li>
        <li class="menu"
            v-for="(item,index) in subTitle"
            :key="item"
            @click="showOtherData(index)"
            :class="{'active':tabFlag[index]}">
          {{item}}
          <img src="/configstatic/pc/images/choice_active.png"
               v-show="tabFlag[index]">
        </li>
      </ul>
      <div class="date-choice">
        <date-choice @sendData="getChiceDate"></date-choice>
      </div>
    </div>
    <div class="table-wrap">
      <!-- 双面/号码统计 -->
      <div class="two-coin-wrap"
           v-if="tabFlag[0]">
        <div class="two-coin pk10">
          <h2>{{$tex("今日双面统计")}}</h2>
          <table border="0"
                 cellspacing="0"
                 cellpadding="0"
                 class="first-table">
            <tbody>
              <tr class="gray-bg">
                <td style="width:147px;">{{$tex("号码")}}</td>
                <td v-for="(info,idx) in resultList.totalNumCount"
                    :key="idx">{{info.num}}</td>
              </tr>
              <tr>
                <td class='ssc-times'>{{$tex("出现次数")}}</td>
                <td v-for="(item,idx) in resultList.totalNumCount"
                    :key="idx">{{item.count}}</td>
              </tr>
            </tbody>
          </table>
          <table border="0"
                 cellspacing="0"
                 cellpadding="0"
                 class="second-table">
            <tbody>
              <tr class="gray-bg">
                <td rowspan="2"
                    style="width:147px;">{{$tex("球次")}}</td>
                <template v-if="resultList.length">

                  <td v-for="(name,idx) in resultList.mixinInfo.name"
                      :key="idx"
                      colspan="4">{{name}}</td>
                </template>
              </tr>
              <template v-if="resultList.length">
                <tr class="gray-bg">
                  <td v-for="(desc,idx) in resultList.mixinInfo.desc"
                      :key="idx">{{desc}}</td>
                </tr>
              </template>
              <tr>
                <td style="width:147px;">{{$tex("出现次数")}}</td>
                <template v-if="resultList.length">
                  <td v-for="(count,idx) in resultList.mixinInfo.count"
                      :key="idx">{{count}}</td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!--长龙统计 -->
      <div class="long-wrap"
           v-if="tabFlag[1]">
        <h2>{{$tex("长龙连开提醒")}}</h2>
        <div class="long">
          <ul>
            <li v-for=" (item,idx) in resultList.longData "
                :key="idx">
              <span>{{item.title}}:</span>
              <span>{{item.content}}</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 号码分析 -->
      <div class="analy"
           v-if="tabFlag[2] &&resultList.length">
        <ul>
          <li>{{$tex("查看球号分析")}}:</li>
          <li class='ball-analy'
              v-for="(num,index) in ballsNum"
              :key="index"
              @click="ballNumAnaly(index)"
              :class="[code==='11x5'?'eleven-five':'',isActiveNumber[index]===index ? 'active':'']">{{num}}</li>
        </ul>
        <ul>
          <li>{{$tex("大小单双分布")}}:</li>
          <li class='ball-single'
              v-for="(num,index) in singleDouble"
              :key="index"
              @click="singleDoubleAnaly(index)"
              :class="[code==='11x5'?'eleven-five':'',single&&index===0||single===false&&index===1||small===false&&index===2||small&&index===3||double&&index===singleDouble.length-2?'active':'']">{{num}}</li>
        </ul>
      </div>
      <div class="record-list"
           v-if="resultList.length">
        <table border="0 "
               cellspacing="0 "
               cellpadding="0"
               class='ball-table'>
          <tbody>
            <tr>
              <td v-for="(item,index) in totalAnalyTitle"
                  :key="index"
                  :colspan="item.colspan">{{item.colspan?item.title:item}}</td>
            </tr>
            <tr v-for="item in resultList "
                :key="item.periodNo">
              <td>{{item.periodNo}}</td>
              <td class="ball">
                <span v-for="(ballInfo,index) in item.ballsInfo.lotteryNumbers"
                      :key="index"
                      :class="[
                            choiceBalls.length&&!choiceBalls.includes(ballInfo.content) || single&&!ballInfo.single|| single===false&&ballInfo.single||small===false&&ballInfo.small||small&&!ballInfo.small||double&&!ballInfo.double?'opacity':'']">{{ballInfo.content}}</span>
              </td>
              <td>{{item.sumInfo.sum}}</td>
              <td :class="[item.sumInfo.sum%2===0?'double-clr':'single-clr']">{{item.sumInfo.single}}</td>
              <td :class="[item.sumInfo.sum>22?'large-clr':'small-clr']">{{item.sumInfo.small}}</td>
              <td :class="[item.sumInfo.long==='龙'?'dragon':item.sumInfo.long==='虎'?'tiger':'sum']">{{item.sumInfo.long}}</td>
              <td v-for="(info,index) in item.ballsInfo.sizes"
                  :key="index"
                  :style="{'color':info.clr}">{{info.content}}</td>
              <td v-for="(info,index) in item.ballsInfo.singles"
                  :key="index"
                  :style="{'color':info.clr}">{{info.content}}</td>
              <td v-for="(info,index) in item.threeInfo"
                  :key="index"
                  :style="{'color':info.clr}">{{info.clr?info.content:info}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else
           style="height:100px;text-align:center;line-height:90px;border:1px solid #f1f1f1;border-top:none;">{{$tex("暂无数据")}}</div>
    </div>

  </div>
</template>
<script>
import config from '../const.js';
import dateChoice from './dateChoice.vue';
export default {
  components: {
    dateChoice
  },
  props: {
    code: { //彩种大类
      type: String
    },
    lotteryId: {
      type: String
    },
  },
  data () {
    return {
      loading: false,
      resultList: [],
      subTitle: [],
      ballsNum: [],
      singleDouble: [],
      tabFlag: [false, false, false],//切换号码、大小、单双
      choiceBalls: [],
      small: null, //大小
      single: null,//单双
      double: false,//对子
      params: {
        lotteryId: '',
        num: '200',
      },
      totalAnalyTitle: [ //总和分析标题
        this.$tex('期数'),
        this.$tex('开奖号码'),
        {
          title: this.$tex('总和'),
          colspan: 3
        },
        this.$tex('龙虎'),
        {
          title: this.$tex('1-5球大小'),
          colspan: 5
        },
        {
          title: this.$tex('1-5球单双'),
          colspan: 5
        }, this.$tex('前三'), this.$tex('中三'), this.$tex('后三')],
    }
  },
  methods: {
    /**
   * 球号分析
   */
    ballNumAnaly (index) {
      this.single = null;
      this.small = null;
      this.double = null;
      if (this.isActiveNumber[index] === index) {
        this.isActiveNumber.splice(index, 1, -1);
        this.choiceBalls.splice(this.choiceBalls.indexOf(index), 1);
        return
      }
      this.isActiveNumber.splice(index, 1, index);
      this.choiceBalls.push(index);
    },
    /**
     * 大小单双分布
     */
    singleDoubleAnaly (index) {
      this.isActiveNumber = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
      this.choiceBalls = [];
      switch (index) { //单为true,小为true
        case 0:
          this.double = false;
          this.single = this.single ? null : true;
          break;
        case 1:
          this.double = false;
          this.single = this.single === false ? null : false;
          break;
        case 2:
          this.double = false;
          this.small = this.small === false ? null : false;
          break;
        case 3:
          this.double = false;
          this.small = this.small ? null : true;
          break;
        case 4:
          this.double = !this.double;
          this.small = null;
          this.single = null;
          break;
        default:
          this.choiceBalls = [];
          this.isActiveNumber = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
          this.single = null;
          this.small = null;
          this.double = false;
          break;
      }
    },
    showOtherData (index) {
      this.tabFlag.splice(index, 1, this.tabFlag[index] = !this.tabFlag[index]);
    },
    getChiceDate (result) {
      this.params = Object.assign(result, this.params);
      this.getData();
    },
    getData () {
      this.loading = true;
      this.$http.post("/api/v2/trend/queryOpencodes", this.params, { unenc: true }).then(response => {
        this.loading = false;
        if (response.data.code !== 0) return;
        let data = response.data.data;
        let recordList = data.records;
        if (recordList.length) {
          this.resultList = config[this.code].handlerRecordList(recordList);
          return
        }
        this.resultList = [];
      });
    },
  },
  created () {
    this.params.lotteryId = this.lotteryId;
    this.getData();
    this.subTitle = config[this.code].subTitle;
    this.ballsNum = config[this.code].ballsNum;
    this.singleDouble = config[this.code].singleDouble;
    this.isActiveNumber = config[this.code].isActiveNumber;
  }
}
</script>
<style lang="less">
.complex-analy {
  width: 100%;
  li {
    float: left;
    text-align: center;
  }
  tr {
    &.gray-bg {
      td {
        background: #f5f5f5;
      }
    }
  }
  .title-tab {
    height: 52px;
    line-height: 52px;
    border: 1px solid #ebebeb !important;
    border-top: none;
    overflow: hidden;
    .title {
      padding-left: 20px;
      &:first-child {
        float: left;
        line-height: 52px;
        li {
          cursor: pointer;
          margin: 0 10px;
          &:first-child {
            cursor: inherit;
            font-weight: bold;
            font-size: 18px;
            color: #333;
            margin-left: 0;
          }
          &.menu {
            position: relative;
            height: 32px;
            line-height: 32px;
            padding: 0 16px 0 3px;
            margin-top: 10px;
            border: 1px solid #e4e4e4;
            border-radius: 4px;
            opacity: 1;
            font-size: 14px;
            font-weight: normal;
            text-align: center;
            &.active {
              opacity: inherit;
              border-color: @primary-color;
              color: @primary-color;
            }
            img {
              position: absolute;
              bottom: 0;
              right: 0;
              width: 22px;
              height: 22px;
            }
            &:hover {
              color: @primary-color;
              border-color: @primary-color;
            }
          }
        }
      }
    }
    .date-choice {
      float: right;
    }
  }
  .table-wrap {
    .two-coin-wrap {
      padding: 5px 19px 10px;
      background-color: #fafafa;
      border: 1px solid #f1f1f1;
      border-top: none;
      .two-coin {
        h2 {
          font-size: 16px;
          font-weight: normal;
          line-height: 44px;
          color: #333;
        }
        &.pk10 {
          td {
            padding: inherit;
            &.pk10-times {
              width: 75px;
            }
            &.ssc-times {
              width: 147px;
            }
          }
        }
        .second-table {
          margin-top: 10px;
        }
      }
    }
    .long-wrap {
      &:extend(.complex-analy .table-wrap .two-coin-wrap);
      padding-top: 16px;
      padding-bottom: 0;
      margin-bottom: 4px;
      border: 1px solid #f1f1f1;
      margin-top: 4px;
      &:after {
        display: block;
        clear: both;
        visibility: hidden;
        content: "";
      }
      h2 {
        &:extend(.complex-analy .table-wrap .two-coin-wrap .two-coin h2);
        line-height: 42px;
      }
      .long {
        display: flex;
        justify-content: space-between;
        li {
          width: 146px;
          height: 40px;
          line-height: 40px;
          margin: 0 10px 10px 0;
          letter-spacing: 2px;
          color: #545454;
          border: 1px solid #e5e5e5;
          background: #fff;
        }
      }
    }
    .analy {
      &:extend(.complex-analy .table-wrap .long-wrap);
      padding-top: 18px;
      padding-bottom: 18px;
      ul {
        height: 32px;
        line-height: 32px;
        &:first-child {
          margin-bottom: 10px;
        }
        li {
          color: #555;
          &:first-child {
            font-size: 16px;
            margin-right: 3px;
          }
          &.ball-analy {
            width: 58px;
            margin: 0 12px;
            border-radius: 4px;
            border: 1px solid #dddddd;
            background-color: #fff;
            cursor: pointer;
            &.active {
              border: 1px solid @primary-color;
              color: @primary-color;
            }
            &:hover {
              border-color: @primary-color;
              color: @primary-color;
            }
          }
          &.ball-single {
            &:extend(.complex-analy .table-wrap .analy ul li.ball-analy);
            &:hover {
              border-color: @primary-color;
              color: @primary-color;
            }
            &:last-child {
              width: 110px;
              background: @primary-color;
              color: #fff;
              border: none;
              -webkit-transition: opacity 0.2s linear;
              transition: opacity 0.2s linear;
            }
          }
        }
        &:last-child {
          li {
            &.ball-single {
              &:extend(.complex-analy .table-wrap .analy ul li.ball-analy);
              &:last-child {
                width: 110px;
                &:hover {
                  opacity: 0.8;
                }
              }
              &.active {
                border: 1px solid @primary-color;
                color: @primary-color;
              }
            }
          }
        }
      }
      &:after {
        display: block;
        clear: both;
        visibility: hidden;
        content: "";
      }
    }
    .record-list {
      padding: 9px 19px 29px;
      margin-top: 4px;
      border: 1px solid #f1f1f1;
    }
    table {
      color: #282828;
      border: 1px solid #dbdbdb;
      border-bottom: none;
      position: relative;
      table-layout: fixed;
      width: 100%;
      white-space: normal;
      word-break: break-all;
      td {
        border-right: 1px solid #eaeaea;
        border-bottom: 1px solid #eaeaea;
        text-align: center;
        height: 40px;
        padding: 0 4px;
        color: #575757;
        &:last-child {
          border-right: none;
        }
        &.double-clr {
          color: #f12a31;
        }
        &.single-clr {
          color: #575757;
        }
        &.small-clr {
          color: #233fd4;
        }
        &.large-clr {
          color: #575757;
        }
        &.dragon {
          color: #f12d35;
        }
        &.tiger {
          color: #184dd5;
        }
        &.sum {
          color: #184dd5;
        }
        &.ball {
          span {
            display: inline-block;
            height: 25px;
            width: 25px;
            border: none;
            margin: 2px;
            border-radius: 50%;
            background: #f03939;
            color: #fff;
            padding: 0;
            font-size: 16px;
            font-weight: normal;
            line-height: 25px;
            &.opacity {
              opacity: 0.1;
            }
          }
        }
      }
    }
  }
}
</style>


