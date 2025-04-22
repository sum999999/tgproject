<template>
  <div>
    <component :is="view" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
const phoneBuy = () => import(/* webpackChunkName: "phoneBuy" */ './phoneBuy')
const phoneBuy3 = () => import(/* webpackChunkName: "phoneBuy3" */ '@/views-v3/content/phoneBuy/phone_buy')
const phoneBuy4 = () => import(/* webpackChunkName: "phoneBuy4" */ '@/views-v4/content/phoneBuy/phone_buy')
const phoneBuy5 = () => import(/* webpackChunkName: "phoneBuy4" */ '@/views-v5/phoneBuy/phone_buy')
const phoneBuy6 = () => import(/* webpackChunkName: "phoneBuy6" */ '@/views-v6/phone-buy')
const phoneBuy7 = phoneBuy3
const phoneBuy8 = () => import(/* webpackChunkName: "phoneBuy8" */ '@/views-v8/phone-buy')
const phoneBuy9 = phoneBuy8
const phoneBuy10 = () => import(/* webpackChunkName: "phoneBuy10" */ '@/views-v10/phone-buy')
const phoneBuy11 = () => import(/* webpackChunkName: "phoneBuy11" */ '@/views-v11/phone-buy')

export default {
  components: {
    phoneBuy,
    phoneBuy2: phoneBuy,
    phoneBuy3,
    phoneBuy4,
    phoneBuy5,
    phoneBuy6,
    phoneBuy7,
    phoneBuy8,
    phoneBuy9,
    phoneBuy10,
    phoneBuy11,
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['pageTemplate']),
    view() {
      let verseion = this.pageTemplate.index || ''
      return 'phoneBuy' + verseion
    },
  },
}
</script>

<style>
</style>
