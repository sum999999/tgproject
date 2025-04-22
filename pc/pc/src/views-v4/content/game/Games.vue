<template>
    <div class="games">
        <div class="games-wrapper">
            <div class="games-top-div">
                <div class="games-search">
                    <Input v-model="gameName" type="text"  placeholder="请输入游戏名称"  @keyup.enter.native="searchGame">
                        <span slot="append" @click="searchGame">
                            <i class="ivu-icon ivu-icon-ios-search"></i>
                            <span>搜索</span>
                        </span>
                    </Input>
                </div>
                <div class="types" v-if="playForms.length">
                    <ul>
                        <li :class="{active: curTabIndex == index,disabled:item.platformStatus !='1'&&item.platformId!=='-1' }"
                          v-for="(item, index) in playForms" :key="index">
                            <a href="javascript:void(0)"
                              v-if="item.platformId!=='-1' && item.platformStatus=='1'"
                              @click="onTabItemClick(item,index)">{{item.code | subName}}</a>
                            <a href="javascript:void(0)"
                              v-if="item.platformId!=='-1' && item.platformStatus=='2'"
                              @click="onTabItemClick(item,index)">{{item.code | subName}}&nbsp;&nbsp;即将上线...</a>
                            <a href="javascript:void(0)"
                              v-if="item.platformId!=='-1' && item.platformStatus=='3'"
                              @click="onTabItemClick(item,index)">{{item.code | subName}}&nbsp;&nbsp;维护中...</a>
                            <a href="javascript:void(0)"
                             v-if="item.platformId==='-1'"
                             @click="onTabItemClick(item,index)">{{item.typeName}}</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="games-bottom-div">
              <game-list
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
        </div>
    </div>
</template>
<script>
  import { queryTypePlatforms } from "@/api/game";

const GetComponent = function(index) {
  return () => import(`./${index}`);
};
export default {
  name: "game",
  components: {
    gameList: GetComponent("gameList"),
  },
  data() {
    return {
      gameName:'',
      curTabIndex: 0,
      playForms: [],
      currentGameList: [],
      cacheGameList:[], //缓存游戏列
      loading: false,
      gameCode: "",
      showLoginGameTip: false, //是否显示登录游戏的额度转换提示
      swiperOption: {
        slidesPerView: 5,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      }
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
      if (!v) return "";
      return v.replace(/^([a-zA-Z0-9])+(.*)$/, (match, p1, p2) => {
        return p2;
      });
      // return v.slice(v.length - 2, v.length)
    }
  },
  watch: {
    $route: {
      handler(n) {
        this.handlerData(n.params.id);
      },
      deep: true
    }
  },
  mounted() {},
  async created() {
    this.gameList = {};
    let code = this.$route.params.id;
    let sysData = await this.$store.dispatch("querySystemConfig");
    this.showLoginGameTip =
      sysData["GAME_ACCOUNT_AUTO_TRANSFORM"] === "0" ? false : true;
    this.handlerData(code);
  },
  methods: {
    toggleLoading(val) {
      //loading显示隐藏
      this.loading = val;
      // console.log(this.loading);
    },
    searchGame() {
      if(!this.gameName) {
        this.currentGameList = this.cacheGameList;
        return;
      }
      let lowerName = this.wordToLowerCase(this.gameName);
      this.currentGameList = this.cacheGameList.filter(item => this.wordToLowerCase(item.gameName).includes(lowerName));
    },
    wordToLowerCase(char) { //大写转小写
      return char.replace(/[A-Z]/g,(match)=>{
        return match.toLowerCase();
      })
    },
    wordToLowerCase(char) { //大写转小写
      return char.replace(/[A-Z]/g,(match)=>{
        return match.toLowerCase();
      })
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
            if (this.playForms.length) {
              if (code === "FISH") {
                //点击捕鱼按钮进来
                this.curTabIndex = 0;
                this.currentGameList = this.playForms[0].children;
              } else {
                this.curTabIndex = this.playForms.findIndex(
                  item => item.code === code && item.platformStatus !== "2"
                );
                let codeIndex = '';
                if (this.curTabIndex == -1) {
                  //可能不存在
                  this.curTabIndex = 0;
                  codeIndex = this.playForms[0].code;
                } else {
                  codeIndex = this.playForms[this.curTabIndex].code;
                }
                if (codeIndex) {
                  this.fetchGameList( codeIndex);
                } else {
                  this.currentGameList = this.playForms[0].children;
                }
              }
              this.cacheGameList = this.currentGameList;
            } else {
              this.curTabIndex = 0;
              this.currentGameList = [];
            }
          });
      }
    },
    fetchGameList(code) {
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
            this.cacheGameList = this.currentGameList;
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
      if (info.platformStatus !== "1" && info.platformId !== "-1") return;
      this.curTabIndex = index;
      if (info.platformId === "-1") {
        this.currentGameList = info.children;
      } else {
        this.fetchGameList(info.code);
      }
    }
  }
};
</script>
<style lang="less" scoped>
    .games{
        width:100%;
        height:1363px;
        padding-top:40px;
        background:#f3f7fb url('../../images/qp_bg.png') no-repeat center center;
    }
    .games-wrapper{
        width:1200px;
        margin:auto;
    }
    .games-search{
        width:265px;
        height:48px;
        float:left;
        line-height: 48px;
        vertical-align: middle;
        background-color: #2e73ff;
        border-radius: 6px;
        padding:0 4px;
    }
    /deep/.ivu-input{
        height:40px;
        font-size: 16px;
    }
    /deep/.ivu-input-group{
        padding-top:3px;
    }
    /deep/.ivu-input-group-append{
        font-size: 18px;
        color:#fff;
    }
    /deep/.ivu-icon-ios-search{
        font-size: 26px;
    }
    /deep/.ivu-input-group-prepend, .ivu-input-group-append{
        padding: 4px 17px;
    }
    /deep/.ivu-input-group-append>span{
        display: inline-block;
        width:67px;
        height:30px;
        padding-top:2px;
        &>i{
            display:inline-block;
            vertical-align: middle;
        }
        &>span{
            display:inline-block;
            vertical-align: middle;
            margin-left: 3px;
        }
    }
    /deep/.ivu-input-group-prepend, /deep/.ivu-input-group-append{
        background-color: #2e73ff;
        border:none;
        padding:4px 12px;
    }
    /deep/.ivu-input{
        padding-left:10px;
    }
    .types{
        width:914px;
        height:48px;
        line-height: 48px;
        border-radius: 6px;
        background-color:#fff;
        float:right;
        &>ul{
            overflow: hidden;
        }
        &>ul>li{
            float:left;
            &.active>a{
              color:#3489ff;
            }
            &>a{
                display:inline-block;
                vertical-align: middle;
                height:28px;
                line-height: 28px;
                padding:0 24px;
                font-size: 16px;
                border-right: 1px solid #eeeeee;
                color:#343434;
                &.all{
                  color:#3489ff;
                }
            }
        }
    }
    .games-top-div{
        overflow: hidden;
    }
    .games-bottom-div{
      position: relative;
      height:957px;
    }

</style>
