<template>
  <div
    class="trend trend-tpl"
    v-loading="loadingfir||(loadingsec||loadingthi)"
  >
    <div class="detail-title">
      <div class="title-wrap">
        <div class='title'>
          <div class='img-wrap'>
            <img
              :src="singleLottery.lotteryIcon"
              alt=""
            >
          </div>
          <div class="name">
            <strong>{{singleLottery.lotteryName}}</strong>
          </div>
        </div>
        <div class="menu">
          <ul>
            <li
              v-for="(disp,index) in disps"
              :key="index"
              @click="changeAnaly(disp,index)"
              :class="{'active':displayId===disp.displayId}"
            >{{disp.displayName}}</li>
          </ul>
        </div>
      </div>
      <table-list
        :code="lotteryType"
        v-if="singleLottery.openBallCount>0"
        :lotteryId='lotteryId'
        :displayId="displayId"
        :displayCode="displayCode"
        :openBallCount="singleLottery.openBallCount"
        style='margin-bottom:44px;'
      ></table-list>
    </div>
  </div>
</template>

<script>
import tableList from "./table_list.vue";
export default {
  components: {
    tableList
  },
  data() {
    return {
      defaultIndex: 0,
      displayId: "", //表格显示不同分析图
      displayCode: "",
      lotteryType: "", //一级高亮标识
      disps: [], //彩种走势菜单
      singleLottery: {},
      loadingfir: false,
      loadingsec: false,
      loadingthi: false
    };
  },
  methods: {
    /**
     * 切换分析图
     */
    changeAnaly(disp, index) {
      if (index === this.defaultIndex) return;
      this.displayCode = disp.displayCode;
      this.displayId = disp.displayId;
    },
    /**
     *获取二级菜单
     */
    getSubMenu(code, isData) {
      this.$http
        .post(
          "/api/v2/trend/queryAllDisplaysByCode",
          { code: code },
          { unenc: true }
        )
        .then(response => {
          if (response.data.code !== 0) return;
          let data = response.data.data;
          for (let i = 0, len = data.lotterys.length; i < len; i++) {
            if (this.lotteryId === data.lotterys[i].lotteryId) {
              this.lotteryType = data.lotterys[i].code;
              this.disps = data.lotterys[i].disps;
              this.singleLottery = data.lotterys[i];
              if (isData) {
                this.displayId = this.disps[0].displayId;
                this.displayCode = this.disps[0].displayCode;
              }
            }
          }
        });
    },
    /**
     * 获取一级菜单
     */
    init() {
      this.$http
        .post("/api/v2/trend/queryAllLotterys", "", { unenc: true })
        .then(response => {
          if (response.data.code !== 0) return;
          this.loadingfir = false;
          let data = response.data.data;
          for (let i = 0, len = data.types.length; i < len; i++) {
            for (
              let j = 0, len2 = data.types[i].lotterys.length;
              j < len2;
              j++
            ) {
              if (this.lotteryId === data.types[i].lotterys[j].lotteryId) {
                // this.lotteryType = data.types[i].code;
                // console.log(data.types);
                // debugger;
                this.getSubMenu(data.types[i].code);
              }
            }
          }
        });
    }
  },
  created: function() {
    this.lotteryId = this.$route.params.id;
    this.displayId = this.$route.query.displayId;
    this.defaultIndex = this.$route.query.displayId;
    this.displayCode = this.$route.query.displayCode;
    if (!this.displayId) {
      this.getSubMenu(this.$route.query.code, true);
    }
    this.loadingfir = true;
    this.init();
  }
};
</script>

<style lang="less">
@imgSrc: "~@/assets/images/";
.trend {
  box-sizing: border-box;
  height: 100%;
  width: 1000px;
  margin: 0 auto;
  padding: 46px 0 28px 0;
  overflow: auto;
  min-height: 700px;

  .detail-title {
    background-color: #fff;
    .title-wrap {
      height: 106px;
      padding: 13px 0 13px 20px;
      font-size: 0;
      position: relative;
      background-image: url("@{imgSrc}/trend-hd.png");

      .title {
        display: inline-block;
        vertical-align: middle;
        font-size: 0;
        div {
          &:extend(.trend .detail-title .title-wrap .title);
          &.img-wrap {
            width: 80px;
            height: 80px;
            border: 9px solid #fff;
            border-radius: 50%;
            margin-right: 12px;
            img {
              width: 62px;
              height: 62px;
              margin-right: 10px;
            }
          }
          &.name {
            font-size: 18px;
            color: #fff;
            font-weight: bold;
          }
        }
      }

      .menu {
        &:extend(.trend .detail-title .title-wrap .title);
        margin-left: 28px;
        li {
          display: inline-block;
          width: 92px;
          line-height: 34px;
          cursor: pointer;
          color: #fff;
          font-size: 14px;
          text-align: center;
          &.active {
            border: 2px solid #a8a9a4;
            font-size: 16px;
            line-height: 30px;
          }
        }
      }
    }
  }
}
</style>
