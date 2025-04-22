<template>
  <div class="chat-control" id="chatControl">
    <div class="face-body" v-show="showEmojiBox">
      <div class="chat-emoji-panel nice-scroll" @click.stop>
        <div class="item" v-show="showEmojiPanel">
          <span
            :name="item.symbol"
            @click.stop="onEmojiSelected($event)"
            v-html="item"
            v-for="(item, index) in emojiList"
            :key="index"
          ></span>
        </div>
        <div
          v-for="(groups, index) in gifConfig.groups"
          v-show="index == gifPanelIndex"
          class="item"
          :key="groups.groupName"
        >
          <img
            :src="`${gifConfig.staticSrc}${groups.groupName}/${item.src}`"
            @click.stop="onGifSelected(groups.groupName, item, $event)"
            v
            v-for="(item, idx) in groups.list"
            :key="idx"
          />
        </div>
      </div>

      <ul class="chat-emoji-tab clearfix" @click.stop>
        <li
          :class="{ selected: showEmojiPanel }"
          v-if="showEmojiPanelTab"
          @click.stop="onEmojiPanelTabClick"
        >
          <i class="iconfont icon-face"></i>
        </li>
        <li
          v-for="(item, index) in gifConfig.groups"
          :key="index"
          :class="{ selected: index == gifPanelIndex }"
          @click.stop="onGifPanelTabClick(index)"
        >
          <img :src="item.groupImg" :key="item.groupName" />
        </li>
      </ul>
    </div>

    <div class="tool">
      <!--  发红包 -->
      <redPacket
        ref="redPacket"
        :joinRoomSuccess="joinRoomSuccess"
        v-show="redPacket"
        @sendRedPacketMessage="onRedPacketSend"
      ></redPacket>
      <i class="iconfont icon-face" @click.stop="onEmojiToolClick"></i>
      <i class="iconfont icon-img">
        <input
          class="file"
          type="file"
          @click="onImgToolClick($event)"
          accept="image/png,image/gif,image/jpeg"
          @change="onImgToolChange($event)"
        />
      </i>
      <span class="">
        <i18n path="您对{name}说" :tag="false">
          <template slot="name">
            <span class="red">{{ $tex("大家") }}</span>
          </template> </i18n
        >：
      </span>
    </div>

    <div class="msg-in">
      <span class="toUser-box" ref="toUser" v-show="atUserList.length">
        <span class="toUser" v-for="(item, idx) in atUserList" :key="idx">
          {{ `@${item.name}` }}
          <i @click="onAtUserClose(idx)" class="iconfont icon-close"></i>
        </span>
      </span>
      <textarea
        class="input"
        ref="msgIn"
        :style="atUserStyle"
        v-model="msg"
        @keyup.enter="onSendBtnClick"
        cols="30"
        rows="10"
        :placeholder="placeholder"
        :readonly="!canSpeak"
        @dragover.prevent
        @drop="onFileDrop"
      ></textarea>
      <div class="btn" @click="onSendBtnClick">
        <i class="iconfont icon-send"></i>
        {{ $tex("发送") }}
      </div>
    </div>
  </div>
</template>

<script>
import * as RongYun from "@/utils/rongyun.js";
import redPacket from "./components/redPacket.vue";
import utils from "@/utils/utils";
import { imgFileCP2Blob } from "@/utils/img";

export default {
  name: "chatFeature",
  components: {
    redPacket,
  },
  props: {
    value: "",
    joinRoomSuccess: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "",
    },
    canSpeak: {
      // 为false则不能点击发送和输入内容
      type: Boolean,
      default: false,
    },
    hasAuth: {
      // 为false则所有功能不能使用
      type: Boolean,
      default: false,
    },
    redPacket: {
      // 是否有红包功能
      type: Boolean,
      default: false,
    },
    atUserStyle: {
      type: Object,
      default: function() {
        return {};
      },
    },
    atUserList: {
      type: Array,
      default: function() {
        return [];
      },
    },
    showEmojiBox: {
      //显示emoji面板
      type: Boolean,
      default: false,
    },
    showEmojiPanel: {
      // emoji面板下的emoji group
      type: Boolean,
      default: false,
    },
    showEmojiPanelTab: {
      // emoji面板下的emoji tab
      type: Boolean,
      default: false,
    },
    gifPanelIndex: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      emojiList: [],
      gifConfig: RongYun.getGifConfig(), // emoji面板下的gif group
      msg: this.value,
      dropMsg: {},
    };
  },
  watch: {
    value: {
      handler(newValue) {
        if (newValue !== this.msg) {
          this.msg = newValue;
        }
      },
    },
    msg: {
      handler(newValue) {
        if (newValue !== this.value) {
          this.$emit("input", newValue);
        }
      },
    },
  },
  created() {
    this.initEmojiList();
  },
  methods: {
    // 输入框拖拽图片
    onFileDrop(e) {
      e.preventDefault();
      let files = e.dataTransfer.files;
      if (files.length > 0) {
        this.msg = files[0];
        this.dropMsg = files;
      }
    },
    // 发送红包
    onRedPacketSend(message, item) {
      if (!this.hasAuth) {
        return;
      }
      this.$emit("red-packet-send", message, item);
    },
    // 工具栏emoji点击事件
    onEmojiToolClick() {
      if (!this.hasAuth) {
        return;
      }
      this.$emit("emoji-click");
    },
    // 工具栏img点击事件
    onImgToolClick(event) {
      if (!this.hasAuth) {
        return event.preventDefault();
      }
      this.$emit("img-click", event);
    },
    // 选择图片触发
    async onImgToolChange(event) {
      console.log("this.hasAuth", this.hasAuth);
      if (!this.hasAuth) {
        return;
      }

      // const target = event.target || event.srcElement;
      // const _files = target.files;
      const _files =
        Object.keys(this.dropMsg).length === 0
          ? (event.target || event.srcElement).files
          : this.dropMsg;
      if (!_files.length) {
        return void 0;
      }
      if (!utils.isImgType(_files[0].name)) {
        return void 0;
      }
      const retFiles = [];
      for (let i = 0; i < _files.length; i++) {
        const file = await imgFileCP2Blob(_files[i], 0.5);
        if (file.size > 1024 * 1204 * 4) {
          this.$Message.info(this.$tex("图片不能超过{num}M", { num: 4 }));
          return;
        }
        retFiles[i] = file;
      }
      this.dropMsg = {};
      this.$emit("img-change", retFiles);
    },
    // 表情面板下方tab的emoji被点击
    onEmojiPanelTabClick() {
      if (!this.hasAuth) {
        return;
      }
      this.$emit("emoji-panel-tab-click");
    },
    // 表情面板下方tab的gif被点击
    onGifPanelTabClick(index) {
      if (!this.hasAuth) {
        return;
      }
      this.$emit("gif-panel-tab-click", index);
    },
    // 选中emoji表情
    onEmojiSelected(event) {
      if (!this.hasAuth) {
        return;
      }
      const thisTarget = event.target || event.srcElement;
      const emojiName = thisTarget.getAttribute("name");
      this.$emit("emoji-selected", emojiName);
    },
    // 选中gif表情
    onGifSelected(groupName, item, event) {
      if (!this.hasAuth) {
        return;
      }
      this.$emit("gif-selected", groupName, item, event);
    },
    onAtUserClose(idx) {
      if (!this.hasAuth) {
        return;
      }
      this.$emit("at-user-close", idx);
    },
    onSendBtnClick() {
      if (!this.hasAuth) {
        return;
      }
      if (!this.canSpeak) {
        return;
      }
      // 判断是否上传的图片
      if (typeof this.msg === "object") {
        this.onImgToolChange();
        this.msg = "";
        return;
      }
      this.$emit("send-click");
    },
    initEmojiList() {
      let emojiList = RongYun.emoji.init();
      var tempDiv = document.createElement("div");
      for (var i = 0; i < emojiList.length; i++) {
        var value = emojiList[i];
        tempDiv.appendChild(value.node.cloneNode(true));
        this.emojiList.push(tempDiv.innerHTML);
        tempDiv.innerHTML = null;
      }
    },
  },
};
</script>

<style scoped="scoped" lang="less">
@imgSrc: "~@/assets/images/chat";
.chat-control .msg-in .input * {
  font-size: 14px !important;
  color: #333 !important;
  background: transparent !important;
}

.chat-control {
  position: relative;

  .face-body {
    background: #fff;
    border: 1px solid #eee;
    width: 350px;
    height: 210px;
    position: absolute;
    box-shadow: 1px 1px 6px #eee;
    z-index: 10;
    left: 0;
    top: -212px;
  }

  .chat-emoji-panel {
    color: #000;
    border-radius: 3px;
    padding: 5px;
    font-size: 0;
    overflow: auto;
    height: 180px;

    span {
      margin: 5px 5px;
      cursor: pointer;
      display: inline-block;
    }

    img {
      display: inline-block;
      width: 64px;
      height: 64px;
      margin: 8px;
      cursor: pointer;
    }
  }

  .chat-emoji-tab {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #eee;

    li {
      cursor: pointer;
      float: left;
      width: 35px;
      height: 30px;
      padding-top: 5px;
      line-height: 22px;
      text-align: center;

      &.selected {
        background-color: #fff;
      }
    }

    .icon-face {
      font-size: 24px;
      visibility: middle;
      cursor: pointer;
    }

    img {
      visibility: middle;
      cursor: pointer;
      margin: 0 5px;
      width: auto;
    }
  }

  .tool {
    background: #fff;
    color: #666666;
    height: 40px;
    line-height: 40px;
    border-top: 1px #e6e6e6 solid;
    font-size: 14px;

    .red {
      color: #ff3939;
    }

    .tool-gif {
      display: inline-block;
      width: 22px;
      height: 22px;
      vertical-align: middle;
      margin: 0 4px;
      cursor: pointer;
      background: url("@{imgSrc}/gif-gulid1.png");
    }

    .iconfont {
      font-size: 22px;
      margin-right: 5px;
      cursor: pointer;
      display: inline-block;
      height: 22px;
      vertical-align: middle;
      line-height: 22px;
    }

    .icon-img {
      position: relative;
      overflow: hidden;
      width: 22px;
      height: 22px;
      display: inline-block;
      vertical-align: middle;

      .file {
        position: absolute;
        font-size: 100px;
        right: 0;
        top: 0;
        cursor: pointer;
        opacity: 0;
      }
    }
  }

  .msg-in {
    position: relative;
    background: #eee;
    padding-right: 92px;

    .input {
      overflow: auto;
      border: 1px solid rgba(230, 230, 230, 0.3);
      border-radius: 2px;
      background: transparent;
      margin-right: 100px;
      height: 122px;
      font-size: 14px;
      width: auto;
      margin-right: 100px;
      padding: 10px;
      box-sizing: border-box;
      box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
      width: 100%;
      position: relative;
      z-index: 1;
    }

    .toUser-box {
      position: absolute;
      left: 10px;
      top: 10px;
    }

    .toUser {
      background: rgb(97, 159, 224);
      border-radius: 5px;
      color: #fff;
      padding: 0px 5px;
      font-size: 14px;
      display: inline-block;
      margin-right: 5px;
      margin-bottom: 5px;
      position: relative;
      z-index: 2;

      &:last-child {
        margin-right: 0;
      }

      .icon-close {
        cursor: pointer;
      }
    }

    .btn {
      height: 122px;
      line-height: 122px;
      text-align: center;
      background: #127dec;
      border: 1px solid #127dec;
      font-size: 14px;
      width: 92px;
      position: absolute;
      z-index: 3;
      right: 0;
      top: 0px;
      transition: 0.3s;
      border-radius: 2px;
      cursor: pointer;
      box-sizing: border-box;
      color: #fff;
    }

    .icon-send {
      font-size: 18px;
    }
  }
}
</style>
