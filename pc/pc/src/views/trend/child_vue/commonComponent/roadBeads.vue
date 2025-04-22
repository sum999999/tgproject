<template>
  <div
    class="roadbead-analy-wrap"
    v-loading="loading"
  >
<!--    <BackTop></BackTop>-->
    <div class="roadbead-analy">
      <div class="title-top">
        <ul class="title clearfix">
          <li
            v-for="(item,index) in modes"
            :key="index"
            @click="choiceMode(index)"
            :class="[modeIndex===index?'active':'']"
            :style="{'left':160*index+'px'}"
          >{{item}}</li>
        </ul>
        <div class="date-choice">
          <date-choice @sendData="getChiceDate"></date-choice>
        </div>
      </div>
      <div
        v-if="roadBeadsList.length"
        class="mode-menu"
      >
        <div class='rand'>
          <ul class="clearfix">
            <li>{{$tex("筛选名次")}} :</li>
            <li
              class="tab"
              v-for="(rank,index) in ranks[modeIndex]"
              :key="index"
              @click="choiceRank(index)"
              :class="[(modeIndex===0&&ranksFlag[index])||(modeIndex===1&&index===singleIndex)||(modeIndex==2&&twoSideFlag[index])?'active':'']"
            >
              {{rank}}
              <i class="iconfont icon-yxj-right"></i>
              <!--  <img src="/configstatic/pc/images/choice_active.png"> -->
            </li>
          </ul>
        </div>
        <div class="road-beads clearfix">
          <ul class="clearfix">
            <li>{{$tex("筛选路珠")}} :</li>
            <li
              class="tab"
              v-for="(rank,index) in roadBeads[modeIndex]"
              :key="index"
              @click="choiceRoadBeads(index)"
              :class="[(modeIndex===0&&roadBeadsFlag[index])||(modeIndex===1&&singleBeadsFlag[index])||(modeIndex===2&&twoSideIndex===index)?'active':'',modeIndex===2&&index>2?'large-width':'']"
            >
              {{rank}}
              <i class="iconfont icon-yxj-right"></i>
            </li>
          </ul>
          <div
            class='quick-handler'
            v-if="modeIndex!=1"
          >
            <span @click="choiceAll">{{$tex("全选")}}</span>
            <span @click="clear">{{$tex("清空")}}</span>
          </div>
        </div>
      </div>
      <!--内容-->
      <div
        v-if="roadBeadsList.length"
        class="content-wrap"
      >
        <div
          class="item"
          v-for="(item,index) in roadBeadsList"
          :key="index"
          v-if="(code!=='klsf'&&
                   (modeIndex===0&&((item.ballIndex>=0&&ranksFlag[item.ballIndex])&&(item.roadBeadsIndex>=0&&roadBeadsFlag[item.roadBeadsIndex]))
                ||(modeIndex===0&&item.ballIndex===undefined&&roadBeadsFlag[item.roadBeadsIndex]))||
                (modeIndex===1&&singleIndex===item.ballIndex&&(item.isSingleDouble&&singleBeadsFlag[1]||item.isSmallLarge&&singleBeadsFlag[0])&&!item.isDragonTiger)
                ||(modeIndex===2&&((item.ballIndex>=0&&twoSideFlag[item.ballIndex])||(item.ballIndex===undefined&&twoSideFlag[twoSideFlag.length-1]))&&
                (twoSideIndex===0&&(item.isSmallLarge||item.isSumSmallLarge)||(twoSideIndex===1&&(item.isSingleDouble||item.isSumSingleDouble))||(twoSideIndex===2&&item.isDragonTiger))))||(code==='klsf'&&
                    (modeIndex===0&&((item.ballIndex>=0&&ranksFlag[item.ballIndex])&&(item.roadBeadsIndex>=0&&roadBeadsFlag[item.roadBeadsIndex]))
                ||(modeIndex===0&&item.ballIndex===undefined&&roadBeadsFlag[item.roadBeadsIndex]))||
                 (modeIndex===1&&singleIndex===item.ballIndex&&(((item.isSumSingleDouble||item.isSingleDouble)&&singleBeadsFlag[1])||
                 ((item.isSumSmallLarge||item.isSmallLarge)&&singleBeadsFlag[0])||(item.isDragonTiger&&singleBeadsFlag[2])||(item.isTail&&singleBeadsFlag[3])||(item.isSingleAndDouble&&singleBeadsFlag[4])))
                ||(modeIndex===2&&twoSideFlag[item.ballIndex]&&
                (twoSideIndex===0&&(item.isSmallLarge||item.isSumSmallLarge)||(twoSideIndex===1&&(item.isSingleDouble||item.isSumSingleDouble))||(twoSideIndex===2&&item.isDragonTiger)||(twoSideIndex===3&&(item.isTail||item.isSumTail))||(twoSideIndex===4&&item.isSingleAndDouble))))"
        >
          <img
            src="/static/images/road-beads-new.png"
            alt=""
          >
          <div class="title">
            <div class="lf">
              <div class="same">{{$tex("连续出现")}}</div>
              <i18n class="same" path="{num}次以上" tag="div">
                <template slot="num">
                  <InputNumber
                          :max="100000"
                          :min="1"
                          :step="1"
                          style="width:47px;"
                          size="small"
                          v-model="choiceResult[index].count"
                  ></InputNumber>
                  &nbsp;
                </template>
              </i18n>
              <Select
                style="width:47px;"
                class="same"
                size="small"
                v-model="choiceResult[index].flag"
              >
                <Option
                  v-for="(itm,index) in item.choice"
                  :value="itm.flag"
                  :key="index"
                >{{itm.title}}</Option>
              </Select>
              <div class="same btn-wrap">
                <Button @click="ok(index)">{{$tex("确定")}}</Button>
              </div>
              <div class="same">{{$tex("出现的次数")}}:</div>
              <div class="same count">{{counts[index]}}</div>
            </div>
            <div class="rt">
              <span>{{$tex("今天累计")}}:</span>
              <span>{{item.oneName}}</span>
              <span>({{item.oneCount}})</span>
              <span>{{item.twoName}}</span>
              <span>({{item.twoCount}})</span>
              <span class="font-red">{{item.index}}</span>
              <span class="font-red">{{item.name}}</span>
              <span class="font-red">{{$tex("最新")}}</span>
            </div>
          </div>
          <div class="road-analy-content">
            <table
              border="0 "
              cellspacing="0 "
              cellpadding="0"
            >
              <tbody>
                <tr>
                  <td
                    v-for="(info,idx) in item.infoArray"
                    :key="idx"
                    :class="[info.flag?'special-color':'',info.choiceFlag==info.flag+''&&info.choiceCount<=info.count?'special-bg':'']"
                  >{{info.content}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div
        v-else
        style="height:100px;text-align:center;line-height:90px;border:1px solid #f1f1f1;border-top:none;border-bottom:none;"
      >{{$tex("暂无数据")}}</div>
    </div>
  </div>
</template>
<script>
import config from "../const.js";
import dateChoice from "./dateChoice.vue";
export default {
  components: {
    dateChoice
  },
  props: {
    code: {
      type: String
    },
    lotteryId: {
      type: String
    }
  },
  data() {
    return {
      params: {
        lotteryId: "",
        num: "200"
      },
      dates: [this.$tex("今天"), this.$tex("昨天"), this.$tex("前天"), this.$tex("最近30期"), this.$tex("最近60期"), this.$tex("最近90期")],
      modes: [this.$tex("综合模式"), this.$tex("单选模式"), this.$tex("两面模式")],
      dateIndex: 0, //日期查询索引
      roadBeadsList: [],
      roadBeads: [], //路珠的标题
      modeIndex: 0, //路珠的查看模式
      ranksFlag: [], //筛选名次按钮--综合模式
      twoSideFlag: [], ////筛选名次--两面模式
      roadBeadsFlag: [], ////筛选路珠按钮--综合模式
      singleBeadsFlag: [], //
      singleIndex: 0, //单选模式下筛选名次
      singleBeadsFlag: [], //单选模式下筛选路珠--单选模式
      twoSideIndex: 0, //筛选路珠--两面模式
      ranks: [], //综合、单选和两面模式数组
      choiceResult: [],
      counts: [], //表格数量
      loading: false
    };
  },
  methods: {
    /**
     * 路珠分析---确定按钮
     */
    ok(index) {
      let flag = this.choiceResult[index].flag;
      let count = this.choiceResult[index].count;
      let infoArray = this.roadBeadsList[index].infoArray;
      let sameCount = 0;
      infoArray.forEach(item => {
        item.choiceCount = count;
        item.choiceFlag = flag;
        if (item.count >= count && flag === item.flag + "") {
          sameCount++;
        }
      });
      this.counts.splice(index, 1, sameCount);
    },
    /**
     * 取消全选
     */
    clear() {
      switch (this.modeIndex) {
        case 0:
          this.ranksFlag.forEach((item, index) => {
            this.ranksFlag.splice(index, 1, false);
            if (index < this.roadBeadsFlag.length) {
              this.roadBeadsFlag.splice(index, 1, false);
            }
          });
          break;
        case 2:
          this.twoSideFlag.forEach((item, index) => {
            this.twoSideFlag.splice(index, 1, false);
          });
          break;
        default:
          break;
      }
    },
    /**
     * 全选
     */
    choiceAll() {
      switch (this.modeIndex) {
        case 0: //综合模式
          this.ranksFlag.forEach((item, index) => {
            this.ranksFlag.splice(index, 1, true);
            if (index < this.roadBeadsFlag.length) {
              this.roadBeadsFlag.splice(index, 1, true);
            }
          });
          break;
        case 2: //两面模式
          this.twoSideFlag.forEach((item, index) => {
            this.twoSideFlag.splice(index, 1, true);
          });
        default:
          break;
      }
    },
    /**
     * 筛选名次
     */
    choiceRank(idx) {
      switch (this.modeIndex) {
        case 0: //综合模式
          this.ranksFlag.splice(idx, 1, !this.ranksFlag[idx]);
          break;
        case 1: //单选模式
          this.singleIndex = idx;
          break;
        case 2: //两面模式
          this.twoSideFlag.splice(idx, 1, !this.twoSideFlag[idx]);
          break;
        default:
          break;
      }
    },
    /**
     * 筛选路珠
     */
    choiceRoadBeads(index) {
      switch (this.modeIndex) {
        case 0: //综合
          this.roadBeadsFlag.splice(index, 1, !this.roadBeadsFlag[index]);
          break;
        case 1: //单选
          this.singleBeadsFlag.splice(index, 1, !this.singleBeadsFlag[index]);
          break;
        case 2: //两面
          if (this.twoSideIndex === index) return;
          this.twoSideIndex = index;
          break;
        default:
          break;
      }
    },
    /**
     * 路珠查看模式
     */
    choiceMode(index) {
      if (this.modeIndex === index) return;
      this.modeIndex = index;
      if (this.code === "pk10") {
        this.counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      } else if (this.code === "ssc") {
        this.counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //item出现的次数
      } else if (this.code === "11x5") {
        this.counts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      } else if (this.code === "klsf") {
        this.counts = [
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0
        ];
      }
      this.roadBeadsList.forEach(item => {
        item.infoArray.forEach(itm => {
          if (itm.choiceCount !== -1) {
            itm.choiceCount = -1;
            itm.choiceFlag = null;
          }
        });
      });
      switch (this.modeIndex) {
        case 0:
          if (this.code === "pk10") {
            this.ranksFlag = [
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true
            ];
            this.roadBeadsFlag = [true, true, true];
          } else if (this.code === "ssc") {
            this.ranksFlag = [true, true, true, true, true, true];
            this.roadBeadsFlag = [true, true, true];
          } else if (this.code === "11x5") {
            this.ranksFlag = [true, true, true, true, true, true, true];
            this.roadBeadsFlag = [true, true, true];
          } else if (this.code === "klsf") {
            this.ranksFlag = [
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true
            ];
            this.roadBeadsFlag = [true, true, true, true, true, true];
          }
          break;
        case 1:
          if (this.code === "pk10") {
            this.singleBeadsFlag = [true, true, true];
          } else if (this.code === "ssc") {
            this.singleBeadsFlag = [true, true];
          } else if (this.code === "11x5") {
            this.singleBeadsFlag = [true, true];
          } else if (this.code === "klsf") {
            this.singleBeadsFlag = [true, true, true, true, true];
          }
          this.singleIndex = 0;
          break;
        case 2:
          if (this.code === "pk10") {
            this.twoSideFlag = [
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true
            ];
          } else if (this.code === "ssc") {
            this.twoSideFlag = [true, true, true, true, true, true, true];
          } else if (this.code === "11x5") {
            this.twoSideFlag = [true, true, true, true, true, true, true];
          } else if (this.code === "klsf") {
            this.twoSideFlag = [
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true,
              true
            ];
          }
          this.twoSideIndex = 0;
          break;
        default:
          break;
      }
    },
    getChiceDate(result) {
      //获取选择的时间
      this.params = Object.assign(result, this.params);
      this.getData();
    },
    getData() {
      this.loading = true;
      this.$http
        .post("/api/v2/trend/queryOpencodes", this.params, { unenc: true })
        .then(response => {
          this.loading = false;
          if (response.data.code !== 0) return;
          let data = response.data.data;
          let recordList = data.records;
          if (recordList.length) {
            this.roadBeadsList = config[this.code].analyRoadBeads(recordList);
            return;
          }
          this.roadBeadsList = [];
        });
    }
  },
  created() {
    this.params.lotteryId = this.lotteryId;
    this.getData();
    this.ranks = config[this.code].ranks;
    this.roadBeads = config[this.code].roadBeads;
    this.choiceResult = config[this.code].choiceResult;
    this.ranksFlag = config[this.code].ranksFlag;
    this.twoSideFlag = config[this.code].twoSideFlag;
    this.singleBeadsFlag = config[this.code].singleBeadsFlag;
    this.roadBeadsFlag = config[this.code].roadBeadsFlag;
    this.counts = config[this.code].counts;
  }
};
</script>
<style lang='less'>
.roadbead-analy-wrap {
  width: 100%;
  .roadbead-analy {
    border: 1px solid #e9e9e9;
    margin-top: 24px;
    padding-bottom: 19px;
    li {
      float: left;
      text-align: center;
    }
    .title-top {
      display: flex;
      border-bottom: 1px solid #e6e6e6;
      .title {
        float: left;
        li {
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        &:first-child {
          position: relative;
          display: flex;
          width: 50%;
          overflow: hidden;
          float: left;
          li {
            width: 160px;
            padding: 0 10px;
            &:after {
              display: block;
              content: "";
              position: absolute;
              right: -1px;
              top: 0;
              width: 0;
              height: 46px;
              border-right: 1px solid #e6e6e6;
            }
            &.active {
              background-color: @primary-color;
              color: #fff;
              top: -3px;
              &:after {
                top: 3px;
              }
            }
          }
        }
      }
      .date-choice {
        float: right;
        line-height: 47px;
        width: 50%;
      }
      &:after {
        display: block;
        clear: both;
        content: "";
        visibility: hidden;
      }
    }
    .mode-menu {
      border-bottom: 1px solid #e9e9e9;
      padding: 20px 0 0 19px;
      li {
        &:first-child {
          color: #999;
          padding-right: 7px;
        }
        &.tab {
          cursor: pointer;
          margin: 2px 7px;
          padding: 0 22px 0 3px;
          height: 24px;
          line-height: 24px;
          /*  border: 1px solid @primary-color; */
          position: relative;
          text-align: left;
          font-size: 12px;
          opacity: 0.3;
          &.active {
            opacity: 1;
          }
          img {
            width: 22px;
            height: 22px;
            position: absolute;
            right: 0;
            bottom: 0;
          }
          .icon-yxj-right {
            position: absolute;
            /*    color: @primary-color; */
            right: 0;
            bottom: 0;
            height: 24px;
            font-size: 24px;
          }
        }
      }
      .rand {
        margin-bottom: 14px;
      }
      .road-beads {
        &:extend(.roadbead-analy-wrap .roadbead-analy .mode-menu .rand);
        .quick-handler {
          float: right;
          margin-right: 80px;
          color: #666;
          span {
            cursor: pointer;
            &:last-child {
              margin-left: 24px;
            }
          }
        }
      }
    }
    .content-wrap {
      .item {
        position: relative;
        margin-bottom: 2px;
        border-bottom: 1px solid #e9e9e9;
        border-top: 1px solid #e9e9e9;
        &:first-child {
          border-top: none;
        }
        img {
          width: 24px;
          height: 24px;
          position: absolute;
          right: 0;
          top: 0;
        }
        .title {
          display: flex;
          justify-content: space-between;
          padding: 6px 0 6px 7px;
          .lf {
            font-size: 0;
            float: left;
            .same {
              display: inline-block;
              vertical-align: middle;
              font-size: 12px;
              &.count {
                margin-left: 7px;
              }
              &:first-child {
                margin-right: 4px;
              }
              &.above {
                margin: 0 6px 0 2px;
              }
              &.btn-wrap {
                margin-left: 17px;
                margin-right: 6px;
                vertical-align: middle;
              }
              .ivu-btn {
                height: 24px;
                line-height: 12px !important;
              }
            }
          }
          .rt {
            float: right;
            line-height: 24px;
            font-size: 12px;
            span {
              float: left;
              margin: 0 3px;
              &:first-child {
                margin-right: 7px;
              }
              &:last-child {
                margin-left: 8px;
              }
              &:nth-last-child(2) {
                margin-left: 2px;
              }
              &:nth-last-child(3) {
                margin-right: 2px;
              }
              &.font-red {
                color: @primary-color;
              }
            }
          }
        }
        .road-analy-content {
          background: url("/static/images/table_bg.png") repeat;
          overflow-x: auto;
          overflow-y: hidden;
          border-top: 1px solid #e9e9e9;
          direction: rtl;
          min-height: 114px;
          table {
            float: right;
            min-height: 114px;
            td {
              vertical-align: top;
              box-sizing: border-box;
              text-overflow: ellipsis;
              width: 30px;
              text-align: center;
              padding: 7px 7px 0;
              border-right: 1px solid #e9e9e9;
              color: #999;
              font-size: 12px;
              &.special-color {
                color: @primary-color;
              }
              &.equal-color {
                color: #00ab07;
              }
              &:nth-child(odd) {
                background: #fff;
              }
              &:nth-child(even) {
                background: #f5f5f5;
              }
              &:first-child {
                border-right: none;
              }
              &:last-child {
                border-left: 1px solid #e9e9e9;
              }
              &.special-bg {
                background: @trend-road-beads-choice-bg;
                color: #fff;
              }
            }
          }
        }
      }
    }
  }
}
</style>

