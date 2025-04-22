<template>
  <div
    class="active-detail-page"
    :class="{
    'active-page--v6': isInternational
    }"
    v-loading="loading"
    v-html='content'
  >
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import util from '@/utils/utils'

export default {
  name: 'ActiveDetailPage',
  data() {
    return {
      loading: true,
      content: '',
    }
  },
  computed: {
    ...mapGetters(['isInternational']),
  },
  created() {
    this.showActityDetail(this.$route.params.id)
  },
  methods: {
    showActityDetail(resourceId) {
      this.loading = true
      this.$http.post('/api/v2/cms/queryDiscountActivityById', { resourceId }, { unenc: true }).then((response) => {
        if (response.data.code !== 0) {
          return
        } else {
          this.content = util.escapeHtml(response.data.data.content)
        }
        this.loading = false
      })
    },
  },
}
</script>

<style scoped lang="less">
.active-detail-page {
  width: 1000px;
  margin: 0 auto;
  background-color: #fff;
  margin-inline-start: auto;
  margin-inline-end: auto;
  padding: 10px;
  margin-top: 10px;
  min-height: 800px;
}
</style>