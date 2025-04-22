<template>
  <div class="chat-control" id="chatControl">
    <chatBottomTool
      ref="chatBottomTool"
      @on-sendEmojiMessage="sendEmojiMessage"
      @on-sendImgMessage="sendImgMessage"
      @on-sendRedPacketMessage="sendRedPacketMessage"
      @on-setMsg="setMsg"
      :isCanSpeak="isCanSpeak"
      :dropMsg="dropMsg"
      @on-dropMsg="dropMsg = {}"
    ></chatBottomTool>
    <div class="msg-in">
      <textarea
        class="input"
        ref="msgIn"
        v-model="msg"
        :placeholder="$tex('请输入文字')"
        @keyup.enter="sendTextMessage"
        cols="30"
        rows="10"
        :readonly="!isCanSpeak && !permissions"
        @dragover.prevent
        @drop="onFileDrop"
      ></textarea>
      <div class="btn" @click="sendTextMessage">
        <i class="iconfont icon-send"></i>
        {{ $tex("发送") }}
      </div>
    </div>
  </div>
</template>

<script>
import util from "@/utils/utils";
import chatBottomTool from "./chatBottomTool";
import { mapGetters } from "vuex";
import { queryChatRooms } from "@/api/chat";
export default {
  components: { chatBottomTool },
  props: {
    joinRoomSuccess: false,
    value: "",
    isCanSpeak: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      msg: "",
      dropMsg: {},
      teamMember: null,
    };
  },
  computed: {
    ...mapGetters(["user", "chatPeopleData"]),
    permissions() {
      if (this.teamMember) {
        const index = this.teamMember.findIndex(
          (item) => item.userId == this.$store.getters.teamChat
        );
        if (index > -1) this.msg = "";
        return index > -1 ? true : false;
      }
      return false;
    },
  },
  created() {
    this.$store.dispatch("querySystemConfig").then((data) => {
      this.forbidRedpackt = data["FORBID_SEND_REDPACKED"] === "1";
    });
    this.queryChatRoomsTeam();
  },
  mounted() {
    //输入框绑定粘切事件
    this.textAreaBindPasteEvent();
  },
  watch: {
    value(v) {
      this.msg = v;
    },
    msg(v) {
      this.$emit("input", v);
    },
    isCanSpeak: {
      handler(v) {
        if (!v) {
          this.msg = this.$tex("没有权限");
        } else {
          this.msg = "";
        }
      },
      immediate: true,
    },
  },
  methods: {
    // 团队列表
    async queryChatRoomsTeam() {
      const res = await queryChatRooms({
        current: 1,
        roomNo: "",
        size: 1,
        userId: this.user.userId ? this.user.userId : "",
      });
      if (res.data.code !== 0) return;
      let data = res.data.data;
      this.teamMember = data.myInvited;
    },

    // 输入框拖拽图片
    onFileDrop(e) {
      e.preventDefault();
      let files = e.dataTransfer.files;
      if (files.length > 0) {
        this.msg = files[0];
        this.dropMsg = files;
      }
    },
    textAreaBindPasteEvent() {
      //输入框绑定粘切事件
      const msgIn = this.$refs.msgIn;
      msgIn.addEventListener("paste", (e) => {
        util.getPasterImg(e, this.receivePasteImgCallBack);
      });
    },
    //接收粘切图片的回调
    receivePasteImgCallBack(base64Url, blob) {
      const { isAdmin, isCustomerService } = this.chatPeopleData;
      // debugger;
      if (isAdmin === "0" && isCustomerService === "-1") return;
      this.$emit("send-paste-img", {
        base64Url,
        blob,
      });
    },
    sendTextMessage() {
      console.log("typeof this.msg", typeof this.msg);
      if (typeof this.msg === "object") {
        this.$refs.chatBottomTool.sendImgMessage();
        this.msg = "";
        return;
      }
      this.$emit("on-sendTextMessage", this.msg);
    },
    sendEmojiMessage(groupName, gifInfo) {
      this.$emit("on-sendEmojiMessage", groupName, gifInfo);
    },
    sendImgMessage(files) {
      this.$emit("on-sendImgMessage", files);
    },
    sendRedPacketMessage(message) {
      this.$emit("on-sendRedPacketMessage", message);
    },
    setMsg(emojiName) {
      this.msg = this.msg + emojiName;
    },
  },
};
</script>

<style></style>
