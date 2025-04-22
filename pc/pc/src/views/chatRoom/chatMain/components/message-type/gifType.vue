<template>
    <div class="msg-gif">
        <img
                @click="fullImage()"
                :id="`img-${message.sentTime}`"
                :src="message.content.remoteUrl"
                alt=""
        >
    </div>
</template>

<script>
  export default {
    name: "gifType",
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
    methods: {
      fullImage() {
        this.$emit("on-fullImage", this.message);
      }
    }
  };
</script>

<style>
</style>
