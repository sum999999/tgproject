<template>
  <div class="v8-layout container-fluid">
    <base-header v-if="showHead"></base-header>
    <base-nav v-if="showHead"></base-nav>
    <router-view />
    <base-footer v-if="showFooter"></base-footer>
    <slide-quick />
  </div>
</template>

<script>
import BaseHeader from './components/BaseHeader'
import BaseNav from './components/BaseNav'
import BaseFooter from './components/BaseFooter'
import { mapGetters } from 'vuex'
import SlideQuick from '@/views-v10/layout/SlideQuick.vue'

export default {
  name: 'layout10',
  components: {
    BaseHeader,
    BaseNav,
    BaseFooter,
    SlideQuick,
  },
  props: {
    showHead: {
      type: Boolean,
      default: false,
    },
    showFooter: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(['user', 'isInternational']),
  },
  watch: {
    // user: {
    //   deep: true,
    //   immediate: true,
    //   handler(newUser = {}, oldUser = {}) {
    //     if (newUser.userId && newUser.userId !== oldUser.userId) {
    //       this.handleExChangeRate()
    //     }
    //   }
    // }
  },
  mounted() {
    this.handleExChangeRate()
    this.$store.dispatch('queryLanguageConfig')
  },
  methods: {
    handleExChangeRate() {
      this.isInternational && this.$store.dispatch('querySysExChangeInfo')
    },
  },
}
</script>

<style lang="less">
@import '~@/styles/theme/components/v10-layout-theme-dark.less';
</style>


