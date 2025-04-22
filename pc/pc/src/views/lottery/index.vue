<template>
  <div>
    <component :is="view" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
const lottery = () => import(/* webpackChunkName: "lottery" */ '@/views/lottery/lottery')
const lottery2 = () => import(/* webpackChunkName: "lottery2" */ '@/views-v2/content/lottery/lottery')
const lottery3 = () => import(/* webpackChunkName: "lottery3" */ '@/views-v3/content/lottery/lottery')
const lottery4 = () => import(/* webpackChunkName: "lottery4" */ '@/views/lottery/lottery')
const lottery5 = () => import(/* webpackChunkName: "lottery4" */ '@/views-v5/lottery/lottery')
const lottery6 = lottery3
const lottery7 = lottery3
const lottery8 = lottery3
const lottery9 = lottery3
const lottery10 = () => import(/* webpackChunkName: "lottery10" */ '@/views/lottery/lottery')
const lottery11 = lottery10

export default {
  components: {
    lottery,
    lottery2,
    lottery3,
    lottery4,
    lottery5,
    lottery6,
    lottery7,
    lottery8,
    lottery9,
    lottery10,
    lottery11,
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['pageTemplate']),
    view() {
      let verseion = this.pageTemplate.index || ''
      return 'lottery' + verseion
    },
  },
}
</script>


<style lang="less">
</style>
