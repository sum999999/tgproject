<template>
  <div class="fill-height">
    <template>
      <div class="left-search" id="leftSearch">
        <div v-show="!switching && advisorySwitch == 2">
          <input
            type="text"
            v-model="searchName"
            @focus="queryUsers"
            @input="monitorSwitching"
          />
          <i class="iconfont icon-search" @click="search"></i>
        </div>
        <i class="ivu-icon ivu-icon-refresh" @click="refresh"></i>
      </div>
    </template>

    <!--    <EasyScrollbar :barOption="barOption"> -->
    <div class="userlist2-wrap">
      <ul class="user-list2" id="userlist2">
        <template v-if="switching">
          <li
            class="item"
            v-for="(item, index) in userList"
            :key="index"
            @click="openWinChat(item)"
            :class="{ selected: isCurrentSelected(item) }"
            v-show="
              !searchName2 ||
                (searchName2 && item.name.indexOf(searchName2) > -1)
            "
          >
            <img class="img" :src="item.imgUrl || defHdImg" alt="" />
            <span class="name">{{ item.name }}</span>
            <img
              v-if="$store.getters.sysPlatformFlag !== 'by322'"
              class="lv"
              :src="item.levelUrl || defLv"
              alt=""
            />
            <img v-else class="lv" :src="item.levelUrl" alt="" />
          </li>
        </template>
        <template v-else>
          <li
            class="item"
            v-for="(item, index) in activeUsers"
            :key="index"
            @click="openWinChat(item)"
            :class="{ selected: isCurrentSelected(item) }"
          >
            <img class="img" :src="item.imgUrl || defHdImg" alt="" />
            <span class="name"
              >{{ item.nickName }}
              <span style="margin-left: 10px;">({{ item.userCode }})</span>
            </span>
            <img
              class="lv"
              :src="item.levelIcon ? item.levelIcon : item.userLevelIcon"
              alt=""
            />
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import { checkChineseKey } from "@/lang";
import { queryChatRooms } from "@/api/chat";

export default {
  data() {
    return {
      searchName: "",
      searchName2: "",
      defLv: checkChineseKey()
        ? "/static/images/chat/unLoad-hd.png"
        : "/static/images/chat/unLoad-hd-en.png",
      defHdImg: "/static/images/chat/chat_def_hd.png",
      userList: [],
      activeUsers: [],
      SearchUsers: "",
    };
  },
  props: {
    switching: {
      type: Boolean,
      default: true,
    },
    advisorySwitch: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    ...mapGetters([
      "chatCurrentRoom",
      "chatContactsList",
      "chatPeopleData",
      "chatCurrentContact",
      "user",
    ]),
    user() {
      return this.$store.state.user;
    },
    isExitUser() {
      return this.user.userId;
    },
    isCustomerService() {
      return this.isExitUser && this.chatPeopleData.isCustomerService === "1";
    },
    isAdmin() {
      return this.isExitUser && this.chatPeopleData.isAdmin === "1";
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
  watch: {
    chatCurrentRoom: {
      handler(n, o = {}) {
        if (n.roomId !== o.roomId) {
          //  this.handleQueryChatPersons(true);
        }
      },
      deep: true,
      immediate: true,
    },
    chatPeopleData(n) {
      this.handleQueryChatPersons(n);
    },
    user(n, o = {}) {
      if (n.userId != o.userId) {
        this.handleQueryChatPersons();
      }
    },
  },
  methods: {
    ...mapMutations(["getChatPeopleData", "SET_CHAT_ISLOADING_USERLIST"]),
    ...mapActions(["setChatCurrentContact"]),
    isCurrentSelected(item) {
      const { userInfo = {} } = this.chatCurrentContact;
      item.id = item.id ? item.id : item.userId;
      return item.id === userInfo.id;
    },
    setUserName(user) {
      return user.nickName || chatUtil.handlerName(user.userCode);
    },
    openWinChat(item) {
      if (this.advisorySwitch != 3 && !this.isCanPrivate) {
        return;
      }

      item = {
        ...item,
        id: item.id ? item.id : item.userId,
      };
      this.$store.commit("SET_CHAT_TEAM", item.id);
      const exitUserIndex = this.chatContactsList.findIndex(
        (item) => item.userInfo.id === item.id
      );
      if (exitUserIndex > -1) {
        this.setChatCurrentContact(this.chatContactsList[exitUserIndex]);
      } else {
        this.setChatCurrentContact({
          userInfo: {
            id: item.id,
            portrait: item.imgUrl,
            name: item.name || item.nickName || item.userCode,
            sendUserLevelIcon: item.userLevelIcon || item.levelIcon,
          },
          lastMessage: {},
          unreadMessageCount: 0,
        });
      }
    },
    /**
     * 搜索用户
     */
    search() {
      this.activeUsers = this.SearchUsers.filter((item) => {
        if (!item.userCode && (!item.nickName || item.nickName === ""))
          return false;
        // 模糊查询
        const regex = new RegExp(this.searchName, "i");

        return (
          (item.userCode && regex.test(item.userCode)) ||
          (item.nickName && regex.test(item.nickName))
        );
      });
    },

    /**
     * 未登录查询人员列表
     */
    async unLoginQueryChatPersons() {
      const { roomId, ryChatRoomId } = this.chatCurrentRoom;
      if (roomId) {
        const response = await this.$http.post(
          "/api/v2/chat/queryChatPeopleCount",
          {
            chatId: ryChatRoomId,
            userId: this.user.userId || "",
            roomId,
          },
          {
            unenc: true,
          }
        );
        if (response.data.code !== 0) return;
        this.getChatPeopleData(Object.assign({}, response.data.data));
        this.handleChatPeople(response.data.data);
      }
    },
    /**
     * 未登录查询人员处理
     */
    async handleQueryChatPersons(isRefresh) {
      clearTimeout(this.queryTimer);
      this.SET_CHAT_ISLOADING_USERLIST(true);
      try {
        if (this.isAdmin || this.isCustomerService) {
          await this.loginQueryChatPersons();
          this.queryTimer = window.setInterval(() => {
            this.loginQueryChatPersons();
          }, 10 * 60 * 1000); // 每10分钟更新一次
        } else {
          if (isRefresh && this.chatPeopleData.peopleList) {
            this.handleChatPeople(this.chatPeopleData);
          } else {
            await this.unLoginQueryChatPersons();
          }
        }
      } catch (error) {
        this.SET_CHAT_ISLOADING_USERLIST(false);
      }
      this.SET_CHAT_ISLOADING_USERLIST(false);
    },
    /**
     * 客服或者是管理员查询真实人员列表
     */
    async loginQueryChatPersons() {
      const { roomId, ryChatRoomId } = this.chatCurrentRoom;
      if (!roomId || !ryChatRoomId) return;
      const response = await this.$http.post(
        "/api/v2/chat/queryChatPersons",
        {
          roomId: roomId,
          chatId: ryChatRoomId,
        },
        {
          unenc: true,
          userId: true,
        }
      );
      const { data, code } = response.data;
      if (code !== 0) return;
      this.handleChatPeople({
        count: data.length,
        peopleList: data,
      });
    },
    // 活跃用户
    async onlineListing() {
      if (!this.isCanPrivate) {
        return;
      }
      const { roomId, ryChatRoomId } = this.chatCurrentRoom;
      this.activeUsers = [];
      const res = await this.$http.post(
        "/api/v2/user/activeUsers",
        {
          chatId: ryChatRoomId,
          userId: this.user.userId || "",
          roomId,
        },
        {
          unenc: true,
          userId: true,
        }
      );
      // 不展示自己
      this.SearchUsers = res.data.data.filter(
        (item) => item.userCode != this.user.userCode
      );
      if (this.searchName == "" || this.searchName == this.user.userCode) {
        this.activeUsers = this.advisorySwitch == 2 ? this.SearchUsers : [];
      }
    },
    // 团队列表
    async queryChatRoomsTeam() {
      this.activeUsers = [];
      const res = await queryChatRooms({
        current: 1,
        roomNo: "",
        size: 1,
        userId: this.user.userId ? this.user.userId : "",
      });
      if (res.data.code !== 0) return;
      let data = res.data.data;
      this.activeUsers = this.advisorySwitch == 3 ? data.myInvited : [];
      return data.myInvited;
    },
    handleChatPeople(data) {
      this.onlineCount = data.count || 0;
      this.userList = data.peopleList.filter(
        (item) => item.id != this.user.userId
      );
      try {
        this.oldUserList = JSON.parse(JSON.stringify(this.userList));
      } catch (error) {
        this.oldUserList = [];
      }
    },

    refresh() {
      this.searchName = "";
      this.onlineListing();
      this.handleQueryChatPersons();
    },
    //
    queryUsers() {
      this.onlineListing();
      this.searchName = "";
    },
    monitorSwitching() {
      if (this.searchName == "") {
        this.activeUsers = this.SearchUsers;
      } else {
        if (this.SearchUsers !== "") {
          this.search();
        }
      }
    },
  },
  created() {},
};
</script>

<style lang="less" scoped>
.fill-height {
  height: 100%;
}
.left-search {
  overflow: hidden;
  position: relative;
  padding-right: 20px;
  input {
    border-radius: 15px;
    margin: 8px;
    padding: 2px 30px 2px 10px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
    width: 220px;
    height: 25px;
    line-height: 25px;
    color: #ddd;
    outline: 0;
  }
  .icon-search {
    position: absolute;
    right: 39px;
    top: 50%;
    margin-top: -13px;
    cursor: pointer;
    font-size: 18px;
  }
  .ivu-icon-refresh {
    position: absolute;
    right: 7px;
    top: 50%;
    margin-top: -10px;
    cursor: pointer;
    font-size: 18px;
  }
}
.ivu-icon-i {
  margin: 5px 0 0 220px;
  font-size: 18px;
}
.userlist2-wrap {
  height: 100%;
  padding-top: 41px;
  margin-top: -41px;
}
.user-list2 {
  height: 100%;
  overflow: auto;
  li {
    list-style-type: none;
    width: 240px;
    padding: 14px 10px;
    transition: 0.3s;
    color: #ddd;
    cursor: pointer;
    position: relative;
    border-bottom: 1px solid rgba(0, 0, 0, 0);
    &:hover,
    &.selected {
      background: rgba(0, 0, 0, 0.2);
    }
    .img {
      width: 24px;
      height: 264x;
      border-radius: 50%;
      margin: 0 8px;
      vertical-align: middle;
    }
    .name {
      font-size: 14px;
      display: inline-block;
      vertical-align: middle;
      white-space: nowrap;
      width: 105px;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
    }
    .lv {
      position: absolute;
      right: 10px;
      top: 50%;
      max-width: 70px;
      max-height: 30px;
      transform: translateY(-50%);
      /*     float: right; */
      /*  height: 18px;
            width: 18px; */
    }
  }
}
</style>
