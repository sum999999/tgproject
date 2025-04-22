<template>
  <div class="transfer-result">
    <div
      class="go-back"
      @click="onBackClick"
    >
      <span>返回余额宝</span>
    </div>
    <div class="done-order">
      <div class="top-tip">
        <div class="confirmicon"></div>
        <div class="confirm1">
          <span>{{title}}</span>
          <p>
            <span>{{dsc}}</span>
          </p>
          <Button
            type="primary"
            class="watct-detail-btn"
            @click="onWatchProfitLoss"
          >查看收支明细</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "YebTransferResult",
  props: ["title", "dsc"],
  methods: {
    onBackClick() {
      this.$emit("tab-clear-pageview");
    },
    onWatchProfitLoss() {
      this.$emit("tab-replace-view", "ProfitLossDetail");
      this.$emit("tab-clear-pageview");
    }
  }
};
</script>

<style lang="less" scoped>
.go-back {
  width: 140px;
  border: 1px solid #ff7614;
  height: 35px;
  line-height: 35px;
  border-radius: 6px;
  color: #ff7614;
  background: url("/static/images/bk-one.png") no-repeat left center;
  background-position-x: 10px;
  text-align: center;
  padding-left: 30px;
  cursor: pointer;
  margin-bottom: 10px;
}
.go-back img {
  width: auto;
  height: auto;
}
.done-order {
  margin-top: 86px;
}
.done-order .info {
  border-right: 1px solid #e2e2e2;
  width: 425px;
  margin: 30px auto 0;
}
.done-order dl.first-in {
  height: 105px;
}
.done-order dl {
  height: 35px;
  line-height: 35px;
  border-bottom: 1px solid #fff;
}
.done-order dl dd,
.done-order dl dt {
  display: inline-block;
  height: 100%;
  float: left;
}
.done-order dl.first-in dt {
  height: 100%;
  line-height: 105px;
}
.done-order dl dt {
  color: #fff;
  width: 90px;
  text-align: center;
  /*   background: @primary-color; */
}
.done-order dl dd span {
  display: block;
  padding-left: 12px;
  width: 334px;
}
.done-order dl dd span.bk-clr {
  background: #e2e2e2;
}
.done-order dl dd span.bo-b {
  border-bottom: 1px solid #e2e2e2;
  height: 34px;
  line-height: 34px;
}

.confirmicon {
  // float: left;
  display: inline-block;
  vertical-align: top;
  width: 60px;
  height: 60px;
  margin-left: 170px;
  background: url("~@/assets/images/icon.png") no-repeat -76px -509px;
}
.confirm1 {
  // float: left;
  display: inline-block;
  vertical-align: top;
  margin-left: 20px;
}
.confirm1 span {
  font-size: 24px;
  color: #313131;
  font-weight: bold;
}
.confirm1 p > span {
  font-size: 16px;
  font-weight: normal;
}
.watct-detail-btn {
  margin-top: 30px;
  width: 182px;
  height: 36px;
}
</style>
