<template>
  <div class="qrCode-info">
    <div class="qr-wrap">
      <img class="hd w-full" :src="user.imgUrl" alt="" />
      <div :id="this.idx" :ref="this.idx" class="qr-code"></div>
    </div>
    <div class="user clearfix">
      <!--   <div class="hd-wrap">
        <img class="hd"
             :src="user.imgUrl"
             alt="">
      </div> -->
      <div class="item">
        <div class="wrap">
          <label class="key">{{ $tex("邀请人") }}：</label>
          <span class="val">{{ user.nickName || user.userCode }}</span>
        </div>
      </div>
      <div class="item">
        <div class="wrap">
          <label class="key">{{ $tex("邀请码") }}：</label>
          <span class="val">{{ data.expandCode }}</span>
        </div>
        <span class="btn" id="hideBtn" @click="onSure">{{ $tex("选择") }}</span>
      </div>
      <div class="newPosition">
        <div class="newWrap ">
          <label class="key">{{ $tex("分享链接") }}：</label>
          <div class="newVal">{{ qrCodeUrlText }}</div>
          <img
            class="img"
            src="@/assets/images/fuzhi.png"
            alt=""
            @click="oncopy()"
          />
        </div>
        <!-- <span class="btn" id="hideBtn" @click="oncopy()">{{
          $tex("复制")
        }}</span> -->
      </div>
    </div>
  </div>
</template>
<script>
import QRCode from "@/utils/qrcode"; // import QRCode from "qrcodejs2"; 不使用网站太长会报错

export default {
  props: {
    idx: "",
    data: null,
    hideBtn: true,
  },
  data() {
    return {
      qrCodeUrlText: "",
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  watch: {
    data: {
      handler(v) {
        if (v) {
          this.handeleCreateQr();
        }
      },
      deep: true,
    },
  },
  methods: {
    oncopy() {
      navigator.clipboard.writeText(this.qrCodeUrlText).then(() => {
        this.$Modal.info({
          title: this.$tex("提示信息"),
          content: this.$tex("已复制"),
          onOk: () => {},
        });
      });
    },
    onSure() {
      this.$emit("on-sure");
    },
    handeleCreateQr() {
      this.$store.dispatch("querySystemConfig").then((data) => {
        this.hasMade = false;
        this.qrCodeUrl = data["PROMOTION_QRCODE_URL"];
        const { expandCode, platformCode } = this.data;
        // 2019.10.30 commont by xiaojiji
        // const qrCodeUrlText = `${
        //   this.qrCodeUrl
        // }?ttpaste=${expandCode}&ttcode=${platformCode}`;
        const preUrl = this.qrCodeUrl.split("?")[0];
        // const qrCodeUrlText = `${preUrl}?ttpaste=${expandCode}&ttcode=${platformCode}`;
        const qrCodeUrlText = `${this.qrCodeUrl}?exp=${expandCode}&ttcode=${platformCode}`;
        this.qrCodeUrlText = qrCodeUrlText;
        if (this.qrcode) {
          this.qrcode.clear(); // 清除代码
          this.qrcode.makeCode(qrCodeUrlText); // 生成另外一个二维码
          this.hasMade = true;
        } else {
          this.qrcode = new QRCode(this.idx, {
            text: qrCodeUrlText,
            // width: 160,
            // height: 160,
          });
          if (this.qrcode) {
            this.hasMade = true;
          }
        }
        this.$emit("has-made", this.hasMade);
      });
    },
  },
};
</script>

<style lang="less" scoped>
@imgSrc: "~@/assets/images";
@deep: ~">>>";
.qrCode-info {
  position: absolute;
  top: 260px;
  left: 0;
  width: 100%;
  color: #fff;
  padding: 25px;
  font-size: 22px;
  .user {
    padding: 15px 0 20px 150px;
    position: relative;
    left: 338px;
    font-size: 16px;
    .hd-wrap {
      // float: left;
      width: 104px;
      height: 104px;
      border-radius: 100%;
      background-color: #fff;
      text-align: center;
      margin-right: 25px;
    }
    .hd {
      display: inline-block;
      width: 100px;
      height: 100px;
      margin-top: 2px;
      border-radius: 100%;
      float: none;
    }
    .item {
      //   margin-right: 20px;
      .wrap {
        display: inline-block;
        width: 162px;
        border-bottom: 1px solid #b1c781;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 2px;
      }

      .val {
        max-width: 300px;
        min-width: 200px;
        text-overflow: ellipsis;
        // display: inline-block;
        vertical-align: middle;
        overflow: hidden;
        white-space: nowrap;
      }

      .key {
        display: inline-block;
        vertical-align: middle;
      }
    }
    .newPosition {
      display: flex;
      position: relative;
      top: 100px;
      left: -330px;
      .newWrap {
        display: flex;
        width: 360px;
        // border-bottom: 1px solid #b1c781;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 2px;
        .key {
          display: inline-block;
          vertical-align: middle;
          margin: auto;
        }
        .newVal {
          // max-width: 300px;
          // min-width: 200px;
          width: 280px;
          text-overflow: ellipsis;
          vertical-align: middle;
          overflow: hidden;
          white-space: nowrap;
          background: url("@{imgSrc}/huang_.png") no-repeat;
          background-size: 100% 100%;
          padding: 5px 5px 7px 14px;
          color: grey;
        }
        .img {
          width: 23px;
          height: 25px;
          margin: 5px 10px;
          cursor: pointer;
        }
      }
    }
    .btn {
      padding: 4px 10px;
      font-size: 16px;
      margin-left: 10px;
      cursor: pointer;
      position: relative;
      top: -8px;
    }
  }
}
.qr-wrap {
  text-align: center;
  padding-top: 10px;
  width: 164px;
  height: 164px;
  margin: -10px auto;
  position: relative;
  .qr-code {
    display: inline-block;
    position: relative;
    top: 135px;
    width: 140px;
    height: 140px;
    // background-color: #fff;
    @{deep} canvas {
      width: 140px;
      height: 140px;
    }
    @{deep} img {
      width: 100%;
    }
  }
  .hd {
    position: absolute;
    top: 130%;
    left: 50%;
    width: 40px;
    height: 40px;
    margin-left: -20px;
    margin-top: -20px;
    z-index: 1;
    padding: 2px;
    border-radius: 100%;
    background-color: #fff;
  }
}
</style>
