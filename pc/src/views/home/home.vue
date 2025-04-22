<template>
  <div class="home content">
    <div class="banner-betting">
      <hotlist />
      <div>
        <banner></banner>
        <div class="betting">
          <!-- 快速投注模块 -->
          <fast-betting></fast-betting>
          <!-- 二维码，网站公告，新手指导 -->
          <!-- <qr-notice></qr-notice> -->
        </div>
      </div>
      <infolist />
    </div>

    <!-- 开奖公告,中奖排行榜, 咨询中心  列表模块 -->
    <!-- <list></list>z -->
    <!-- -->

    <!-- <div class="flow index-footer">
      <ul>
        <li>
          <h4>登录/注册</h4>
          <i class="iconfont icon-per"></i>
          <p>
            快速填写信息<br />
            10s成为本站会员
          </p>
        </li>
        <li class="next-step">
          <i class="iconfont icon-home-tj"></i>
        </li>
        <li>
          <h4>充值</h4>
          <i class="iconfont icon-bank1"></i>
          <p>
            储蓄卡&nbsp;信用卡&nbsp;支付宝<br />
            多种&nbsp;方式&nbsp;安全快捷
          </p>
        </li>
        <li class="next-step">
          <i class="iconfont icon-home-tj"></i>
        </li>
        <li>
          <h4>购买彩票</h4>
          <i class="iconfont icon-buy"></i>
          <p>
            竞技彩&nbsp;数字彩&nbsp;快频彩<br />
            彩种全面&nbsp;玩法多样
          </p>
        </li>
        <li class="next-step">
          <i class="iconfont icon-home-tj"></i>
        </li>
        <li>
          <h4>中奖提现</h4>
          <i class="iconfont icon-zzjl"></i>
          <p>
            <template v-if="$configText.siteId == 'k70'">
              1至3分钟即可到账<br />
              安全有保障
            </template>
            <template v-else>
              最快5分钟到账<br />
              安全有保障
            </template>
          </p>
        </li>
      </ul>
    </div> -->
    <!-- <popup-notice></popup-notice> -->
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


