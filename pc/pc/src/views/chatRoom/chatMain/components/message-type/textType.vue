<template>
  <section
    class="text-type"
    v-html="msg"
  ></section>
</template>

<script>
import * as RongYun from "@/utils/rongyun";

export default {
  name: "enterMessage",
  props: {
    message: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  computed: {
    msg() {
      return RongYun.emoji.emojiToHTML(this.$xss(this.message.content.content));
    }
  }
};
</script>

<style lang="less" scoped>
@vw: 7.5vw;
.text-type {
  white-space: pre-wrap;
}
</style>  
