<template>
  <div>
    <component :is="view" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Util from "@/utils/utils";
const register = () => import(/* webpackChunkName: "register" */ './register.vue')
const register2 = () => import(/* webpackChunkName: "register2" */ '@/views-v2/content/register/register')
const register3 = () => import(/* webpackChunkName: "register3" */ '@/views-v3/content/register/register.vue')
const register4 = () => import(/* webpackChunkName: "register4" */ '@/views-v4/content/register/register.vue')
const register5 = () => import(/* webpackChunkName: "register5" */ './register.vue')
const register6 = () => import(/* webpackChunkName: "register6" */ '@/views-v6/register')
const register7 = register3
const register8 = () => import(/* webpackChunkName: "register8" */ '@/views-v8/register')
const register9 = register8
const register10 = () => import(/* webpackChunkName: "register10" */ '@/views-v10/register')
const register11 = () => import(/* webpackChunkName: "register10" */ '@/views-v11/register')

export default {
  components: {
    register,
    register2,
    register3,
    register4,
    register5,
    register6,
    register7,
    register8,
    register9,
    register10,
    register11,
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['pageTemplate']),
    view() {
      let verseion = this.pageTemplate.index || ''
      return 'register' + verseion
    },
  },
}
</script>

<style>
</style>
