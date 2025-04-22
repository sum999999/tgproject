<template>
  <div class='notice-detail'>
    <div class='broad-list'>
      <div class='top'></div>
      <div class='lottery-category'>
        <ul>
          <li
            :style="{width:100/broadList.length +'%'}"
            v-for='(item,index) in broadList'
            :key="index"
            @click='changeBroad(item)'
            :class="{'red-bg' : lotteryType === item.lotteryType}"
          >
            <i v-if="index"><img
                :src="item.lotteryTypeIcon"
                alt="图片"
              ></i>
            <span>{{item.lotteryTypeName}}</span>
          </li>
        </ul>
      </div>
      <div class='sub-lottery'>
        <span
          v-for='item in subList'
          :key="item.lotteryId"
          @click="getLotteryNoticeDetail(item)"
          :class="{'red-color':lotteryId ===item.lotteryId}"
        >{{item.lotteryName}}</span>
      </div>
    </div>
    <div
      class='detail-info'
      :class="{'large-padding':lotteryId ==='17' || lotteryId ==='20'}"
    >
      <ul
        class='title'
        v-if='lotteryInfo.lottery'
      >
        <li>{{lotteryInfo.lottery.lotteryName}}</li>
        <li>[{{lotteryInfo.lottery.prizeIntervalDesc}}]</li>
        <li>
          <i></i>
          <router-link :to="`/trendDetail/${lotteryInfo.lottery.lotteryId}?code=${lotteryInfo.lottery.code}`">{{$tex("号码走势")}}</router-link>
        </li>
        <li>
          <i></i>
          <a v-if="isInternational" href="javascript:void(0)" @click="jump2BuyLottery">
            {{$tex("玩法规则")}}
          </a>
          <router-link v-else :to="`/role/${lotteryInfo.lottery.lotteryId}`">{{$tex("玩法规则")}}</router-link>
        </li>
      </ul>
      <div class='period'>
        <i18n class="item" path="第{num}期" tag="div">
          <template slot="num">
            <Select
                    v-model="periodNo"
                    @on-change="changeSelected"
                    style='width:118px;height:30px;vertical-align:top;margin:0 20px;'
            >
              <Option
                      v-for="item in lotteryInfo.lotteryNearPrizeList"
                      :value="item.periodNo"
                      :key="item.periodNo"
              >{{item.periodNo}}</Option>
            </Select>
          </template>
        </i18n>
        <div class='item'>
          <span>{{$tex("开奖日期")}}：</span>
          <span style='color: rgb(190, 18, 4);'>{{selectedNo.prizeTime | convert2LocalDateTime}}</span>
        </div>
        <!-- 六合彩 -->
        <template v-if="selectedNo.lotteryNumber">
          <div
            class='item'
            v-if="code === '6hc'"
          >
            <span
              class='marksix-item'
              v-for="(item,index) in selectedNo.lotteryNumber"
              :key="index"
            >
              <span
                class='ball'
                :class='item.color'
              >{{item.num}}</span>
              <i>{{item.zTxt}}</i>
              <b v-if='index===5'>+</b>
            </span>
          </div>
          <!-- pc蛋蛋 -->
          <div
            class='item pcdd-item'
            v-else-if="code === 'pcdd'"
          >
            <span
              class='ball'
              v-for="(vv,index) in selectedNo.lotteryNumber"
              :key="index"
              :class="[vv.clr ?`${vv.clr}` : '']"
            >
              <span>{{vv.content}}</span>
              <span v-if="index === selectedNo.lotteryNumber.length-1">{{vv.desc}}</span>
            </span>
          </div>
          <div
            class='item'
            v-else-if="code === 'ksan'"
          >
            <!-- 要改 -->
            <!-- <span class='ball' :class = "[code === 'ksan' && item.sum? 'ksan-item' : '']" v-for="(item,index) in selectedNo.lotteryNumber" :key="index">
                            {{!item.sum ? item : item.sumVal + '' + item.sum + ' ' + item.size +" | " + item.num}}
                        </span> -->
            <span
              class="ball"
              :class="[idx2<=2 ? `ksan-${vv}` : 'ksan-ball']"
              v-for="(vv,idx2) in selectedNo.lotteryNumber"
              :key="idx2"
            >
              {{!vv.sum ? '' : vv.sumVal + '' + vv.sum + ' ' + vv.size +" | " + vv.num}}
            </span>
          </div>
          <div
            class='item'
            v-else-if="code === 'ssc'"
          >
            <span
              class='ball'
              :class="[code === 'ssc' && item.sum? 'ssc-item' : '']"
              v-for="(item,index) in selectedNo.lotteryNumber"
              :key="index"
            >
              {{!item.sum ? item : item.sum + ' ' + item.size +" | " + item.num}}
            </span>
          </div>
          <div
            class='item'
            v-else-if="code === 'pk10'"
          >
            <span
              class='ball'
              v-for="(item,index) in selectedNo.lotteryNumber"
              :key="index"
              :class="[`pk10-${item}`]"
            >
              <!-- {{item}} -->
            </span>
          </div>
          <div
            class='item'
            v-else
          >
            <span
              class='ball'
              v-for="(item,index) in selectedNo.lotteryNumber"
              :key="index"
            >
              {{item}}
            </span>
          </div>
        </template>
        <template v-else>
          <div class="item">{{$tex("正在开奖")}}...</div>
        </template>

      </div>
    </div>
    <div
      class='lottery-num'
      :class="code"
    >
      <div class='tab'>
        <i></i>
        <span>{{$tex("开奖公告")}}</span>
      </div>
      <div class='columns'>
        <ul
          class='title'
          v-for='num in 2'
          :key='num'
        >
          <li>{{$tex("期号")}}</li>
          <li>{{$tex("开奖日期")}}</li>
          <li>{{$tex("开奖号码")}}</li>
        </ul>
      </div>
      <div class='lottery-result'>
        <ul>
          <li
            v-for='(splitList,index) in lotteryList'
            :key='index'
          >
            <ul class='result clearfix'>
              <li
                v-for="(item,idx) in splitList "
                :key="idx"
                v-if="item"
              >
                <span class="prd">{{item.periodNo}}</span>
                <span class="time">
                  {{item.prizeTime}}
                </span>
                <!-- 六合彩 -->
                <template v-if="item.lotteryNumber">
                  <span
                    class="item marksix-item"
                    v-if="code === '6hc'"
                  >
                    <i
                      v-for="(vv,idx2) in item.lotteryNumber"
                      :key="idx2"
                    >
                      <em :class='vv.color'>{{vv.num}}</em>
                      <i>{{vv.zTxt}}</i>
                      <b v-if='idx2===5'>+</b>
                    </i>
                  </span>
                  <!-- pc蛋蛋 -->
                  <span
                    class="item pcdd-ball"
                    v-else-if="code === 'pcdd'"
                  >
                    <i
                      v-for="(vv,index2) in item.lotteryNumber"
                      :key="index2"
                      :class="[vv.clr ?`${vv.clr}` : '']"
                    >
                      <em :class="[vv.clr?`${vv.clr}`:'']">{{vv.content}}</em>
                      <span v-if="index2 === item.lotteryNumber.length-1">{{vv.desc}}</span>
                    </i>
                  </span>
                  <span
                    class="item  normal-ball"
                    v-else-if="code ==='ssc'"
                  >
                    <em
                      :class="[vv.sum ? 'ssc-ball' :'']"
                      v-for="(vv,idx2) in item.lotteryNumber"
                      :key="idx2"
                    >
                      {{!vv.sum ? vv : vv.sum + ' ' + vv.size +" | " + vv.num}}
                    </em>
                  </span>
                  <span
                    class="item  normal-ball"
                    v-else-if="code ==='ksan'"
                  >
                    <em
                      :class="[idx2<=2 ? `ksan-${vv}` : 'ksan-ball']"
                      v-for="(vv,idx2) in item.lotteryNumber"
                      :key="idx2"
                    >
                      <!-- <span v-if = "(idx2!=0 ) && (idx2 !=1) && (idx2 !=2)"> -->
                      {{!vv.sum ? '' : vv.sumVal + '' + vv.sum + ' ' + vv.size +" | " + vv.num}}

                      <!-- </span> -->
                      <!-- <span :class=></span> -->
                    </em>
                  </span>
                  <span
                    class="item normal-ball"
                    v-else-if="code === 'pk10'"
                  >
                    <em
                      v-for="(vv,idx2) in item.lotteryNumber"
                      :key="idx2"
                      :class="[`pk10-${vv}`]"
                    >
                      <!-- {{vv}} -->
                    </em>
                  </span>
                  <span
                    class="item  normal-ball"
                    v-else
                  >
                    <em
                      v-for="(vv,idx2) in item.lotteryNumber"
                      :key="idx2"
                    >
                      {{vv.num||vv}}
                    </em>
                  </span>
                </template>
                <template v-else>
                  <span class="item">{{$tex("正在开奖")}}...</span>
                </template>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import getZodiac from "@/utils/format-ball/zodica.js";
import formatPcdd from "@/utils/format-ball/format_pcdd.js";
import arrayUtil from "@/utils/arrayUtil";
import { formatSsc } from "@/utils/format-ball/format_ssc.js";
import formatksan from "@/utils/format-ball/format_ksan.js";
import EventBus from "@/utils/eventBus";
import { mapGetters } from "vuex";

// import { getBallsStyle } from "@/views/common/module_js/format_pk10.js";
export default {
  data() {
    return {
      broadList: [], // 彩种类别
      subList: [], // 彩种类别的子类
      subListOrigin: [],
      lotteryType: "-2",
      lotteryId: "",
      lotteryInfo: {}, //彩票的描述
      selectedNo: {},
      periodNo: 0, //开奖期号
      lotteryList: [], //往期开奖列表,
      code: "" // PK10表格的宽度要特殊处理
    };
  },
  computed: {
    ...mapGetters(["isInternational"]),
  },
  watch: {
    $route(n) {
      this.getLotteryNoticeDetail({
        lotteryId: n.params.id
      });
    }
  },
  methods: {
    jump2BuyLottery() {
      this.$store.commit("SET_LOTTERY_BUY_LOTTERY_SHOW_PLAY_RULE", true);
      this.$router.push({
        name: "buyLottery",
        params: { id: `${this.lotteryId}` }
      });
    },
    updatePrizeHistory(event) {
      let extra = event.target;
      if (typeof extra === 'string') {
        extra = JSON.parse(extra);
      }
      this.updataSubList(extra);
    },
    updataSubList(obj) {
      // console.log(obj, '===========================')
      if (obj.lotteryId !== this.$route.params.id) return;
      for (let i = 0, len = this.lotteryList.length; i < len; i++) {
        for (let j = 0, len2 = this.lotteryList[i].length; j < len2; j++) {
          if (this.lotteryList[i][j].periodNo === obj.periodNo) {
            if (i === 0 && j === 0) {
              this.selectedNo.lotteryNumber = obj.lotteryNumber
                .replace("+", ",")
                .split(",");
              this.formatSingleNumber(this.selectedNo);
              return;
            }
            this.lotteryList[i][j].lotteryNumber = obj.lotteryNumber
              .replace("+", ",")
              .split(",");
            this.formatSingleNumber(this.lotteryList[i][j]);
            return;
          }
          // if (i === len-1 && j === len2-1) { //插入
          //     this.lotteryList.push({
          //         lotteryNumber: obj.lotteryNumber.replace('+',',').split(','),
          //         periodNo: obj.periodNo,
          //         prizeTime:this.lotteryList[0][0].prizeTime
          //     });
          // }
        }
      }
    },
    formatSingleNumber(item) {
      //格式化推送的号码
      if (this.code === "6hc") {
        //6hc
        this.sixBallFormat(item);
      } else if (this.code === "pcdd") {
        item.lotteryNumber = formatPcdd(item.lotteryNumber);
      } else if (this.code === "ssc") {
        item.lotteryNumber.push(formatSsc(item.lotteryNumber));
      } else if (this.code === "ksan") {
        item.lotteryNumber.push(formatksan(item.lotteryNumber));
      }
    },
    changeBroad(item) {
      //切换彩种类别
      this.lotteryType = item.lotteryType;
      // this.subList = item.lotteryType ? item.lotteryList : JSON.parse(JSON.stringify(this.subListOrigin));
      this.subList = item.lotteryList;
    },
    getLotteryNoticeDetail(item) {
      //切换彩种
      if (this.lotteryId === item.lotteryId) {
        return;
      }
      this.lotteryId = item.lotteryId;
      this.$router.push({ params: { id: item.lotteryId } });
      this.initData(this.lotteryId);
    },
    changeSelected(list) {
      //下拉框选择
      let selectedNo = this.lotteryInfo.lotteryNearPrizeList.filter(
        item => item.periodNo == list
      )[0];
      let num = selectedNo.lotteryNumber;
      if (!num) {
        //为空
        this.lotteryList.forEach(item => {
          item.forEach(its => {
            if (its.periodNo === selectedNo.periodNo) {
              selectedNo.lotteryNumber = its.lotteryNumber;
            }
          });
        });
      } else {
        typeof num === "string" ? (num = num.replace("+", ",").split(",")) : "";
      }
      this.selectedNo = selectedNo;
      this.$set(this.selectedNo, "lotteryNumber", num);
    },
    getSixBallColor(ballsInfo) {
      //格式化六合彩球
      ballsInfo.lotteryNearPrizeList.forEach(list => {
        // console.log(list);
        if (Array.isArray(list.lotteryNumber)) {
          //     list.lotteryNumber.forEach((ball, index) => {
          //     getZodiac(list.prizeTime.replace(/-/g, "/")).forEach(value => {
          //         value.data.forEach((vv,idx) =>{
          //         if(vv == ball) {
          //             list.lotteryNumber[index] = {
          //                 num: ball,
          //                 zTxt: value.label,
          //                 color: value.clrs[idx]
          //             }
          //         }
          //     })
          //     });
          // });
          this.sixBallFormat(list);
        }
      });
      return ballsInfo;
    },
    sixBallFormat(list) {
      //六合彩格式化
      list.lotteryNumber.forEach((ball, index) => {
        getZodiac(list.prizeTime.replace(/-/g, "/")).forEach(value => {
          value.data.forEach((vv, idx) => {
            if (vv == ball) {
              list.lotteryNumber[index] = {
                num: ball,
                zTxt: value.label,
                color: value.clrs[idx]
              };
            }
          });
        });
      });
    },
    initData(id) {
      this.$http
        .post(
          "/api/v2/lottery/queryLotteryNearPrizeInfo",
          { lotteryId: id },
          { unenc: true }
        )
        .then(response => {
          if (response.data.code !== 0) return;
          let data = response.data.data;
          // console.log('!!!!!!!!!!',data.lotteryNearPrizeList);
          // console.log(data);

          data.lotteryNearPrizeList.forEach(item => {
            if (item.lotteryNumber) {
              item.lotteryNumber = item.lotteryNumber
                .replace("+", ",")
                .split(",");
            }
            // typeof item.lotteryNumber === 'string'? item.lotteryNumber = item.lotteryNumber.replace('+',',').split(',') : '';
          });
          this.code = data.lottery.code;
          // this.lotteryInfo = data; // 5.10
          let handlerData = null;

          if (this.code === "6hc") {
            //六合彩
            let handlerData = this.getSixBallColor(data);
          } else if (this.lotteryId === "2" || this.lotteryId === "19") {
            // pcdd
            data.lotteryNearPrizeList.forEach(item => {
              if (Array.isArray(item.lotteryNumber)) {
                item.lotteryNumber = formatPcdd(item.lotteryNumber);
              }
            });
          } else if (this.code === "ssc") {
            //时时彩
            data.lotteryNearPrizeList.forEach(item => {
              if (Array.isArray(item.lotteryNumber)) {
                item.lotteryNumber.push(formatSsc(item.lotteryNumber));
              }
            });
          } else if (this.code === "ksan") {
            // ksan
            data.lotteryNearPrizeList.forEach(item => {
              if (Array.isArray(item.lotteryNumber)) {
                item.lotteryNumber.push(formatksan(item.lotteryNumber));
              }
            });
          }
          this.lotteryInfo = data; // 5.10
          this.lotteryList = new arrayUtil(
            (handlerData || data).lotteryNearPrizeList
          ).averageSplitArray(2);
          this.selectedNo = data.lotteryNearPrizeList[0];
          this.periodNo = data.lotteryNearPrizeList[0].periodNo;
        });
    }
  },
  created() {
    this.lotteryId = this.$route.params.id; //高亮lotteryList
    //  this.broadList = sessionStorage.getItem("broadList") != null ? JSON.parse(sessionStorage.getItem("broadList")).list : [];
    //  this.subListOrigin = sessionStorage.getItem("broadList") != null ? JSON.parse(sessionStorage.getItem("subList")).list : [];
    //  this.subList = sessionStorage.getItem("broadList") != null ? JSON.parse(sessionStorage.getItem("subList")).list : [];
    // let vm = this;
    this.$http
      .post("/api/v2/lottery/queryLotteryListGroupByType", "", { unenc: true })
      .then(response => {
        //一级菜单
        if (response.data.code !== 0) return;
        this.broadList = response.data.data.lotteryTypeList;
        // console.log(this.broadList);
        this.subList = this.broadList[0].lotteryList;
      });
    this.initData(this.lotteryId);
  },
  mounted() {
    EventBus.addEventListener('updatePrizeHistory', this.updatePrizeHistory, this);
  },
  beforeDestroy() {
    EventBus.removeEventListener('updatePrizeHistory', this.updatePrizeHistory, this);
  }
};
</script>
<style lang="less">
.notice-detail .detail-info .period .item .ksan-ball {
  width: 102px !important;
  background: none !important;
  color: #313131 !important;
  font-size: 14px !important;
  line-height: 24px !important;
  border-radius: 0 !important;
}
.notice-detail .detail-info .period .item .ksan-1,
.notice-detail .detail-info .period .item .ksan-2,
.notice-detail .detail-info .period .item .ksan-3,
.notice-detail .detail-info .period .item .ksan-4,
.notice-detail .detail-info .period .item .ksan-5,
.notice-detail .detail-info .period .item .ksan-6 {
  background-image: url(~@/assets/images/icon.png) !important ;
  border-radius: 0 !important;
}
.notice-detail .detail-info .period .item .ksan-1 {
  background-position: -324px -463px !important;
}
.notice-detail .detail-info .period .item .ksan-2 {
  background-position: -353px -463px !important;
}
.notice-detail .detail-info .period .item .ksan-3 {
  background-position: -383px -463px !important ;
}
.notice-detail .detail-info .period .item .ksan-4 {
  background-position: -412px -463px !important;
}
.notice-detail .detail-info .period .item .ksan-5 {
  background-position: -442px -463px !important;
}
.notice-detail .detail-info .period .item .ksan-6 {
  background-position: -471px -463px !important;
}
.notice-detail .lottery-result > ul > li:nth-child(odd):hover {
  background: #ebf7ff;
}
.notice-detail .lottery-result .result .ksan-1,
.notice-detail .lottery-result .result .ksan-2,
.notice-detail .lottery-result .result .ksan-3,
.notice-detail .lottery-result .result .ksan-4,
.notice-detail .lottery-result .result .ksan-5,
.notice-detail .lottery-result .result .ksan-6 {
  background-image: url(~@/assets/images/icon.png) !important ;
  border-radius: 0;
}

.notice-detail .lottery-result .result .ksan-1 {
  background-position: -324px -463px;
}
.notice-detail .lottery-result .result .ksan-2 {
  background-position: -353px -463px;
}
.notice-detail .lottery-result .result .ksan-3 {
  background-position: -383px -463px;
}
.notice-detail .lottery-result .result .ksan-4 {
  background-position: -412px -463px;
}
.notice-detail .lottery-result .result .ksan-5 {
  background-position: -442px -463px;
}
.notice-detail .lottery-result .result .ksan-6 {
  background-position: -471px -463px;
}
</style>

<style lang="less">
.notice-detail {
  width: 1000px;
  font-size: 14px;
  margin: 0 auto;
  overflow: hidden;
}
.notice-detail .broad-list {
  padding-top: 42px;
}
.notice-detail .broad-list .top {
  width: 100%;
  height: 62px;
  background: url(/static/images/notice_broad.png) no-repeat #fff;
}
.notice-detail .lottery-category {
  /*   background: @notice-detail-title-bg; */
  color: #fff;
  > ul {
    display: flex;
    flex-wrap: wrap;
    li {
      padding: 10px 0px;
    }
  }
}
.notice-detail .lottery-category li {
  display: flex;
  align-items: center;
  position: relative;
  font-size: 0;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s ease-in;
  -webkit-transition: background 0.2s ease-in;
}
.notice-detail .lottery-category li:hover {
  /*   background: @notice-detail-title-active; */
}
.notice-detail .lottery-category li.red-bg {
  /* background: @notice-detail-title-active; */
}
.notice-detail .lottery-category li i {
  display: inline-block;
  vertical-align: top;
  width: 22px;
  height: 22px;
  margin: 0 10px 0 0;
}
.notice-detail .lottery-category li img {
  height: 100%;
  float: none;
  width: auto;
  filter: brightness(2);
  -webkit-filter: brightness(2);
  -ms-filter: brightness(2);
  -moz-filter: brightness(2);
  -o-filter: brightness(2);
}
.notice-detail .lottery-category li span {
  font-size: 14px;
}
.notice-detail .sub-lottery {
  width: 1000px;
  padding: 9px 0;
  background: @notice-detail-sub-menu-bg;
  color: #313131;
  border: 1px solid @primary-color;
  border-top: none;
}
.notice-detail .sub-lottery:after {
  display: block;
  content: "";
  clear: both;
  visibility: hidden;
}
.notice-detail .sub-lottery span {
  position: relative;
  float: left;
  line-height: 27px;
  padding: 0 15px;
  text-align: center;
  cursor: pointer;
}
.notice-detail .sub-lottery span.red-color {
  /*  color: #be1204; */
}
.notice-detail .sub-lottery span:after {
  position: absolute;
  display: block;
  content: "";
  width: 1px;
  height: 14px;
  right: 0;
  top: 7px;
  background: #989898;
}
.notice-detail .sub-lottery span:last-child:after {
  display: none;
}
.notice-detail .detail-info {
  border: 1px solid @notice-detail-info-border;
  background: @notice-detail-info-bg;
  padding: 10px 20px;
  margin-top: 10px;
}
.notice-detail .detail-info.large-padding {
  padding-bottom: 35px;
}
.notice-detail .detail-info .title {
  font-size: 22px;
}
.notice-detail .detail-info .title:after {
  display: block;
  content: "";
  height: 0;
  clear: both;
}
.notice-detail .detail-info .title li {
  float: left;
  height: 28px;
  line-height: 28px;
  margin-right: 24px;
  font-size: 12px;
}
.notice-detail .detail-info .title li:first-child {
  margin-right: 44px;
  font-size: 22px;
}
.notice-detail .detail-info .title li:nth-child(2) {
  font-weight: normal;
  color: #7f7f7f;
}
.notice-detail .detail-info .title li i {
  display: inline-block;
  vertical-align: top;
  width: 22px;
  height: 22px;
  margin: 3px 7px 0 0;
  background: url(~@/assets/images/icon.png) no-repeat -329px -346px;
}
.notice-detail .detail-info .title a {
  display: inline-block;
  vertical-align: top;
  color: #ff7614;
}
.notice-detail .detail-info .title a:hover {
  color: rgba(255, 118, 20, 0.9);
}
.notice-detail .detail-info .title li:last-child i {
  background-position: -363px -346px;
}
.notice-detail .detail-info .title li:last-child a {
  color: #32bc27;
}
.notice-detail .detail-info .title li:last-child a:hover {
  color: rgba(50, 188, 39, 0.9);
}
.notice-detail .detail-info .period {
  margin-top: 20px;
  //   height: 30px;
  //   line-height: 30px;
  font-size: 0;
  clear: both;
}
.notice-detail .detail-info .period .item {
  display: inline-block;
  margin-right: 26px;
  font-size: 12px;
  //   height: 30px;
  line-height: 30px;
  vertical-align: text-top;
}
.notice-detail .detail-info .period .item .marksix-item > i {
  height: 19px;
  line-height: 19px;
}
.notice-detail .detail-info .period .item span {
  font-size: 12px;
}
.notice-detail .detail-info .period .item:nth-child(2) {
  font-size: 12px;
  margin-right: 20px;
}
.notice-detail .detail-info .period .item .marksix-item {
  position: relative;
  display: inline-block;
  width: 30px;
  line-height: 19px;
  vertical-align: top;
  margin: 0 2px;
  font-size: 14px;
}
.notice-detail .detail-info .period .marksix-item:last-child {
  margin-left: 12px;
}
.notice-detail .detail-info .period .item .ball,
.notice-detail .lottery-result .result em {
  display: inline-block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  margin: 0 2px;
  border-radius: 50%;
  background: radial-gradient(#ff6050 7%, #e50000);
  background: radial-gradient(#ff6050 7%, #e50000);
  background: -webkit-radial-gradient(#ff6050 7%, #e50000);
  background: -moz-radial-gradient(#ff6050 7%, #e50000);
  background: -o-radial-gradient(#ff6050 7%, #e50000);
  color: #fff;
  text-align: center;
  overflow: hidden;
  font-style: normal;
}
/* pk10 */
.notice-detail .detail-info .period .item .pk10-01,
.notice-detail .detail-info .period .item .pk10-02,
.notice-detail .detail-info .period .item .pk10-03,
.notice-detail .detail-info .period .item .pk10-04,
.notice-detail .detail-info .period .item .pk10-05,
.notice-detail .detail-info .period .item .pk10-06,
.notice-detail .detail-info .period .item .pk10-07,
.notice-detail .detail-info .period .item .pk10-08,
.notice-detail .detail-info .period .item .pk10-09,
.notice-detail .detail-info .period .item .pk10-10,
.notice-detail .lottery-result .result .pk10-01,
.notice-detail .lottery-result .result .pk10-02,
.notice-detail .lottery-result .result .pk10-03,
.notice-detail .lottery-result .result .pk10-04,
.notice-detail .lottery-result .result .pk10-05,
.notice-detail .lottery-result .result .pk10-06,
.notice-detail .lottery-result .result .pk10-07,
.notice-detail .lottery-result .result .pk10-08,
.notice-detail .lottery-result .result .pk10-09,
.notice-detail .lottery-result .result .pk10-10 {
  /*pk10*/
  // border-radius: 2px;
  // -webkit-border-radius: 2px;
  // -moz-border-radius: 2px;
  // -ms-border-radius: 2px;
  // -o-border-radius: 2px;
  border-radius: 0;
  -webkit-border-radius: 0;
  -moz-border-radius: 0;
  -ms-border-radius: 0;
  -o-border-radius: 0;
  width: 24px;
  height: 24px;
  margin: 0 3px;
  background: url("/static/images/icon.png") no-repeat -242px -10px;
  // color: #fff;
  // background-size: 30px 30px;
}
// .notice-detail .detail-info .period .item .pk10-01,
// .notice-detail .lottery-result .result .pk10-01 {
//     color: #000;
// }
.notice-detail .detail-info .period .item .pk10-02,
.notice-detail .lottery-result .result .pk10-02 {
  background-position: -210px -10px;
}
.notice-detail .detail-info .period .item .pk10-03,
.notice-detail .lottery-result .result .pk10-03 {
  background-position: -178px -10px;
}
.notice-detail .detail-info .period .item .pk10-04,
.notice-detail .lottery-result .result .pk10-04 {
  background-position: -147px -10px;
}
.notice-detail .detail-info .period .item .pk10-05,
.notice-detail .lottery-result .result .pk10-05 {
  background-position: -20px -10px;
}
.notice-detail .detail-info .period .item .pk10-06,
.notice-detail .lottery-result .result .pk10-06 {
  background-position: -52px -10px;
}
.notice-detail .detail-info .period .item .pk10-07,
.notice-detail .lottery-result .result .pk10-07 {
  background-position: -272px -10px;
}
.notice-detail .detail-info .period .item .pk10-08,
.notice-detail .lottery-result .result .pk10-08 {
  background-position: -83px -10px;
}
.notice-detail .detail-info .period .item .pk10-09,
.notice-detail .lottery-result .result .pk10-09 {
  background-position: -115px -10px;
}
.notice-detail .detail-info .period .item .pk10-10,
.notice-detail .lottery-result .result .pk10-10 {
  background-position: -305px -10px;
}
.notice-detail .detail-info .period .item .ball.ssc-item,
.notice-detail .lottery-result .result .item .ksan-ball,
.notice-detail .detail-info .period .item .ball.ksan-item,
.notice-detail .lottery-result .result em.ssc-ball {
  background: none;
  color: #313131;
  width: 70px;
  font-size: 14px;
  margin-left: 0px;
}
/* 快三样式 */
.notice-detail .lottery-result .result .item .ksan-ball {
  line-height: 25px;
  border-radius: 0;
  -webkit-border-radius: 0;
  -moz-border-radius: 0;
  -ms-border-radius: 0;
  -o-border-radius: 0;
}
.notice-detail .lottery-result .result .item .ksan-ball,
.notice-detail .detail-info .period .item .ball.ksan-item {
  width: auto;
  white-space: nowrap;
  word-break: keep-all;
  display: block;
}
.notice-detail .detail-info .period .pcdd-item .red span:first-child {
  border-radius: 50%;
  background: radial-gradient(#ff6050 7%, #e50000);
  background: radial-gradient(#ff6050 7%, #e50000);
  background: -webkit-radial-gradient(#ff6050 7%, #e50000);
  background: -moz-radial-gradient(#ff6050 7%, #e50000);
  background: -o-radial-gradient(#ff6050 7%, #e50000);
}
.notice-detail .detail-info .period .ball.green,
.notice-detail .detail-info .period .pcdd-item .green span:first-child,
.notice-detail .lottery-result .result em.green {
  background: radial-gradient(#1acb01 3%, #017019);
  background: -webkit-radial-gradient(#1acb01 3%, #017019);
  background: -moz-radial-gradient(#1acb01 3%, #017019);
  background: -o-radial-gradient(#1acb01 3%, #017019);
}
.notice-detail .detail-info .period .ball.blue,
.notice-detail .detail-info .period .pcdd-item .blue span:first-child,
.notice-detail .lottery-result .result em.blue {
  background: radial-gradient(#007ef9 27%, #0035ae);
  background: -webkit-radial-gradient(#007ef9 27%, #0035ae);
  background: -moz-radial-gradient(#007ef9 27%, #0035ae);
  background: -o-radial-gradient(#007ef9 27%, #0035ae);
}
.notice-detail .detail-info .period .ball.other,
.notice-detail .detail-info .period .pcdd-item .other span:first-child,
.notice-detail .lottery-result .result em.other {
  background: #aaa;
}
.notice-detail .detail-info .period .pcdd-item .ball.red,
.notice-detail .detail-info .period .pcdd-item .ball.green,
.notice-detail .detail-info .period .pcdd-item .ball.blue,
.notice-detail .detail-info .period .pcdd-item .ball.other,
.notice-detail .lottery-result .result .pcdd-ball i.red,
.notice-detail .lottery-result .result .pcdd-ball i.green,
.notice-detail .lottery-result .result .pcdd-ball i.blue,
.notice-detail .lottery-result .result .pcdd-ball i.other {
  display: inline-block;
  vertical-align: top;
  width: 80px;
  height: 30px;
  margin-left: 0;
  line-height: 30px;
  border-radius: 0;
  -webkit-border-radius: 0;
  -ms-border-radius: 0;
  -moz-border-radius: 0;
  -o-border-radius: 0;
  background: none;
  color: #313131;
}
.notice-detail .lottery-result .result .item.pcdd-ball .red,
.notice-detail .lottery-result .result .item.pcdd-ball .green,
.notice-detail .lottery-result .result .item.pcdd-ball .blue,
.notice-detail .lottery-result .result .item.pcdd-ball .other {
  margin-top: 0;
}
.notice-detail .detail-info .period .pcdd-item .red span:first-child,
.notice-detail .detail-info .period .pcdd-item .green span:first-child,
.notice-detail .detail-info .period .pcdd-item .blue span:first-child,
.notice-detail .detail-info .period .pcdd-item .other span:first-child {
  display: inline-block;
  vertical-align: top;
  width: 30px;
  height: 30px;
  color: #fff;
  border-radius: 50%;
}
.notice-detail .detail-info .period .pcdd-item .red span:last-child,
.notice-detail .detail-info .period .pcdd-item .green span:last-child,
.notice-detail .detail-info .period .pcdd-item .blue span:last-child,
.notice-detail .detail-info .period .pcdd-item .other span:last-child,
.notice-detail .lottery-result .result .item.pcdd-ball .red span,
.notice-detail .lottery-result .result .item.pcdd-ball .green span,
.notice-detail .lottery-result .result .item.pcdd-ball .blue span,
.notice-detail .lottery-result .result .item.pcdd-ball .other span {
  display: inline-block;
  vertical-align: top;
  /* width:42px; */
  height: 30px;
  border-radius: 50%;
  font-size: 14px;
}
.notice-detail .detail-info .period .marksix-item i {
  display: block;
  width: 30px;
  height: 60px;
  text-align: center;
  color: #313131;
}
.notice-detail .detail-info .period .marksix-item b {
  position: absolute;
  right: -14px;
  top: 5px;
  width: 10px;
  height: 60px;
  font-weight: normal;
}
.notice-detail .detail-info .period .pcdd-item > span:nth-child(even) {
  width: 10px;
  height: 30px;
  background: none;
  color: #000;
  text-align: center;
}
.notice-detail .lottery-num {
  margin: 12px 0 42px 0;
  background-color: #fff;
}
.notice-detail .lottery-num .tab {
  height: 40px;
  line-height: 40px;
  font-size: 0;
  overflow: hidden;
}
.notice-detail .lottery-num .tab i {
  display: inline-block;
  vertical-align: top;
  margin: 6px 7px 0 0;
  width: 27px;
  height: 27px;
  background: url(~@/assets/images/icon.png) no-repeat -547px -59px;
}
.notice-detail .lottery-num .tab span {
  font-size: 16px;
}
.notice-detail .lottery-num .columns {
  height: 35px;
  line-height: 35px;
  /*   background: #be1204; */
  color: #fff;
}
.notice-detail .lottery-num .columns .title {
  width: 50%;
  height: 100%;
  float: left;
}
.notice-detail .lottery-num .columns .title:first-child {
  border-right: 1px solid #fff;
}
.notice-detail .lottery-num .columns .title li {
  float: left;
  width: 140px;
  text-align: center;
}
.notice-detail .lottery-num .columns .title li:nth-child(2) {
  width: 88px;
}
.notice-detail .lottery-num .columns .title li:last-child {
  width: 270px;
}
.notice-detail .lottery-num.pk10 .columns .title li {
  width: 60px;
}
.notice-detail .lottery-num.pk10 .columns .title li:last-child {
  width: 350px;
}
.notice-detail .lottery-result {
  border: 1px solid @notice-detail-table-border;
  border-top: none;
}
.notice-detail .lottery-result > ul > li {
  line-height: 72px;
}
.notice-detail .lottery-result > ul > li:nth-child(even) {
  background: @notice-detail-even-bg;
}
.notice-detail .lottery-result > ul > li:nth-child(odd) .result li:first-child {
  border-right: 1px solid @notice-detail-table-border;
}
.notice-detail .lottery-result ul > li:nth-child(even) .result li:first-child {
  border-right: 1px solid #fff;
}
.notice-detail .lottery-result .result li {
  float: left;
  width: 50%;
  display: flex;
  align-items: center;
}
.notice-detail .lottery-result .result li > span {
  float: left;
  width: 140px;
  display: flex;
  justify-content: center;
}
.notice-detail .lottery-result .result li span.prd {
  word-wrap: break-word;
  word-break: break-all;
  line-height: normal;
  text-align: center;
}
.notice-detail .lottery-result .result li span.prd.large-line-height {
  line-height: 72px;
  padding: 0;
}
.notice-detail .lottery-result .result li > span:nth-child(2) {
  width: 88px;
}
.notice-detail .lottery-result .result li > span:last-child {
  width: 270px;
}
.notice-detail .pk10 .lottery-result .result li span.prd {
  width: 60px;
}
.notice-detail .pk10 .lottery-result .result li span:last-child {
  width: 350px;
}
.notice-detail .lottery-result .result li span.time {
  display: inline-block;
  line-height: 20px;
  text-align: center;
}
.notice-detail .lottery-result .result li .item > i,
.notice-detail .lottery-result .result li .normal-ball > i {
  display: inline-block;
  width: 30px;
  line-height: 19px;
  border-radius: 50%;
  color: #fff;
  text-align: center;
  margin: 11px 2px 0 2px;
}
.notice-detail .lottery-result .result li .item.pcdd-ball > i {
  color: #313131;
  margin: 0 2px;
  margin-top: 31px;
}
.notice-detail .lottery-result .result li span.marksix-item > i:last-child {
  margin-left: 10px;
}
.notice-detail .lottery-result .result .normal-ball > i {
  height: 30px;
  line-height: 30px;
  margin: 0 2px;
  background: radial-gradient(#ff6050 7%, #e50000);
  background: -webkit-radial-gradient(#ff6050 7%, #e50000);
  background: -moz-radial-gradient(#ff6050 7%, #e50000);
  background: -o-radial-gradient(#ff6050 7%, #e50000);
}
.notice-detail .lottery-result .result .item > i:nth-child(6) {
  position: relative;
  margin-left: 2px;
}
.notice-detail .lottery-result .result li .item > i b {
  position: absolute;
  top: 5px;
  right: -13px;
  width: 10px;
  height: 60px;
}
.notice-detail .lottery-result .result li .item > i i {
  color: #313131;
  display: block;
  width: 100%;
  height: 19px;
  text-align: center;
}
.notice-detail .detail-info .period .item .marksix-item > i,
.notice-detail .lottery-result .result li .marksix-item > i i {
  margin: 0 2px;
  height: auto;
  white-space: normal;
  word-break: break-all;
}
.notice-detail .lottery-result .result li .item i b {
  font-weight: normal;
  color: #313131;
}
.notice-detail .lottery-result .result .pcdd-ball i:nth-child(even) {
  width: 10px;
}
.notice-detail .lottery-result .result .pcdd-ball i:nth-child(even) em {
  width: 10px;
  height: 30px;
  line-height: 30px;
  background: none;
  color: #313131;
  font-size: 12px;
  font-style: normal;
}
.notice-detail .lottery-result .result .pcdd-other {
  background: #aaa;
}
</style>

