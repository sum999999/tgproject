<template>
  <div style="background: #150b0b;">
    <div class="phone-buy">
      <div class="info">
        <img :src="`/configstatic/pc/images/Icon-60.png?v=` + version" />
        <p>{{ host }}</p>
      </div>
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
      <!-- <div class="right">
      <div class="item item1">
        <span>红包</span>
      </div>
      <div class="item item2">
        <span>微聊</span>
      </div>
      <div class="item item3">
        <span @click="onLongqueueClick">长龙助手</span>
      </div>
      <div class="item item4">
        <router-link to="/chatRoom"><span>聊天室</span></router-link>
      </div>
      <div class="item item5">
        <span>客服</span>
      </div>
    </div> -->
    </div>
  </div>
</template>

<script>
import VueQr from "vue-qr";
import { mapGetters } from "vuex";
export default {
  components: {
    VueQr,
  },
  data() {
    return {
      kfTime: configText.kfTime || "7x12",
      isShowAndroid: false,
      isShowIos: false,
      host: location.host,
      version: process.env.VERSION,
    };
  },
  created() {
    // console.log(location.host)
  },
  computed: {
    ...mapGetters(["isLogin"]),
    url() {
      return window.location.host;
    },
    qrcodes() {
      return this.$store.state.qrcodes;
    },
  },
  methods: {
    onLongqueueClick() {
      if (this.isLogin) {
        this.$store.commit("SET_APP_LONGQUEUE", true);
      } else if (this.$route.name === "buyLottery") {
        this.$store.commit("getShowLoginDialog", true);
      } else {
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style scoped lang="less">
.info {
  position: relative;
  margin: 0 auto;
  width: 400px;
  top: 88px;
  left: -234px;
  img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin: 17px 18px 18px 17px;
  }
  p {
    margin-top: 50px;
    font-size: 25px;
    color: #e4393c;
    font-weight: bold;
    user-select: none;
  }
}
.phone-buy {
  position: relative;
  height: 655px;
  background: url("/static/images/img_bg.png") no-repeat 50% 0;
  // .right {
  //   position: fixed;
  //   bottom: 200px;
  //   right: 20px;
  //   .item {
  //     width: 50px;
  //     height: 50px;
  //     cursor: pointer;
  //     margin-bottom: 5px;
  //     position: relative;
  //     span {
  //       position: absolute;
  //       right: 50px;
  //       text-align: center;
  //       opacity: 0;
  //       transition: all 0.3s;
  //       top: 13px;
  //       width: 0px;
  //       color: #333;
  //       white-space: nowrap;
  //       background: rgba(255, 255, 255, 0.8);
  //       overflow: hidden;
  //       padding: 2px 0;
  //     }
  //     &:hover span {
  //       width: 80px;
  //       opacity: 1;
  //     }
  //   }
  //   .item1 {
  //     background: url("~@/assets/images-v11/sf1.png") no-repeat 0 0;
  //     background-size: 100% 100%;
  //   }
  //   .item2 {
  //     background: url("~@/assets/images-v11/sf2.png") no-repeat 0 0;
  //     background-size: 100% 100%;
  //   }
  //   .item3 {
  //     background: url("~@/assets/images-v11/sf3.png") no-repeat 0 0;
  //     background-size: 100% 100%;
  //   }
  //   .item4 {
  //     background: url("~@/assets/images-v11/sf4.png") no-repeat 0 0;
  //     background-size: 100% 100%;
  //   }
  //   .item5 {
  //     background: url("~@/assets/images-v11/sf5.png") no-repeat 0 0;
  //     background-size: 100% 100%;
  //   }
  // }
}
.phone-buy .half {
  width: 100%;
  height: 380px;
}

.phone-buy .down {
  position: relative;
  margin: 0 auto;
  bottom: -170px;
  left: -230px;
  width: 400px;
  height: 200px;
  img {
    width: 100%;
  }
}
.phone-buy .down .lf {
  width: 130px;
  height: 160px;
  margin-right: 45px;
}
.phone-buy .down .lf > img {
  float: none;
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
