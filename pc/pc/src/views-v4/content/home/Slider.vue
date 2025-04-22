<template>
    <div class="notice-wrap ">
        <div class="content clearfix">
            <!-- 公告 -->
            <div class="txt"
            :class="{'hotPhone-txt':hotPhone}">
                <div class="clearfix">
                    <i class="iconfont icon-voice_open"></i>&nbsp;
                    <div
                    v-if="notice"
                    class="margquee">
                        <marquee
                            scrolldelay=60
                            scrollAmount=6>
                            <span
                            class="notice-cont"
                            v-html="notice"
                            @click="$router.push({path:'/newsList/announce'})"
                            ></span>
                        </marquee>
                    </div>
                </div>
            </div>
            <!-- 公告结束 -->
        </div>
    </div>
</template>
<script>
import headerMixin from "@/views-v4/common/module_vue/headerMixin.js";
export default {
    mixins: [headerMixin]
}
</script>
<style lang="less" scoped>
    .notice-wrap {
        position: relative;
        height: 36px;
        font-size: 12px;
        width:1040px;
        max-width: 1040px;
        margin:0 auto;
        border:2px solid #e0e3e5;
        border-radius: 18px;
        box-shadow: 0 0 10px rgba(0,0,0,.25);
        margin-top: 32px;
        padding-left:14px;
    .content {
      margin: 0 auto;
      height:100%;
      .txt {
        float: left;
        width: 100%;
        .txt-icon {
          float: left;
          margin-top: 7px;
        }
        .margquee {
          position: absolute;
          top:0;
          left:42px;
          width: 966px;
          line-height: 34px;
          overflow: hidden;
          marquee {
            height: 35px;
          }
          &:hover {
            span {
              cursor: pointer;
            }
          }
          span {
            margin: 0;
            white-space: nowrap;
            display: inline-block;
            * {
              display: inline-block;
              font-size: 12px !important;
              background: none !important;
              /*   color: #be1204 !important; */
              line-height: 0;
              * {
                display: inline-block;
                font-size: 12px !important;
                background: none !important;
                /*   color: #be1204 !important; */
              }
            }
          }
        }
      }
      ul {
        float: right;
        li {
          float: left;
          padding: 0 10px;
          border-right: 1px solid #7f7f7f;
          height: 14px;
          line-height: 14px;
          margin-top: 11px;
          .zxkf {
            /*  background: #ae291a; */
            color: #fff;
            padding: 2px 5px;
            border-radius: 5px;
          }
          .icon-zxkf {
            font-size: 12px;
            margin-right: 5px;
          }
          &.red-circle {
            position: relative;
            &:before {
              display: block;
              position: absolute;
              content: "";
              width: 12px;
              height: 12px;
              right: 3px;
              top: -5px;
              border-radius: 50%;
              /*   background: #be1204; */
              transform: scale(0.5);
            }
          }
          &:last-child {
            border-right: 0;
          }
          a {
            color: #7f7f7f;
            &:hover {
              /* color: @primary-color; */
            }
          }
        }
      }
    }
    .hotPhone {
      /*   color: #be1204; */
      height: 16px;
      .i-telephone2 {
        width: 16px;
        height: 17px;
        background-image: url(/static/images/icon.png);
        background-position: -169px -46px;
        background-repeat: no-repeat;
        vertical-align: middle;
      }
    }
  }
  .icon-voice_open{
    position: absolute;
    left:14px;
    width:28px;
    line-height: 35px;
    color:#b6b2b2;
  }
</style>
