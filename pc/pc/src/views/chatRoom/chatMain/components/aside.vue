<template>
  <div class="">
    <aside class="chat-aside">
      <ul class="list" :class="{ show: showAside }">
        <li @click="onSign" v-if="showSign">
          <img
            :src="require('@/assets/images/chat/chat-right-qd-en.png')"
            alt=""
          />
          <span>{{ $tex("签到") }}</span>
        </li>
        <li @click="onShowRank">
          <img
            :src="require('@/assets/images/chat/chat-right-phb-en.png')"
            alt=""
          />
          <span>{{ $tex("排行榜") }}</span>
        </li>
        <li
          v-if="$store.getters.sysSystemConfig.RED_PACKET_SWITCH == '1'"
          @click="onShowRecket"
        >
          <img
            :src="require('@/assets/images/chat/chat-right-hb-en.png')"
            alt=""
          />
          <span>{{ $tex("红包") }}</span>
        </li>
        <li v-if="showLongqueue" @click="onLongqueue">
          <img :src="require('@/assets/images/longqueue/cl.png')" alt="" />
          <span>{{ $tex("长龙") }}</span>
        </li>
      </ul>
      <div class="guild" @click="showAside = !showAside">
        <img
          :src="require('@/assets/images/chat/chat-right-fl-en.png')"
          alt=""
        />
        <span>{{ $tex("福利") }}</span>
      </div>
    </aside>
    <RedpactList
      :showRedPacket.sync="showRedPacket"
      :red-pack-detail="redPackDetail"
    ></RedpactList>

    <Modal
      v-model="showSignSuccess"
      footer-hide
      class="sign-dlg chat-dlg"
      :class="{
        en: !checkChineseKey(),
      }"
      width="350"
    ></Modal>
    <!--  排行榜 -->
    <Modal v-model="showRanking" class="chat-rank-modal" width="550">
      <ul class="chat-rank-head clearfix">
        <li
          v-for="(item, index) in rankTab"
          @click="onSwitchRank(index)"
          :class="{ selected: rankIndex == index }"
          :key="index"
        >
          {{ item.name }}
        </li>
      </ul>

      <div class="chat-rank-panel">
        <div class="chat-rank-list nice-scroll" v-loading="rankLoading">
          <ul v-if="rankList.length">
            <li v-for="(item, index) in rankList" :key="index">
              <img :src="item.headImg" class="hd-img" alt="" />
              <div class="cont">
                <p>{{ $tex("账号昵称") }}：{{ item.userCode }}</p>
                <p>{{ rechargeTxt }}：{{ $scur("￥") }}{{ item.money }}</p>
              </div>

              <span class="order">{{ index + 1 }}</span>
            </li>
          </ul>
          <div v-else class="chat-data-empty">
            {{ $tex("暂无数据") }}
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { UserTypes } from "@/constant/user";

import RedpactList from "./RedpactList";
import { checkChineseKey } from "@/lang";
import { hasPermission } from "@/utils/authority-utils";
import { mapGetters } from "vuex";

export default {
  props: {
    joinRoomSuccess: false,
    signFlag: 0,
  },
  data() {
    return {
      showAside: true,
      showSign: !this.signFlag, // 显示签到
      showRanking: false, // 显示排行版弹框
      showRedPacket: false,
      showSignSuccess: false, // 签到成功弹框
      rankList: [],
      rankLoading: false,
      rankIndex: 0,
      rankTab: [
        {
          name: this.$tex("昨日充值排行"),
          type: 3,
        },
        {
          name: this.$tex("盈利排行"),
          type: 2,
        },
        {
          name: this.$tex("佣金排行"),
          type: 4,
        },
      ],
      rechargeTxtList: [
        this.$tex("充值金额"),
        this.$tex("盈利金额"),
        this.$tex("佣金金额"),
      ],
      redPackDetail: {},
    };
  },
  components: {
    RedpactList,
  },
  watch: {
    signFlag() {
      this.showSign = !this.signFlag;
    },
  },
  computed: {
    ...mapGetters(["showSysDragon"]),
    rechargeTxt() {
      return this.rechargeTxtList[this.rankIndex];
    },
    user() {
      return this.$store.state.user;
    },
    isLogin() {
      return !!this.user.userId;
    },
    showLongqueue() {
      return hasPermission("longqueue") && this.showSysDragon;
    },
  },
  mounted() {},
  methods: {
    hasPermission,
    checkChineseKey,
    queryRecketList() {
      const clostLoading = this.$Message.loading({
        content: `${this.$tex("加载中")}...`,
        duration: 0,
      });
      let roomId = this.$store.state.chatRoomId;
      return this.$http
        .post(
          "/api/v2/user/queryUnclaimedRedpacket",
          { userId: this.user.userId, roomId: roomId },
          { unenc: true }
        )
        .then((response) => {
          clostLoading();
          if (response.data.code !== 0) return;
          return (this.redPackDetail = response.data.data);
        });
    },
    onShowRecket() {
      this.queryRecketList().then((data) => {
        if (data.unclaimedRedpacketRsp.length) this.showRedPacket = true;
        else this.$Message.info(this.$tex("暂无红包"));
      });
    },
    onLongqueue() {
      if (this.isLogin) {
        this.$store.commit("SET_APP_LONGQUEUE", true);
      } else {
        this.$store.commit("getShowLoginDialog", true);
      }
    },
    /*
     *  @dec 显示排行榜
     */
    onShowRank() {
      this.showRanking = true;
      this.rankIndex = 0;
      this.getUserChatRankByType();
    },
    /*
     *  @dec 切换排行榜
     */
    onSwitchRank(index) {
      if (this.rankIndex === index) return;
      this.rankIndex = index;
      this.getUserChatRankByType(this.rankTab[index].type);
    },
    getUserChatRankByType(type = 3) {
      this.rankLoading = true;
      const r = this.$store.dispatch("getUserChatRank", { type });
      r.then((res) => {
        this.rankLoading = false;
        if (res.data.code !== 0) return;
        const list = res.data.data || [];
        this.rankList = list;
      }).catch((e) => {
        this.rankLoading = false;
        this.rankList = [];
      });
      return r;
    },
    /*
     *  @dec 签到
     */
    onSign() {
      if (!this.user.userCode) {
        this.$store.commit("getShowLoginDialog", true);
        return;
      }
      if (this.user.userType === UserTypes.TRY_PLAY) {
        // 试玩账号
        return;
      }
      this.$http
        .post("/api/v2/user/sign", "", { userId: true })
        .then((response) => {
          if (response.data.code !== 0) return;
          this.showSign = false;
          this.showSignSuccess = true;
        });
    },
  },
};
</script>

<style lang="less">
@imgSrc: "~@/assets/images/chat";
.chat-rank-modal {
  .ivu-modal-footer {
    display: none;
  }
}

.chat-aside {
  position: absolute;
  right: 10px;
  top: 50%;
  width: 50px;
  z-index: 99;
  margin-top: -20px;

  .list-wrap {
    // height: 200px;
  }

  .list {
    position: absolute;
    left: 0;
    bottom: 0;

    & > li {
      position: absolute;
      left: 0;
      bottom: 0;
      transition: all 0.5s linear;
      opacity: 0;
      transform: scale(0);

      span {
        position: absolute;
        color: #ffffff;
        font-weight: bold;
        display: block;
        bottom: 2px;
        left: -5px;
        right: 0;
        text-align: center;
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      &:nth-child(1) {
        transform: scale(0.33);

        span {
          text-shadow: -1px 1px 2px #3cbaa3, 1px 1px 2px #3cbaa3,
            2px -1px 2px #3cbaa3, -1px -1px 2px #3cbaa3;
        }
      }

      &:nth-child(2) {
        transform: scale(0.66);

        span {
          text-shadow: -1px 1px 2px #bf62fa, 1px 1px 2px #bf62fa,
            2px -1px 2px #bf62fa, -1px -1px 2px #bf62fa;
        }
      }

      &:nth-child(3) {
        transform: scale(1);

        span {
          text-shadow: -1px 1px 2px #fb1803, 1px 1px 2px #fb1803,
            2px -1px 2px #fb1803, -1px -1px 2px #fb1803;
        }
      }

      &:nth-child(4) {
        transform: scale(1);

        span {
          text-shadow: -1px 1px 2px #fb1c55, 1px 1px 2px #fb1c55,
            2px -1px 2px #fb1c55, -1px -1px 2px #fb1c55;
        }
      }
    }

    &.show {
      & > li {
        opacity: 1;
        transform: scale(1);

        &:nth-child(1) {
          bottom: 55px;
        }

        &:nth-child(2) {
          bottom: 110px;
        }

        &:nth-child(3) {
          bottom: 165px;
        }

        &:nth-child(4) {
          bottom: 220px;
        }
      }
    }
  }

  .guild {
    position: relative;
    z-index: 1;

    span {
      position: absolute;
      color: #ffffff;
      font-weight: bold;
      display: inline-block;
      text-shadow: -1px 1px 2px #366fda, 1px 1px 2px #366fda,
        2px -1px 2px #366fda, -1px -1px 2px #366fda;
      bottom: 2px;
      left: -4px;
      right: 0;
      text-align: center;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  img {
    width: 50px;
    height: 50px;
    display: block;
    float: none;
    cursor: pointer;
  }
}

.sign-dlg {
  .ivu-modal-content {
    // position: fixed;
    // top: 50%;
    // left: 50%;
    // transform: translate3d(-50%, -50%, 0);
    width: 350px;
    height: 273px;
    padding-top: 30px;
    background: url("@{imgSrc}/qdcg.png") no-repeat;
  }

  &.en {
    .ivu-modal-content {
      background: url("@{imgSrc}/qdcg-en.png") no-repeat;
    }
  }
}

.chat-rank-head {
  width: 400px;
  margin: 10px auto;
  border: 1px solid #eee;
  border-radius: 5px;
  overflow: hidden;

  li {
    float: left;
    width: 33.33333%;
    text-align: center;
    height: 35px;
    line-height: 35px;
    cursor: pointer;

    &.selected {
      color: #fff;
    }
  }
}

.chat-rank-list {
  min-height: 300px;
  max-height: 395px;
  overflow: scroll;

  li {
    border-bottom: 1px solid #cacaca;
    padding: 6px 16px;
    height: 65px;
    overflow: hidden;

    .hd-img {
      height: 50px;
      width: 50px;
      border-radius: 100%;
      float: left;
      margin-right: 20px;
    }

    .cont {
      padding-top: 2px;
      float: left;
      width: 360px;
      color: #000;
      font-size: 14px;
    }

    .order {
      float: right;
      width: 30px;
      height: 30px;
      line-height: 30px;
      margin-top: 10px;
      background-color: #ff6a6a;
      color: #fff;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      border-radius: 100%;
    }

    &:nth-child(1),
    &:nth-child(2),
    &:nth-child(3) {
      .order {
        height: 33px;
        width: 30px;
        font-size: 0;
        border-radius: 0;
      }
    }

    &:nth-child(1) {
      .order {
        background: url("@{imgSrc}/chat-right-jb1.png") no-repeat;
      }
    }

    &:nth-child(2) {
      .order {
        background: url("@{imgSrc}/chat-right-jb2.png") no-repeat;
      }
    }

    &:nth-child(3) {
      .order {
        background: url("@{imgSrc}/chat-right-jb3.png") no-repeat;
      }
    }

    &:last-child {
      border-bottom: 1px solid transparent;
    }
  }
}

.chat-data-empty {
  text-align: center;
  width: 100%;
  padding: 30px;
  color: #666;
  font-size: 16px;
  font-weight: bold;
}
</style>
