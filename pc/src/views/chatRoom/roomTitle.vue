<template>
  <div
    class="chat-room"
    ref="chatRoomInner"
  >
    <div class="room-name-wp">
      <!-- 标题 -->
      <div
        class="room-name"
        @click.stop="toggleRoomList"
      >
        <span>{{roomTitleCurrRoom.roomName}}</span>
        <Icon
          type="ios-arrow-down"
          :class="{'active':showRoomList}"
        />
      </div>
    </div>
    <!-- 房间列表 -->
    <div
      class="room-list-wp"
      :class="{'active':showRoomList}"
    >
      <div class="room-list">
        <ul>
          <li
            v-for="item of rooms"
            :key="item.roomId"
            :class="{'disabled':currRoomId==item.ryChatRoomId}"
            @click="choiceRoom(item)"
          >
            <div class="inner">
              <i></i><span>{{item.roomName}}</span>
            </div>
          </li>
          <li
            v-if="rooms.length"
            @click="more"
          >
            <div>
              <i class="more"></i>
              <span>{{$tex("更多")}}</span>
            </div>
          </li>
          <li
            class='empty'
            v-if="!rooms.length"
          >{{$tex("暂无房间")}}</li>
        </ul>
      </div>
    </div>
    <!-- 更多房间 -->
    <div
      class="more-room-wp"
      :class="{'active':isShowMoreRoom,'long-width':!showLeft}"
    >
      <more-room
        :moreRoomsInfo="moreRoomsInfo"
        :currRoom="currRoom"
        :showLeft="showLeft"
        @get-select-page-data="getMoreChatRoom"
        @close-rooms="closeMoreDialog"
        @choice-curr-room="choiceCurrRoom"
      ></more-room>
    </div>

  </div>
</template>

<script>
import roomsMixin from "@/mixins/roomsMixin.js";
import moreRoom from "./moreRoom.vue";
import { mapMutations, mapActions, mapGetters } from "vuex";
export default {
  // props: ["ryChatRoomInfo"],
  mixins: [roomsMixin],
  props: ["currRoom", "showLeft"],
  components: { moreRoom },
  data() {
    return {
      showRoomList: false, //是否显示房间列表
      chatRoomList: [],
      roomTitleCurrRoom: this.currRoom,
      // currChatRoomName: "",
      currRoomId: this.currRoom.ryChatRoomId,
      isCanSpeak: false, //是否时间段禁言
      // pageInfo: {
      //   current: 1,
      //   roomNo: "",
      //   size: 9,
      //   userId: this.user.userId
      // },
      moreRoomsInfo: {
        chatRooms: [],
        systemChatRooms: []
      }, //更多房间列表
      isShowMoreRoom: false
    };
  },
  watch: {
    currRoom: {
      handler(n = {}, o = {}) {
        if (n.roomId !== o.roomId) {
          this.SET_CHAT_CURRENT_ROOM(n);
          this.setConversationRoom({
            lastMessage: {},
            unreadMessageCount: 0
          });
        }
      },
      immediate: true
    },
    chatShowPrivateWin(n) {
      if (n) {
        this.closeMoreDialog();
      }
    }
  },
  // watch: {
  //   ryChatRoomInfo({ ryChatRoomId, ryChatRoomName }) {
  //     this.currChatRoomName = ryChatRoomName;
  //     this.currRoomId = ryChatRoomId;
  //   }
  // },
  computed: {
    ...mapGetters(["chatShowPrivateWin"]),
    user() {
      return this.$store.state.user;
    },
    rooms() {
      //房间列表
      return this.chatRoomList.slice(0, 20);
    },
    pageInfo() {
      return {
        current: 1,
        roomNo: "",
        size: 9,
        userId: this.user.userId || ''
      }
    }
  },
  methods: {
    ...mapMutations(["SET_CHAT_CURRENT_ROOM"]),
    ...mapActions(["setConversationRoom"]),
    async choiceRoom(item) {
      //切换房间
      let {
        ryChatRoomId,
        type,
        openLevel,
        passwordLevel,
        roomPassword,
        bankLevel,
        roomId,
        banSpeakTime,
        forbidPrivateChat,
        roomNo,
        sysMessage,
        quickDialogue,
        mute
      } = item;
      // debugger;
      if (this.currRoomId === ryChatRoomId) return;
      if (!this.hasJoinRoomAuto(openLevel)) {
        //判断用户等级
        this.$Message.error(this.$tex("用户等级不够不能进入聊天室"));
        return;
      }
      if (roomPassword) {
        if (this.hasJoinRoomAuto(passwordLevel)) {
          let userNeedPwd = true;
          this.$store.commit("SET_CHATROOM_ID", roomId);
          if (this.user.userId) {
            let res = await this.$http.post(
              "/api/v2/chat/queryCheckChatRoomPwd",
              { roomId: roomId },
              {
                userId: true,
                unenc: true
              }
            );
            const { data, code } = res.data;
            if (code === 0) {
              if (data.result) {
                userNeedPwd = true;
              }else{
                 userNeedPwd = false;
              }
            }
          }
          if (userNeedPwd) {
            this.$emit("show-room-pwd-dialog", {
              ryChatRoomId,
              forbidPrivateChat,
              roomId,
              type,
              isBand: this.hasJoinRoomAuto(bankLevel),
              banSpeakTime,
              roomNo,
              sysMessage,
              quickDialogue,
              mute
            }); //显示房间密码弹框
            return;
          }
        }
      }
      this.$emit("no-pwd-enter-room", {
        ryChatRoomId,
        type,
        roomId,
        forbidPrivateChat,
        isBand: this.hasJoinRoomAuto(bankLevel),
        banSpeakTime,
        roomNo,
        sysMessage,
        quickDialogue,
        mute
      });
    },
    /**
     * 显示房间列表
     */
    async toggleRoomList() {
      if (this.chatRoomList.length) {
        this.showRoomList = !this.showRoomList;
        return;
      }
      this.chatRoomList = await this.getChatRoomList();
      this.showRoomList = !this.showRoomList;
    },
    /**
     * 从更多选择房间
     */
    choiceCurrRoom(currRoom) {
      this.isShowMoreRoom = false;
      // this.choiceRoom(this.currRoom.roomId);
      this.choiceRoom(currRoom);
    },
    /**
     * 关闭更多
     */
    closeMoreDialog() {
      this.isShowMoreRoom = false;
    },
    /**
     * 更多
     */
    more() {
      this.showRoomList = false;
      if (this.moreRoomsInfo.chatRooms.length) {
        this.isShowMoreRoom = true;
        return;
      }
      this.getMoreChatRoom();
    },
    /**
     * 获取更多房间信息
     */
    getMoreChatRoom(page, params) {
      let loading = this.$Message.loading({
        content: this.$tex("加载中") + "...",
        duration: 0
      });
      let param = params? Object.assign({},params,{userId: this.user.userId || ''}) : this.pageInfo;
      // debugger;
      // debugger;
      this.$http
        .post("/api/v2/chat/queryChatRooms", param, {
          unenc: true
        })
        .then(res => {
          loading();
          this.isShowMoreRoom = true;
          if (res.data.code !== 0) {
            return;
          }
          let data = res.data.data;
          if (!page) {
            this.$set(
              this.moreRoomsInfo,
              "systemChatRooms",
              data.systemChatRooms
            );
          }
          this.$set(this.moreRoomsInfo, "chatRooms", data.chatRooms);
          this.$set(this.moreRoomsInfo, "total", data.total);
        });
    },
    /**
     * 设置当前房间
     */
    switchRoom(ryChatRoomId) {
      let totalRoomList = this.chatRoomList.concat(
        this.moreRoomsInfo.chatRooms
      );
      this.roomTitleCurrRoom = totalRoomList.filter(
        item => item.ryChatRoomId === ryChatRoomId
      )[0];
      this.showRoomList = false;
      this.currRoomId = ryChatRoomId;
    },

    /**
     * 获取房间列表
     */
    async getChatRoomList() {
      let loading = this.$Message.loading({
        content: this.$tex("加载中") + "...",
        duration: 0
      });
      return new Promise((resolve, reject) => {
        this.$http
          .post("/api/v2/chat/queryChatRoomComboBox", {userId: this.user.userId}, { unenc: true })
          .then(res => {
            loading();
            if (res.data.code !== 0) {
              reject(res.data.data);
              return;
            }
            let chatRoomList = res.data.data.slice(0, 21);
            resolve(chatRoomList);
          });
      });
    },
    /**
     *点击其它部分隐藏房间
     */
    hideRoomList(e) {
      if (!this.showRoomList) return;
      let inner = this.$refs["chatRoomInner"];
      if (!inner) return;
      let target = e.target;
      if (!inner.contains(target)) {
        this.showRoomList = false;
      }
    }
  },
  mounted() {
    //点击元素外面关闭下拉房间列表
    this.$nextTick(() => {
      window.addEventListener("click", this.hideRoomList, false);
    });
  },
  beforeDestroy() {
    window.removeEventListener("click", this.hideRoomList);
  },
  created() {

  }
};
</script>

<style lang="less" scoped>
.chat-room {
  font-size: 16px;
  color: #303b4e;
  position: relative;
  .more-room-wp {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 0;
    background-color: #fff;
    z-index: 101;
    overflow-x: hidden;
    transition: height 0.3s;
    &.active {
      height: calc(100vh - 61px);
    }
    &.long-width {
      width: 100vw;
    }
  }
  .room-name-wp {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 46px;
    margin-left: 6px;
    justify-content: center;
    border-bottom: 1px solid #ebebeb;
  }
  .room-name {
    cursor: pointer;
    &:hover {
      /* color:@primary-color; */
    }
    .ivu-icon {
      position: relative;
      top: 2px;
      margin-left: 14px;
      transition: transform 0.3s;
      font-size: 18px;
      font-weight: bold;
      &.active {
        transform: rotate(180deg);
      }
    }
  }
  .room-list-wp {
    position: absolute;
    top: 47px;
    width: 100%;
    height: 0;
    background-color: #fff;
    transition: height 0.4s;
    overflow: hidden;
    z-index: 101;
    box-shadow: 0 6px 8px -4px #999;
    &.active {
      height: 310px;
    }
  }
  .room-list {
    height: 310px;
    padding: 16px 0;
    overflow: hidden;
    ul {
      height: 100%;
      padding: 0 21px;
      overflow: auto;
      font-size: 0;
      li {
        float: left;
        // display:block;
        width: 25%;
        height: 40px;
        padding: 0 21px;
        margin: 8px 0;
        font-size: 16px;
        line-height: 40px;
        text-align: center;
        color: #fff;
        transition: opacity 0.3s;
        &:hover {
          cursor: pointer;
          opacity: 0.9;
        }
        &.empty {
          width: 100%;
          line-height: 278px;
          text-align: center;
          color: #999;
        }
        &.disabled {
          &:hover {
            cursor: not-allowed;
          }
          .inner {
            background-color: #999;
            background-image: none;
            border-radius: 6px;
          }
        }
        div {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 40px;
          background: url(/static/images/chat/roomListBg/red.png) no-repeat;
          background-size: 100% 40px;
          overflow: hidden;
        }
        i {
          display: block;
          width: 21px;
          height: 18px;
          background: url(/static/images/chat/roomListBg/gem.png) no-repeat left
            center;
          margin-right: 14px;
        }
        .more {
          height: 20px;
          background-image: url(/static/images/chat/roomListBg/more.png);
        }
        span {
          display: block;
          max-width: 80%;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        &:nth-child(2) {
          div {
            background-image: url(/static/images/chat/roomListBg/pink.png);
          }
        }
        &:nth-child(5) {
          div {
            background-image: url(/static/images/chat/roomListBg/blue.png);
          }
        }
        &:nth-child(6) {
          div {
            background-image: url(/static/images/chat/roomListBg/purple.png);
          }
        }
        &:nth-child(7) {
          div {
            background-image: url(/static/images/chat/roomListBg/blue.png);
          }
        }
        &:nth-child(8) {
          div {
            background-image: url(/static/images/chat/roomListBg/blue.png);
          }
        }
        &:nth-child(10) {
          div {
            background-image: url(/static/images/chat/roomListBg/pink.png);
          }
        }
        &:nth-child(13) {
          div {
            background-image: url(/static/images/chat/roomListBg/blue.png);
          }
        }
        &:nth-child(14) {
          div {
            background-image: url(/static/images/chat/roomListBg/purple.png);
          }
        }
        &:nth-child(15) {
          div {
            background-image: url(/static/images/chat/roomListBg/blue.png);
          }
        }
        &:nth-child(16) {
          div {
            background-image: url(/static/images/chat/roomListBg/blue.png);
          }
        }
        &:nth-child(20) {
          div {
            background-image: url(/static/images/chat/roomListBg/orange.png);
          }
        }
      }
    }
  }
  @media only screen and (max-width: 1750px) {
    .room-list {
      ul {
        li {
          width: 33.333333%;
        }
      }
    }
  }
  @media only screen and (max-width: 1550px) {
    .room-list {
      ul {
        li {
          width: 50%;
        }
      }
    }
  }
  @media only screen and (max-width: 1350px) {
    .room-list {
      ul {
        li {
          width: 100%;
        }
      }
    }
  }
}
</style>
