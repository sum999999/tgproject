<template>
  <div class="home content">
    <div class="banner-betting">
      <hotlist />
      <div>
        <banner></banner>
        <div class="betting">
          <fast-betting></fast-betting>
        </div>
      </div>
      <infolist />
    </div>
  </div>
</template>

<script>
import banner from "./banner3d";
import hotlist from "./hotlist";
import infolist from "./infolist";
import list from "./ListLee";
import fastBetting from "./fast_betting";
import qrNotice from "./qr_notice";
// import popupNotice from "./popup_notice";
export default {
  components: {
    banner,
    list,
    fastBetting,
    qrNotice,
    hotlist,
    infolist
    // popupNotice
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.home {
  margin: 10px auto;
}
.banner-betting {
  display: flex;
  justify-content: space-between;
}
.betting {
  margin-top: 15px;
  height: 226px;
  overflow: hidden;
  background: #fff;
}
.flow {
  height: 130px;
  margin: 15px 0;
  border-top: 5px solid @home-component-border;
  border-bottom: 5px solid @home-component-border;
}
.flow li {
  float: left;
  width: 14.28%;
  text-align: center;
  font-size: 14px;
  padding: 5px 0;
  height: 130px;
}
.index-footer {
  .iconfont {
    font-size: 30px;
  }
}
.flow li.next-step {
  line-height: 130px;
}
.flow li.next-step .icon-home-tj {
  font-size: 14px;
}
.flow li h4 {
  font-weight: normal;
  height: 30px;
  line-height: 30px;
  font-size: 16px;
}
.flow li i {
  margin: 1px 0;
}
.flow li p {
  color: #666;
}
</style>


