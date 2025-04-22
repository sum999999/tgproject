
<template>
   <div class='advs-bg-wp'>
        <div class="advs-bg" :style="`background-image:url(${imgUrl})`"></div>
    </div>
</template>
    
<script>
export default {
    data() {
      return {
        imgUrl:''
      }
    },
    methods: {
      getHomeAdsImg() {
        this.$http
          .post('/api/v2/cms/indexBigAd', {}, { unenc: true })
          .then(response => {
            if (response.data.code !== 0) return
            if (response.data.data) {
              this.imgUrl = response.data.data.netUrl;
            }
            
        })
      },
    },
    created() {
      this.getHomeAdsImg();
    }
}
</script>

<style lang="less" scoped>
    .advs-bg-wp {
        height: 100%;
        position: relative;
       .advs-bg{ 
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 500px;
        background-image: url("/static/images/bg-banner.png");
        background-position: top;
        background-repeat: no-repeat;
        cursor: pointer;
        a {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
</style>