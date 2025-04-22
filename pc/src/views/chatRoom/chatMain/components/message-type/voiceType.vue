<template>
  <!-- 声音 -->
  <div
    class="msg-voice"
    @click="playVoice()"
  >
    <span class="iconfont icon-voice"></span>{{message.content.duration}}s
  </div>
</template>
<script>
export default {
  props: {
    message: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },

  methods: {
    playVoice(item) {
      // 预加载
      if (this.playState) {
        RongIMLib.RongIMVoice.stop(this.message.content.content, this.message.content.duration);
        this.playState = false;
        return;
      }
      RongIMLib.RongIMVoice.preLoaded(this.message.content.content, infio => {
        // 播放声音
        RongIMLib.RongIMVoice.play(this.message.content.content, this.message.content.duration);
        this.playState = true;
      });
    }
  }
};
</script>

<style>
</style>
