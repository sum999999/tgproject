<template>
  <div
    class="expend-body"
    :style="{ backgroundImage: `url(${Businesses})` }"
    id="canvas"
  >
    <img class="img-item1" :src="imgItem1" />

    <img
      class="img-item2"
      src="/configstatic/pc/images/ic_promotion_logo.png"
    />
    <div class="div-item">
      <i>
        <span>即刻分享</span>
        <span>更有豪礼相送</span>
        <span>随时随地</span>
        <span>收益入账</span>
      </i>
    </div>
    <expand-info
      idx="qrcode1"
      @has-made="makeCanvas"
      @on-sure="onChoose"
      :data="currentData0"
    >
    </expand-info>
    <!-- <Carousel
      v-model="imgIndex"
      dots="none"
      class="expend-box"
      loop="false"
    >
      <CarouselItem>
        <div
          class="expend-panel bg1 userInfo-right"
          :class="{
            en: !checkChineseKey()
          }"
          ref="canvas0"
        >
          <div class="">
            <span>链接</span>
            <img src="" alt="">
            <button>复制</button>
          </div>
        </div>
      </CarouselItem>
      <CarouselItem>
        <div class="expend-panel bg2"
             ref="canvas0">
        </div>
      </CarouselItem>
        <CarouselItem>
        <div class="expend-panel bg3"
             ref="canvas2">

        </div>
      </CarouselItem>

      <CarouselItem>
        <div
          class="expend-panel bg4 userInfo-right"
          :class="{
            en: !checkChineseKey()
          }"
          ref="canvas1"
        >

        </div>
      </CarouselItem>

      <CarouselItem>
        <div
          class="expend-panel bg5 userInfo-right"
          :class="{
            en: !checkChineseKey()
          }"
          ref="canvas2"
        >

        </div>
      </CarouselItem>

      <CarouselItem>
        <div
          class="expend-panel bg5 userInfo-right"
          :class="{
            en: !checkChineseKey()
          }"
          ref="canvas3"
        >
          <expand-info
            idx="qrcode4"
            @has-made="makeCanvas"
            @on-sure="onChoose"
            :data="currentData3"
          > </expand-info>
        </div>
      </CarouselItem>

       <CarouselItem>
        <div
          class="expend-panel bg5 userInfo-right"
          :class="{
            en: !checkChineseKey()
          }"
          ref="canvas4"
        >
          <expand-info
            idx="qrcode5"
            @has-made="makeCanvas"
            @on-sure="onChoose"
            :data="currentData4"
          > </expand-info>
        </div>
      </CarouselItem>

      <CarouselItem>
        <div
          class="expend-panel bg6 userInfo-right"
          :class="{
            en: !checkChineseKey()
          }"
          ref="canvas5"
        >
          <expand-info
            idx="qrcode6"
            @has-made="makeCanvas"
            @on-sure="onChoose"
            :data="currentData5"
          > </expand-info>
        </div>
      </CarouselItem>
      <CarouselItem>
        <div
          class="expend-panel bg7 userInfo-right"
          :class="{
            en: !checkChineseKey()
          }"
          ref="canvas6"
        >
          <expand-info
            idx="qrcode7"
            @has-made="makeCanvas"
            @on-sure="onChoose"
            :data="currentData6"
          > </expand-info>
        </div>
      </CarouselItem>
      <CarouselItem>
        <div
          class="expend-panel bg8 userInfo-right"
          :class="{
            en: !checkChineseKey()
          }"
          ref="canvas7"
        >
          <expand-info
            idx="qrcode8"
            @has-made="makeCanvas"
            @on-sure="onChoose"
            :data="currentData7"
          > </expand-info>
        </div>
      </CarouselItem>
    </Carousel>  -->

    <expand-dialog
      :showDlg.sync="showDlg"
      :checkRow="checkRow"
      @on-selected-code="onSelectedCode"
    ></expand-dialog>
    <Button
      type="primary"
      class="saveQr"
      long
      v-if="hasMade"
      @click.native="saveImg"
      >{{ $tex("保存") }}</Button
    >
  </div>
</template>

<script>
import expandDialog from "./common/expand_me_dialog.vue";
import expandInfo from "./common/expand_me_info.vue";
import html2canvas from "html2canvas";
import { mapGetters } from "vuex";
import { checkChineseKey } from "@/lang/index";
import imgItem1 from "@/assets/images/qrbg.png";

export default {
  components: {
    expandDialog,
    expandInfo,
  },
  data() {
    return {
      hasMade: false,
      list: [],
      /*  currentData0: {}, */
      currentData0: {},
      currentData1: {},
      /*  currentData2: {}, */
      currentData2: {},
      currentData3: {},
      currentData4: {},
      currentData5: {},
      currentData6: {},
      currentData7: {},
      imgIndex: 0,
      showDlg: false,
      checkRow: {},
      hideBtn0: true,
      Businesses: "",
      imgItem1: imgItem1, // 图片
    };
  },
  computed: {
    ...mapGetters(["isInternational"]),
    user() {
      return this.$store.state.user;
    },
  },
  created() {
    this.initIndex = 0;
    this.switching();
  },
  methods: {
    checkChineseKey,
    onSelectedCode(data, hasYqm) {
      if (this.initIndex == 0) {
        this.currentData0 = this.currentData1 = this.currentData2 = this.currentData3 = this.currentData4 = this.currentData5 = this.currentData6 = this.currentData7 =
          data || {};
        this.initIndex++;
      }
      if (data) {
        this["currentData" + this.imgIndex] = data;
      }
      if (!hasYqm) {
        this.$Modal.confirm({
          title: this.$tex("提示"),
          content: `<p>${this.$tex("您还没有推广码，请先添加")}</p>`,
          onOk: () => {
            this.$router.push("/personalCenter/expand");
          },
        });
      }
    },
    onChoose() {
      this.checkRow = this["currentData" + this.imgIndex];
      this.showDlg = true;
    },
    makeCanvas(val) {
      this.hasMade = val;
    },
    async saveImg() {
      if (!this.hasMade) {
        return;
      }
      let vm = this;
      let imgIndex = vm.imgIndex;
      vm[`hideBtn${imgIndex}`] = false;
      vm._canvas = vm.$refs[`canvas${imgIndex}`];
      let ignoreElements = vm.$refs.hideBtn;
      if (vm[`hideBtn${imgIndex}`]) {
        return;
      }
      html2canvas(vm._canvas, {
        scale: 1.2,
        logging: false,
        imageTimeout: 0,
        useCORS: true,
        ignoreElements(element) {
          let id = element.getAttribute("id");
          if (id === "hideBtn") {
            return true;
          }
          if (element.classList.contains("hd")) {
            return true;
          }
        },
      }).then((canvas) => {
        vm.dataURL = canvas.toDataURL("image/png", 1.0);
        vm.saveFile(
          vm.dataURL.replace("image/jpeg", "image/octet-stream"),
          new Date().getTime() + ".jpeg"
        );
      });
      vm[`hideBtn${imgIndex}`] = true;
    },
    saveFile(data, filename) {
      if (window.navigator.msSaveOrOpenBlob) {
        var bstr = atob(data.split(",")[1]);
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        var blob = new Blob([u8arr]);
        window.navigator.msSaveOrOpenBlob(blob, "chart-download" + "." + "png");
      } else {
        // 这里就按照chrome等新版浏览器来处理
        const a = document.createElement("a");
        a.href = data;
        a.download = filename;
        let event = document.createEvent("MouseEvents");
        event.initMouseEvent(
          "click",
          true,
          false,
          window,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
        a.dispatchEvent(event);
      }
    },
    async switching() {
      const { PLATFORM_FLAG } = await this.$store.dispatch("querySystemConfig");
      // 需要更换背景的商户 (或者将背景图放在外部文件)
      const client = ["by318", "by347"];
      const picture = client.includes(PLATFORM_FLAG) ? PLATFORM_FLAG : "bg";
      this.Businesses = require(`@/assets/images/${picture}.png`);
    },
  },
};
</script>

<style lang="less" scoped>
@imgSrc: "~@/assets/images";
@deep: ~">>>";
.expend-body {
  height: 677px;
  width: 756px;
  position: absolute;

  .div-item {
    width: 194px;
    height: 64px;
    position: absolute;
    bottom: 90px;
    left: 28px;
    font-size: 17px;
    text-align: center;
    color: #fff;
  }
  .img-item1 {
    position: absolute;
    top: 392px;
    left: 279.5px;
    width: 26%;
  }
  .img-item2 {
    // position: absolute;
    // left: 50px;
    // top: 400px;
    // width: 20%;
    position: absolute;
    left: 20px;
    top: 350px;
    width: 30%;
  }
  .ivu-carousel-item {
    position: relative;
  }
}
.expend-box {
  width: 756px;
  margin: 0 auto;
  .expend-panel {
    width: 756px;
    height: 677px;

    /*   &.bg1 {
      background: url("@{imgSrc}/tg_bg1.png") no-repeat;
    } */
    /*     &.bg1 {
      background: url("@{imgSrc}/photo_2023-11-29_22-03-32.jpg") no-repeat;
      background-size: 65%;
    } */
    /* &.bg3 {
      @{deep} .qr-wrap {
        background: url("@{imgSrc}/ewm_bg3.png") no-repeat;
      }
      background: url("@{imgSrc}/tg_bg3.png") no-repeat;
    } */
    /* &.bg2 {
      background: url("@{imgSrc}/photo_2023-11-29_22-03-39.jpg") no-repeat;
      background-size: 65%;
    }
    &.bg3 {
      background: url("@{imgSrc}/photo_2023-11-29_22-03-43.jpg") no-repeat;
      background-size: 65%;
    }
    &.bg4 {
      background: url("@{imgSrc}/photo_2023-11-29_22-03-48.jpg") no-repeat;
      background-size: 65%;
    }
    &.bg5 {
      background: url("@{imgSrc}/photo_2023-11-29_22-03-52.jpg") no-repeat;
      background-size: 65%;
    }
    &.bg6 {
      background: url("@{imgSrc}/tg_bg6.jpg") no-repeat;
    }
    &.bg7 {
      background: url("@{imgSrc}/tg_bg7.jpg") no-repeat;
    }
    &.bg8 {
      background: url("@{imgSrc}/tg_bg8.jpg") no-repeat;
    }
    &.en {
      &.bg1 {
        background: url("@{imgSrc}/en_tg_bg1.jpg") no-repeat;
      }
      &.bg2 {
        background: url("@{imgSrc}/en_tg_bg2.jpg") no-repeat;
      }
      &.bg3 {
        background: url("@{imgSrc}/en_tg_bg3.jpg") no-repeat;
      }
      &.bg4 {
        background: url("@{imgSrc}/en_tg_bg4.jpg") no-repeat;
      }
      &.bg5 {
        background: url("@{imgSrc}/en_tg_bg5.jpg") no-repeat;
      }
      &.bg6 {
        background: url("@{imgSrc}/en_tg_bg6.jpg") no-repeat;
      }
      &.bg7 {
        background: url("@{imgSrc}/en_tg_bg7.jpg") no-repeat;
      }
      &.bg8 {
        background: url("@{imgSrc}/en_tg_bg8.jpg") no-repeat;
      }
    } */
    &.userInfo-right {
      .qrCode-info {
        top: 390px;
        left: 0;
      }
      @{deep} .qr-wrap {
        .qr-code {
          width: 150px;
          height: 150px;
          canvas {
            width: 100%;
            height: 100%;
          }
        }
      }
      @{deep} .user {
        position: absolute;
        right: 0;
        top: 64px;
        font-size: 14px;
        padding: 0;
        width: 245px;
        .val {
          max-width: inherit;
          min-width: inherit;
          width: 110px;
        }
        .item {
          .wrap {
            border-bottom: 1px solid #ffd253;
            margin-bottom: 8px;
            padding-bottom: 4px;
          }
          &:first-child {
            .val {
              width: 115px;
            }
          }
        }
        .btn {
          padding: 2px 8px;
          font-size: 12px;
          white-space: nowrap;
        }
      }
    }
  }
}
</style>

<style lang="less">
.expend-body {
  .ivu-carousel-arrow.left {
    left: -15px;
  }
  .ivu-carousel-arrow.right {
    right: -15px;
  }
}
.saveQr {
  width: 163px;
  height: 36px;
  display: block;
  line-height: 36px;
  text-align: center;
  font-size: 15px;
  border-radius: 5px;
  margin: 30px auto 0;
  color: #fff !important;
  cursor: pointer;
  /* background-color: #bf1204; */
  position: relative;
  top: 690px;
}
</style>
