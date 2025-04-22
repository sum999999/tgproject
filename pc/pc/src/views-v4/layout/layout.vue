<template>
  <div class="tmpl-layout">
    <top-content v-if="isShowHead"></top-content>
    <header-content v-if="isShowHead"></header-content>
    <!-- <div class="clr"></div> -->
    <div
      class="bodyer"
      :class="{'activeBar':$route.name === 'active'
        ||$route.name === 'helpcenter'
        ||$route.name === 'personalCenter'
        ||$route.name === 'password'
        ||$route.name === 'role'
        ||$route.name === 'newsList'}"
      v-loading="loginGameloading"
    >
      <keep-alive :include="['chatRoom']">
        <router-view />
      </keep-alive>
    </div>
    <suspend v-if="isShowSuspend"
        @open-feed-back="showFeedBack"></suspend>
    <footer-content v-if="isShowFoot"></footer-content>
    <!-- clr作为清楚浮动使用 -->
    <div class="clr"></div>
    <div
      style="display:none"
      id="ios"
    ></div>
    <div
      style="display:none"
      id="android"
    ></div>
     <!-- 我的反馈 -->
    <div v-if="isShowFeedBack">
        <my-feed-back
           :showFeedBack="isShowFeedBack"
           @close-my-feed-back="closeMyFeedBack"
           @add-feed-back="addFeedBack"/>
    </div>
    <!-- 添加反馈 -->
    <div v-if="isShowAddFeedBack">
        <add-feed-back
          :showAddFeedBack="isShowAddFeedBack"
          @close-add-feed-back="isShowAddFeedBack=false;"
         />
    </div>
  </div>
</template>
<script>
import topContent from "../common/module_vue/top.vue";
import headerContent from "../common/module_vue/header.vue";
import suspend from "../common/module_vue/Suspend.vue";
import footerContent from "../common/module_vue/FooterContent.vue";
import { mapGetters } from "vuex";
import myFeedBack from '@/components/myFeedBack.vue';
import addFeedBack from '@/components/addFeedBack.vue';
import { queryQrcodesAndServicer } from "@/api/cms";

export default {
  components: {
    topContent,
    headerContent,
    suspend,
    footerContent,
    myFeedBack,
    addFeedBack
  },
  data() {
    return {
      loginGameloading: false,
      isShowHead: true,
      isShowSuspend: true,
      isShowFoot: true,
      isShowFeedBack: false,
      isShowAddFeedBack: false
    };
  },
  async created() {
    this.routeStatus(this.$route.name);
    await queryQrcodesAndServicer().then(response => {
        const { code, data } = response.data;
        if (code !== 0) {
          return;
        }
        this.$store.commit("getServicer", data.servicer);
        this.getQrCode(data.qrcodes);
        document.title = data.servicer.name;
      });
  },
  watch: {
    $route(n) {
      this.routeStatus(n.name);
    },
    pageTemplate: {
      handler() {
        this.routeStatus(this.$route.name);
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(["pageTemplate",'user'])
  },
  methods: {
    /**
     * 是否显示意见反馈窗口
     */
    showFeedBack() {
      if(!this.user.userId) {
        this.$router.push('/login');
        return;
      }
      this.isShowFeedBack = true;
    },
    /**
     * 关闭意见反馈
     */
    closeMyFeedBack() {
      this.isShowFeedBack = false;
    },
    /**
     * 显示添加反馈
     */
    addFeedBack(){
      this.closeMyFeedBack();
      setTimeout(() => {
        this.isShowAddFeedBack = true;
      },1000)
    },
    routeStatus(name) {
      const headHideArr = ["buyLottery", "redPacket", "chatRoom", "feedbackActive"];
      const footHideArr = ["buyLottery", "redPacket", "chatRoom", "feedbackActive", "lottery"];
      const suspendHideArr = ["redPacket", "chatRoom", "feedbackActive", "lottery", "phone_buy"];
      if (headHideArr.indexOf(name) !== -1) {
        this.isShowHead = false;
      } else {
        this.isShowHead = true;
      }
      if (footHideArr.indexOf(name) !== -1) {
        this.isShowFoot = false;
      } else {
        this.isShowFoot = true;
      }
      if (suspendHideArr.indexOf(name) !== -1) {
        this.isShowSuspend = false;
      } else {
        this.isShowSuspend = true;
      }
    },
    getQrCode(data) {
      // 注册全局的二维码
      let img = "";
      let value = "";
      let vm = this;
      let arr = [];
      ["ios", "android"].forEach((item, idx) => {
        let qrDom = document.getElementById(item);
        let code = new QRCode(qrDom , data[idx].targetUrl);
        let timer = setTimeout(function() {
          let img = qrDom.querySelector("img");
          value = img.getAttribute("src");
          arr.push({ img: value, icon: item });
          if (item === "android") {
            vm.$store.commit("getQrcodes", arr);
          }
        });
      });
    }
  }
};
</script>
<style lang="less">
.tmpl-layout {
  font-size: 12px;
  .active-page {
    width: 1000px;
  }
  .activeBar {
    border-top: 2px solid #d7dee7;
    background-color: #f5f5f5;
    min-height: 977px;
  }
  .personal-center {
    width: 1200px;

    .personal-content {
      width: 980px !important;
    }
  }
  .news-page {
    width: 1200px !important;
    //   background-color: #fff;
    .new-content {
      width: 982px !important;
    }
  }
  .help-center {
    width: 1200px !important;
    .help-content {
      width: 980px !important;
    }
  }
  .notice-contaner-tpl {
    width: 1200px;
    margin: 0 auto;
  }
  .trend-list-contanier {
    width: 1200px;
    margin: 0 auto;
  }
  .borrow .borrow-content {
    width: 750px;
    margin: 0 auto;
  }
  .description-tpl {
    width: 730px;
    margin: 0 auto;
  }
}
</style>
