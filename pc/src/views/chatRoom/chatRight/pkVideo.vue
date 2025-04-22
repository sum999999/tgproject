<template>
  <div>
    <div class="iframe-shadow"></div>
    <iframe id="sp"
            scrolling="no"
            frameborder="0"
            style="display: block; width: 448px; height: 289.032px;"
            src="//kj.kai861.com/view/video/PK10/video.html?10001"></iframe>
  </div>
</template>
<script>
export default {}
</script>
<style lang="less" scoped>
.iframe-shadow {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  height: 300px;
  z-index: 10;
  width: 100%;
}
</style>