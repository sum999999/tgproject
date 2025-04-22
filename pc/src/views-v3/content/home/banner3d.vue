<template>
  <div class="banner-wrap">
    <section
      id="cuteslider_3_wrapper"
      class="cs-circleslight"
      @click="goUrl($event)"
    >
      <div
        id="cuteslider_3"
        class="cute-slider"
        data-width="1172"
        data-height="466"
        data-overpause="true"
        default-url="/Promotion"
      >
        <ul data-type="slides">
          <li
            v-for="(item) in list"
            :key="item.resourceId"
            :data-delay="sysCarouselDelay"
            data-src="5"
            data-trans3d="tr6,tr17,tr22,tr23,tr29,tr27,tr32,tr34,tr35,tr53,tr54,tr62,tr63,tr4,tr13,tr45"
            data-trans2d="tr3,tr8,tr12,tr19,tr22,tr25,tr27,tr29,tr31,tr34,tr35,tr38,tr39,tr41"
          >
            <img
              :src="item.netUrl"
              :data-src="item.netUrl"
              :data-thumb="item.netUrl"
            >
          </li>
        </ul>
        <ul data-type="controls">
          <li data-type="link"></li>
          <li data-type="previous"></li>
          <li data-type="next"></li>
          <li
            data-type="slidecontrol"
            data-thumb="true"
            data-thumbalign="up"
          ></li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import { mapGetters } from 'vuex'

let vm = null
export default {
  data() {
    return {
      list: [],
      imgList: null,
      curListIndex: 0,
    }
  },
  watch: {
    list(newVal, oldVal) {
      if (!isEmpty(newVal) && !isEqual(newVal, oldVal)) {
        this.$nextTick(() => {
          var cuteslider3 = new Cute.Slider()
          cuteslider3.setup('cuteslider_3', 'cuteslider_3_wrapper')
          cuteslider3.api.addEventListener(Cute.SliderEvent.CHANGE_END, (event) => {
            this.curListIndex = event.target._currentSlide.index
          })
        })
      }
    },
  },
  computed: {
    ...mapGetters(['sysCarouselDelay']),
  },
  updated() {
    if (this.list.length > 0) {
    }
  },
  methods: {
    goUrl(event) {
      if (['br-controls'].indexOf(event.target.className) === -1) {
        return
      }
      let banner = this.list[this.curListIndex]
      let { targetUrl, contentType, resourceId } = banner
      if (contentType === -1) {
        if (targetUrl) {
          if (targetUrl.indexOf('http') > -1) {
            window.open(targetUrl.trim(), '_blank')
            return true
          } else {
            this.$router.push(targetUrl.trim())
          }
        }
      } else if (contentType === 1 || contentType === 2) {
        this.$router.push({
          path: `/active/${resourceId}`,
        })
      } else if (contentType === 3) {
        this.$router.push('/active')
      }
    },
  },
  created() {
    vm = this
    this.$http.post('/api/v2/cms/queryBanners', { frontType: 'pc' }, { unenc: true }).then((response) => {
      if (response.data.code !== 0) return
      this.list = response.data.data
    })
  },
  beforeDestroy() {
    clearInterval(this.autoPlayObj)
  },
}
</script>
<style lang="less" scoped>
    @deep: ~'>>>';
    .banner-wrap @{deep}{
        cursor: pointer;
        position: relative;
        height:466px;
        z-index: 3;
        border-radius: 10px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        overflow:hidden;

        #cuteslider_3_wrapper {
            position: relative;
            width: 1172px;
            height: 466px;
            overflow: hidden;
        }

        #cuteslider_3 >div:nth-last-child(1) img{
            width: 1172px !important;
            height: 466px !important;
        }

        .cute-slider {
            position: relative;
            visibility: hidden;
            overflow: hidden;
        }

        .cute-ie8 *,
        .cute-ie7 * {
            filter: inherit;
            opacity: inherit;
        }

        /* Slider Controls */

        .br-controls {
            position: absolute;
            z-index: 10;
        }

        .br-next,
        .br-previous,
        .br-slidecontrol,
        .br-thumb-bottom .br-thumb-img,
        .br-thumb-up .br-thumb-img,
        .br-thumblist {
            position: absolute;
        }

        .br-slidecontrol {
            list-style: none;
            cursor: auto !important;
        }

        .br-slidecontrol ul {
            margin: 0px;
            padding: 0px;
            height: 0px;
        }

        .br-slidecontrol ul li {
            display: block;
            position: relative;
            float: left;
            cursor: pointer !important;
        }

        .br-slidecontrol ul li .br-control-selected {
            display: none;
        }

        .br-thumb-bottom,
        .br-thumb-up {
            position: relative;
        }

        .br-thumblist {
            width: 100%;
            text-align: center;
            height: 0px;
            left: 0px;
            bottom: 0px;
        }

        .br-thumblist-content .br-list-thumb img {
            cursor: pointer !important;
        }

        .br-thumb-img img {
            height: 100% !important;
        }

        .br-slideinfo .top,
        .br-slideinfo .bottom {
            width: 100%;
        }

        .br-slideinfo .right,
        .br-slideinfo .left {
            height: 100%;
        }

        .br-slideinfo .more-btn {
            cursor: pointer !important;
            display: block;
            position: relative;
            text-decoration: none;
        }

        .br-slideinfo .subtitle,
        .br-slideinfo .title,
        .br-slideinfo .text {
            display: block;
        }

        /* Slider Timer */

        .br-circle-timer,
        .br-circle-timer .br-timer-dot,
        .br-bar-timer,
        .br-bar-timer .br-timer-bar {
            position: absolute !important;
        }

        .br-circle-timer .br-timer-dot {
            left: 50% !important;
            top: 50% !important;
        }

        /* Slider Captions */

        .br-captions div {
            position: absolute;
            text-shadow: none;
        }

        /* Slider Video */

        .br-video .play-btn,
        .br-video .close-btn {
            background-repeat: no-repeat;
            cursor: pointer !important;
            position: absolute;
        }

        .br-video .video-cont {
            position: absolute;
            z-index: 2;
        }

        .cute-ie8 .video-cont,
        .cute-ie7 .video-cont {
            z-index: auto !important;
        }

        /* Slider Shadow */

        .cute-shadow {
            width: 100%;
        }

        .cute-shadow img {
            max-width: 100%;
        }

        /* Slider Loading */

        .br-loading {
            position: absolute;
            top: 50%;
            left: 50%;
            z-index: 101;
        }

        .br-large-loading {
            position: absolute;
            top: 50%;
            left: 50%;
            z-index: 100;
        }

        .br-loading .img,
        .br-large-loading .img {
            width: 100%;
            height: 100%;
        }

        /* Trying to remove all the default global styles of WordPress :) */

        .cute-slider img {
            max-width: none !important;
        }

        .cute-slider img,
        .entry-content .cute-slider img,
        .comment-content .cute-slider img,
        .widget .cute-slider img,
        .cute-shadow img,
        .entry-content .cute-shadow img,
        .comment-content .cute-shadow img,
        .widget .cute-shadow img {
            border-radius: 0px;
            box-shadow: none;
            border: 0px;
            margin: 0px;
        }

        .entry-content .cute-slider *,
        .comment-content .cute-slider *,
        .widget .cute-slider * {
            line-height: normal;
            padding: 0px;
            outline: none;
            border: 0px;
            margin: 0px;
        }

        .cute-slider br.clear {
            clear: both;
        }

        .top div,
        .right div,
        .bottom div,
        .left div {
            padding: 20px !important;
        }

        .br-infocontent .title {
            background: none !important;
            margin: 0px !important;
            padding: 0px !important;
        }

        .br-infocontent .text {
            text-align: justify;
            margin: 10px 0px 0px 0px !important;
            padding: 0px !important;
        }
        /*#cuteslider_3_wrapper {*/
        /*    position: absolute;*/
        /*    top: 0;*/
        /*    left: 50%;*/
        /*    z-index: 0;*/
        /*    width: 1920px;*/
        /*    height: 350px;*/
        /*    margin-left: -960px;*/
        /*    overflow: hidden;*/
        /*}*/
        /* Slider Controls */

        .cs-circleslight .br-controls {
            background-image: url('~@/assets/images/cute3d/trans.png');
        }

        .cs-circleslight .br-next,
        .cs-circleslight .br-previous,
        .cs-circleslight .br-slidecontrol ul li,
        .cs-circleslight .br-slidecontrol ul li .br-control-selected,
        .cs-circleslight .br-circle-timer .br-timer-dot,
        .cs-circleslight .br-video .play-btn,
        .cs-circleslight .br-video .close-btn,
        .cs-circleslight .br-large-loading,
        .cs-circleslight .br-loading {
            background-image: url('~@/assets/images/cute3d/controls.png');
        }

        .cs-circleslight .br-previous,
        .cs-circleslight .br-next {
            width: 40px;
            height: 40px;
            top: 50%;
            margin-top: -20px;
            filter: none !important;
        }

        .cs-circleslight .br-previous {
            left: 10px;
            background-position: 0px 0px;
        }

        .cs-circleslight .br-next {
            right: 10px;
            background-position: -60px 0px;
        }

        .cs-circleslight .br-previous:hover {
            background-position: 0px -60px;
        }

        .cs-circleslight .br-next:hover {
            background-position: -60px -60px;
        }

        .cs-circleslight .br-slidecontrol {
            width: 100%;
            bottom: 30px;
            right: 0px;
        }

        .cs-circleslight .br-slidecontrol ul {
            margin: 0px;
            padding: 0px 9px 0 83px;
        }

        .cs-circleslight .br-slidecontrol ul li {
            display: inline-block !important;
            float: none !important;
            filter: none !important;
            width: 26px;
            height: 4px;
            border-radius: 4px;
            margin-right: 15px;
            background: rgba(0, 0, 0, 0.5);
            opacity: 1;
        }

        .cs-circleslight .br-slidecontrol ul li .br-control-selected {
            width: 26px;
            height: 4px;
            background: #fed136;
        }

        .cs-circleslight .br-slidecontrol ul li:hover {
            background: #fed136;
        }

        .cs-circleslight .br-thumb-bottom {
            left: -33px;
        }

        .cs-circleslight .br-thumb-up {
            left: -33px;
            top: -143px;
            filter: none !important;

        }

        .cs-circleslight .br-thumb-frame {
            background-image: url('~@/assets/images/cute3d/thumb-frame.png');
        }

        .cs-circleslight .br-thumb-bottom .br-thumb-frame {
            background-position: -0px -7px;
            width: 92px;
            height: 95px;
        }

        .cs-circleslight .br-thumb-up .br-thumb-frame {
            background-position: -89px 1px;
            width: 92px;
            height: 95px;
        }

        .cs-circleslight .br-thumb-bottom .br-thumb-img,
        .cs-circleslight .br-thumb-up .br-thumb-img {
            top: 17px;
            left: 15px;
            width: 60px;
            height: 60px;
        }

        .cs-circleslight .br-thumb-img img {
            position: static !important;
        }

        .cs-circleslight .br-thumblist {
            margin-bottom: 33px;
        }

        .cs-circleslight .br-thumblist-container {
            z-index: 20;
            position: relative;
            padding: 3px;
            height: 50px;
            display: inline-block;
            max-width: 40%;
            border-radius: 3px;
            -moz-border-radius: 3px;
            -webkit-border-radius: 3px;
            background: #f3f3f3;
            background: -moz-linear-gradient(top, #ffffff 0%, #eeeeee 100%);
            background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#ffffff), color-stop(100%,#eeeeee));
            background: -webkit-linear-gradient(top, #ffffff 0%,#eeeeee 100%);
            background: -o-linear-gradient(top, #ffffff 0%,#eeeeee 100%);
            background: -ms-linear-gradient(top, #ffffff 0%,#eeeeee 100%);
            background: linear-gradient(to bottom, #ffffff 0%,#eeeeee 100%);
            filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#eeeeee',GradientType=0 );
            box-shadow: 0px 2px 10px -4px black;
        }

        .cs-circleslight .br-thumblist-frame {
            margin-top: -3px;
            overflow: hidden;
            height: 100%;
            position: relative;
            top: 3px;
        }

        .cs-circleslight .br-thumblist-content {
            white-space: nowrap;
            text-align: center;
            display: inline-block;
            position: relative;
        }

        .cs-circleslight .br-thumblist-content .br-list-thumb {
            display: inline-block;
            margin-left: 3px;
        }

        .cs-circleslight .br-thumblist-content,
        .cs-circleslight .br-thumblist-content .br-list-thumb,
        .cs-circleslight .br-thumblist-content .br-list-thumb img {
            height: 100%;
        }

        .cs-circleslight .br-thumblist-content .br-list-thumb img {
            width: 50px;
            transition: all .3s ease-in-out;
            -o-transition: all .3s ease-in-out;
            -ms-transition: all .3s ease-in-out;
            -moz-transition: all .3s ease-in-out;
            -webkit-transition: all .3s ease-in-out;
        }

        .cs-circleslight .br-thumblist-content .br-list-thumb img:hover {
            opacity: .4;
            filter: alpha(opacity=40);
        }

        .cs-circleslight .br-thumblist-content .br-list-thumb:first-child {
            margin-left: 0px;
        }

        .cs-circleslight .br-slideinfo .br-infocontent {
            background: url('~@/assets/images/cute3d/info-pat.png');
            font-size: 12px;
        }

        .cs-circleslight .br-infocontent .title,
        .cs-circleslight .br-infocontent .text {
            text-shadow: 0px 1px 0px white;
        }

        .cs-circleslight .br-slideinfo .right,
        .cs-circleslight .br-slideinfo .left {
            width: 300px;
        }

        .cs-circleslight .br-slideinfo .top div {
            padding: 20px 60px !important;
        }

        .cs-circleslight .br-slideinfo .right div {
            padding-right: 60px !important;
        }

        .cs-circleslight .br-slideinfo .bottom div {
            padding: 20px 60px 40px 60px !important;
        }

        .cs-circleslight .br-slideinfo .left div {
            padding-left: 60px !important;
        }

        .cs-circleslight .br-slideinfo .title {
            font: bold 18px/normal 'Open Sans', Arial, sans-serif;
            color: #333;
        }

        .cs-circleslight .br-slideinfo .text{
            font: 12px/17px 'Open Sans', Arial, sans-serif;
            color: #444;
        }

        .cs-circleslight .br-slideinfo .more-btn {
            height: 34px;
            color: #555;
            font: 12px/34px 'Open Sans', Arial, sans-serif;
            padding: 0px 10px;
            float: right;
            margin: 8px 0px 0px 15px !important;
            border-radius: 30px;
            -moz-border-radius: 30px;
            -webkit-border-radius: 30px;
            background: #fff;
            border: 1px solid #fff;
        }

        .cs-circleslight .br-slideinfo .more-btn:hover {
            color: #111 !important;
        }

        /* Slider Timer */

        .cs-circleslight .br-circle-timer {
            top: 5px;
            left: 5px;
            width:28px;
            height:28px;
        }

        .cs-circleslight .br-circle-timer .br-timer-dot {
            width: 8px;
            height: 8px;
            margin-left: -4px;
            margin-top: -4px;
            background-position: -30px -120px;
        }

        .cs-circleslight .br-circle-timer .br-timer-dot:hover {
            background-position: -30px -135px;
        }

        .cs-circleslight .br-circle-timer .br-timer-stroke {
            opacity: .5;
        }

        .cs-circleslight .br-bar-timer {
            height: 6px;
            bottom: 0px;
        }

        .cs-circleslight .br-bar-timer .br-timer-glow {
            width: 104px;
            height: 7px;
            background-image: url('~@/assets/images/cute3d/light-timer-glow.png');
            filter: none !important;
        }

        .cs-circleslight .br-bar-timer .br-timer-bar {
            height: 2px;
            top: 4px;
            background-color: white;
        }

        /* Slider Captions */

        .cs-circleslight .br-captions {
            font-size:100%;
        }

        /* Slider Video */

        .cs-circleslight .br-video .play-btn {
            width: 50px;
            height: 50px;
            background-position: -120px -120px;
            top: 50%;
            left: 50%;
            margin: -25px 0 0 -25px;
            filter: none !important;
        }

        .cs-circleslight .br-video .play-btn:hover {
            background-position: -180px -120px;
        }

        .cs-circleslight .br-video .close-btn {
            width: 20px;
            height: 20px;
            right: 5px;
            top: 5px;
            background-position: -90px -120px;
            filter: none !important;
        }

        .cs-circleslight .cute-ie8 .br-video .close-btn {
            right: 0px;
            top: -25px;
        }

        .cs-circleslight .br-video .close-btn:hover {
            background-position: -90px -150px;
        }

        .cs-circleslight .br-video .video-cont {
            background: black;
            width:100%;
            height:100%;
        }

        /* Slider Shadow */

        .cs-circleslight .cute-shadow {
            margin-top: -2%;
        }

        /* Slider Loading */

        .cs-circleslight .br-loading,
        .cs-circleslight .br-large-loading {
            width: 40px;
            height: 40px;
            background-position: -240px 0px;
            margin: -20px;
            filter: none !important;
        }

        .cs-circleslight .br-loading .img,
        .cs-circleslight .br-large-loading .img {
            background: url("~@/assets/images/cute3d/loading.gif") no-repeat center center;
        }

        .cs-circleslight .br-next {
            width: 75px;
            height: 75px;
            right: 17px;
            border-radius: 50%;
            text-align: center;
            background-color: rgba(0, 0, 0, .6);
            background-size: 17px 31px;
            background-image: url('~@/assets/images-v3/index/banner-next-angle.png');
            background-repeat: no-repeat;
            background-position: center center;
            &:hover {
                background-color: rgba(0, 0, 0, .5);
                background-repeat: no-repeat;
                background-position: center center;
            }
        }
        .cs-circleslight .br-previous {
            width: 75px;
            height: 75px;
            left: 17px;
            border-radius: 50%;
            text-align: center;
            background-color: rgba(0, 0, 0, .6);
            background-size: 17px 31px;
            background-image: url('~@/assets/images-v3/index/banner-pre-angle.png');
            background-repeat: no-repeat;
            background-position: center center;
            &:hover {
                background-color: rgba(0, 0, 0, .5);
                background-repeat: no-repeat;
                background-position: center center;
            }
        }
    }
</style>
