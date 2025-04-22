<template>
  <div>
    <template v-if="loadeEmojiPanel">
      <div class="face-body" v-show="showEmojiPanel">
        <div class="chat-emoji-panel nice-scroll" @click.stop>
          <div class="item" v-show="fontEmojiShow">
            <span
              :name="item.symbol"
              @click.stop="chooseEmoji($event)"
              v-html="item"
              v-for="(item, index) in emojiList"
              :key="index"
            >
            </span>
          </div>
          <div
            v-for="(groups, index) in gifConfig.groups"
            v-show="index == gifPanelIndex"
            class="item"
            :key="groups.groupName"
          >
            <img
              :src="`${gifConfig.staticSrc}${groups.groupName}/${item.src}`"
              @click.stop="sendEmojiMessage(groups.groupName, item, $event)"
              v-for="(item, idx) in groups.list"
              :key="idx"
              alt=""
            />
          </div>
        </div>

        <ul class="chat-emoji-tab clearfix" @click.stop>
          <li
            :class="{ selected: fontEmojiShow }"
            v-if="showFontEmjoyGuild"
            @click.stop="onShowFontEmjoyPanel"
          >
            <i class="iconfont icon-face"></i>
          </li>
          <li
            v-for="(item, index) in gifConfig.groups"
            :key="index"
            :class="{ selected: index == gifPanelIndex }"
            @click.stop="onShowGifPanel(index)"
          >
            <img :src="item.groupImg" :key="item.groupName" />
          </li>
        </ul>
      </div>
    </template>

    <div class="tool">
      <!--  发红包 -->
      <redPacket
        ref="redPacket"
        :joinRoomSuccess="joinRoomSuccess"
        v-show="isShowRedpacket"
        @sendRedPacketMessage="sendRedPacketMessage"
      ></redPacket>
      <i class="iconfont icon-face" @click.stop="onShowEmjoyPanel"></i>
      <i class="iconfont icon-img">
        <input
          class="file"
          type="file"
          multiple="multiple"
          @click="clkFile"
          accept="image/png,image/gif,image/jpeg"
          @change="sendImgMessage($event)"
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
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import * as RongYun from "@/utils/rongyun";
import { UserTypes } from "@/constant/user";
import utils from "@/utils/utils";
import { imgFileCP2Blob } from "@/utils/img";

import redPacket from "../components/redPacket.vue";

export default {
  props: {
    isCanSpeak: {
      default: false,
      type: Boolean,
    },
    dropMsg: {
      default: {},
    },
  },
  components: {
    redPacket,
  },
  data() {
    return {
      emojiList: [],
      gifConfig: RongYun.getGifConfig(),
      fontEmojiShow: true,
      showEmojiPanel: false,
      gifShow: false, //显示gif
      gifPanelIndex: -1, //显示gif表情列表
      loadeEmojiPanel: false, //加载表情面板
      showFontEmjoyGuild: false, // 显示普通表情入口
      forbidRedpackt: false, // 是否显示红包
      joinRoomSuccess: true,
    };
  },
  computed: {
    ...mapGetters(["user", "chatPeopleData"]),
    isShowRedpacket() {
      return this.isManagerChat;
    },
    isManagerChat() {
      return this.chatPeopleData.isAdmin === "1";
    },
  },
  created() {
    let emojiList = RongYun.emoji.init();
    var tempDiv = document.createElement("div");
    for (var i = 0; i < emojiList.length; i++) {
      var value = emojiList[i];
      tempDiv.appendChild(value.node.cloneNode(true));
      this.emojiList.push(tempDiv.innerHTML);
      tempDiv.innerHTML = null;
    }
  },
  mounted() {
    window.addEventListener("click", () => {
      this.showEmojiPanel = false;
      this.gifShow = false;
    });
  },
  methods: {
    onShowEmjoyPanel() {
      if (!this.isCanSpeak) return;
      this.loadeEmojiPanel = true;
      this.showEmojiPanel = true;
      // 可发言
      this.showFontEmjoyGuild = true; // 普通表情入口显示
      this.fontEmojiShow = true;
      this.showEmojiPanel = true;
      this.gifPanelIndex = -1;
      /*      if (this.user.userCode) {
        if (this.user.userType === UserTypes.TRY_PLAY) {
          // 试玩账号
          this.showEmojiPanel = true;
          this.gifPanelIndex = 0;
          this.showFontEmjoyGuild = true; // 普通表情入口显示
        } else {
        }
      } else {
        // 游客
        this.gifPanelIndex = 0;
        this.showEmojiPanel = true;
        this.fontEmojiShow = false;
        this.showFontEmjoyGuild = false;
      } */
    },
    clkFile() {
      if (!this.isCanSpeak) {
        event.preventDefault();
      }
    },
    /*
     *  @显示gif表情
     */
    onShowGifPanel(index) {
      this.gifPanelIndex = index;
      // this.showFontEmjoyGuild = false;
      this.fontEmojiShow = false;
    },
    /*
     *  @显示普通表情
     */
    onShowFontEmjoyPanel() {
      this.fontEmojiShow = true;
      this.gifPanelIndex = -1;
    },
    sendEmojiMessage(groupName, item) {
      if (!this.isCanSpeak) return;
      this.$emit("on-sendEmojiMessage", groupName, item);
    },
    async sendImgMessage(event) {
      if (!this.isCanSpeak) return;
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
      this.$emit("on-dropMsg");
      this.$emit("on-sendImgMessage", retFiles);
    },
    chooseEmoji() {
      var thisTarget = event.target || event.srcElement;
      var emojiName = thisTarget.getAttribute("name");
      if (emojiName) {
        this.$emit("on-setMsg", emojiName);
      }
    },
    sendRedPacketMessage(message) {
      if (!this.isCanSpeak) return;
      this.$emit("on-sendRedPacketMessage", message);
    },
  },
};
</script>

<style></style>
