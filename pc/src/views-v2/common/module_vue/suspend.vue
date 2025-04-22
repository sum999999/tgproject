<!--
 *                                |~~~~~~~|
 *                                |       |
 *                                |       |
 *                                |       |
 *                                |       |
 *                                |       |
 *     |~.\\\_\~~~~~~~~~~~~~~xx~~~         ~~~~~~~~~~~~~~~~~~~~~/_//;~|
 *     |  \  o \_         ,XXXXX),                         _..-~ o /  |
 *     |    ~~\  ~-.     XXXXX`)))),                 _.--~~   .-~~~   |
 *      ~~~~~~~`\   ~\~~~XXX' _/ ';))     |~~~~~~..-~     _.-~ ~~~~~~~
 *               `\   ~~--`_\~\, ;;;\)__.---.~~~      _.-~
 *                 ~-.       `:;;/;; \          _..-~~
 *                    ~-._      `''        /-~-~
 *                        `\              /  /
 *                          |         ,   | |
 *                           |  '        /  |
 *                            \/;          |
 *                             ;;          |
 *                             `;   .       |
 *                             |~~~-----.....|
 *                            | \             \
 *                           | /\~~--...__    |
 *                           (|  `\       __-\|
 *                           ||    \_   /~    |
 *                           |)     \~-'      |
 *                            |      | \      '
 *                            |      |  \    :
 *                             \     |  |    |
 *                              |    )  (    )
 *                               \  /;  /\  |
 *                               |    |/   |
 *                               |    |   |
 *                                \  .'  ||
 *                                |  |  | |
 *                                (  | |  |
 *                                |   \ \ |
 *                                || o `.)|
 *                                |`\\) |
 *                                |       |
 *                                |       |
 * 
 * @Author: jerry
 * @Date: 2023-12-29 15:26:24
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-07-16 17:20:06
 * @FilePath: \pc\src\views-v2\common\module_vue\suspend.vue
 * @Description: 游戏风格侧边栏
 -->

<template>
  <ul class="tpl-suspend">
    <li @click="openWin(servicer.url)">
      <i class="iconfont icon-zxkf"></i>
      <p>在线客服</p>
    </li>
    <li
      @click="openWin(`tencent://message/?exe=qq&menu=yes&Uin=${servicer.qq}`)"
    >
      <i class="iconfont icon-qq"></i>
      <p>QQ客服</p>
    </li>
    <li @click="$router.push('/helpCenter/register')">
      <i class="iconfont icon-bangzhu1"></i>
      <p>帮助中心</p>
    </li>
    <li>
      <i class="iconfont icon-phone"></i>
      <p>APP下载</p>

      <ul class="down-wrap">
        <li>
          <div class="ewm-wrap">
            <img :src="qrcodes[0] && qrcodes[0].img" alt="" />
            <img class="center" src="/static/images/ios.png" alt="" />
          </div>
          <p>扫码下载iOS</p>
        </li>
        <li>
          <div class="ewm-wrap">
            <img :src="qrcodes[1] && qrcodes[1].img" alt="" />
            <img class="center" src="/static/images/android.png" alt="" />
          </div>
          <p>扫码下载安卓</p>
        </li>
      </ul>
    </li>
    <li class="feed-back-wp" @click="openFeedBack">
      <i class="feed-back"></i>
      <p>意见反馈</p>
    </li>
    <li v-if="showLongqueue" class="longqueue-wp" @click="onLongqueueClick">
      <i class="longqueue"></i>
      <p>长龙助手</p>
    </li>
  </ul>
</template>

<script>
import Util from "@/utils/dom.js";
import { mapGetters } from "vuex";
import { hasPermission } from "@/utils/authority-utils";

// import
export default {
  computed: {
    ...mapGetters(["user", "showSysDragon"]),
    isLogin() {
      return !!this.user.userId;
    },
    qrcodes() {
      // console.log(this.$store.state);
      return this.$store.state.qrcodes;
    },
    servicer() {
      return this.$store.state.servicer;
    },
    showLongqueue() {
      return hasPermission("longqueue") && this.showSysDragon;
    },
  },
  methods: {
    openWin(path) {
      const url = this.user.userCode ? path + `?id=${this.user.userCode}` : path;
      Util.openWin(url);
    },
    //打开意见反馈
    openFeedBack() {
      this.$emit("open-feed-back");
    },
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

<style lang="less" scoped>
.tpl-suspend {
  position: fixed;
  right: 0;
  top: 50%;
  margin-top: -280px;
  width: 90px;
  z-index: 10;
  background-color: #131522;
  color: #3f4767;
  text-align: center;
  & > li {
    padding: 15px 0;
    border-bottom: 1px solid #31364c;
    border-left: 1px solid #31364c;
    position: relative;
    cursor: pointer;
    a {
      color: #3f4767;
    }
    a {
      &:hover {
        color: #ed1459;
      }
    }
    &:hover {
      color: #ed1459;
    }
    .iconfont {
      font-size: 25px;
    }
    &:first-child {
      border-top: 1px solid #31364c;
      border-top-left-radius: 10px;
    }
    &:last-child {
      border-bottom-left-radius: 10px;
    }
    &:hover {
      .down-wrap {
        display: block;
      }
    }
  }
}
.down-wrap {
  position: absolute;
  background-color: #ed1459;
  width: 320px;
  height: 190px;
  border-radius: 10px;
  padding: 10px;
  display: none;
  left: -340px;
  top: -20px;
  padding: 20px 30px;
  li {
    float: left;
    width: 120px;
    height: 120px;
    margin-left: 20px;
    position: relative;
    &:first-child {
      margin-left: 0;
    }
    img {
      float: none;
      margin-bottom: 5px;
      height: 120px;
    }
    p {
      color: #fff;
    }
    .center {
      position: absolute;
      left: 50%;
      top: 50%;
      margin-top: -15px;
      margin-left: -15px;
      width: 30px;
      height: 30px;
      color: #fff;
    }
  }
  &::before {
    content: "";
    position: absolute;
    right: -20px;
    top: 50%;
    margin-top: -10px;
    border: 10px solid transparent;
    border-left-color: #ed1459;
  }
}
//意见反馈
.feed-back-wp {
  &:hover {
    .feed-back {
      background-image: url("../../images/index/yjfk-xz.png");
    }
  }
  .feed-back {
    display: inline-block;
    width: 25px;
    height: 25px;
    background: url("../../images/index/yjfk.png") no-repeat;
    background-size: cover;
  }
}
.longqueue-wp {
  &:hover {
    .longqueue {
      background-image: url("~@/assets/images/longqueue/yx_changlongxz.png");
    }
  }
  .longqueue {
    display: inline-block;
    width: 37px;
    height: 34px;
    background: url("~@/assets/images/longqueue/yx_changlong.png") no-repeat;
    background-size: cover;
  }
}
</style>
