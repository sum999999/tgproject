<template>
  <div class="msg-emoji">
    <img
      :id="`img-${message.sentTime}`"
      :src="imageUri"
      alt=""
    >
  </div>
</template>

<script>
import * as RongYun from "@/utils/rongyun";
const gifConfig = RongYun.getGifConfig();
export default {
  props: {
    message: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },

  computed: {
    imageUri() {
      let { extra } = this.message.content;
      if (typeof extra === "string") {
        extra = JSON.parse(extra);
      }
      return gifConfig.staticSrc + extra.groupName + "/" + extra.emojiName;
    }
  },
  methods: {}
};
</script>

<style>
</style>
