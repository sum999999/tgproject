<template>
  <div class="tmpl-layout">
    <myHeader v-if="isShowHead"></myHeader>
    <suspend v-if="showSuspend" @open-feed-back="openFeedBack"/>
    <keep-alive :include="['chatRoom']">
      <router-view />
    </keep-alive>
    <myFooter v-if="isShowFoot" />
    <div
      style="display:none"
      id="qrcodeTmp2"
    > </div>
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
import header from "@/views-v2/common/module_vue/header.vue";
import footer from "@/views-v2/common/module_vue/footer.vue";
import suspend from "@/views-v2/common/module_vue/suspend.vue";
import myFeedBack from '@/components/myFeedBack.vue';
import addFeedBack from '@/components/addFeedBack.vue';
import { mapGetters } from "vuex";
import { queryQrcodesAndServicer } from "@/api/cms";

export default {
  components: { myHeader: header, myFooter: footer, suspend,myFeedBack,addFeedBack },
  data() {
    return {
      isShowHead: true,
      isShowFoot: true,
      showSuspend: true,
      isShowFeedBack: false, //是否显示意见反馈
      isShowAddFeedBack: false //是否显示添加意见反馈
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
    ...mapGetters(["pageTemplate","user"])
  },
  methods: {
    /**
     * 是否显示意见反馈窗口
     */
    showFeedBack() {
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
    //打开意见反馈
    openFeedBack() {
      if(!this.user.userId) {
        this.$router.push('/login');
        return;
      }
      this.isShowFeedBack = true;
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
        this.showSuspend = false;
      } else {
        this.showSuspend = true;
      }
    },
    getQrCode(data) {
      // 注册全局的二维码
      let img = "";
      let value = "";
      let vm = this;
      let arr = [];
      let qrDom = document.getElementById("qrcodeTmp2");
      for(let i=0;i<2;i++) {
        new QRCode(qrDom, data[i].targetUrl);
        if(i==1) {
        }
      }
      setTimeout(() =>{
        ["ios", "android"].forEach((item, idx) => {
          const img = qrDom.querySelectorAll("img")[idx];
          const value = img.getAttribute("src");
          arr.push({ img: value, icon: item });
          if(idx==1) {
            vm.$store.commit("getQrcodes", arr);
          }
        })
      },50);

      // ["ios", "android"].forEach((item, idx) => {
      //   let code = new QRCode(qrDom, data[idx].targetUrl);
      //   let timer = setTimeout(function() {
      //     let img = qrDom.querySelector("img");
      //     value = img.getAttribute("src");
      //     arr.push({ img: value, icon: item });
      //     if (item === "android") {
      //       vm.$store.commit("getQrcodes", arr);
      //     }
      //   });
      // });
    }
  }
};
</script>

<style lang="less">
.tmpl-layout {
  .active-page {
    width: 1000px;
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
  .trend-tpl {
    width: 1200px !important;
  }
  .description-tpl {
    width: 730px;
    margin: 0 auto;
  }
}
</style>
