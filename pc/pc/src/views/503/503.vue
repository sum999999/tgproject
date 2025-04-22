<template>
  <div class="body">
    <div class="contanier clearfix">
      <img
        class="icon-1"
        src="../../assets/images/503/icon-1.png"
        alt=""
      >
      <div class="cont">
        <div class="title">
          {{codeData.maintainTitle}}
        </div>
        <div class="time">
          {{$tex("非常抱歉给你带来不便！")}}
        </div>
        <div class="explain">
          <p class="dear">
            {{$tex("亲爱的玩家朋友")}}：
          </p>
          <div class="text">
            <p>{{codeData.maintainNotice}}</p>
            <p>{{$tex("更新时间")}}：{{maintainTime}}</p>
            <p>{{$tex("更新方式")}}：{{$tex(codeData.maintainType)}}</p>
            <p>{{$tex("更新内容")}}：{{codeData.maintainContent}}</p>
          </div>
          <a
            :href="codeData.maintainContact"
            class="gokf"
            target="_blank"
          >
            <i class="kf"></i>
            {{$tex("联系在线客服")}}</a>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import router from '@/router';
  import Utils from "@/utils/utils";
  import { convert2LocalDateTime } from "@/filters/index.js"

  export default {
    name: 'code503',
    beforeRouteEnter (to, from, next) {
      const {name, fullPath, path} = from;
      if (!name && fullPath === "/" && path === "/") {
        router.push("/");
      }
      next();
    },
    data() {
      return {};
    },
    computed: {
      codeData() {
        let data = localStorage.getItem("CODE_503");
        let result = JSON.parse(data) || {};
        result.maintainContact = Utils.escapeHtml(result.maintainContact);
        return result;
      },
      maintainTime() {
        const maintainTime = this.codeData.maintainTime;
        if (!maintainTime) {
          return '';
        }
        const times = maintainTime.split(' - ').map(time => {
          return time.trim();
        });
        const [ ltime, rtime ] = times;
        return `${convert2LocalDateTime(ltime)} - ${convert2LocalDateTime(rtime)}`
      }
    },
    methods: {

    }
  };
</script>

<style scoped lang="less">
@imgSrc: "~@/assets/images/503/";
@vw: 6.5vw;
.body {
  position: relative;
  background: url("@{imgSrc}/bg.jpg") 0 0 repeat;
  margin: 0 auto;
  min-height: 100vh;
  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 0;
    width: 100%;
    height: 65px;
    background: url("@{imgSrc}/bg-top.jpg") 0 0 repeat;
  }
  &::before {
    top: 0;
  }
  &::after {
    bottom: 0;
  }
  .contanier {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 710px;
    height: 300px;
    margin-top: -150px;
    margin-left: -270px;
  }
  .icon-1 {
    float: left;
    margin-right: 46px;
    width: 260px;
    display: block;
  }
  .cont {
    float: left;
    width: 400px;
    margin-top: -20px;
    line-height: 26px;
    .dear {
      display: block;
    }
    .title {
      font-size: 66px;
      color: #fff;
      line-height: 70px;
      margin-bottom: 12px;
    }
    .time {
      font-size: 18px;
      margin-bottom: 12px;
      color: #fff;
    }
    .explain {
      color: #ffbd00;
      font-size: 14px;
      p {
        color: #ffbd00;
      }
      .text {
        margin-bottom: 22px;
      }
    }
  }
  .gokf {
    display: block;
    width: 226px;
    height: 54px;
    line-height: 54px;
    font-size: 18px;
    text-align: center;
    color: #212121;
    border-radius: 9px;
    background-image: linear-gradient(to bottom, #fde376, #e2b505);
    .kf {
      display: inline-block;
      width: 28px;
      height: 30px;
      background: url("@{imgSrc}/bn_kf.png") 0 0 no-repeat;
      background-size: 100% 100%;
      vertical-align: middle;
    }
  }
}
</style>
