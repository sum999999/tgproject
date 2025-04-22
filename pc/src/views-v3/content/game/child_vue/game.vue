<template>
  <div
    class="game-layout"
    v-loading="loading"
  >
    <div
      class="game-content"
      v-if="playForms.length"
    >
      <ul class="game-tab clearfix">
        <li
          class="game-tab-item clearfix"
          :class="{active: curTabIndex == index,disabled:item.platformStatus !='1'&&item.platformId!=='-1' }"
          @click="onTabItemClick(item,index)"
          v-for="(item, index) in playForms"
          :key="index"
        >
         <div class="title">{{item.typeName|tailName}}</div>
          <!-- <div class="name">{{item.code | subName}}</div> -->
          <!-- <div class="dsc middle">
            <div class="dsc-wrap">
              <div class="title">{{item.typeName|tailName}}</div>
            </div>
          </div> -->
          <span
            class="jjsx"
            v-if="item.platformStatus =='2'"
          ></span>
          <span
            class="whz"
            v-if="item.platformStatus =='3'"
          ></span>
        </li>
        <!-- 搜索 -->
        <li class="game-search">
          <i @click.stop="searchGame"></i>
           <Input v-model="gameName" style="width:200px;height: 36px;" type="text" @keyup.enter.native="searchGame"></Input>
        </li>
      </ul>
      <game-list
        ref="gameList"
        :code="code"
        :dataList="currentGameList"
        :showLoginGameTip="showLoginGameTip"
        @toggle-loading="toggleLoading"
        v-if="currentPlayForm.platformStatus=='1' || currentPlayForm.platformId==='-1'"
      ></game-list>
      <div
        v-if="currentPlayForm.platformStatus=='2'"
        class="ui-empty"
      >即将上线...</div>
      <div
        v-if="currentPlayForm.platformStatus=='3'"
        class="ui-empty"
      >维护中...</div>
      <div
        v-if="!currentPlayForm.platformStatus && currentPlayForm.platformId!=='-1'"
        class="ui-empty"
      >
        敬请期待...
      </div>

    </div>
    <div
      v-else
      class="ui-empty"
    >
      {{$tex("暂无数据")}}
    </div>
  </div>
</template>
<script>
  import { queryTypePlatforms } from "@/api/game";

const GetComponent = function(index) {
  return () => import(`./${index}`);
};
export default {
  name: "gameWp",
  props:['code'],
  data() {
    return {
      curTabIndex: 0,
      playForms: [],
      currentGameList: [],
      loading: false,
      gameCode: "",
      gameName: '',
      searchGameCode:'',
      showLoginGameTip: false //是否显示登录游戏的额度转换提示
      // gameList: {}
    };
  },
  computed: {
    currentPlayForm() {
      return (this.curTabIndex >= 0 && this.playForms[this.curTabIndex]) || {};
    }
  },
  filters: {
    subName(v) {
      if (!v) return "";
      let subName = v.split("_")[0];
      // return v.slice(0, v.length - 2)
      return subName;
    },
    tailName(v) {
      // if (!v) return "";
      // return v.replace(/^([a-zA-Z0-9])+(.*)$/, (match, p1, p2) => {
      //   return p2;
      // });
      return v;
    }
  },
  watch: {
    $route: {
      handler(n) {
        this.handlerData(n.params.id);
        this.gameName = '';
      },
      deep: true
    }
  },
  mounted() {
    // this.gameList = {}
    // this.loading = true;
    // this.$http.post('/party/v2/game/queryPlayForm', { isMain: "0" }, { unenc: true }).then(response => {
    //   this.loading = false;
    //   if (response.data.code !== 0) return
    //   let data = response.data.data
    //   let query = this.$route.query; //推广链接进来的
    //   this.playForms = data.filter(item => item.platformStatus != '0')
    //   if (this.playForms.length) {
    //     this.curTabIndex = this.playForms.findIndex(item => item.platformStatus == '1')
    //     if (query.type) this.curTabIndex = this.playForms.findIndex(item => item.platformCode === query.type); //2019 1.2 by xiaojiji 推广链接进来跳到指定类型
    //     let curPlayForm = this.playForms[this.curTabIndex];
    //     if (curPlayForm) {
    //       this.fetchGameList(curPlayForm.platformId, curPlayForm.platformCode)
    //     }
    //   }
    // })
  },
  async created() {
    this.gameList = {};
    let code = this.$route.params.id;
    let sysData = await this.$store.dispatch("querySystemConfig");
    this.showLoginGameTip =
      sysData["GAME_ACCOUNT_AUTO_TRANSFORM"] === "0" ? false : true;
    // console.log(this.showLoginGameTip);
    this.handlerData(code);
  },
  methods: {
    toggleLoading(val) {
      //loading显示隐藏
      this.loading = val;
      // console.log(this.loading);
    },
    searchGame() {
      this.$refs['gameList'].localSearch(this.gameName);
      // if(!this.gameName) return;
      // console.log(1);
      // this.loading = true;
      // this.$http.post('/party/v2/game/queryGameSearch',{code: this.searchGameCode,type: this.gameName},{unenc:true}).then(res =>{
      //   this.loading = false;
      //   if(res.data.code!==0) return;
      //   let listItem = res.data.data.list[0];
      //   if(listItem) {
      //       this.currentGameList = listItem.platformsRsps;
      //       return;
      //   }
      //   this.currentGameList = [];
      // })
      //  this.$http.post("/party/v2/game/queryPlatformGames",{ code: this.searchGameCode,name: this.gameName },{ unenc: true }).then(res => {
      //        this.loading = false;
      //       if (res.data.code !== 0) return;
      //       const data = res.data.data;
      //       console.log(data);

      //  })
    },
    handlerData(code) {
      if (code) {
        let newCode = code.includes("_") ? code.split("_")[1] : code;
        this.loading = true;
        queryTypePlatforms({ code: newCode }).then(res => {
            this.loading = false;
            if (res.data.code !== 0) return;
            this.playForms = res.data.data.list.filter(
              item => item.platformStatus != "0"
            );
            // let normalStatusItemIndex = 0
            // for (let i = 0; i < this.playForms.length; i++) {
            //   if (this.playForms[i] == '1') {
            //     normalStatusItemIndex = i
            //   }
            // }
            if (this.playForms.length) {
              if (code === "FISH") {
                //点击捕鱼按钮进来
                this.curTabIndex = 0;
                this.currentGameList = this.playForms[0].children;
                // debugger;
                this.searchGameCode = 'fish';
                // console.log(this.currentGameList);
                // debugger;
                // console.log
              } else {
                this.curTabIndex = this.playForms.findIndex(
                  item => item.code === code && item.platformStatus !== "2"
                );
                if (this.curTabIndex == -1) {
                  //可能不存在
                  this.curTabIndex = 0;
                  code = this.playForms[0].code;
                } else {
                  code = this.playForms[this.curTabIndex].code;
                }
                if (code) {
                  this.searchGameCode = code;
                  this.fetchGameList(code);
                } else {
                  this.currentGameList = this.playForms[0].children;
                  this.searchGameCode = '';
                  // debugger;
                }
              }
            } else {
              this.curTabIndex = 0;
              this.currentGameList = [];
              this.searchGameCode = '';
            }
          });
      }
    },
    fetchGameList(code) {
      // this.gameCode = code;
      // debugger;
      if (!this.gameList[code]) {
        this.loading = true;
        this.$http
          .post(
            "/party/v2/game/queryPlatformGames",
            { code: code },
            { unenc: true }
          )
          .then(res => {
            this.loading = false;
            if (res.data.code !== 0) return;
            let data = res.data.data.list;
            this.currentGameList = this.gameList[code] = data;
          });
      } else {
        this.fetchCurrentGameList(code);
      }
    },
    fetchCurrentGameList(code) {
      let { playForms, gameList, curTabIndex } = this;
      if (playForms.length) {
        this.currentGameList = this.gameList[code];
      } else {
        this.currentGameList = [];
      }
    },
    onTabItemClick(info, index) {
      this.gameName = '';
      if (info.platformStatus !== "1" && info.platformId !== "-1") return;
      this.curTabIndex = index;
      if (info.platformId === "-1") {
        this.currentGameList = info.children;
        this.searchGameCode = '';
      } else {
        this.fetchGameList(info.code);
        this.searchGameCode = info.code;
      }
    }
  },
  components: {
    gameList: GetComponent("gameList")
  }
};
</script>
<style scoped lang="less">
@deep: ~ '>>>';
.game-layout {
  // background: url("../../../assets/images/game/bg.jpg") no-repeat;
  background-size: cover;
  // padding: 10px 0;
  font-family: 'PingFang SC Regular';
}
.game-content {
  width: 1172px;
  margin: 0 auto;
  border:none;
  /*   border: 1px solid #be1204; */
  .ui-empty {
    padding: 150px 0;
  }
}
.game-tab {
  /*  background-color: #be1204; */
  // background-color: transparent;
  font-size: 0;
  background-color: @baseColor;
  padding:14px 50px 30px;
  border-radius: 10px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  .game-tab-item {
    padding: 0 20px;
    cursor: pointer;
    min-width: 90px;
    // width: 90px;
    height: 36px;
    display: inline-block;
    // height: 60px;
    // float: left;
    // line-height: 60px;
    text-align: center;
    margin-left: 15px;
    margin-top: 16px;
    color: @textLightColor;
    position: relative;
    border-radius: 36px;
    border: 1px solid @textLightColor;
    &.disabled {
      cursor: not-allowed;
    }
    .jjsx,
    .whz {
      position: absolute;
      right: -10px;
      top: -10px;
      width: 63px;
      height: 31px;
      z-index: 1;
    }
    .jjsx {
      // background: url("../../../assets/images/jjsx.gif");
    }
    .whz {
      // background: url("../../../assets/images/whz.gif");
    }
    > div {
      // float: left;
      // line-height: 1.2;
      height: 100%;
    }
    // .name {
    //   line-height: 60px;
    //   font-size: 36px;
    //   padding-right: 8px;
    // }
    // .dsc-wrap {
    //   display: inline-block;
    //   vertical-align: middle;
    //   text-align: left;
    // }
    .title {
      font-size: 14px;
      line-height: 36px;
      font-family: 'PingFang SC Medium';
    }
    // .en {
    //   font-size: 12px;
    // }
  }
  .game-search {
    display:inline-block;
    margin-left: 15px;
    margin-top: 15px;
    position: relative;
    i {
      position: absolute;
      top: 8px;
      right: 13px;
      display: block;
      width: 20px;
      height: 20px;
      background: url('~@/assets/images-v3/game/sousuo.png') no-repeat;
      z-index: 2;
      cursor:pointer;
    }
    .ivu-input-wrapper {
      vertical-align: initial;
      border-radius: 36px;
        @{deep}.ivu-input {
          padding: 0 16px;
          padding-right: 40px;
          height: 36px;
          border-radius: 36px;
          border: none;
          background-color: #000;
          caret-color: #fff;
          color: #fff;
      }
    }

  }
  .game-tab-item.active {
    // background-color: #fff;
    color:#000;
    background-color: @buttonColor;
    .dsc-wrap,
    .name {
      /*       color: #be1204; */
    }
  }
}
// .middle:after {
//   display: inline-block;
//   content: "";
//   height: 100%;
//   vertical-align: middle;
// }
</style>
