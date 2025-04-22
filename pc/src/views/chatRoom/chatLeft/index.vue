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
 * @Author: 
 * @Date: 2023-12-29 15:26:24
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-07-16 17:15:50
 * @FilePath: \pc\src\views\chatRoom\chatLeft\index.vue
 * @Description: 聊天室左侧tab栏
 -->

<template>
  <div class="index-left" v-loading="chatIsLoaddingUserList">
    <div class="left-hd">
      <a :href="downloadUrl" target="_blank" class="link">
        <img class="img" src="../../../assets/images/chat/app.png" alt="" />
        <span class="txt">{{ $tex("软件下载") }}</span>
      </a>
      <a @click.prevent="openService" target="_blank" class="link">
        <img class="img" src="../../../assets/images/chat/per.png" alt="" />
        <span class="txt">{{ $tex("在线客服") }}</span>
      </a>
      <!-- 盘口339隐藏在线投注 -->
      <span @click="goPage(onLineSvUrl)" class="link">
        <img class="img" src="../../../assets/images/chat/touzhu.png" alt="" />
        <span class="txt">{{ $tex("在线投注") }}</span>
      </span>
    </div>
    <div class="left-box">
      <div class="left-tab" id="leftTab">
        <ul class="tab-list clearfix" :class="{}">
          <li
            :class="{ selected: advisorySwitch == 0 }"
            @click="advisorySwitch = 0"
          >
            {{ $tex("消息列表") }}
          </li>
          <li
            v-if="showTeam"
            :class="{ selected: advisorySwitch == 3 }"
            @click="activeSwitching(3)"
          >
            {{ $tex("团队") }}
          </li>
          <li
            :class="{ selected: advisorySwitch == 1 }"
            @click="activeSwitching(1)"
          >
            {{ $tex("活跃人数") }}
            <span v-if="!isKf"> ({{ chatPeopleData.count || 0 }})</span>
          </li>
          <li
            v-show="isCanPrivate"
            :class="{ selected: advisorySwitch == 2 }"
            @click="activeSwitching(2)"
          >
            {{ $tex("在线会员") }}
          </li>
        </ul>
      </div>
      <div class="left-body">
        <div class="left-item" v-show="advisorySwitch == 0">
          <MessageList />
        </div>
        <div class="left-item" v-show="advisorySwitch != 0">
          <PeopleList
            ref="peopleList"
            :switching="switching"
            :advisorySwitch="advisorySwitch"
          ></PeopleList>
          <!--        </EasyScrollbar> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MessageList from "./messageList";
import PeopleList from "./peopleList";
import { mapGetters, mapActions } from "vuex";
import * as RongYun from "@/utils/rongyun";
import { queryQrcodesAndServicer } from "@/api/cms";
import Util from "@/utils/dom.js";

export default {
  components: { MessageList, PeopleList },
  data() {
    return {
      barOption: RongYun.BarOption,
      servicerUrl: "",
      advisorySwitch: 0,
      onlineCount: 0,
      // defLv: "/static/images/chat/unLoad-hd.png",
      onLineSvUrl: "",
      downloadUrl: "",
      switching: true,
      showTeam: false,
    };
  },
  computed: {
    ...mapGetters([
      "chatIsLoaddingUserList",
      "chatCurrentRoom",
      "user",
      "chatPeopleData",
    ]),
    isKf() {
      return (
        this.chatPeopleData.isAdmin === "1" ||
        this.chatPeopleData.isCustomerService === "1"
      );
    },
    isExitUser() {
      return this.user.userId;
    },
    isCanPrivate() {
      const canSeeRelUser =
        this.chatPeopleData.isAdmin === "1" ||
        this.chatPeopleData.isCustomerService === "1"; // 有看真实用户的权限

      return (
        this.isExitUser &&
        canSeeRelUser &&
        this.chatPeopleData.privateChat === "1" // 是否有私聊的权限
        // && this.chatCurrentRoom.forbidPrivateChat == "0" // 聊天室是否禁止私聊
      );
    },
  },
  methods: {
    obtainSysConfigAsync() {
      this.$store.dispatch("querySystemConfig").then((systemConfig) => {
        const { CHAT_SOFT_DOWN_URL, CHAT_BET_ONLINE_URL } = systemConfig;
        this.downloadUrl = CHAT_SOFT_DOWN_URL;
        this.onLineSvUrl = CHAT_BET_ONLINE_URL;
      });
    },
    countRandom() {
      let hours = new Date().getHours;
      if (hours < 8) {
        return Math.floor(Math.random() * 2000) + 3000;
      } else {
        return Math.floor(Math.random() * 20000) + 30000;
      }
    },
    queryQrcodesAndServicer() {
      queryQrcodesAndServicer().then((response) => {
        this.servicerUrl = response.data.data.servicer.url;
        document.title = response.data.data.servicer.name;
      });
    },
    goPage(link) {
      const LINK = window.location.href.split("#")[0].slice(0, -1) + link; // 主域名后拼接 /a
      window.open(LINK, "_blank");
      // window.open(link, "_blank");
    },
    //  判断列表展示
    activeSwitching(item) {
      this.advisorySwitch = item;
      if (item === 1) {
        this.switching = true;
      } else if (item === 2) {
        this.$refs.peopleList.onlineListing();
        this.switching = false;
      } else if (item === 3) {
        this.$refs.peopleList.queryChatRoomsTeam();
        this.switching = false;
      }
    },
    openService() {
      if (this.servicerUrl) {
        let url = null;
        if (this.$store.getters.sysPlatformFlag != "by336") {
          url = this.user.userCode
            ? this.servicerUrl + `?id=${this.user.userCode}`
            : this.servicerUrl;
        } else {
          // 336客服链接携带参数会报错
          url = this.servicerUrl;
        }
        Util.openWin(url);
      }
    },
  },
  created() {
    this.obtainSysConfigAsync();
    this.queryQrcodesAndServicer();
  },
  mounted() {
    this.$refs.peopleList.queryChatRoomsTeam().then((result) => {
      if (result) {
        this.showTeam = result.length > 0 ? true : false;
      }
      return;
    });
  },
};
</script>

<style scoped lang="less">
.index-left {
  float: left;
  margin-left: -260px;
  position: relative;
  width: 260px;
  /*  padding-bottom: 6000px;
    margin-bottom: -6000px; */
  overflow: hidden;
  height: 100%;
  // height: calc(100vh - 60px);
  border-radius: 0 2px 0 0;
  background: #2e394d;
  border-top: 1px #485264 solid;
  transition: width 0.2s linear;
  color: #fff;
  a {
    color: #fff;
  }
  .left-box {
    height: 100%;
    margin-top: -81px;
    padding-top: 81px;
  }
  .left-body {
    height: 100%;
    padding-top: 39px;
    margin-top: -39px;
  }
  .left-item {
    height: 100%;
  }
}
.left-hd {
  margin-bottom: 5px;
  padding-left: 10px;
  display: table;
  table-layout: fixed;
  .link {
    width: 80px;
    text-align: center;
    display: table-cell;
    padding-top: 12px;
    cursor: pointer;
    .img {
      width: 40px;
      height: 40px;
      margin: 0 auto 4px;
      display: block;
    }
    &:hover {
      color: #ff0;
    }
  }
}
.left-tab {
  height: 38px;
  line-height: 38px;
  position: relative;
  display: block;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(0, 0, 0, 0.2);
  overflow: hidden;
  .tab-list {
    display: flex;
    li {
      flex: 1;
      text-align: center;
      color: #ccc;
      cursor: pointer;
      &:hover {
        color: #fff;
      }
      &.selected {
        background: rgba(0, 0, 0, 0.3);
        color: #fff;
      }
    }
  }
}
.user-list {
  .item {
  }
  .txt {
    border-left: 3px solid #ed4101;
    margin: 10px;
    padding: 0 8px;
    font-size: 16px;
  }
  .child {
    li {
      .qq-link {
        padding: 0 25px;
        margin-bottom: 10px;
        display: block;
      }
      .img {
        height: 26px;
        width: 26px;
        border-radius: 50%;
        vertical-align: middle;
        margin-right: 5px;
        margin-bottom: 5px;
      }
    }
    .links {
      height: 60px;
      border-top: 1px solid #192436;
      border-bottom: 1px solid #192436;
      .btn {
        display: inline-block;
        width: 90px;
        height: 20px;
        line-height: 20px;
        padding: 6px;
        margin: 15px;
        margin-right: 8px;
        border: 1px solid transparent;
        font-size: 14px;
        text-align: center;
        transition: 0.3s;
      }
      .btn1 {
        border: 1px #ee433e solid;
        color: #ee433e;
        &:hover {
          color: #fff;
          background: #ee433e;
        }
      }
      .btn2 {
        border: 1px #0e79f6 solid;
        color: #0e79f6;
        &:hover {
          color: #fff;
          background: #0e79f6;
        }
      }
    }
  }
}
</style>
