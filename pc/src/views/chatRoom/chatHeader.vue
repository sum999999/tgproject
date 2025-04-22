<template>
  <div id="header">
    <div class="logo"><img :src="picture + `${key}`" /></div>
    <ul class="header-menu">
      <li @click="addCollection">
        <i class="iconfont icon-fav"></i>{{ $tex("收藏") }}
      </li>
      <li class="phone-link">
        <i class="iconfont icon-phone"></i>{{ $tex("手机聊天室") }}
        <div class="ewm">
          <div id="ewmCode"></div>
          <p class="txt">{{ $tex("打开手机浏览器扫一扫聊天") }}</p>
        </div>
      </li>
    </ul>
    <ul class="user-menu" v-if="user.userCode">
      <li class="hd" @click="goPage('#/personalCenter/account')">
        <img class="u-img" :src="user.imgUrl" alt="" />
        <span class="u-name"> {{ user.userCode }}</span>
      </li>
      <li>
        <span class="ui-btn btn-blue" @click="signOut">{{ $tex("退出") }}</span>
      </li>
    </ul>
    <ul class="user-menu" v-else>
      <li>
        <span class="ui-btn btn-orange" @click="goPage('#/register')">{{
          $tex("注册")
        }}</span>
        <span class="ui-btn btn-blue" @click="loginShow">{{
          $tex("登录")
        }}</span>
      </li>
    </ul>
    <!-- 登录弹框 -->
    <loginDlg
      :isShow="showLoginDialog"
      class="dcp-login-dg"
      @close-login-modal="closeLoginModal"
    ></loginDlg>
    <!-- 登录弹框 -->
  </div>
</template>

<script>
import loginDlg from "@/components/login_dlg.vue";
import QRCode from "@/utils/qrcode"; // import QRCode from "qrcodejs2"; 不使用网站太长会报错

export default {
  components: {
    loginDlg: loginDlg,
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    showLoginDialog() {
      return this.$store.state.showLoginDialog;
    },
  },
  data() {
    return {
      picture: "/configstatic/pc/images/",
      key: "logo.png",
      mark: "",
    };
  },
  watch: {
    "$store.getters.pageTemplate.index"(value) {
      if (this.mark == "tgdemo") this.pictureSwitching(value);
    },
  },
  methods: {
    closeLoginModal(result) {
      //登录框
      this.$store.commit("getShowLoginDialog", false);
    },
    goPage(link) {
      window.open(link, "_blank");
    },
    addCollection() {
      this.$Modal.info({
        title: this.$tex("加入收藏"),
        content: this.$tex("请按Ctrl+D加入收藏"),
        onOk: () => {},
      });
    },
    loginShow() {
      this.$store.commit("getShowLoginDialog", true);
    },
    signOut() {
      let vm = this;
      this.$http
        .post("/api/v2/user/loginOut", "", { userId: true })
        .then((response) => {
          if (response.data.code !== 0) return;
          vm.$store.commit("getUser", "");
          localStorage.setItem("user", "");
          this.$router.push("/");
        });
    },
    toDesktop() {
      try {
        var WshShell = new ActiveXObject("WScript.Shell");
        var oUrlLink = WshShell.CreateShortcut(
          WshShell.SpecialFolders("Desktop") + "\\带彩票.url"
        );
        oUrlLink.TargetPath = location.href;
        oUrlLink.Save();
      } catch (e) {
        alert("当前IE安全级别不允许操作！");
      }
    },
    pictureSwitching(value) {
      if (value == 10) {
        this.key = "logo_A.png";
      } else if (value == 2 || value == 3) {
        this.key = "logo_C.png";
      } else {
        this.key = "logo_B.png";
      }
    },
  },
  mounted() {
    new QRCode("ewmCode", location.host + "/#/chatRoom");
    this.mark = this.$store.getters.sysPlatformFlag;
    if (this.mark == "tgdemo") {
      const pictureKey = this.$store.getters.pageTemplate.index;
      this.pictureSwitching(pictureKey);
    }
  },
};
</script>

<style scoped lang="less">
@imgSrc: "../../assets/images/chat";
#header {
  position: relative;
  z-index: 999;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  height: 60px;
  line-height: 60px;
  color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  font-size: 14px;
  background: url("@{imgSrc}/header-topbg.png") right top repeat #293240;

  .logo {
    width: 260px;
    text-align: center;
    float: left;

    img {
      vertical-align: middle;
      width: 130px;
    }
  }
}

.header-menu {
  float: left;
  position: relative;

  li {
    float: left;
    margin-right: 30px;
    cursor: pointer;
    height: 60px;

    &:last-child {
      margin-top: 0;
    }

    .iconfont {
      font-size: 18px;
      margin-right: 4px;
    }
  }

  /*  .phone-link {
              .ewm {
                  position: absolute;
                  border-radius: 3px;
                  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
                  padding: 20px;
                  z-index: 100;
                  padding: 20px;
                  text-align: center;
                  img {
                      width: 150px;
                      height: 150px;
                      display: block;
                  }
              }
          } */
}

.user-menu {
  float: right;
  padding-right: 50px;

  li {
    float: left;
    margin-right: 5px;
    padding: 0 15px;
    cursor: pointer;

    &:last-child {
      margin-right: 0;
    }
  }

  .tx {
    animation: bank-flash 0.5s infinite;

    &:hover {
      background: rgba(0, 0, 0, 0.4);
    }
  }

  .hd {
    &:hover {
      background: rgba(0, 0, 0, 0.4);
    }

    .u-img {
      width: 40px;
      height: 40px;
      vertical-align: middle;
    }

    .u-name {
      vertical-align: middle;
      height: 50px;
      line-height: 50px;
    }
  }

  .icon-bank {
    color: #ee433e;
    font-size: 24px;
    vertical-align: middle;
    margin-right: 5px;
  }

  .ui-btn {
    margin-top: 15px;
    margin-left: 15px;
    margin-right: 10px;
    width: auto;
    padding: 0 8px;
  }
}

@keyframes bank-flash {
  0%,
  100% {
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -ms-transform: scale(1);
    -o-transform: scale(1);
    transform: scale(1);
  }

  50% {
    -webkit-transform: scale(0.95);
    -moz-transform: scale(0.95);
    -ms-transform: scale(0.95);
    -o-transform: scale(0.95);
    transform: scale(0.95);
  }
}

.ui-btn {
  text-align: center;
  font-size: 14px;
  display: inline-block;
  width: 70px;
  height: 32px;
  line-height: 32px;
  color: #fff;
  border-radius: 2px;
  cursor: pointer;

  &.btn-orange {
    background: #e65610;
  }

  &.btn-blue {
    background: #0e79f6;
  }
}
</style>
<style lang="less">
.header-menu {
  .phone-link {
    position: relative;

    &:hover {
      .ewm {
        display: block;
      }
    }
  }

  .ewm {
    position: absolute;
    border-radius: 3px;
    display: none;
    box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
    padding: 20px;
    // z-index: 100;
    z-index: 3000;
    padding: 20px;
    text-align: center;
    background-color: #fff;
    color: #333;
    left: 0;
    top: 52px;

    &::before {
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-width: 8px;
      border-color: transparent;
      border-style: dashed;
      border-right-color: rgb(255, 255, 255);
      left: 0;
      top: -8px;
    }

    img {
      width: 150px;
      height: 150px;
      display: block;
      margin-bottom: 10px;
    }

    .txt {
      height: 36px;
      line-height: 25px;
    }
  }
}

.dcp-login-dg {
  // z-index: 1001;
  // position: fixed;
}
</style>
