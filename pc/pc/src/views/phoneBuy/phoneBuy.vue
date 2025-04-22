<template>
  <div class="phone-buy">
    <div class="txt"></div>
    <div class="iphone"></div>
    <div class="rightbg"></div>
    <div class="down">
      <div
        class="android"
        @mouseenter="isShowAndroid = true"
        @mouseleave="isShowAndroid = false"
      >
        <div class="lf" v-if="qrcodes.length">
          <vue-qr
            :text="qrcodes[1].url"
            logoSrc="/static/images/android.png"
            :margin="0"
          ></vue-qr>
          <!-- <img
            :src="qrcodes[1].img"
            alt=""
          >
          <i><img
              src="/static/images/android.png"
              alt=""
            ></i> -->
        </div>
      </div>
      <div
        class="ios"
        @mouseenter="isShowIos = true"
        @mouseleave="isShowIos = false"
      >
        <div class="lf rt" v-if="qrcodes.length">
          <vue-qr
            :text="qrcodes[0].url"
            logoSrc="/static/images/ios.png"
            :margin="0"
          ></vue-qr>
          <!-- <img
            :src="qrcodes[0].img"
            alt=""
          >
          <i><img
              src="/static/images/ios.png"
              alt=""
            ></i> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueQr from "vue-qr";
export default {
  components: {
    VueQr,
  },
  data() {
    return {
      kfTime: configText.kfTime || "7x12",
      isShowAndroid: false,
      isShowIos: false,
    };
  },
  computed: {
    url() {
      return window.location.host;
    },
    qrcodes() {
      console.log("this.$store.state.qrcodes", this.$store.state.qrcodes);
      return this.$store.state.qrcodes;
    },
  },
};
</script>

<style scoped lang="less">
.phone-buy {
  position: relative;
  height: 761px;
  background: url("/static/images/bg10191.png") no-repeat 0 0;
  background-size: 1382px auto;
}
.phone-buy .half {
  width: 100%;
  height: 380px;
}
.phone-buy .iphone {
  position: absolute;
  top: 20px;
  right:8%;
  width: 690px;
  height: 510px;
  background: url("/static/images/phone1019.png") no-repeat 0;
  background-size: 100% 100%;
}
.phone-buy .rightbg {
  position: absolute;
  top: 0;
  right:0%;
  width: 140px;
  height: 758px;
  background: url("/static/images/rightbg019.png") no-repeat 0;
}
.phone-buy .txt {
  position: absolute;
  left: 10.4%;
  top: 80px;
  width: 583px;
  height: 264px;
  z-index: 2;
}
.phone-buy .down {
  position: absolute;
  left: 20%;
  top: 475px;
  z-index: 3;
  img {
    width: 100%;
  }
}
.phone-buy .down > div {
  display: inline-block;
  width: 168px;
  height: 48px;
  font-size: 0;
  background: url("/static/images/Android_dow.png") no-repeat;
}
.phone-buy .down .ios {
  margin-left: 56px;
  background-image: url("/static/images/apple_dow.png");
}
.phone-buy .down .lf {
  position: absolute;
  top: -160px;
  left: 8px;
  width: 155px;
  height: 160px;
  background: url("/static/images/phone-buy-qr_ewm.png") no-repeat center;
  background-size: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.phone-buy .down .lf > img {
  float: none;
  padding: 0px 20px 12px 20px;
}
.phone-buy .down .rt {
  left: 238px;
}
.phone-buy .down .lf i {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 35px;
  padding: 2px;
  background: #fff;
  border-radius: 2px;
}
.phone-buy .qr .ios {
  margin-left: 150px;
}
</style>

