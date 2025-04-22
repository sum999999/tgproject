<template>
  <div class="prize-notice nice-scroll"
       id="prizeNotice"
       v-loading="loading">
    <!--     <my-header title="开奖" noHistory></my-header> -->
    <div>
      <span class="refresh"
            @click="queryPrizeList">
        <i class="ivu-icon ivu-icon-refresh"></i>
      </span>
      <div>
        <ul>
          <li v-for="(item, index) in lotteryList"
              :key="index">
            <div class="list-logo">
              <img class="prize-notice-lottery-img"
                   :src="item.lotteryIcon" />
            </div>
            <div class="list-detail">
              <div class="title">
                <span>{{item.lotteryName}}</span>
                <span class="rf">{{item.lastPrizeTime |formateDate}}</span>
              </div>
              <div class="period">
                {{item.periodNo}}
              </div>
              <div class="ui-list-balls"
                   :class="['ui-ball-'+item.code]">
                <span v-for="(b,index1) in item.dispNumber"
                      :key="index1"
                      :class="{liuhe: item.info}">
                  <span v-if="!parseInt(b) && parseInt(b) !== 0"
                        class="symbol">
                    <strong>{{b}}</strong>
                  </span>
                  <span v-else
                        class="ball"
                        :style="{background: item.info ? item.info[index1].clr : ''}"
                        :class="['ball-'+b]">
                    <strong>{{b}}</strong>
                  </span>
                  <i v-if="item.info">
                    <animal :text="item.info[index1].zodiac"></animal>
<!--                    {{item.info[index1].zodiac}}-->
                  </i>
                  <!-- <span v-if="!item.normal&&index1<item.dispNumber.length-2">+</span>
                                <span v-if="!item.normal&&index1===item.dispNumber.length-2">=&nbsp;</span> -->
                </span>
                <div class="clr"></div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>
<script>
import Business from "@/utils/business.js";
import DateUtil from "@/utils/format_date.js";
import Animal from '@/components/Animal';

export default {
  name: "prizeNotice",
  components: {
    Animal
  },
  data() {
    return {
      lotteryList: [],
      loading: false
    };
  },
  computed: {
    noticeModify() {
      return this.$store.state.noticeModify;
    }
  },
  watch: {
    noticeModify(data) {
      let vm = this;
      if (data.path !== vm.$route.path) return;
      for (let item of this.lotteryList) {
        if (item.lotteryId === data.lotteryId) {
          item.lotteryNumber = data.lotteryNumber;
          item.periodNo = data.periodNo;
          item.lastPrizeTime = data.time;
          Business.setBallStyle(item);
          return;
        }
      }
    },
    lotteryList: {
      handler(newVal) {
        let vm = this;
        this.$nextTick(() => {
          let domList = Array.prototype.slice.call(
            $(".prize-notice-lottery-img")
          );
          //       this.base64Image(domList, newVal)
        });
      },
      deep: true
    }
  },
  filters: {
    formateDate(value) {
      if (!value) return "";
      let date = DateUtil.getFormatDate(value, "yymmddhhmmss");
      // let idx = date.indexOf('-');
      // date = date.substr(idx+1);
      return date;
    }
  },
  methods: {
    getHistory(lotteryId) {
      this.$router.push("/historyList/" + lotteryId);
    },
    queryPrizeList(item) {
      let vm = this;
      vm.loading = true;
      vm.$http
        .post("/api/v2/lottery/queryPrizeList", "", {
          loading: true,
          unenc: true
        })
        .then(response => {
          if (response.data.code !== 0) return;
          vm.lotteryList = [];
          vm.loading = false;
          response.data.data.lotteryList.forEach(element => {
            Business.setBallStyle(element);
            vm.lotteryList.push(element);
          });
        });
    }
  },
  activated() {},
  deactivated() {
    // 退出时
  },
  created() {
    this.queryPrizeList();
  }
};
</script>

<style scoped lang="less">
.prize-notice {
  height: 100%;
}
.prize-notice li {
  min-height: 98px;
  padding: 6px 0.3rem 6px 65px;
  border-bottom: 10px solid #eee;
  position: relative;
}
.prize-notice .refresh::before {
  content: "";
  position: fixed;
  width: 2px;
  height: 50px;
  background-color: #2d97ff;
  right: 44px;
  top: 105px;
}
.prize-notice .refresh {
  position: fixed;
  right: 30px;
  z-index: 100;
  top: 150px;
  background: radial-gradient(#138aff, #409fff, #84c3ff);
  border-radius: 100%;
  width: 30px;
  height: 30px;
  line-height: 34px;
  text-align: center;
  text-indent: 2px;
  opacity: 0.5;
}
.prize-notice .refresh:hover {
  opacity: 1;
}
.prize-notice .ivu-icon {
  cursor: pointer;
  color: #fff;
  font-size: 20px;
}
.prize-notice li .list-logo {
  position: absolute;
  left: 15px;
  top: 25px;
}
.prize-notice li .list-logo img {
  width: 40px;
}
.prize-notice .list-detail {
  margin-left: 0.3rem;
}
.prize-notice .list-detail .title .rf {
  font-size: 0.66rem;
  color: rgb(134, 132, 132);
}
.prize-notice .period {
  font-size: 0.66rem;
  color: rgb(134, 132, 132);
  margin-bottom: 0.2rem;
}
.right-icon {
  position: absolute;
  right: 0.3rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}
.prize-notice {
  .lee-globaloading {
    .load-3 {
      top: 250px;
    }
  }
}
</style>
<style lang="less" scoped>
@import "./prize.less";
</style>

