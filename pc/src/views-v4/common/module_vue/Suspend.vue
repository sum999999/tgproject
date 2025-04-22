<template>
  <div
    id="sideChatRight"
    class="float-box float-box-right"
    picfloat="right"
  >
    <div>
      <ul>
        <li class="box-service"><a
            href="javascript:void(0)"
            @click="openWin(servicer.url)"
          ><i></i></a></li>
        <li class="box-service box-feed-back"><a
            href="javascript:void(0)"
            @click="openFeedBack"
          ><i></i></a></li>
        <!-- <li class="box-qq" @click="openWin(`tencent://message/?exe=qq&menu=yes&Uin=${servicer.qq}`)"><a href="javascript:void(0)" target="_bank"><i></i><span style="width: 200px;display: inline-block;top: 14px;left:44px;color: #fff;font-size: 10px;">QQ客服：{{servicer.qq}}</span></a></li> -->
        <li
          class="box-qq box-help"
          @click="$router.push('/helpCenter/register')"
        ><a href="javascript:void(0)">
            <Icon type="wrench"></Icon><span style="width: 200px;display: inline-block;top: 11px;left:56px;color: #fff;font-size: 14px;">帮助中心</span>
          </a></li>
        <!-- <li class="box-top"><a href="javascript:void(0)" id="goTop" @click="back()"><i></i></a></li> -->
        <li
          v-if="showLongqueue"
          class="box-longqueue"
        ><a
            href="javascript:void(0)"
            @click="onLongqueueClick"
          ><i></i><span style="width: 200px;display: inline-block;top: 14px;left:44px;color: #fff;font-size: 10px;">长龙助手</span></a></li>
      </ul>
    </div>
  </div>
</template>
<script>
import Util from '@/utils/dom.js'
import { mapGetters } from 'vuex'
import { hasPermission } from '@/utils/authority-utils'

export default {
  computed: {
    ...mapGetters(['showSysDragon']),
    user() {
      return this.$store.state.user
    },
    isLogin() {
      return !!this.user.userId
    },
    qrcodes() {
      return this.$store.state.qrcodes
    },
    servicer() {
      return this.$store.state.servicer
    },
    showLongqueue() {
      return hasPermission('longqueue') && this.showSysDragon
    },
  },
  methods: {
    openFeedBack() {
      this.$emit('open-feed-back')
    },
    openWin(path) {
      Util.openWin(path)
    },
    onLongqueueClick() {
      if (this.isLogin) {
        this.$store.commit('SET_APP_LONGQUEUE', true)
      } else if (this.$route.name === 'buyLottery') {
        this.$store.commit('getShowLoginDialog', true)
      } else {
        this.$router.push('/login')
      }
    },
  },
}
</script>

<style lang="less" scoped>
.float-box {
  position: fixed;
  z-index: 1000;
  top: 170px;
  right: 0 !important;
  float: right;
  .box-longqueue {
    i {
      background: url(~@/assets/images/longqueue/ty_changlong.png) no-repeat;
      display: block;
      height: 44px;
      margin-left: 7px;
      margin-top: 10px;
    }
  }
}

.float-box > div {
  height: 230px;
  width: 52px;
}

.float-box li {
  width: 52px;
  height: 44px;
  margin-bottom: 2px;
  position: relative;
  transition: all 0.5s;
}

.float-box li a {
  display: block;
  width: 44px;
  height: 44px;
  position: absolute;
  left: 8px;
  top: 0;
  background: #4292ff;
  border-right: 8px solid #2f75ff;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  transition: all 0.5s;
}

.float-box li i {
  background: url(../../images/side_contact_right.png) no-repeat;
  display: block;
  height: 44px;
}

.float-box li.box-service i {
  background-position: -8px 3px;
}

.float-box li.box-feed-back i {
  background-position: -4px -183px;
}

.float-box li.box-tel i {
  background-position: 0 -46px;
}

.float-box li.box-qq i {
  background-position: -6px -90px;
}

.float-box li.box-wechat i {
  background-position: 0 -138px;
}

.float-box li.box-top i {
  background-position: 0 -184px;
}
.float-box li.box-help i {
  font-size: 24px;
  background: none;
  color: #fff;
  margin-left: 9px;
  margin-top: 10px;
}

.float-box li a:hover {
  background: #ffb015;
  border-color: #ff9901;
}

.float-box li.box-service a:hover {
  width: 127px;
  left: -73px;
}

.float-box li.box-longqueue a:hover {
  width: 127px;
  left: -73px;
}

.float-box li.box-qq a:hover,
.float-box li.box-tel a:hover {
  width: 167px;
  left: -113px;
}

.float-box li a span {
  display: none;
  width: 143px;
  height: 175px;
  position: absolute;
  left: -143px;
  bottom: 0;
}

.float-box li.box-wechat span {
  // background: url(../../images/wechat_qrcode.png) no-repeat;
}

.float-box li.box-wechat a:hover span {
  display: block;
}

.float-box li.box-wechat a:hover {
  border-radius: 0;
}
.ivu-back-top {
  position: absolute;
  top: 0;
  opacity: 0;
  right: 0 !important;
}
</style>
