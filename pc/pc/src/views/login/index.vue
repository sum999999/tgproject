<template>
  <div>
    <component :is="view" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Util from "@/utils/utils";
const login = () => import(/* webpackChunkName: "login" */ '@/views/login/login')
const login2 = () => import(/* webpackChunkName: "login2" */ '@/views-v2/content/login/login')
const login3 = () => import(/* webpackChunkName: "login3" */ '@/views-v3/content/login/login')
const login4 = () => import(/* webpackChunkName: "login4" */ '@/views-v4/content/login/login')
const login5 = () => import(/* webpackChunkName: "login4" */ '@/views-v5/login/login')
const login6 = () => import(/* webpackChunkName: "login4" */ '@/views-v6/login')
const login7 = login3
const login8 = () => import(/* webpackChunkName: "login8" */ '@/views-v8/login')
const login9 = login8
const login10 = () => import(/* webpackChunkName: "login10" */ '@/views-v10/login')
const login11 = () => import(/* webpackChunkName: "login10" */ '@/views-v11/login')

export default {
  components: {
    login,
    login2,
    login3,
    login4,
    login5,
    login6,
    login7,
    login8,
    login9,
    login10,
    login11,
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['pageTemplate']),
    view() {
      let verseion = this.pageTemplate.index || ''
      return 'login' + verseion
    },
  },
}
</script>
