<template>
  <div class="header-contaner">
    <div class="header-top">
      <div class="w">
        <div class="header-date-wrap">
          <headerDate></headerDate>
        </div>
        <ul class="header-top-list clearfix">
          <li v-if="userInfo.userCode">
            <a @click.stop="goPersonCenter">会员中心</a>
          </li>
          <li v-if="arrowFree">
            <a @click.stop="freePlay">免费试玩</a>
          </li>
          <li>
            <a @click="addCollection">加入收藏</a>
          </li>
          <li v-if="serverUrl">
            <a
              class="zxkf"
              :href="serverUrl.url"
              @click.stop.prevent="openService(serverUrl.url)"
              target="_blank"
            >
              在线客服</a
            >
          </li>
        </ul>
      </div>
    </div>
    <div class="w">
      <div class="notice-wrap ">
        <div class="content clearfix">
          <!-- 公告 -->
          <div class="txt" :class="{ 'hotPhone-txt': hotPhone }">
            <div class="clearfix">
              <i class="iconfont icon-voice_open"></i>&nbsp;
              <div v-if="notice" class="margquee">
                <marquee scrolldelay="100" scrollAmount="6">
                  <div
                    class="notice-cont"
                    v-html="notice"
                    @click="$router.push({ path: '/newsList/announce' })"
                  ></div>
                </marquee>
              </div>
            </div>
            <div class="hotPhone" v-if="hotPhone">
              <i class="iconfont icon-dianhua"></i> <span>{{ hotPhone }}</span>
            </div>
          </div>
          <!-- 公告结束 -->

          <!--登录注册-->
          <div
            class="unlogined-contaner "
            v-if="!userInfo.userCode && $route.name != 'login'"
            id="loginInfo"
          >
            <div class="input-wrapper ">
              <Input
                type="text"
                v-model="userCode"
                size="large"
                icon="ios-person-outline"
                placeholder="账号"
                @on-enter="doLogin()"
              ></Input>
            </div>
            <div class="input-wrapper same input-wrapper-pwd">
              <Input
                type="password"
                id="loginPwd"
                name="loginPwd"
                v-model="password"
                size="large"
                icon="ios-locked-outline"
                placeholder="密码"
                @on-enter="doLogin()"
              ></Input>
              <span class="for-pwd" @click.stop="$router.push('/password')"
                >忘记密码?</span
              >
            </div>
            <div class="input-wrapper same validate" v-if="!captchaFlag">
              <Input
                type="text"
                v-model="checkCode"
                size="large"
                placeholder="验证码"
                @on-enter="doLogin()"
                @on-focus="refreshCheckCode()"
              ></Input>
              <img
                :src="ewmUrl"
                class="ewm"
                @click="changeCaptcha"
                style="cursor:pointer"
              />
            </div>
            <div
              class="input-wrapper same valida"
              v-if="captchaFlag"
              style="width:0;height:0;overflow:hidden;"
            >
              <div id="captcha"></div>
            </div>
            <div class="btn-wrapper login">
              <Button type="primary" class="header-outBtn" @click="doLogin()"
                >登 录</Button
              >
            </div>
            <div class="btn-wrapper register">
              <Button type="default" class="header-btn" @click="goRegister()"
                >注 册</Button
              >
            </div>
          </div>
          <!--  登录注册结束-->
          <!-- 用户信息结束-->
          <div class="logined-contaner" v-if="!!userInfo.userCode">
            <div class="logined-user">
              <div class="account-logo">
                <template v-if="userInfo && userInfo.imgUrl">
                  <img
                    :src="userInfo && userInfo.imgUrl"
                    @click="$router.push('/personalCenter/account')"
                  />
                </template>
                <template v-else-if="userInfo && !userInfo.imgUrl">
                  <img
                    src="/static/images/account.png"
                    @click="$router.push('/personalCenter/account')"
                  />
                </template>
                <div class="account-popup">
                  <p>
                    <router-link :to="'/personalCenter/account'"
                      >会员中心</router-link
                    >
                  </p>
                  <p>
                    <router-link :to="'/personalCenter/trade'"
                      >交易明细</router-link
                    >
                  </p>
                  <p>
                    <router-link :to="'/personalCenter/record'"
                      >投注记录</router-link
                    >
                  </p>
                  <p v-if="userInfo.userType == '10'">
                    <router-link :to="'/personalCenter/userManage'"
                      >代理中心</router-link
                    >
                  </p>
                </div>
              </div>
              <div class="account-detail">
                <p>
                  <span class="lab">账号&nbsp;:</span>
                  <span class="user-name"
                    >{{ userInfo.userCode }}&nbsp;&nbsp;</span
                  ><img :src="userInfo.userLevelIcon" />
                </p>
                <p class="balance">
                  <span class="lab">余额&nbsp;:&nbsp;</span>
                  <span>{{ userInfo.balance | keepDecimalOf2 }}</span>
                  <i
                    class="iconfont icon-refresh"
                    @mouseenter="showPopup = false"
                    @mouseleave="showPopup = false"
                    @click="refreshBalance()"
                    :class="{ 'turn-round': turnRound }"
                  ></i>
                </p>
              </div>
            </div>
            <ul class="clearfix logined-opt">
              <li
                class="ordinary deposit"
                v-if="userInfo.userType !== '09' && userInfo.userType !== '08'"
              >
                <Button
                  class="header-btn"
                  type="default"
                  @click="$router.push({ path: '/personalCenter/recharge' })"
                >
                  <i class="iconfont icon-qianbao1"></i>
                  <span class="text">充值</span>
                </Button>
              </li>
              <li
                class="ordinary withdrawal"
                v-if="userInfo.userType !== '09' && userInfo.userType !== '08'"
              >
                <Button
                  type="default"
                  class="header-btn"
                  @click="$router.push({ path: '/personalCenter/withdraw' })"
                >
                  <i class="iconfont icon-qianbao"></i>
                  <span class="text">提现</span></Button
                >
              </li>
              <li class="login-out" @click="signOut()">
                <Button type="primary" class="header-outBtn">退出</Button>
              </li>
            </ul>
          </div>
          <!-- 登录注册结束 -->
        </div>
      </div>
      <div class="head-menu">
        <div class="content clearfix">
          <!-- logo -->
          <div class="logo-wrap">
            <div class="logo">
              <router-link to="/"
                ><img
                  class="w-full"
                  :src="picture"
                  :title="$configText.main + ''"
              /></router-link>
            </div>
          </div>
          <!--logo结束-->
          <ul class="nav-menu" :class="['nav-menu-' + menu.length]">
            <li
              v-for="(item, idx) in menu"
              :key="idx"
              :style="{ width: 100 / menu.length + '%' }"
              :class="{
                active:
                  currentMenu === (item.url ? item.url : item.code) ||
                  currentMenu === item.code,
                hot: item.hot,
              }"
            >
              <router-link
                v-if="item.url && !item.url.includes('chatRoom')"
                :to="item.url"
                class="link-a"
                :target="item.target"
                >{{ item.label }}</router-link
              >
              <a
                v-else-if="item.url && item.url.includes('chatRoom')"
                @click.stop="toChatRoom"
                >聊天室</a
              >

              <a
                v-else
                :target="item.target"
                class="game-box"
                @mouseenter="onGameHover(idx)"
                @mouseleave="onGameLeave(idx)"
                @click.prevent="navGoGamePlat(item.code)"
              >
                <span>{{ item.typeName }}</span>
                <!-- <transition name="rq-fade"> -->
                <div class="child" :class="[gameIndex === idx ? 'active' : '']">
                  <div class="child-list">
                    <div v-loading="loading">
                      <div
                        class="ui-empty"
                        v-if="item.subMenu && !item.subMenu.length && !loading"
                      >
                        暂无游戏
                      </div>
                      <ul v-else>
                        <li
                          v-for="(list, idx) of item.subMenu"
                          :key="idx"
                          :class="[
                            list.dispType === '1' && list.platformStatus !== '1'
                              ? 'disabled'
                              : '',
                          ]"
                          @click.stop="goGamePlat(list, $event)"
                        >
                          <div class="name">
                            <span>{{
                              list.typeName ? list.typeName : list.gameName
                            }}</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <!-- </transition> -->
              </a>
            </li>
          </ul>
        </div>
      </div>

      <confirm-free
        :modalShow="confirmDialog"
        :title="$tex('温馨提示')"
        @btn-ok="handConfirm"
        :maskClosable="true"
        @btn-cancel="handForClear"
      >
        <div slot="content">
          <p class="confirm-free-modal-p">
            {{ $tex("当前使用的是正式账号，确定要切换到试玩模式吗") }}
          </p>
        </div>
      </confirm-free>

      <!-- 试玩弹窗 -->
      <component
        :is="tryPlay"
        :hasOpen="play"
        :tryPlayCaptchaInfo="tryPlayCaptchaInfo"
        @closeTryModal="play = false"
      >
      </component>

      <component
        :is="loginDialog"
        :isShow="showLoginDialog"
        @close-login-modal="showLoginDialog = false"
      >
      </component>
      <!-- 登录弹框 -->
      <!-- 登录游戏前的自动转换提示 -->
      <modal
        :modalShow="gameMoneyTipShow"
        title="棋牌游戏"
        claName="login-game-dlg-wrap"
        width="380"
        @btn-cancel="gameMoneyTipShow = false"
        @btn-ok="goGameLogin"
      >
        <div slot="content" class="gameTipDlg">
          <p>
            首次进入游戏，系统将自动为您进行钱包额度转换，详情请前往钱包查看。
          </p>
          <!-- <div class="btn-wrap"> <Button type='primary'
                            >转换额度</Button></div> -->
        </div>
      </modal>
    </div>
  </div>
</template>
<script>
import headerMixin from "./headerMixin.js";
import headerDate from "@/components/header_date.vue";
let defaultMenu = [
  { label: "首页", url: "/home" },
  // { label: "购彩大厅", url: "/lottery", target: "_blank" },
  { label: "优惠活动", url: "/active" },
];

export default {
  mixins: [headerMixin],
  components: { headerDate },
  data() {
    return {
      defaultMenu: defaultMenu,
      menu: [...defaultMenu],
      insertPos: 1,
      picture: "/configstatic/pc/images/logo.gif",
    };
  },
  methods: {
    addCollection() {
      this.$Modal.info({
        title: this.$tex("加入收藏"),
        content: this.$tex("请按Ctrl+D加入收藏"),
        onOk: () => {},
      });
    },
  },
  mounted() {
    const key = this.$store.getters.sysPlatformFlag;
    if (key == "tgdemo") {
      this.picture = "/configstatic/pc/images/logo_C.gif";
    }
  },
};
</script>
<style>
.confirm-free-modal-p {
  padding: 5%;
  text-align: center;
  font-size: 14px;
}
</style>
<style lang="less" scoped>
@import "../../../styles/mixin.less";
@deep: ~">>>";
.header-contaner {
  background-color: #0d0e17;
  .notice-wrap {
    font-size: 12px;
    padding-top: 20px;
    padding-bottom: 10px;
    .content {
      .txt {
        float: left;
        width: 400px;
        .icon-voice_open {
          float: left;
          color: #ed1459;
          margin-right: 5px;
          margin-top: 4px;
        }
        .margquee {
          float: left;
          width: 350px;
          line-height: 35px;
          marquee {
            height: 35px;
            overflow: hidden;
          }
          &:hover {
            span {
              cursor: pointer;
            }
          }
          .notice-cont {
            margin: 0;
            white-space: nowrap;
            display: inline-block;
            @{deep} * {
              display: inline-block;
              font-size: 12px !important;
              background: none !important;
              color: #d2d2d2 !important;
              line-height: 0;
              * {
                display: inline-block;
                font-size: 12px !important;
                background: none !important;
                color: #d2d2d2 !important;
                /*   color: #be1204 !important; */
              }
            }
          }
        }
      }
      .hotPhone-txt {
        margin-top: -10px;
        .margquee {
          line-height: 30px;
          height: 30px;
          marquee {
            height: 30px;
          }
        }
        .hotPhone {
          color: #e1e0e2;
          span {
            font-size: 16px;
          }
        }
      }
    }
  }
  .head-menu {
    color: #fff;
    position: relative;
    z-index: 101;
    .logo-wrap {
      width: 180px;
      height: 60px;
      float: left;
      img {
        width: auto;
        height: 60px;
      }
    }
    .content {
      margin: 0 auto;
      /*  background: @primary-color; */
      position: relative;
      .lottery-title {
        float: left;
        width: 220px;
        position: relative;
        border-right: none;
        .icon {
          float: left;
          display: block;
          height: 44px;
          overflow: hidden;
          i {
            margin-top: 13px;
          }
        }
      }
      .nav-menu {
        width: 1020px;
        float: right;
        & > li {
          float: left;
          text-align: center;
          line-height: 60px;
          height: 60px;
          position: relative;
          & > a {
            color: #fff;
            font-size: 16px;
            display: inline-block;
            height: 100%;
            border: 1px solid transparent;
            position: relative;
            &::after {
              content: "";
              position: absolute;
              left: 0;
              bottom: -1px;
              right: 0;
              height: 2px;
              z-index: 2;
            }
          }

          .link-a {
            &:hover,
            &.router-link-active {
              color: #ed1459;
              a {
                color: #ed1459;
              }
              &::after {
                background-color: #ed1459;
              }
            }
          }
          &.active {
            a {
              color: #ed1459;
              &::after {
                background-color: #ed1459;
              }
            }
          }

          .game-box {
            &:hover {
              display: block;
              width: 100%;
              border: 1px solid #262537;
              background-color: #131522;
              &::after {
                background-color: #131522;
                z-index: 10;
              }
              .child {
                display: block;
              }
            }
          }
          .child {
            display: none;
            border: 1px solid #262537;
            position: absolute;
            left: -1px;
            top: 100%;
            background-color: #131522;
            width: 230px;
            padding: 0 20px;
            @{deep} .lee-globaloading {
              height: 50px;
              background-color: transparent;
              .load-3 {
                margin-top: -30px;
              }
              .k-line2 {
                background-color: #ed1459;
              }
            }
          }
          .child-list {
            min-height: 50px;
            position: relative;
            z-index: 11;
            li {
              float: left;
              width: 50%;
              color: #fff;
              text-align: left;
              white-space: nowrap;
              line-height: 40px;
              &:hover {
                color: #ed1459;
              }
              &:first-child {
                width: 100%;
                margin-top: -12px;
              }
              &.disabled {
                cursor: not-allowed;
                color: gray;
              }
            }
          }
        }
      }
      .nav-menu-7 {
        li {
          &.hot {
            &::before {
              right: 8%;
            }
          }
        }
      }
      .nav-menu-8 {
        li {
          &.hot {
            &::before {
              right: 1%;
            }
          }
        }
      }
    }
  }
}
.gameTipDlg {
  .c-red {
    /*   color: @primary-color; */
  }
  .btn-wrap {
    margin: 20px auto 10px;
    text-align: center;
  }
}
.header-outBtn {
  background-color: #ed1459;
  color: #fff;
  min-width: 80px;
  height: 36px;
}
.header-btn {
  border: 1px solid #ed1459;
  color: #ed1459;
  min-width: 80px;
  background-color: transparent;
  height: 36px;
}

.logined-contaner {
  float: right;
  width: 800px;
  .logined-user {
    float: left;
    width: 400px;
    margin-left: 50px;
    position: relative;
    .account-logo {
      height: 100%;
      float: left;
      margin-top: -12px;
      img {
        width: 60px;
        height: 60px;
        cursor: pointer;
      }
      &:hover {
        .account-popup {
          display: block;
        }
      }
      .account-popup {
        position: absolute;
        top: 58px;
        left: 30px;
        background: #fff;
        border: 1px solid #ebebeb;
        transform: translate(-50%, 0);
        z-index: 1000;
        padding: 0 15px;
        font-size: 12px;
        color: #7f7f7f;
        z-index: 100000;
        animation: fade-in 0.6s 1 ease;
        display: none;
        &:before {
          content: "";
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 10px 12px 10px;
          border-color: transparent;
          border-bottom-color: #ebebeb;
          position: absolute;
          left: 50%;
          top: -11px;
          transform: translate(-50%, 0);
        }
        &:after {
          &:extend(.header-contaner
              .content
              .logined
              li
              .account-logo
              .account-popup:before);
          border-bottom: 12px solid #fff;
          top: -10px;
        }
        p {
          height: 30px;
          line-height: 30px;
          border-bottom: 1px solid #ebebeb;
          padding: 0 5px;
          &:last-child {
            border-bottom: 0;
          }
          a {
            color: #7f7f7f;
            &:hover {
              /*       color: @primary-color; */
            }
          }
        }
      }
    }

    .account-detail {
      height: 60px;
      margin-left: 80px;
      margin-top: -5px;
      p {
        white-space: nowrap;
        line-height: 26px;
        &.balance {
          font-size: 0;
        }
        span {
          font-size: 14px;
          color: #fff;
          &.user-name {
            display: inline-block;
            vertical-align: top;
            color: #fff;
            .ellipse();
          }
        }
        .icon-refresh {
          display: inline-block;
          margin-left: 7px;
          cursor: pointer;
          font-size: 12px;
          font-weight: bold;
          margin-top: -8px;
          color: #fff;
          &.turn-round {
            animation: rotating 5s infinite linear;
          }
        }
        img {
          float: inherit;
          vertical-align: middle;
          width: 70px;
        }
      }
      .lab {
        color: #fff;
      }
    }
  }
  .logined-opt {
    float: right;
    li {
      float: left;
      margin-right: 15px;
      &:last-child {
        margin-right: 0;
      }
      .header-btn {
        border: 1px solid #ed1459;
        color: #ed1459;
        background-color: transparent;
      }
    }
  }
}

.unlogined-contaner {
  float: left;
  width: 800px;
  .input-wrapper {
    position: relative;
    display: inline-block;
    margin-right: 23px;
    width: 170px;
  }
  .btn-wrapper {
    display: inline-block;
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
  }
  .for-pwd {
    position: absolute;
    right: 10px;
    top: 8px;
    color: #ed1459;
    cursor: pointer;
  }

  .validate {
    @{deep} .ivu-input {
      padding-left: 10px;
      padding-right: 67px;
    }
    .ewm {
      position: absolute;
      width: 67px;
      left: auto;
      right: 1px;
      top: 1px;
      height: 30px;
    }
  }
  @{deep} .ivu-input {
    background-color: transparent;
    height: 32px;
    color: #fff;
    padding-right: 10px;
    padding-left: 32px;
  }
  @{deep} .ivu-input-icon {
    color: #fff;
    height: 32px;
    line-height: 32px;
    left: 0;
    right: inherit;
  }
  .input-wrapper-pwd {
    @{deep} .ivu-input {
      padding-right: 80px;
    }
  }
}
.header-top {
  background-color: #080810;
  height: 37px;
  line-height: 37px;
}
.header-date-wrap {
  float: left;
  width: 250px;
  color: #fff;
}
.header-top-list {
  float: right;
  li {
    float: left;
    padding: 0 15px;
    position: relative;
    &::after {
      position: absolute;
      right: 0;
      top: 13px;
      content: "";
      height: 15px;
      width: 1px;
      background-color: #fff;
    }
    &:last-child {
      &::after {
        display: none;
      }
    }
    a {
      color: #fff;
      &:hover {
        color: #ed1459;
      }
    }
  }
}
</style>
<style scoped>
.ui-empty {
  padding-top: 40px;
}
</style>
