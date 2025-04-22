<template>
  <div class="home-notice">
    <img
      class="home-notice__icon"
      src="~@/assets/images-v8/home/notice.png"
    />
    <span class="home-notice__label">{{$tex("公告")}}:</span>
    <marquee
      v-if="notice"
      class="home-notice__marquee"
      scrolldelay="100"
      scrollamount="6"
    >
      <div
        class="home-notice__content"
        v-html="notice"
        @click="$router.push({path:'/newsList/announce'})"
      ></div>
    </marquee>
    <router-link
      class="home-notice__download"
      to="/phoneBuy"
    >
      <img
        class="animate__animated animate__tada animate__infinite"
        src="~@/assets/images-v8/home/download.png"
      >
    </router-link>
  </div>
</template>

<script>
import utils from '@/utils/utils'

export default {
  name: 'HomeNotice',
  data() {
    return {
      notice: '',
    }
  },
  created() {
    this.handleNotice()
  },
  methods: {
    handleNotice() {
      this.$store.dispatch('queryAnnounceEssayList', { current: 1, size: 100, type: '02' }).then((response) => {
        if (response.data.code !== 0) return
        let n = response.data.data.list
        let txt = ''
        n.forEach((item) => {
          txt += utils.escapeHtml(item.content)
        })
        this.notice = txt
      })
    },
  },
}
</script>

<style lang="less" scoped>
@deep: ~'>>>';
.home-notice {
  height: 36px;
  background: #212121;
  box-shadow: inset 0 0 16px 0 rgba(254, 209, 54, 0.5);
  border-radius: 9999px;
  display: flex;
  align-items: center;
  padding: 10px 20px;
  &__icon {
    width: 18px;
    height: 18px;
    display: inline-block;
  }
  &__label {
    flex-shrink: 0;
    margin: 0 10px;
  }
  &__marquee {
    height: 100%;
    line-height: 16px;
    flex: 1;
  }
  &__content {
    height: 100%;
    &:hover {
      cursor: pointer;
    }
    @{deep} {
      * {
        vertical-align: top;
        display: inline-block;
      }
      img {
        float: none;
        max-width: none !important;
        width: auto;
      }
    }
  }
  &__download {
    margin-left: 20px;
  }
}
</style>