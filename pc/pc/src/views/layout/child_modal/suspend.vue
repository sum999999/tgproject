<template>
    <div class="suspend"
         :style="{'opacity':show?1:0,'background-image':`url(${suspendBg})`}"
         v-if="showSuspend"
    >
        <h4>扫一扫</h4>
        <p class="app">
            <span>
                <span>
                  <i class="i-icon" :class="icon.icon1"></i>
                </span>
                <span>&nbsp;{{txt.txt1}}</span>
            </span>
        </p>
        <div class="rq">
            <img :src="qrcode.img" :onload="imgLoadf()">
            <i><img :src="'/static/images/'+qrcode.icon + '.png'" :onload="imgLoads()"></i>
        </div>
        <div>
            <a v-if="txt.isLeft"
               class="service i-icon i-suspend-bt"
               @click.prevent="showFallBackDialog">
                <span>
                  <i class="iconfont"
                     :class="icon.icon2"
                     style="font-size:20px;"
                  ></i>
                </span>
                <span>&nbsp;{{txt.txt2}}</span>
            </a>
            <a v-else
               class="service i-icon i-suspend-bt"
               @click.prevent="goPath(url[0])"
            >
                <span><i class="i-icon" :class="icon.icon2"></i></span>
                <span>&nbsp;{{txt.txt2}}</span>
            </a>
        </div>
        <div>
            <a class="service i-icon last i-suspend-bt"
               @click.prevent="goPath(url[1])">
                <span>
                  <i class="i-icon"
                     :class="icon.icon3"
                  ></i>
                </span>
                <span>&nbsp;{{txt.txt3}}</span>
            </a>
        </div>
        <div class="close"
             @click="close()">
            <Icon type="android-close"></Icon>
        </div>
        <!-- 试玩弹框结束 -->
        <confirm-free
                :modalShow='confirmDialog'
                :title="$tex('温馨提示')"
                @btn-ok="handConfirm"
                :maskClosable="true"
                @btn-cancel="confirmDialog=false;">
            <div slot="content">
                <p class="confirm-free-modal-p">{{$tex("当前使用的是正式账号，确定要切换到试玩模式吗")}}</p>
            </div>
        </confirm-free>
    </div>
</template>

<script>
  import ConfirmFree from "@/components/modal";
  import Util from "@/utils/dom.js";

  export default {
    components: {ConfirmFree},
    props: {
      txt: {
        type: Object,
        default: {}
      },
      icon: {
        type: Object,
        default: {}
      },
      url: {
        type: Array,
        default: []
      },
      qrcode: {
        type: Object
      },
      suspendBg: {
        type: String
      }
    },
    data() {
      return {
        confirmDialog: false,
        showSuspend: true,
        show: false,
        img: [false, false]
      };
    },
    computed: {
      user() {
        return this.$store.state.user;
      }
    },
    watch: {
      url() {
      }
    },
    methods: {
      showFallBackDialog() { //打开意见反馈
        if (!this.user.userId) {
          this.$router.push('/login');
          return
        }
        this.$emit('open-feed-back');

      },
      goPath(path) {
        if (path.slice(0, 2) !== "#/") {
          Util.openWin(path);
          return;
        }
        if (path.indexOf("lottery") > -1) {
          let routeData = this.$router.resolve({path: path.slice(1)});
          window.open(routeData.href, "_blank");
          return;
        }
        //打开免费试玩窗口
        this.$router.push({path: path.slice(1)});
      },
      handConfirm() {
        this.confirmDialog = false;
        this.signOut();
        if (this.url[0].slice(0, 2) === "#/") {
          this.$router.push({name: "free_trial"});
          return;
        }
        let routeData = this.$router.resolve({name: "free_trial"});
        window.open(routeData.href, "_blank");
      },
      close() {
        this.showSuspend = false;
        this.$emit("closeSuspend");
      },
      imgLoadf() {
        this.img[0] = true;
        this.imgLoad();
      },
      imgLoads() {
        this.img[1] = true;
        this.imgLoad();
      },
      imgLoad() {
        if (this.img[0] && this.img[1]) {
          setTimeout(() => {
            this.show = true;
          }, 500);
        } else {
          this.show = false;
        }
      },
      signOut() {
        let vm = this;
        this.$http
          .post("/api/v2/user/loginOut", "", {userId: true})
          .then(response => {
            if (response.data.code !== 0) return;
            vm.$store.commit("getUser", "");
            localStorage.setItem("user", "");
            if (this.$route.name === "personalCenter") this.$router.push("/");
          });
      }
    }
  };
</script>

<style lang="less">
    @import "../../../styles/mixin.less";

    .suspend {
        position: relative;
        opacity: 0;
        width: 135px;
        height: auto;
        min-height: 313px;
        color: #fff;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        transition: all 1.2s;
        padding: 30% 0 10%;
    }

    // .suspend .suspend-head {
    //     position: absolute;
    //     top: -9px;
    //     left: 50%;
    //     text-align: center;
    //     line-height: 52px;
    //     transform: translate(-49%, 0);
    // }
    // .suspend .suspend-head .i-logo {
    //     margin-top: 4px;
    // }
    .suspend h4 {
        margin-bottom: 2px;
        text-align: center;
        font-size: 15px;
        font-weight: normal;
    }

    .suspend .app {
        text-align: center;
        font-size: 12px;
        height: 25px;
        line-height: 25px;
    }

    .suspend .app span {
        display: inline-block;
    }

    .suspend .app span span {
        height: 100%;
        overflow: hidden;
        float: left;
    }

    .suspend .app span i {
        float: left;
        margin-top: 2px;
    }

    .suspend .rq {
        width: 120px;
        height: 120px;
        padding: 6px;
        background: #fff;
        margin: 0 auto 10px;
        position: relative;
    }

    .suspend .rq i {
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 35px;
        padding: 2px;
        background: #fff;
        border-radius: 2px;
        -webkit-border-radius: 2px;
    }

    .suspend .service {
        color: #333;
        display: block;
        margin: 0 auto;
        font-size: 14px;
        line-height: 35px;
        /*     color: @supend-service-color; */
    }

    .suspend .service span {
        display: inline-block;
        height: 100%;
        overflow: hidden;
        float: left;
    }

    .suspend .service span i {
        margin-left: 5px;
    }

    .suspend .service.last {
        /* color: @supend-service-last-color; */
    }

    .suspend .close {
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        margin: 0 auto;
        background: #fff;
        position: absolute;
        bottom: -15px;
        left: 0;
        right: 0;
        box-shadow: 0, 0, 5px rgba(190, 19, 4, 0.58);
        -webkit-box-shadow: 0, 0, 5px rgba(190, 19, 4, 0.58);
        border-radius: 50%;
        -webkit-border-radius: 50%;
        font-size: 14px;
        cursor: pointer;
    }
</style>

