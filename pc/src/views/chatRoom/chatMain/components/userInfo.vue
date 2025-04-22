<template>
  <Modal
    v-model="isShowModal"
    class="userInfo-modal"
    title=""
    :footerHide="true"
    width="480"
  >
    <div class="modal-body">
      <div class="hd">
        <img
          :src="portrait"
          alt=""
        >
      </div>
      <div class="name-wrap">
        <span class="name">{{currentMsg.content.extra.senderUser && currentMsg.content.extra.senderUser.nickName}}</span>
      </div>
      <p
        class="code"
      >
        {{$tex("会员账号")}}:
        <img v-if="!userCode" class="loading" src="~@/assets/images/loading.gif">
        <span v-else>{{userCode}}</span>
      </p>
      <div class="u-btn">{{$tex("投注命中率")}}<span class="num">{{ hitRate }}</span></div>
      <div
        v-if="isCanPrivate"
        class="u-btn"
        @click="onOpenPrivateWin"
      >{{$tex("发送消息")}}</div>
    </div>

  </Modal>

</template>

<script>
import { mapMutations, mapActions, mapGetters } from "vuex";
import * as RongYun from '@/utils/rongyun';
import { MessageObjectNames } from "@/constant/rongyun";
import numeral from "numeral";

export default {
  data() {
    return {
      isShowModal: false,
      realUserCode: '',
      userInfo: {}
    };
  },
  props: {
    currentMsg: {},
    value: {
      default: false,
      type: Boolean
    },
    privateChat: {
      type: Boolean,
      default: false,
    }
  },
  watch: {
    value(v) {
      this.isShowModal = v;
      if (v && this.isSysManager) {
        this.$store.dispatch("queryUserInfo", {
          userId: this.userId
        }).then((res) => {
          if (res.data.code !== 0) return
          this.userInfo = res.data.data
        })
      } else {
        this.userInfo = {}
      }
    },
    isShowModal(v) {
      this.$emit("input", v);
    }
  },
  computed: {
    ...mapGetters(["chatPeopleData", "chatCurrentRoom"]),
    isCanPrivate() {
      return (
        this.chatPeopleData.privateChat === "1" &&
        this.chatCurrentRoom.forbidPrivateChat == "0" &&
                !this.privateChat
      );
    },
    isSysManager() {
      return this.chatPeopleData.isAdmin === "1";
    },
    userId () {
      const user = RongYun.MessageManager.getInstance().getUserByMessage(
              this.currentMsg
      );
      return user.id;
    },
    userCode() {
      const message = this.currentMsg || {};
      if (this.isSysManager) {
        return this.userInfo.userCode
      }
      if (message.messageType === MessageObjectNames.FOLLOW_ORDER) {
        const userCode = message.content && message.content.extra && message.content.extra.data && message.content.extra.data.userCode;
        return RongYun.FeatureEx.hideUserCode(userCode);
      }
      const userCode = message.content && message.content.extra && message.content.extra.senderUser && message.content.extra.senderUser.userCode;
      return RongYun.FeatureEx.hideUserCode(userCode);
    },
    hitRate() {
      if (!this.isSysManager) {
        const remoteData = RongYun.MessageManager.getInstance().getRemoteDataByMessage(
                this.currentMsg
        );
        return remoteData.hitRate
      }
      return `${numeral(Number(this.userInfo.betHitRate) || 0).multiply(100).format("0.0") || 0}%`
    },
    portrait() {
      const user = RongYun.MessageManager.getInstance().getUserByMessage(
              this.currentMsg
      );
      return user.portrait || user.icon || "/static/images/chat/chat_def_hd.png"
    }
  },
  methods: {
    ...mapMutations(["SET_CHAT_SHOW_PRIVATE_WIN"]),
    ...mapActions(["setChatCurrentContact"]),
    onOpenPrivateWin() {
      this.setChatCurrentContact({
        userInfo: {
          ...this.currentMsg.content.user
        }
      });
      this.isShowModal = false;
    }
  }
};
</script>

<style lang="less" scoped>
@imgSrc: "~@/assets/images/chat";
@deep: ~">>>";
.userInfo-modal {
  @{deep} .ivu-modal-body {
    background: url("@{imgSrc}/model-bg.png") no-repeat;
  }
  @{deep} .ivu-modal-content {
    border: 0;
    border-radius: 12px;
    background-color: #fff;
  }
  @{deep} .ivu-modal-close .ivu-icon-ios-close-empty {
    color: #fff;
    font-size: 40px;
  }
  .hd {
    text-align: center;
    img {
      display: inline-block;
      width: 100px;
      height: 100px;
      float: none;
    }
  }
  .name-wrap {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    margin: 10px 0;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      left: 50%;
      margin-left: -150px;
      top: 50%;
      height: 1px;
      width: 300px;
      background-color: #e8ebe9;
      z-index: 1;
    }
    .name {
      position: relative;
      z-index: 2;
      background-color: #fff;
      padding: 0 20px;
    }
  }
  .code {
    text-align: center;
    color: #999;
    font-size: 16px;
  }
  .u-btn {
    text-align: center;
    width: 200px;
    height: 40px;
    line-height: 40px;
    margin: 20px auto;
    border-radius: 20px;
    background-image: linear-gradient(to right, #811fef, #e81d9c);
    color: #fff;
    font-size: 15px;
    cursor: pointer;
  }
  .loading {
    display: inline-block;
    width: 110px;
    float: none;
    vertical-align: middle;
  }
}
</style>
