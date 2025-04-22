<template>
  <div class="header">
    <div class="header-content">
      <div class="header-left-logo">
        <!-- logo -->
        <div class="logo">
          <router-link to="/"><img
              class="w-full"
              src="/configstatic/pc/images/logo.gif"
              :title="$configText.main+''"
            ></router-link>
        </div>
        <!-- end -->
        <div class="suspend-logo"></div>
      </div>
      <div class="header-right-nav">
        <div class="header-nav-wrapper">
          <ul
            class="nav-menu"
            :class="['nav-menu-'+menu.length]"
          >
            <li
              v-for="(item, idx) in menu"
              :key="idx"
              :style="{width: 100 / menu.length + '%'}"
              :class="{active: currentMenu === (item.url?item.url:item.code) || currentMenu===item.code,hot:item.hot}"
            >
              <router-link
                v-if="item.url && !item.url.includes('chatRoom')"
                :to="item.url"
                class="link-a"
                :target='item.target'
              >{{item.label}}</router-link>
              <a
                v-else-if="item.url && item.url.includes('chatRoom')"
                @click.stop="toChatRoom"
              >聊天室</a>
              <a
                v-else
                :target='item.target'
                class="game-box"
                @mouseenter="onGameHover(idx)"
                @mouseleave="onGameLeave(idx)"
                @click.prevent="navGoGamePlat(item.code)"
              >
                <span>{{item.typeName}}</span>
                <i class="icon-select"></i>
                <div
                  class="drop-down-wrapper toggle"
                  v-show="gameIndex===idx"
                  :class="[gameIndex===idx?'active':'']"
                >
                  <div
                    class="drop-down-content nav-drop lottery-drop"
                    :class="{'toggleBar':item.subMenu}"
                    v-loading="loading"
                  >
                    <div
                      class="ui-empty"
                      v-if="item.subMenu&&!item.subMenu.length && !loading"
                    >
                      暂无游戏
                    </div>
                    <div
                      class="layout"
                      v-else
                    >
                      <dl class="right">
                        <dd
                          class="lottery-vr"
                          v-for="(list,idx) of item.subMenu"
                          :key="idx"
                          :class="[list.dispType==='1'&&list.platformStatus!=='1'?'disabled':'',idx===(item.subMenu.length-1)?'last':'']"
                        >
                          <a
                            href="javascript:void(0)"
                            @click.stop="goGamePlat(list,$event)"
                          >
                            <span class="hd">
                              <img
                                :src="list.typeIcon?list.typeIcon:list.gameIcon"
                                alt=""
                              >
                              <h4>{{list.typeName?list.typeName:list.gameName}}</h4>
                            </span>
                            <template v-if="list.dispType==='2'">
                              <span class="bd">{{$tex("立即游戏")}}</span>
                            </template>
                            <template v-if="list.dispType==='1'">
                              <span
                                class="bd"
                                v-if="list.platformStatus==='1'"
                              >{{$tex("立即游戏")}}</span>
                              <span
                                class="bd"
                                v-else-if="list.platformStatus==='2'"
                              >即将上线</span>
                              <span
                                class="bd"
                                v-else-if="list.platformStatus==='3'"
                              >维护中</span>
                              <span
                                class="bd"
                                v-else-if="!list.platformStatus"
                              >敬请期待</span>
                            </template>
                          </a>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import headerMixin from './headerMixin.js'
export default {
  mixins: [headerMixin],
}
</script>
<style lang="less" scoped>
@import './style.less';
.header {
  position: relative;
  height: 86px;
  line-height: 86px;
  background-color: @primaryTextColor;
}
.header-content {
  width: 1200px;
  margin: 0 auto;
}
.header-left-logo {
  float: left;
  height: 86px;
}
.header-right-nav {
  float: left;
  margin-left: 70px;
  & > ul > li {
    float: left;
    & > a {
      position: relative;
      display: inline-block;
    }
  }
}
.logo {
  width: 178px;
  height: 86px;
  & > a {
    display: inline-block;
    vertical-align: middle;
  }
}
.suspend-logo {
  width: 90px;
  height: 42px;
}
.header-nav-wrapper {
  width: 950px;
  .nav-menu > li {
    float: left;
    text-align: center;
    &.active,
    &:hover {
      background-color: @backGroundColor;
      & > a {
        color: #fff;
        font-size: 18px;
      }
    }
    & > a {
      display: block;
      height: 86px;
      color: @boldTextColor;
      font-size: @normalFontSize;
      box-sizing: border-box;
    }
  }
}
.nav-drop {
  background: url(../../images/nav_drop_bg.png) repeat-x;
  position: absolute;
  width: 100%;
  height: 0;
  left: 0;
  top: 100%;
  z-index: 999;
  overflow: hidden;
  &.toggleBar {
    height: 145px;
    transition: height 0.6s;
  }
  .layout {
    display: inline-block;
    max-width: 1200px;
    width: 1200px;
    margin: auto;
    overflow: auto;
  }
}
.nav-drop .nav-promotion {
  width: 170px;
  height: 145px;
  background: url(../../images/drop_pro_bg.png) repeat;
}
.nav-drop dl dd {
  text-align: center;
  display: inline-block;
}
.nav-drop dl dd a {
  background: url(../../images/nav_drop_line.png) no-repeat right 37px;
}
.nav-drop dl dd.last a {
  background: none;
}
.nav-drop dl dd.sports-bb a,
.nav-drop dl dd.l-c-allbet a,
.nav-drop dl dd.lottery-sgwin a {
  background: none;
}
.nav-drop a {
  display: block;
  width: 100%;
  height: 145px;
  text-align: center;
}
.nav-drop a em {
  color: #626262;
}
.nav-drop .hd {
  width: 200px;
  height: 95px;
  padding-top: 10px;
  line-height: initial;
  display: block;
  overflow: hidden;
  & > img {
    height: 74%;
    width: auto;
    float: initial;
  }
  & > h4 {
    font-size: 12px;
    line-height: 12px;
    font-weight: normal;
  }
}
.nav-drop .bd {
  display: block;
  width: 90px;
  height: 27px;
  line-height: 27px;
  margin: 10px auto 0;
  border: 1px solid #548dfa;
  color: #548dfa;
  border-radius: 14px;
  font-size: 12px;
  -webkit-transition: background 0.3s ease-in-out;
  -moz-transition: background 0.3s ease-in-out;
  -ms-transition: background 0.3s ease-in-out;
  -o-transition: background 0.3s ease-in-out;
  transition: background 0.3s ease-in-out;
}
.nav-drop a:hover .bd {
  background: #f0a638;
  border-color: #f0a638;
  color: #fff;
}
.nav-drop i {
  display: block;
  background: url(../../images/nav_hd_spirits.png) no-repeat;
  width: 100px;
  height: 100px;
  margin: 0 auto;
}
.nav-menu li > a > i {
  display: block;
  background: url(../../images/ico_triangle.png) no-repeat;
  height: 14px;
  line-height: 14px;
  width: 14px;
  margin: auto;
  margin-top: -22px;
}
</style>
