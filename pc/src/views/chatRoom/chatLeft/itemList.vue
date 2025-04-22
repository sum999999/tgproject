<template>
  <li>
    <img
      class="img"
      :src="portrait ||defHdImg"
      alt=""
    >
    <div
      class="cont"
      :class="{noMsg:!text}"
    >
      <div class="name-wrap">
        <span class="name">{{name}}</span>
        <img
          v-if="sendUserLevelIcon"
          class="lv"
          :src="sendUserLevelIcon"
          alt=""
        >
      </div>
      <p
        class="text"
        v-html="text"
      ></p>
    </div>
    <i
      class="unReadCount"
      v-if="unreadMessageCount"
    >
      {{unreadMessageCount | filterUnRead}}
    </i>
    <i
      v-show="showDelBtn"
      class="iconfont icon-close"
      @click.stop="onDelete"
    ></i>
  </li>
</template>

<script>
export default {
  props: {
    portrait: "",
    name: "",
    text: "",
    unreadMessageCount: "",
    sendUserLevelIcon: "",
    showDelBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      defHdImg: "/static/images/chat/chat_def_hd.png"
    };
  },
  filters: {
    filterUnRead(v) {
      if (v > 99) return "99+";
      return v;
    }
  },
  methods: {
    onDelete() {
      this.$emit("on-delete");
    }
  }
};
</script>

<style lang="less" scoped>
li {
  list-style-type: none;
  width: 260px;
  padding: 14px 10px;
  transition: 0.3s;
  color: #ddd;
  cursor: pointer;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0);
  padding-left: 56px;
  position: relative;
  &:hover {
    background: rgba(0, 0, 0, 0.2);
    .icon-close {
      display: block;
    }
  }
  &.selected {
    background: rgba(0, 0, 0, 0.2);
  }
  .img {
    position: absolute;
    left: 8px;
    top: 16px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    vertical-align: middle;
  }
  .cont {
    width: 100%;
    &.noMsg {
      .name-wrap {
        line-height: 40px;
        height: 40px;
      }
    }
    .name {
      font-size: 14px;
      display: inline-block;
      vertical-align: middle;
      white-space: nowrap;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
    }
    .text {
      white-space: nowrap;
      width: 180px;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      height: 21px;
    }
    .lv {
      position: absolute;
      right: 10px;
      top: 30px;
      max-width: 70px;
      max-height: 30px;
      transform: translateY(-50%);
    }
  }
  .unReadCount {
    position: absolute;
    right: 8px;
    bottom: 10px;
    background-color: #ec0022;
    width: 20px;
    height: 20px;
    line-height: 20px;
    border-radius: 100%;
    text-align: center;
    font-size: 12px;
  }
  .icon-close {
    position: absolute;
    right: 8px;
    top: -5px;
    color: #ec0022;
    font-size: 20px;
    cursor: pointer;
    display: none;
  }
}
</style>
