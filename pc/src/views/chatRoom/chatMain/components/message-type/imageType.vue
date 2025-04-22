<template>
  <div class="msg-img">
    <img
      @click="fullImage()"
      :id="`img-${message.sentTime}`"
      :src="imageUri"
      alt=""
    >
<!--    <img-->
<!--      v-else-->
<!--      @click="fullImage()"-->
<!--      :src="message.content.imageUri"-->
<!--      :id="`img-${message.sentTime}`"-->
<!--      alt=""-->
<!--    >-->
  </div>
</template>

<script>
  import Util from '@/utils/utils';

export default {
  props: {
    message: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    imageUri() {
      const base64Content = this.message.content && this.message.content.content;
      const imageUri = this.message.content && this.message.content.imageUri;
      if (base64Content && !Util.validDataUrl(base64Content)) {
        return Util.joinBase64Head(Util.getMimeTypeByUrl(imageUri), base64Content)
      }
      return imageUri
    }
  },
  methods: {
    fullImage() {
      this.$emit("on-fullImage", this.message);
    }
  }
};
</script>

<style>
</style>
