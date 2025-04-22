<template>
  <div class="list">
    <div class="listop" v-if="user.userCode">
      <div class="user-name">账号 ：{{ user.userCode }}</div>
    </div>
    <div class="listop" v-else>
      <div @click="sign()">登录</div>
      <div @click="enroll()">用户注册</div>
    </div>
    <!--     <div class="draw-notice lee-draw-notice">
      <h3>开奖公告</h3>
      <div class="list-content">
        <ul
          ref="drawNotice"
          class="lee-transition lee-list-scrollLi"
          :style="{ top: drawNoticeTop + 'px' }"
        >
          <li v-for="(item, idx) in drawNotice" :key="idx">
            <h6>
              {{ item.lotteryName }}
              <span
                >{{ item.periodNo | periodNoFilter }}期&nbsp;{{
                  item.prizeTime
                }}</span
              >
            </h6>
            <div class="num" v-if="item.lotteryNumber">
              <span
                v-for="(vv, index) in item.lotteryNumber.split(',')"
                :key="index"
                :class="{ add: vv == '+' }"
                >{{ vv }}</span
              >
            </div>
            <div class="operation">
              <span>
                <router-link
                  :to="
                    item.status === '0'
                      ? `${$route.fullPath}`
                      : { name: 'buyLottery', params: { id: item.lotteryId } }
                  "
                  :class="{ 'not-allow': item.status === '0' }"
                  :target="item.status === '1' ? '_blank' : ''"
                  >投注</router-link
                >
              </span>
              <span> </span>
              <span class="interval">|</span>
              <span>
                <router-link
                  :to="{
                    name: 'trend_detail',
                    params: { id: item.lotteryId },
                    query: { code: item.code },
                  }"
                  >走势</router-link
                >
              </span>
              <span class="interval">|</span>
              <span>
                <router-link
                  :to="{
                    name: 'notice_detail',
                    params: { id: item.lotteryId },
                  }"
                  >详情</router-link
                >
              </span>
            </div>
          </li>
        </ul>
      </div>
      <div class="move" @mouseleave="leaveMove()">
        <span class="prev" @mouseenter="goScorllUp()">
          <i class="i-icon i-arrow-right"></i>
        </span>
        <span class="next" @mouseenter="goScorllDown()">
          <i class="i-icon i-arrow-right"></i>
        </span>
      </div>
    </div> -->

    <!--     <div class="ranking">
      <h3>最新中奖榜</h3>
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
            :style="{ transform: `translateY(${rankTop}px)` }"
            class="scroll-ul lee-scroll-ul"
          >
            <li
              v-for="(item, idx) in ranking"
              :class="{ level: idx < 3 }"
              :key="item.rankingNo"
            >
              <span>{{ item.userCode }}</span>
              <span>
                <span class="prizeTotal">{{ item.prizeTotal }}</span
                >元
              </span>
              <span>{{ item.lotteryName }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div> -->

    <div class="slide">
      <h6>昨日盈利榜</h6>
      <ul>
        <li v-for="(item, idx) in profit" :key="idx">
          <div class="auctionList">
            <div class="auctionInfo">
              <img class="auctionAvatar" :src="item.headImg"></img>
              <div class="auctionProfit">
                <p class="auction-name">账号名称：<span>{{ item.userCode }}</span></p>
                <p>昨日盈利：<span style="color:red">{{ item.money }}</span></p>
              </div>
            </div>
            <div class="auctionRanking">{{ idx + 1 }}</div>
          </div>
        </li>
      </ul>
    </div>
    <div class="ranking">
      <h6>中奖信息</h6>
      <div class="cont">
        <div
          class="rowup"
          @mouseenter="leeScorllStop()"
          @mouseleave="leeScorllStart()"
        >
          <!--  -->
          <ul
            ref="rowup"
            :style="{ transform: `translateY(${rankTop}px)` }"
            class="scroll-ul lee-scroll-ul"
          >
            <li
              v-for="(item, idx) in ranking"
              :class="{ level: idx < 3 }"
              :key="item.rankingNo"
            >
              <div class="winning-list">
                <img class="winning-avatar" src="~@/assets/images-v11/sf4.png"></img>
                <div class="winning-info">
                  <p class="winning-user">
                    <span>{{ item.userCode }}</span
                    >&nbsp;{{ item.lotteryName }}
                  </p>
                  <p class="winning-user">
                    喜中&nbsp;<span class="winning-amoun"
                      >￥&nbsp;{{ item.prizeTotal }}</span
                    >
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { slice } from "lodash";

export default {
  data() {
    return {
      drawNotice: [],
      drawNoticeTop: 0,
      ranking: [],
      rankTimer: null,
      timer: null,
      rankTop: 0,
      timerPrize: null,
      hig: 0, //排行榜ul的高度
      loop: "",
      scrollObj: null,
      scrollObjLeft: null,
      profit: [], //盈利榜
    };
  },
  filters: {
    periodNoFilter(value) {
      if (value.length > 8) return value.substring(8);
      return value;
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    sign() {
      this.$router.push("/login");
      // this.$store.commit("getShowLoginDialog", true);
    },
    enroll() {
      this.$router.push("/register");
    },
    /**
     * @author  Lee
     * scroll滚动
     *
     * ***/
    leeScorllStart() {
      this.leeScorllStop();
      const refreshPosition = () => {
        this.$refs.rowup.scrollTop++;
        if (Math.abs(this.$refs.rowup.scrollTop) >= 200) {
          this.$refs.rowup.scrollTop = 0;
          this.ranking.push(this.ranking.shift());
        }
        this.scrollObj = setTimeout(refreshPosition, 40);
      };
      refreshPosition();
    },
    leeScorllStop() {
      clearInterval(this.scrollObj);
    },
    /**
     * 中奖排行榜
     *
     * ***/
    requestForqueryIndexLotteryPrizeList() {
      this.$http
        .post("/api/v2/lottery/queryPrizeRankingList", "", { unenc: true })
        .then((response) => {
          if (response.data.code !== 0) {
            $(".ranking")[0].style.opacity = 0;
            return;
          }
          $(".ranking")[0].style.opacity = 1;
          this.ranking = response.data.data.prizeRankingList;
          if (this.ranking.length) {
            this.leeScorllStart();
          }
        });
    },
    getProfitList(type = 2) {
      const r = this.$store.dispatch("getUserChatRank", { type });
      r.then((res) => {
        if (res.data.code !== 0) return;
        const list = res.data.data || [];
        this.profit = list.slice(0, 3);
      }).catch((e) => {
        this.profit = [];
      });
      return r;
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
    },
  },
  created() {
    // 开奖公告
    // this.$http
    //   .post("/api/v2/lottery/queryIndexLotteryPrizeList", "", { unenc: true })
    //   .then((response) => {
    //     if (response.data.code !== 0) return;
    //     $(".lee-draw-notice")[0].style.opacity = 1;
    //     this.drawNotice = response.data.data.lotteryPrizeList;

    //     this.drawNotice.forEach((item) => {
    //       if (item.code === "6hc") {
    //         let lotteryNumbers = item.lotteryNumber.split(",");
    //         let lotteryArr = [];
    //         lotteryNumbers.forEach((item2) => {
    //           if (item2.indexOf("+") > -1) {
    //             let num = item2.split("+");
    //             num.splice(1, 0, "+");
    //             lotteryArr = lotteryArr.concat(num);
    //           } else {
    //             lotteryArr.push(item2);
    //           }
    //         });
    //         item.lotteryNumber = lotteryArr.join(",");
    //       }
    //       if (item.prizeTime) {
    //         let arr = item.prizeTime.split(" ")[0].split("-");
    //         item.prizeTime = arr[1] + "-" + arr[2];
    //       }
    //     });
    //   });
    // 中奖排行榜
    this.requestForqueryIndexLotteryPrizeList();
    this.loop = setInterval(() => {
      this.requestForqueryIndexLotteryPrizeList();
    }, 1000 * 60 * 5);
    this.getProfitList();
  },

  beforeDestroy() {
    clearInterval(this.scrollObj);
    clearInterval(this.scrollObjLeft);
    clearInterval(this.loop);
  },
};
</script>

<style lang="less" scoped>
.listop {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  .user-name {
    width: 100%;
    overflow: hidden;
  }
  div {
    width: 48%;
    text-align: center;
    background: #fff9dd;
    line-height: 42px;
    color: #e4393c;
    font-size: 16px;
    font-weight: 700;
    border: 1px solid #ebd4b3;
    box-sizing: border-box;
    border-radius: 2px;
    cursor: pointer;
  }
}
.draw-notice,
.ranking {
  height: 224px;
  position: relative;
  overflow: hidden;
}
.list > div > h3 {
  height: 30px;
  line-height: 30px;
  color: #333;
  font-size: 14px;
  background: #fff;
  border: 1px solid #ddd;
  padding-left: 5px;
}
.list .draw-notice {
  width: 220px;
  opacity: 0;
  transition: 1.2s;
  background: #fff;
}
.list .draw-notice h3 a {
  float: right;
  margin-right: 6px;
  color: #fff;
}
.list .draw-notice .list-content {
  border-top: 0;
  position: relative;
  overflow: hidden;
  height: 400px;
  width: 100%;
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
}
.list .draw-notice li .num .add {
  /*   color: @list-ball-gradient-bg-one; */
  background: none;
  font-size: 15px;
  font-weight: bold;
}
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
}
.list .draw-notice .move span.prev i {
  transform: rotate(-90deg);
}
.list .ranking {
  // width: 220px;
  // transition: 1.2s;
  // background: #fff;
  height: 226px;
  width: 252px;
  border: 1px solid #dce1e5;
  margin-top: 23px;
  h6 {
    margin: 0;
    padding: 0 8px;
    line-height: 35px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    height: 31px;
  }
}
.list .ranking .cont {
  border-top: 0;
  height: 400px;
}
.list .ranking .tab {
  height: 40px;
  line-height: 40px;
  text-align: center;
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
  height: 56px;
  line-height: 40px;
  width: 100%;
  .winning-list {
    width: 250px;
    height: 56px;
    border-bottom: 1px dashed #dce1e5;
    display: flex;
    .winning-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      margin: 8px 12px;
      transition: 0.5s;
    }
    .winning-info {
      width: 170px;
      height: 41px;
      margin-top: 10px;
      // display: flex;
      .winning-user {
        height: 20px;
        line-height: 20px;
      }
      .winning-amoun {
        color: red;
      }
    }
  }
}

// .list .ranking ul li span {
//   display: inline-block;
//   width: 30%;
//   text-align: center;
//   float: left;
//   font-size: 12px;
// }
// .list .ranking ul li span:nth-child(2) {
//   text-align: center; /* padding-right: 8px; */
//   width: 40%;
//   white-space: nowrap;
//   text-overflow: ellipsis;
//   overflow: hidden;
// }
// .list .ranking ul li span i {
//   width: 20px;
//   height: 20px;
//   line-height: 20px;
//   display: inline-block;
//   background: #e8e8e8;
// }
// .list .ranking ul li.level span i {
//   color: #fff;
// }
.slide {
  height: 195px;
  width: 252px;
  border: 1px solid #dce1e5;
  margin-top: 13px;
  h6 {
    margin: 0;
    padding: 0 8px;
    line-height: 30px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
  }
  .auctionList {
    width: 250px;
    height: 54.4px;
    border-bottom: 1px dashed #dce1e5;
    display: flex;
    .auctionInfo {
      display: flex;
      width: 198px;
      height: 50.4px;
      .auctionAvatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        margin: 8px 12px;
        transition: 0.5s;
        background: pink;
      }
      .auctionProfit {
        margin-top: 12px;
        width: 140px;
        .auction-name {
          span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .auctionRanking {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      margin: 9px 12px;
      background: rgb(182, 139, 242);
      display: flex;
    justify-content: center;
    align-items: center;
    }
  }
}
</style>
