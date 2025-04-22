<template>
  <div class="more-room">
    <!-- close -->
    <div
      class="close"
      @click="closeRooms"
    ><i class="iconfont icon-close1"></i></div>
    <!-- 搜索框 -->
    <div class="room-search">
      <div class="search">
        <input
          type="text"
          v-model.trim="roomNo"
          :placeholder="$tex('请输入房间号查询')"
        >
        <Button
          type="primary"
          v-preventReClick="2000"
          @click.stop="searchRoom"
        >
          <Icon type="ios-search" />{{$tex("搜索")}}</Button>
      </div>
    </div>
    <dl :class="{'long-width':!showLeft}">
      <dt :class="{'disabled':currRoomId===sysChatRooms.ryChatRoomId}">
        <div
          class="wp syswp"
          :style="sysChatRoomsRoomIcon"
          @click="enterRoom(sysChatRooms)"
        >
          <div class="room-name">
            <span class="name">{{sysChatRooms.roomName}}</span>
            <span class="no">ID:{{sysChatRooms.roomNo}}</span>
          </div>
          <div class="room-desc">
            <div class="mar-wp">
              <marquee
                behavior="scrolll"
                direction="left"
              >
                <div>{{sysChatRooms.roomDesc}}</div>
              </marquee>
            </div>
            <div class="count">
              <i class="iconfont icon-renshu"></i>
              {{sysChatRooms.onlineAmount}}人
            </div>
          </div>
        </div>
      </dt>
      <!-- 非系统房间 -->
      <dd>
        <ul>
          <template v-if="total">
            <li
              :class="{'disabled':currRoomId===item.ryChatRoomId}"
              v-for="(item, index) in chatRooms"
              :key="item.roomId + index"
            >
              <div
                class="wp"
                :style="`background-image:url(${item.roomIcon})`"
                @click="enterRoom(item)"
              >
                <div class="room-name">
                  <span class="name">{{item.roomName}}</span>
                  <span class="no">ID:{{item.roomNo}}</span>
                </div>
                <div class="room-desc">
                  <div class="mar-wp">
                    <marquee
                      behavior="scrolll"
                      direction="left"
                    >
                      <div>{{item.roomDesc}}</div>
                    </marquee>
                  </div>
                  <div class="count">
                    <i class="iconfont icon-renshu"></i>
                    {{item.onlineAmount}}人
                  </div>
                </div>
              </div>
            </li>
          </template>
          <template v-else>
            <li style="width: 100%;height: 290px;line-height:290px;text-align:center;">
              {{$tex("没有更多了")}}
            </li>
          </template>
          <li>
            <!-- 分页 -->
            <div
              class="rooms-page"
              :class="{'empty':!total}"
            >
              <page
                :total="total"
                :currentPage="params.current"
                :pageSize="params.size"
                @get-Page-Data="getPageData"
              ></page>
            </div>
          </li>
        </ul>
      </dd>
    </dl>
  </div>
</template>

<script>
import roomsMixin from "@/mixins/roomsMixin.js";
import page from "@/components/page.vue";
export default {
  props: ["moreRoomsInfo", "currRoom", "showLeft"],
  mixins: [roomsMixin],
  components: {
    page
  },
  data() {
    return {
      params: {
        current: 1,
        size: 9,
        roomNo: ""
      },
      roomNo: "" //房间号码
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    chatRooms() {
      //其它房间
      return this.moreRoomsInfo.chatRooms.slice(0, 9);
    },
    sysChatRooms() {
      //聊天室
      if (!this.moreRoomsInfo.systemChatRooms.length) return {};
      return this.moreRoomsInfo.systemChatRooms[0];
    },
    sysChatRoomsRoomIcon() {
      return this.sysChatRooms.roomIcon && `background-image:url(${this.sysChatRooms.roomIcon})`;
    },
    currRoomId() {
      return this.currRoom.ryChatRoomId;
    },
    total() {
      if (!this.moreRoomsInfo.chatRooms.length) return 0;
      return this.moreRoomsInfo.total;
    }
  },
  methods: {
    /**
     * 获取指定页的数据
     */
    getPageData(page) {
      this.$set(this.params, "current", page);
      // console.log(this.params);
      // if(page>=2) {
      //     this.$set(this.params,'size',9);
      // } else if(page === 1){
      //     this.$set(this.params,'size',10);
      // }
      // this.$set(this.params,'userId',this.user.userId?this.user.userId:'');
      this.$emit("get-select-page-data", page, this.params);
    },
    /**
     * 关闭更多房间
     */
    closeRooms() {
      this.$emit("close-rooms");
      this.roomNo = "";
    },
    enterRoom(item) {
      if (this.currRoomId === item.ryChatRoomId) return;
      this.$emit("choice-curr-room", item);
    },
    /**
     * 搜索房间
     */
    searchRoom() {
      this.$set(this.params, "size", 9);
      this.$set(this.params, "roomNo", this.roomNo);
      this.$set(this.params, "current", 1);
      this.$emit("get-select-page-data", 1, this.params);
    }
  }
};
</script>

<style lang="less" scoped>
.more-room {
  position: relative;
  height: 100%;
  background-color: #fff;
  transition: height 0.3s;
  &.active {
    height: calc(100vh - 60px);
  }
  .room-search {
    position: absolute;
    width: 100%;
    top: 230px;
    left: 0;
    text-align: center;
    .search {
      position: relative;
      display: inline-block;
      width: 508px;
      height: 54px;
      box-shadow: 0 0 10px 2px rgba(32, 133, 236, 0.3);
      border-radius: 10px;
      text-align: left;
      background-color: #fff;
      overflow: hidden;
    }
    input {
      outline: none;
      border: none;
      width: 388px;
      height: 100%;
      padding-left: 20px;
      &::-webkit-input-placeholder {
        color: #b5b5b5;
      }
      &:-moz-placeholder {
        color: #b5b5b5;
      }
      &::-moz-placeholder {
        color: #b5b5b5;
      }
      &:-ms-input-placeholder {
        color: #b5b5b5;
      }
    }
    button {
      position: absolute;
      right: 0;
      top: 0;
      width: 120px;
      height: 100%;
      font-size: 16px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      background-color: #2085ec;
      border: 1px solid #2085ec;
      transition: opacity 1s;
      &:hover {
        opacity: 0.9;
      }
    }
    .ivu-icon {
      font-size: 22px;
      margin-right: 8px;
      vertical-align: middle;
    }
  }
  .page-wrapper {
    top: -4px;
  }
  .close {
    position: absolute;
    right: 15px;
    top: 10px;
    color: #fff;
    .iconfont {
      font-size: 30px;
      &:hover {
        cursor: pointer;
        opacity: 0.9;
      }
    }
  }
  dl {
    height: 100%;
    // width: calc(100vw - 260px);
    &.long-width {
      width: 100vw;
    }
  }
  dt {
    height: 269px;
    padding-top: 50px;
    background: url(/static/images/chat/roomListBg/system_room_bg.png) no-repeat
      center;
      background-size: cover;
    margin-bottom: 40px;
    &.disabled {
      .wp {
        -webkit-filter: grayscale(100%);
        filter: gray;
        color: gray;
        cursor: not-allowed;
        &:hover {
          opacity: 1;
        }
      }
    }
  }
  .wp {
    position: relative;
    // width: 468px;
    height: 160px;
    padding-top: 35px;
    margin: 0 auto;
    background-size: cover;
    background-repeat: no-repeat;
    font-size: 24px;
    transition: opacity 0.3s;
    &:hover {
      cursor: pointer;
      opacity: 0.9;
    }
  }
  .syswp {
    width: 450px;
  }
  .room-name {
    width: 265px;
    padding-left: 20px;
    color: #fff000;
    span {
      display: block;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .name {
      margin-bottom: 3px;
    }
    .no {
      font-size: 20px;
    }
  }
  .room-desc {
    position: absolute;
    left: 19px;
    bottom: 25px;
    display: flex;
    justify-content: space-between;
    width: 436px;
    height: 24px;
    line-height: 27px;
    font-size: 14px;
    color: #fff;
    opacity: 0.8;
    .mar-wp {
      width: 63%;
      height: 24px;
      overflow: hidden;
    }
    .count {
      width: 28%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      i {
        margin-right: 10px;
      }
    }
  }
  dd {
    position: relative;
    height: calc(100% - 370px);
    ul {
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      padding-right: 10px;
    }
    li {
      width: calc(100% / 3);
      margin-bottom: 32px;
      &:nth-child(6) {
        margin-bottom: 0;
      }
      &:nth-child(7) {
        margin-bottom: 0;
      }
      &:nth-child(8) {
        margin-bottom: 0;
      }
      &:last-child {
        width: 100%;
        margin-bottom: 0;
      }
      &.disabled {
        .wp {
          -webkit-filter: grayscale(100%);
          filter: gray;
          color: gray;
          cursor: not-allowed;
        }
      }
    }
  }
  @media only screen and (max-width: 1700px) {
    dd {
      li {
        width: 50%;
      }
    }
  }
  @media only screen and (max-width: 1300px) {
    dd {
      li {
        width: 100%;
        &:nth-child(6) {
          margin-bottom: 32px;
        }
        &:nth-child(7) {
          margin-bottom: 32px;
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
