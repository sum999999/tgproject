<template>
  <div
    class="active-page"
    ref="content"
    v-loading="loading"
  >
    <div class="active-page__mask"></div>
    <div class="content">
      <ul
        class="active-tab clearfix"
        v-show="!$configText.closeActiveTabs"
      >
        <li
          v-for="(item, idx) in activeTab"
          :key="idx"
          :class="{active: curActiveIndex === idx}"
          @click="onActiveTabClick(idx, item.code)"
        >
          <div class="active-tab__content">{{item.typeName}}</div>
        </li>
      </ul>
      <ul class="active-list">
        <li
          ref="activeItem"
          v-for="(item, idx) in list"
          :key="idx"
        >
          <a
            class='img-wrapper'
            v-if='item.contentType === -1'
          >
            <a
              class="link"
              :href='item.targetUrl'
            ><img :src="item.netUrl+'?imageView2/1/w/1000/h/178'"></a>
            <div class="active-list__desc">
              <p>{{ item.name }}</p>
              <span>{{ $tex('更多') }}</span>
            </div>
          </a>
          <a
            class='img-wrapper'
            v-else
            @click='showActityDetail(item,idx)'
          >
            <a class="link"><img :src="item.netUrl+'?imageView2/1/w/1000/h/178'"></a>
            <div class="active-list__desc">
              <p>{{ item.name }}</p>
              <span>{{ $tex('更多') }}</span>
            </div>
          </a>
          <div
            class='item-detail-wrapper'
            v-show='item.detailContent&&showDetail===idx'
          >
            <div
              class='item-detail'
              :class="{active:showDetail===idx}"
              v-html='item.detailContent'
            ></div>
          </div>
        </li>
      </ul>
      <page
        class="active-page2"
        :total="paramData.total"
        :currentPage="paramData.current"
        :pageSize="paramData.size"
        @get-Page-Data="getData"
        v-show="isShowPage"
      ></page>
    </div>
  </div>
</template>

<script>
import util from '@/utils/utils'
import page from '@/components/page.vue'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      list: [],
      allList: [],
      showDetail: '', //是否显示活动详情
      resourceId: '',
      paramData: {
        current: 1,
        size: 30,
        frontType: 'pc',
      },
      loading: false,
      curActiveIndex: 0,
      isShowPage: true,
    }
  },
  computed: {
    ...mapGetters(['cmsCurDiscounts']),
    user() {
      return this.$store.state.user
    },
    activeTab() {
      if (this.cmsCurDiscounts) {
        return [{ code: '', sort: '-1', typeName: this.$tex('全部') }, ...this.cmsCurDiscounts]
      }
      return [{ code: '', sort: '-1', typeName: this.$tex('全部') }]
    },
  },
  watch: {
    $route() {
      this.getData(1)
    },
    curActiveIndex(index) {
      if (index != 0) {
        this.isShowPage = false
      } else {
        this.isShowPage = true
      }
    },
  },
  components: { page },
  created() {
    this.getData(1)
    this.$store.dispatch('queryDiscountInternational')
  },
  mounted() {
    this.activeTabHandler()
    let vm = this
    // 领取活动交互
    window.confirmActivityPrize = function (params) {
      vm.$http
        .post('/api/v2/cms/confirmActivityPrize', { availableId: `${params}` }, { userId: true })
        .then((response) => {
          if (response.data.code !== 0) return
          vm.$Message.success(vm.$tex('领取成功'))
          vm.user.balance = response.data.data.balance
          localStorage.setItem('user', JSON.stringify(vm.user))
          vm.$store.commit('getUser', vm.user)
          vm.showActityDetail(vm.resourceId, vm.showDetail, true)
        })
    }
  },
  methods: {
    onActiveTabClick(index, type) {
      console.log(index)
      if (this.curActiveIndex === index) {
        return
      }
      this.curActiveIndex = index
      if (!type) {
        return (this.list = [...this.allList])
      }
      const result = []
      for (let key in this.allList) {
        const active = this.allList[key]
        const { platType } = active || {}
        if (platType.split(',').indexOf(type) !== -1) {
          result.push(active)
        }
      }
      this.list = [...result]
    },
    async activeTabHandler() {
      let gameLists = [],
        GAME_SWITCH,
        GAME_LIST
      const data = await this.$store.dispatch('querySystemConfig')
      GAME_SWITCH = data['GAME_SWITCH']
      gameLists = data['lotCcGameTypeConfig']
      if (gameLists) {
        GAME_LIST = JSON.parse(gameLists).filter((item) => item.status === '1')
      }

      if (GAME_LIST) {
        // GAME_LIST.unshift({code: "LOTTERY",  sort: "0", typeName: "彩票"})
        GAME_LIST.unshift({ code: '', sort: '-1', typeName: this.$tex('全部') })
        // GAME_LIST = sortBy(GAME_LIST, function(o) { return o.sort; });
        for (let key in GAME_LIST) {
          const item = GAME_LIST[key]
          // this.activeTab.push({
          //   key: item.code,
          //   value: item.typeName,
          // });
        }
      }
    },
    switch2CurTabContent() {
      const tab = this.activeTab[this.curActiveIndex] || {}
      const type = tab.code
      if (!type) {
        return (this.list = [...this.allList])
      }
      const result = []
      for (let key in this.allList) {
        const active = this.allList[key]
        const { platType } = active || {}

        if (platType.split(',').indexOf(type) !== -1) {
          result.push(active)
        }
      }
      this.list = [...result]
    },
    getData(page) {
      let resourceId = this.$route.query.resourceId
      let vm = this
      this.loading = true
      this.paramData.current = page
      this.$parent.offsetY = 0
      this.$http
        .post('/api/v2/cms/queryDiscountActivityList', this.paramData, {
          unenc: true,
        })
        .then((response) => {
          this.loading = false
          if (response.data.code !== 0) return
          this.allList = this.list = response.data.data.list
          this.paramData.total = response.data.data.total
          this.switch2CurTabContent()
          //点击其它页面的海报进来的
          if (resourceId) {
            this.list.forEach((itm, idx) => {
              if (itm.resourceId === resourceId) {
                this.showActityDetail(itm, idx, false, true)
              }
            })
          }
        })
    },
    getElementTop(el) {
      var actualTop = el.offsetTop
      var current = el.offsetParent
      while (current !== null) {
        actualTop += current.offsetTop
        current = current.offsetParent
      }
      return actualTop
    },
    scrollToContent(idx) {
      const activeEle = this.$refs['activeItem'][idx]
      this.$nextTick(() => {
        const height = this.getElementTop(activeEle)
        window.scrollTo(0, height)
      })
    },
    setScrollTop() {
      var scrollTop = 0
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop
      } else if (document.body) {
        scrollTop = document.body.scrollTop
      }
      return scrollTop
    },
    showActityDetail(item, idx, again = false, scrolled) {
      if (this.showDetail === idx && !again) {
        this.showDetail = ''
        return
      }
      this.showDetail = idx
      this.resourceId = item
      if (item.detailContent) {
        if (scrolled) {
          this.scrollToContent(idx)
        }
        return //如果请求过内容了就不在请求
      }
      this.$http
        .post('/api/v2/cms/queryDiscountActivityById', { resourceId: item.resourceId }, { unenc: true })
        .then((response) => {
          if (response.data.code !== 0) return
          this.$set(this.list[idx], 'detailContent', util.escapeHtml(response.data.data.content))
          if (scrolled) {
            this.scrollToContent(idx)
          }
        })
    },
    // showActityDetailWrapper (item, idx) {
    //   if (this.showDetail === idx) {
    //     this.showDetail = '';
    //     return
    //   }
    //   this.showDetail = idx;
    //   this.showActityDetail(item, idx);
    // }
  },
}
</script>

<style scoped lang="less">
.active-tab {
  margin: 30px 0px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  li {
    padding: 5px 20px;
    margin: 0 10px;
    color: #ffffff;
  }
  li.active {
    position: relative;
    .active-tab__content {
      color: #ffd427 !important;
    }
    &::after {
      position: absolute;
      bottom: -4px;
      content: '';
      display: inline-block;
      width: 100%;
      height: 2px;
      background: #ffd427;
      left: 0;
    }
  }
}
.active-tab__content {
  cursor: pointer;
  background: transparent !important;
  font-family: PingFang-SC-Bold;
  font-size: 16px;

  letter-spacing: 0;
  line-height: 19px;
}
.active-page {
  margin: 0 auto;
  position: relative;
  &__mask {
    position: absolute;
    width: 100%;
    height: 1360px;
    background: url('~@/assets/images-v8/home/bg.png') no-repeat;
    background-size: cover;
    top: 0;
    background-position: center top;
    filter: brightness(0.4);
    transform: scale(1.05);
  }
}
.content {
  z-index: 1;
  position: relative;
}

.active-page-height {
  height: 26px;
}
.active-page .title {
  width: 1000px;
  height: 89px;
  margin: 0 auto;
  position: relative;
  h1 {
    position: absolute;
    left: 46%;
    top: 0;
    color: #c1c1c1;
  }
}
.active-page .title img {
  width: 100%;
  // height: 1000px;
}
.active-page .active-list {
  width: 1000px;
  margin: 0 auto;
  margin-top: 10px;
  &__desc {
    display: flex;
    padding: 20px;
    > p {
      width: 100%;
      font-family: PingFang-SC-Medium;
      font-size: 18px;
      color: #fffffe;
      letter-spacing: 0;
      line-height: 16px;
      word-break: break-all;
    }
    > span {
      flex-shrink: 0;
      font-family: PingFang-SC-Medium;
      font-size: 18px;
      color: #ffd427;
      letter-spacing: 0;
      line-height: 16px;
    }
  }
}
.active-page .active-list li {
  margin-bottom: 26px;
  background: #323232;
  box-shadow: inset 0 1px 0 0 #978853, inset 0 0 16px 0 rgba(254, 209, 54, 0.18);
  border-radius: 10px;
  overflow: hidden;
}
.active-page .active-list li .link {
  display: block;
  position: relative;
  width: 1000px;
  margin: 0 auto;
  height: 178px;
}
.item-detail-wrapper {
  background-color: #fff;
}
.item-detail {
  .active {
    margin-inline-start: auto;
    margin-inline-end: auto;
  }
}
.active-page .active-list li .link img {
  top: 50%;
  left: 50%;
  display: block;
  width: 1000px;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}
.active-page li .active {
  /* border: 1px solid @common-border-color; */
}
.active-page .item-detail {
  padding: 20px 30px;
  line-height: 27px;
}
</style>

<style lang="less">
.active-page img {
  float: none;
  max-width: 100%;
  width: inherit;
}
.active-page2 {
  margin-bottom: 20px;
}
</style>
