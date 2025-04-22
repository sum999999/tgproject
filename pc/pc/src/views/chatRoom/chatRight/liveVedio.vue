<template>
  <div class="live-vedio nice-scroll"
       v-loading="loading">
    <div v-show="!showLiveCurrent">
      <span class="refresh"
            @click="queryLiveList">
        <i class="ivu-icon ivu-icon-refresh"></i>
      </span>
      <ul class="live-list clearfix">
        <li v-for="(item,idx) in liveList"
            :key="idx"
            @click="getLiveRsp(item)">
          <div class="img-wrap">
            <img class="img"
                 :src="item.roomImgSrc"
                 alt="">
            <span class="hot">
              <i class="iconfont icon-hot"></i>{{item.hotNum | hotNumFilter}}</span>
          </div>
          <div class="name">{{item.nickname}}</div>
        </li>
      </ul>
    </div>
    <div class="live-current"
         v-show="showLiveCurrent">
      <div class="info">
        <img class="hd"
             :src="currentVedio.avatar"
             alt="">
        <div class="cont">
          <p class="name">{{currentVedio.nickname}}</p>
          <p class="num">{{currentVedio.hotNum | hotNumFilter}}</p>
        </div>
      </div>
      <i class="iconfont icon-close"
         @click="closeLiveCurrent"></i>
      <!--   <video-player class="video-player-box" ref="videoPlayer"style="{backgroundImage:`url(${currentVedio.roomImgSrc})`}" :options="playerOptions" :playsinline="true" customEventName="customstatechangedeventname">
                </video-player> -->
      <div class="vedio"
           v-if="currentVedio && currentVedio.src">
        <embed width="444"
               height="100%"
               allownetworking="all"
               allowscriptaccess="always"
               :src="currentVedio.src"
               quality="high"
               bgcolor="#000"
               wmode="transparent"
               allowfullscreen="true"
               allowFullScreenInteractive="true"
               type="application/x-shockwave-flash">
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      liveList: [],
      showLiveCurrent: false,
      loading: false,
      currentVedio: {}
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  filters: {
    hotNumFilter(val) {
      if (val >= 10000) {
        return (val / 10000).toFixed(2) + "万";
      } else {
        return val;
      }
    }
  },
  methods: {
    queryLiveList() {
      //  if (!this.user.userCode) return  userId: true, unenc: true
      this.loading = true;
      this.$http
        .post(
          "/api/v2/chat/getLiveList",
          { offset: "0", limit: "30", cid: "douyu" },
          { unenc: true, stopDialog: true }
        )
        .then(response => {
          this.loading = false;
          if (response.data.code !== 0) return;
          this.liveList = response.data.data;
        });
    },
    getLiveRsp(item) {
      // 获取直播流
      this.currentVedio = item;
      this.currentVedio.src =
        "https://staticlive.douyucdn.cn/common/share/play.swf?room_id=" +
        item.roomId;
      this.showLiveCurrent = true;
      /*   this.$http.post('/api/v2/chat/getLiveRsp', { roomId: item.roomId, rate: '1' }, { unenc: true })
            .then(response => {
                if (response.data.code !== 0) return
                // this.currentVedio = Object.assign(this.currentVedio, response.data.data.liveRsp);
                this.currentVedio.src = response.data.data.liveUrl;
                this.playerOptions.poster = this.currentVedio.roomImgSrc
                this.showLiveCurrent = true
            }) */
    },
    closeLiveCurrent() {
      this.showLiveCurrent = false;
    }
  },
  created() {
    this.queryLiveList();
  }
};
</script>

<style scoped lang="less">
.live-vedio {
  position: absolute;
  top: 0;
  bottom: 203px;
  width: 100%;
  overflow: auto;
  .iframe {
    width: 100%;
    min-height: 100%;
  }
  .vedio {
    height: 100%;
    background-color: #000;
    &::before {
      color: #fff;
      content: "加载中...";
      position: absolute;
      left: 50%;
      margin-left: -10px;
      top: 50%;
      margin-top: -10px;
    }
    embed {
      position: relative;
      z-index: 1;
    }
  }
  .refresh::before {
    content: "";
    position: fixed;
    width: 2px;
    height: 50px;
    background-color: #2d97ff;
    right: 44px;
    top: 105px;
  }
  .refresh {
    position: fixed;
    right: 30px;
    z-index: 100;
    top: 150px;
    background: radial-gradient(#138aff, #409fff, #84c3ff);
    border-radius: 100%;
    width: 30px;
    height: 30px;
    line-height: 34px;
    text-align: center;
    text-indent: 2px;
    opacity: 0.5;
  }
  .refresh:hover {
    opacity: 1;
  }
  .ivu-icon {
    cursor: pointer;
    color: #fff;
    font-size: 20px;
  }
}

.live-list {
  padding: 20px;
  margin-left: -5%;
  li {
    width: 45%;
    margin-left: 5%;
    margin-bottom: 3%;
    float: left;
    cursor: pointer;
    .img-wrap {
      position: relative;
      width: 100%;
      height: 110px;
      overflow: hidden;
    }
    .hot {
      position: absolute;
      right: 5px;
      top: 5px;
      background: rgba(0, 0, 0, 0.5);
      padding: 1px 5px;
      font-size: 14px;
      color: #fff;
      border-radius: 5px;
      .icon-hot {
        font-size: 14px;
        margin-right: 5px;
      }
    }
    .img {
      width: 100%;
      border-radius: 4px;
    }
  }
}
.live-current {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  .icon-close {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 25px;
    cursor: pointer;
    z-index: 10;
    color: #fff;
    &:hover {
      color: #fff;
    }
  }
  .info {
    position: absolute;
    left: 10px;
    top: 10px;
    width: 90%;
    z-index: 10;
    color: #fff;
    .hd {
      width: 30px;
      height: 30px;
      border-radius: 100%;
      float: left;
      margin-right: 10px;
    }
    .cont {
      line-height: 16px;
    }
    .num {
      font-size: 12px;
    }
  }
}
</style>

<style lang="less">
.video-player-box {
  .video-js {
    width: 100%;
    min-height: 300px;
    .vjs-big-play-button {
      left: 180px;
      top: 50%;
      margin-top: -20px;
    }
  }
}
.live-vedio {
  .lee-globaloading {
    .load-3 {
      top: 150px;
    }
  }
}
</style>

