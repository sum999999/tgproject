export default {
    data () {
      return {
        slideArrow: false,
        current: 0,
        list: [],
        curListIndex: 0
      }
    },
    methods: {
      changeSwipe (newIndex) {
        this.current = newIndex;
      },
      next () {
        if (this.current === this.list.length - 1) return;
        this.$refs.mySwipe.next();
      },
      prev () {
        if (this.current === 0) return;
        this.$refs.mySwipe.prev();
      },
      goPage (url, resourceId) {
        if (url) {
          url = url.trim()
          if (url.indexOf('http') !== -1) {
            window.open(url)
          } else {
            this.$store.commit('getResourceId', resourceId)
            this.$router.push({ path: url })
          }
        }
      }
    },
    created () {
      this.$http.post('/api/v2/cms/queryBanners', { frontType: 'pc' }, { unenc: true }).then(response => {
        if (response.data.code !== 0) return;
        this.list = response.data.data || [];
      })
    }
  }
