<template>
  <div class="notice lee-notice rf">
    <div class="rq">
      <div class="rq-abel">
        <p
          @mouseenter="clientType = 1"
          :class="{active: clientType === 1}"
        >
          <Icon
            type="social-android"
            class="plat-logo"
          />
          <!--  <i
            class="i-icon"
            :class="{'i-android-red': clientType === 1, 'i-android-gray': clientType !== 1}"
          ></i> -->
          <span>安<br />卓</span>
        </p>
        <p
          @mouseenter="clientType = 0"
          :class="{active: clientType === 0}"
        >
          <Icon
            type="social-apple"
            class="plat-logo"
          />
          <!--   <i
            class="i-icon"
            :class="{'i-ios-red': clientType === 0, 'i-ios-gray': clientType !== 0}"
          ></i> -->
          <span>苹<br />果</span>
        </p>
      </div>
      <div class="rq-img-txt">
        <div
          class="img-wrapper"
          v-if="qrcodes.length"
        >
          <img :src="qrcodes[clientType].img">
          <i><img
              class="w-full"
              :src="'/static/images/'+qrcodes[clientType].icon + '.png'"
              alt=""
            ></i>
        </div>
        <div class="txt">
          扫描二维码<br /> 下载客户端
          <span>轻松中大奖</span>
        </div>
      </div>
      <p class="clr"></p>
    </div>
    <div class="guidance">
      <div class="tab">
        <h5
          @click="getList('notice', '01')"
          :class="{active: guidanceType === 'notice'}"
        >{{ $tex("网站公告") }}</h5>
        <h5
          @click="getList('guidance', '04')"
          :class="{active: guidanceType === 'guidance'}"
        >新手指导</h5>
      </div>
      <ul>
        <li
          v-for="(item, idx) in noticeList"
          :key="idx"
        >
          <span>
            <i class="i-icon i-small-box"></i>
          </span>&nbsp;
          <a
            v-if="idx===0"
            @click.prevent="goPath(item.jumpUrl,'/newsList/announce')"
          >{{item.title}}</a>
          <a
            v-else
            @click.prevent="goPath(item.jumpUrl,'/newsList/guide')"
          >{{item.title}}</a>
          <!-- <router-link v-else :to="item.jumpUrl">{{item.title}}</router-link> -->

        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      clientType: 0,
      noticeList: [], // 公告列表
      guidanceType: '',
    }
  },
  computed: {
    // 获取二维码
    qrcodes() {
      return this.$store.state.qrcodes
    },
  },
  methods: {
    goPath(path, typePath) {
      this.$router.push(path)
      sessionStorage.setItem('newsView', typePath)
    },
    // 获取公告列表
    getList(type, sign) {
      let vm = this
      if (this.guidanceType === type) return

      this.guidanceType = type
      if (type === 'guidance') {
        this.$http.post('/api/v2/cms/queryAdvisoryEssayList', { type: sign }, { unenc: true }).then((response) => {
          $('.lee-notice')[0].style.opacity = 1
          if (response.data.code !== 0) return
          this.noticeList = response.data.data.list.slice(0, 4)
          this.noticeList.forEach((item, index) => {
            vm.$set(item, 'jumpUrl', `/newsDetail/${item.essayId}?type=guide`)
          })
        })
      } else {
        this.$store.dispatch('queryAnnounceEssayList', { type: sign }).then((response) => {
          $('.lee-notice')[0].style.opacity = 1
          if (response.data.code !== 0) return
          this.noticeList = response.data.data.list.slice(0, 4)
          this.noticeList.forEach((item) => {
            // console.log(item);
            vm.$set(item, 'jumpUrl', `/newsDetail/${item.essayId}?type=announce`)
          })
        })
      }
    },
  },
  created() {
    this.getList('notice', '01')
  },
}
</script>

<style lang="less" scoped>
.lee-notice {
  opacity: 0;
  transition: 1.2s;
}
.notice {
  width: 250px;
}
.notice .rq {
  width: 100%;
  height: 120px;
}
.notice .rq > div {
  float: left;
}
.notice .rq .rq-abel {
  width: 35px;
  text-align: center;
  font-size: 12px;
  color: #666;
  height: 100%;
  cursor: pointer;
}
.notice .rq .rq-abel .plat-logo {
  font-size: 20px;
  display: block;
}
.notice .rq .rq-abel p {
  padding-top: 3px;
  height: 50%;
  text-align: center;
  /*  border: 1px solid @home-component-border; */
  line-height: 14px;
}
.notice .rq-abel p:last-child {
  border-top-color: #fff;
}
.notice .rq .rq-abel p.active {
  /*   border-color: @primary-color;
  color: @primary-color; */
}
.notice .rq-img-txt {
  width: 215px;
  /*   border: 1px solid @home-component-border; */
  border-left: 0;
  height: 100%;
}
.notice .rq-img-txt .img-wrapper {
  width: 90px;
  height: 90px;
  position: relative;
  margin: 15px 0 0 15px;
  float: left;
}
.notice .rq-img-txt .img-wrapper > img {
  float: left;
  height: 90px;
  width: 90px;
}
.notice .rq-img-txt .img-wrapper i {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 35px;
  padding: 2px;
  background: #fff;
  border-radius: 2px;
}
.notice .rq-img-txt .txt {
  float: left;
  width: 109px;
  font-size: 14px;
  margin-top: 20px;
  text-align: center;
  overflow: hidden;
}
.notice .rq-img-txt .txt span {
  /*   color: @primary-color; */
  display: block;
  margin-top: 7px;
}
.notice .guidance {
  width: 100%;
  margin-top: 14px;
  /*  border: 1px solid @home-component-border; */
  padding: 10px 10px 0;
  height: 142px;
}
.notice .guidance .tab {
  height: 25px;
  line-height: 15px;
  text-align: center;
  font-size: 14px;
  /*   border-bottom: 1px solid @home-component-border; */
  margin-bottom: 10px;
}
.notice .guidance .tab h5 {
  height: 100%;
  float: left;
  width: 50%;
  font-weight: normal;
  cursor: pointer;
  font-size: 14px;
}
.notice .guidance h5.active {
  /*  color: @primary-color;
  border-bottom: 2px solid @primary-color; */
}
.notice .guidance li {
  font-size: 12px;
  height: 22px;
  line-height: 22px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.notice .guidance li a {
  color: #333;
}
.notice .guidance li a:hover {
  /*   color: @primary-color; */
}
.notice .guidance li i {
  margin-top: 9px;
  float: left;
}
</style>

