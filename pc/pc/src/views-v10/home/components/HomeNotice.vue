<template>
  <div class="home-notice">
    <img
      class="home-notice__icon"
      src="~@/assets/images-v10/home/announcement_icon_1.png"
    />
    <span class="home-notice__label font-black">{{$tex("公告")}}:</span>
    <marquee
      v-if="notice"
      class="home-notice__marquee"
      scrolldelay="100"
      scrollamount="6"
    >
      <div
        class="home-notice__content font-medium "
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
        src="~@/assets/images-v10/home/announcement_icon_2.png"
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
  background: #b2ddff;
  background-image: linear-gradient(0deg, #f0f7ff 0%, #ffffff 100%);
  border: 1px solid #d1d4f6;
  box-shadow: 0 2px 6px 0 rgba(198, 211, 243, 0.8);
  border-radius: 9999px;
  display: flex;
  align-items: center;
  padding: 0 20px;
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
    display: flex;
    align-items: center;
    height: 100%;
    line-height: 16px;
    flex: 1;
  }
  &__content {
    display: flex;
    align-items: center;
    height: 100%;
    &:hover {
      cursor: pointer;
    }
    @{deep} {
      * {
        vertical-align: top;
        display: inline-block;
        text-wrap: nowrap !important;
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