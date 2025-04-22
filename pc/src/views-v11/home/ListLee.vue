<template>
  <div class="">
    <div class="list">
      <div class="draw-notice lee-draw-notice">
        <h3>
          <i class="i-icon i-trophy"></i>
          开奖公告
          <router-link to="/notice">更多</router-link>
        </h3>
        <div class="list-content">
          <ul
            ref="drawNotice"
            class="lee-transition lee-list-scrollLi"
            :style="{top: drawNoticeTop+'px'}"
          >
            <li
              v-for="(item, idx) in drawNotice"
              :key="idx"
            >
              <h6>{{item.lotteryName}}
                <span>{{item.periodNo | periodNoFilter}}期&nbsp;{{item.prizeTime}}</span>
              </h6>
              <div
                class="num"
                v-if="item.lotteryNumber"
              >
                <span
                  v-for="(vv, index) in item.lotteryNumber.split(',')"
                  :key="index"
                  :class="{'add':vv=='+'}"
                >{{vv}}</span>
              </div>
              <div class="operation">
                <span>
                  <router-link
                    :to="item.status === '0' ? `${$route.fullPath}` : {name: 'buyLottery', params: {id: item.lotteryId}}"
                    :class="{'not-allow' : item.status === '0'}"
                    :target="item.status === '1' ? '_blank' : ''"
                  >投注</router-link>
                </span>
                <span>
                  <!-- <a class="bet-btn" @click.prevent="nowBetting(item)">投注</a> -->
                </span>
                <span class="interval">|</span>
                <span>
                  <router-link :to="{name: 'trend_detail', params: {id: item.lotteryId},query:{code:item.code}}">走势</router-link>
                </span>
                <span class="interval">|</span>
                <span>
                  <router-link :to="{name: 'notice_detail', params: {id: item.lotteryId}}">详情</router-link>
                </span>
              </div>
            </li>
          </ul>
        </div>
        <div
          class="move"
          @mouseleave="leaveMove()"
        >
          <span
            class="prev"
            @mouseenter="goScorllUp()"
          >
            <i class="i-icon i-arrow-right"></i>
          </span>
          <span
            class="next"
            @mouseenter="goScorllDown()"
          >
            <i class="i-icon i-arrow-right"></i>
          </span>
        </div>

      </div>
      <div class="consult">
        <h3>
          <i class="i-icon i-new"></i>
          资讯中心
        </h3>
        <div class="lump">
          <div class="title">
            <span class="label">新闻</span>
            <span class="more color-hover">
              <router-link to='newsList/news'>更多>></router-link>
            </span>
          </div>
          <ul>
            <li
              v-for="(item, idx) in newsList"
              :key="idx"
            >
              <i class="i-icon i-small-box"></i>&nbsp;
              <a
                href="#"
                class="link"
                :title="item.title"
                @click.prevent="goPath(item.essayId,'/newsList/news')"
              >{{item.title}}</a>
              <!--      <router-link class="link" :title="item.title" :to="item.essayId">{{item.title}}</router-link> -->
              <span class="rf">{{item.date}}</span>
            </li>
          </ul>
          <div class="title skill">
            <span class="label">技巧</span>
            <span class="more color-hover">
              <router-link to='/newsList/skills'>更多>></router-link>
            </span>
          </div>
          <ul>
            <li
              v-for="(item, idx) in skillList"
              :key="idx"
            >
              <i class="i-icon i-small-box"></i>&nbsp;
              <a
                href="#"
                class="link"
                :title="item.title"
                @click.prevent="goPath(item.essayId,'/newsList/skills')"
              >{{item.title}}</a>
              <!--   <router-link class="link" :title="item.title" :to="item.essayId">{{item.title}}</router-link> -->
              <span class="rf">{{item.date}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="ranking">
        <h3>&nbsp;
          <i
            class="i-icon i-rank"
            style="marginLeft:15px;"
          ></i>
          最新中奖榜
        </h3>
        <div class="cont">
          <div class="tab">
            <h6>账号</h6>
            <h6>奖金</h6>
            <h6>彩种</h6>
          </div>
          <div
            class="rowup"
            @mouseenter="leeScorllStop()"
            @mouseleave="leeScorllStart()"
          >
            <ul
              ref="rowup"
              :style="{transform: `translateY(${rankTop}px)`}"
              class="scroll-ul lee-scroll-ul"
            >
              <li
                v-for="(item, idx) in ranking"
                :class="{level: idx < 3}"
                :key="item.rankingNo"
              >
                <span>{{item.userCode}}</span>
                <span>
                  <span class="prizeTotal">{{item.prizeTotal}}</span>元
                </span>
                <span>{{item.lotteryName}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p class="clr"></p>
    </div>
  </div>
</template>

<script>
import dateModal from "@/utils/format_date.js";
export default {
  data() {
    return {
      drawNotice: [],
      drawNoticeTop: 0,
      ranking: [],
      rankTimer: null,
      timer: null,
      rankTop: 0,
      newsList: [],
      skillList: [],
      timerPrize: null,
      hig: 0, //排行榜ul的高度
      loop: "",
      scrollObj: null,
      scrollObjLeft: null
    };
  },
  filters: {
    periodNoFilter(value) {
      if (value.length > 8) return value.substring(8);
      return value;
    }
  },
  methods: {
    /**
     * @author  Lee
     * scroll滚动
     *
     * ***/
    leeScorllStart() {
      this.leeScorllStop()
      const refreshPosition = () => {
        this.$refs.rowup.scrollTop++;
        if (Math.abs(this.$refs.rowup.scrollTop) >= 80) {
          this.$refs.rowup.scrollTop = 0;
          this.ranking.push(this.ranking.shift());
          this.ranking.push(this.ranking.shift());
        }
        this.scrollObj = setTimeout(refreshPosition, 40);
      };
      refreshPosition();
    },
    leeScorllStop() {
      clearInterval(this.scrollObj);
    },
    getNewsSkill() {
      let vm = this;
      let list = [
        { name: "newsList", sign: "01" },
        { name: "skillList", sign: "03" }
      ];
      list.forEach(listItem => {
        vm.$http
          .post(
            "/api/v2/cms/queryAdvisoryEssayList",
            {
              type: listItem.sign
            },
            { unenc: true }
          )
          .then(response => {
            if (response.data.code !== 0) {
              $(".consult")[0].style.opacity = 0;
              return;
            }
            $(".consult")[0].style.opacity = 1;

            // console.log(response.data.data);
            vm[listItem.name] = response.data.data.list.slice(0, 5);
            vm[listItem.name].forEach(item => {
              if (listItem.sign === "01") {
                item.essayId = `newsDetail/${item.essayId}?type=news`;
              } else {
                item.essayId = `newsDetail/${item.essayId}?type=skills`;
              }
              let date = dateModal.getFormatDate(item.createDate).split("-");
              item.date = date[1] + "/" + date[2];
            });
          });
      });
    },
    /**
     * 中奖排行榜
     *
     * ***/
    requestForqueryIndexLotteryPrizeList() {
      this.$http
        .post("/api/v2/lottery/queryPrizeRankingList", "", { unenc: true })
        .then(response => {
          if (response.data.code !== 0) {
            $(".ranking")[0].style.opacity = 0;
            return;
          }
          $(".ranking")[0].style.opacity = 1;
          this.ranking = response.data.data.prizeRankingList;
          if (this.ranking.length) {
            this.leeScorllStart()
          }
        });
    },
    goPath(path, typePath) {
      this.$router.push(path);
      sessionStorage.setItem("newsView", typePath);
    },
    leaveMove() {
      clearInterval(this.scrollObjLeft);
    },
    goScorllUp() {
      clearInterval(this.scrollObjLeft);
      let height = this.$refs["drawNotice"].clientHeight;
      this.scrollObjLeft = setInterval(() => {
        if (height + this.drawNoticeTop >= 400) {
          this.drawNoticeTop--;
        }
      }, 40);
    },
    goScorllDown() {
      clearInterval(this.scrollObjLeft);
      let height = this.$refs["drawNotice"].clientHeight;
      this.scrollObjLeft = setInterval(() => {
        if (this.drawNoticeTop < 0) {
          this.drawNoticeTop++;
        }
      }, 40);
    }
  },
  created() {
    // 开奖公告
    this.$http
      .post("/api/v2/lottery/queryIndexLotteryPrizeList", "", { unenc: true })
      .then(response => {
        if (response.data.code !== 0) return;
        $(".lee-draw-notice")[0].style.opacity = 1;
        this.drawNotice = response.data.data.lotteryPrizeList;

        this.drawNotice.forEach(item => {
          if (item.code === "6hc") {
            let lotteryNumbers = item.lotteryNumber.split(",");
            let lotteryArr = [];
            lotteryNumbers.forEach(item2 => {
              if (item2.indexOf("+") > -1) {
                let num = item2.split("+");
                num.splice(1, 0, "+");
                lotteryArr = lotteryArr.concat(num);
              } else {
                lotteryArr.push(item2);
              }
            });
            item.lotteryNumber = lotteryArr.join(",");
          }
          if (item.prizeTime) {
            let arr = item.prizeTime.split(" ")[0].split("-");
            item.prizeTime = arr[1] + "-" + arr[2];
          }
        });
      });
    // 中奖排行榜
    this.requestForqueryIndexLotteryPrizeList();
    this.loop = setInterval(() => {
      this.requestForqueryIndexLotteryPrizeList();
    }, 1000 * 60 * 5);
    // 新闻, 技巧
    this.getNewsSkill();
  },
  beforeDestroy() {
    clearInterval(this.scrollObj);
    clearInterval(this.scrollObjLeft);
    clearInterval(this.loop);
  }
};
</script>
<style>
.list .transition-ul {
  transition: 0.1s;
}
</style>


<style lang="less" scoped>
.list {
  margin-top: 15px;
}
.list > div {
  float: left;
  height: 440px;
  position: relative;
  overflow: hidden;
}
.list > div > h3 {
  height: 40px;
  line-height: 40px;
  /*   background: @primary-color; */
  color: #fff;
  font-size: 14px;
}
.list > div > h3 i {
  float: left;
  margin: 9px 5px;
}
.list .draw-notice {
  width: 220px;
  opacity: 0;
  transition: 1.2s;
}
.list .draw-notice h3 a {
  float: right;
  margin-right: 6px;
  color: #fff;
}
.list .draw-notice .list-content {
  /*  border: 1px solid @home-component-border; */
  border-top: 0;
  position: relative;
  overflow: hidden;
  height: 400px;
}
.list .draw-notice ul {
  position: absolute;
  left: 0;
  top: 0;
  padding: 0 6px;
  width: 100%;
}
.list .draw-notice li {
  border-bottom: 1px dashed #ccc;
}
.list .draw-notice li:last-child {
  border-bottom: none;
}
// .list .draw-notice h6:hover span {
//     color: @primary-color;
// }
.list .draw-notice li h6 {
  font-weight: normal;
  font-size: 14px;
  line-height: 30px;
}
.list .draw-notice li h6 span {
  float: right;
  font-size: 12px;
}
.list .draw-notice li .num {
  margin: 0 -1px;
}
.list .draw-notice li .num span {
  width: 22px;
  height: 22px;
  line-height: 22px;
  text-align: center;
  display: inline-block;
  border-radius: 50%;
  font-size: 12px;
  margin: 0 2px 5px;
  color: #fff;
  /*   background: @list-ball-bg;
  background: repeating-linear-gradient(
    @list-ball-gradient-bg-one,
    @list-ball-gradient-bg-two
  ); */
  /* 标准的语法（必须放在最后） */
}
.list .draw-notice li .num .add {
  /*   color: @list-ball-gradient-bg-one; */
  background: none;
  font-size: 15px;
  font-weight: bold;
}
/* .list .draw-notice li .num span:last-child{
        float: right;
        margin: 0;
        background: -webkit-repeating-linear-gradient(#de652a, #f5a13e);
        background: -o-repeating-linear-gradient(#de652a, #f5a13e);
        background: -moz-repeating-linear-gradient(#de652a, #f5a13e);
        background: repeating-linear-gradient(#de652a, #f5a13e); /*
    } */
.list .draw-notice li .operation {
  height: 30px;
  line-height: 30px;
  font-size: 12px;
}
.list .draw-notice li .operation span {
  float: right;
}
.list .draw-notice li .operation .interval {
  margin: 0 5px;
}
.list .draw-notice li .operation span a {
  color: #333;
}
.list .draw-notice li .operation span .not-allow {
  cursor: not-allowed;
  color: #bbbec4;
}
.list .draw-notice li .operation span .not-allow:hover {
  color: #bbbec4;
}
.list .draw-notice li .operation span a:hover {
  /*   color: @primary-color; */
}
.list .draw-notice .move {
  height: 30px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}
.list .draw-notice .move span {
  float: left;
  width: 109px;
  height: 100%;
  /*   background: @list-bottom-bg; */
  text-align: center;
}
.list .draw-notice .move span.next {
  float: right;
  width: 108px;
}
.list .draw-notice .move span i {
  cursor: pointer;
  transform: rotate(90deg);
  margin-top: 4px;
  -moz-transform: rotate(
    90deg
  ); /* Firefox 旋转属性，参数表示角度(deg表示角度)，负数逆时针，正数顺时针 */
  -webkit-transform: rotate(90deg);
  /* Safari和Chrome */
  -ms-transform: rotate(90deg); /* IE 9 */
  -o-transform: rotate(90deg); /* Opera */
}
.list .draw-notice .move span.prev i {
  transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
  /* Firefox 旋转属性，参数表示角度(deg表示角度)，负数逆时针，正数顺时针 */
  -webkit-transform: rotate(-90deg);
  /* Safari和Chrome */
  -ms-transform: rotate(-90deg); /* IE 9 */
  -o-transform: rotate(-90deg); /* Opera */
}
.list .consult {
  margin-left: 15px;
  width: 500px;
  opacity: 0;
  transition: 1.2s;
}
.list .consult .lump {
  padding: 0 14px;
  /*   border: 1px solid @home-component-border; */
  border-top: 0;
  height: 400px;
}
.list .consult .lump .link {
  float: left;
  width: 410px;
  height: 100%;
  margin-left: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.list .consult .lump .title {
  /*   border-bottom: 1px solid @home-component-border; */
  font-size: 14px;
  height: 40px;
  line-height: 30px;
  padding-top: 8px;
  margin-bottom: 5px;
}
.list .consult .lump .title .label {
  display: inline-block;
  padding: 0 13px;
  height: 100%;
  /*     color: @primary-color;
  border-bottom: 2px solid @primary-color; */
}
.list .consult .lump .title .more a {
  float: right;
  font-size: 14px;
  cursor: pointer;
  color: #666;
}
.list .consult .lump .title .more a:hover {
  /*   color: @primary-color; */
}
.list .consult .lump li {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  border-bottom: 1px dashed #ccc;
}
.list .consult .lump li a {
  color: #333;
}
.list .consult .lump li:hover a,
.list .consult .lump li:hover span {
  /* color: @primary-color; */
}
.list .consult .lump li i {
  float: left;
  margin-top: 13px;
}

.list .ranking {
  float: right;
  width: 250px;
  opacity: 0;
  transition: 1.2s;
}
.list .ranking .cont {
  /*   border: 1px solid @home-component-border; */
  border-top: 0;
  height: 400px;
}
.list .ranking .tab {
  height: 40px;
  line-height: 40px;
  text-align: center;
  /*   border-bottom: 1px solid @home-component-border; */
}
.list .ranking .tab h6 {
  width: 30%;
  float: left;
  font-size: 14px;
  font-weight: normal;
}
.list .ranking .tab h6:nth-child(2) {
  width: 40%;
}
.list .ranking .rowup {
  position: relative;
  height: 360px;
  overflow: hidden;
}
.list .ranking ul {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  will-change: transform;
  transform: translate3d(0, 0, 0);
  height: 100%;
  overflow: hidden;
}
.list .ranking ul li {
  height: 40px;
  line-height: 40px;
  width: 100%;
}
.list .ranking ul li:nth-child(odd) {
  /*   background: @list-rank-odd-bg; */
}
.list .ranking ul li span {
  display: inline-block;
  width: 30%;
  text-align: center;
  float: left;
  font-size: 12px;
}
.list .ranking ul li span:nth-child(2) {
  text-align: center; /* padding-right: 8px; */
  width: 40%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.list .ranking ul li span i {
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  background: #e8e8e8;
}
.list .ranking ul li.level span i {
  /*   background: @primary-color; */
  color: #fff;
}
</style>
