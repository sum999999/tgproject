<template>
  <div class="active-page" ref="content" v-loading="loading">
    <div class="active-page__mask"></div>
    <div class="content">
      <div
        v-show="!$configText.closeActiveTabs"
        class="grid grid-cols-8 items-center gap-x-7 gap-y-4 my-10  h-8"
      >
        <Button
          v-for="(item, idx) in activeTab"
          :key="idx"
          shape="circle"
          class=""
          :class="[
            curActiveIndex === idx ? 'ivu-btn-style--2' : 'ivu-btn-style--4',
          ]"
          @click="onActiveTabClick(idx, item.code)"
          >{{ item.typeName }}</Button
        >
      </div>
      <ul class="active-list">
        <li
          ref="activeItem"
          class=" bg-[#F5F9FF] rounded-3xl border-2 border-white border-solid shadow-lg shadow-[rgba(107,168,220,0.10)]"
          v-for="(item, idx) in list"
          :key="idx"
        >
          <template v-if="activitySwitching == '0'">
            <a class="img-wrapper" v-if="item.contentType === -1">
              <a class="link" :href="item.targetUrl"
                ><img :src="item.netUrl + '?imageView2/1/w/1000/h/178'"
              /></a>
            </a>
            <a class="img-wrapper" v-else @click="showActityDetail(item, idx)">
              <a class="link"
                ><img :src="item.netUrl + '?imageView2/1/w/1000/h/178'"
              /></a>
            </a>
          </template>
          <template v-else-if="activitySwitching != '0'">
            <a class="imgNew-wrapper" v-if="item.contentType === -1">
              <a class="newLink" :href="item.targetUrl"
                ><img :src="item.netUrl + '?imageView2/1/w/1000/h/178'"
              /></a>
            </a>
            <a
              class="imgNew-wrapper"
              v-else
              @click="showActityDetail(item, idx)"
            >
              <a class="newLink"
                ><img :src="item.netUrl + '?imageView2/1/w/1000/h/178'"
              /></a>
              <div class="floorRright">
                <h2>{{ item.name }}</h2>
                <p class="actionInfo">
                  <!-- [0活动文案 1活动+任务 2领取+文案]活动界面 -->
                  <span v-if="activitySwitching == '2'">
                    每晋升一个等级，都可以获得晋级奖励！
                  </span>
                </p>
                <a href="javascript:;" class="btn">查看详情<i></i></a>
              </div>
            </a>
          </template>
          <div
            class="item-detail-wrapper"
            v-show="
              (item.taskDetails || item.detailContent) && showDetail === idx
            "
          >
            <div v-if="item.taskDetails" class="promotion">
              <p class="award">{{ item.name }}</p>
              <div class="collectionList">
                <div class="currentStatus" v-for="arr in item.taskDetails">
                  <p class="grade">{{ arr.remark }}</p>
                  <Button
                    @click="goLogin"
                    v-if="!user.userId"
                    style="border: 1px solid gray; color: gray;"
                  >
                    去登陆
                  </Button>
                  <Button
                    v-else
                    @click="receiveAward(arr.conditionId, arr.status, idx)"
                    :class="[arr.status === '1' ? 'receive' : 'notAvailable']"
                  >
                    {{
                      arr.status == "1"
                        ? "点击领取"
                        : arr.status == "0"
                        ? "未达标"
                        : "已领取"
                    }}
                  </Button>
                </div>
              </div>
            </div>
            <div
              class="item-detail"
              :class="{ active: showDetail === idx }"
              v-html="item.detailContent"
            ></div>
          </div>
        </li>
      </ul>
      <page
        class="active-page2"
        :total="paramData.total"
        :currentPage="paramData.current"
        :pageSize="paramData.size"
        @get-Page-Data="getData"
        v-show="isShowPage"
      ></page>
    </div>
  </div>
</template>

<script>
import util from "@/utils/utils";
import page from "@/components/page.vue";
import { mapGetters } from "vuex";
import { getDetail, courtesy, receivePrizeMoney } from "@/api/user.js";

export default {
  data() {
    return {
      list: [],
      allList: [],
      showDetail: "", //是否显示活动详情
      resourceId: "",
      paramData: {
        current: 1,
        size: 30,
        frontType: "pc",
      },
      loading: false,
      curActiveIndex: 0,
      isShowPage: true,
      courtesyId: "",
      packagesList: [],
    };
  },
  computed: {
    ...mapGetters(["cmsCurDiscounts"]),
    user() {
      return this.$store.state.user;
    },
    activeTab() {
      if (this.cmsCurDiscounts) {
        return [
          { code: "", sort: "-1", typeName: this.$tex("全部") },
          ...this.cmsCurDiscounts,
        ];
      }
      return [{ code: "", sort: "-1", typeName: this.$tex("全部") }];
    },
    activitySwitching() {
      return this.$store.getters.sysSystemConfig.ACTIVITY_VIEW;
    },
  },
  watch: {
    $route() {
      this.getData(1);
    },
    curActiveIndex(index) {
      if (index != 0) {
        this.isShowPage = false;
      } else {
        this.isShowPage = true;
      }
    },
  },
  components: { page },
  created() {
    this.getData(1);
    this.$store.dispatch("queryDiscountInternational");
  },
  mounted() {
    this.activeTabHandler();
    this.packagesData();
    let vm = this;
    // 领取活动交互
    window.confirmActivityPrize = function(params) {
      vm.$http
        .post(
          "/api/v2/cms/confirmActivityPrize",
          { availableId: `${params}` },
          { userId: true }
        )
        .then((response) => {
          if (response.data.code !== 0) return;
          vm.$Message.success(vm.$tex("领取成功"));
          vm.user.balance = response.data.data.balance;
          localStorage.setItem("user", JSON.stringify(vm.user));
          vm.$store.commit("getUser", vm.user);
          vm.showActityDetail(vm.resourceId, vm.showDetail, true);
        });
    };
  },
  methods: {
    // 礼包中心活动
    async packagesData() {
      const res = await courtesy({
        current: 1,
        size: 110,
        userId: this.user.userId,
      });
      this.packagesList = res.data.data;
    },
    // 任务详情
    async ActivityList(idx) {
      if (!this.courtesyId) return;
      const res = await getDetail({
        courtesyId: this.courtesyId,
        userId: this.user.userId,
      });
      this.$set(this.list[idx], "taskDetails", res.data.data);
    },
    // 领取奖励
    async receiveAward(conditionId, status, idx) {
      if (status != "1") return;
      const Activity = this.packagesList.courtesyList.filter(
        (item) => item.courtesyId === this.courtesyId
      );
      const { courtesyId, type } = Activity[0];
      const res = await receivePrizeMoney(
        { conditionId, courtesyId, type },
        {
          noEncrypt: false,
          userId: true,
        }
      );
      if (res.data.code !== 0) return;
      this.$Message.success(res.data.msg);
      this.ActivityList(idx);
    },
    // 去登陆
    goLogin() {
      sessionStorage.setItem("path", "active");
      this.$router.push("/login");
    },
    onActiveTabClick(index, type) {
      if (this.curActiveIndex === index) {
        return;
      }
      this.curActiveIndex = index;
      if (!type) {
        return (this.list = [...this.allList]);
      }
      const result = [];
      for (let key in this.allList) {
        const active = this.allList[key];
        const { platType } = active || {};
        if (platType.split(",").indexOf(type) !== -1) {
          result.push(active);
        }
      }
      this.list = [...result];
    },
    async activeTabHandler() {
      let gameLists = [],
        GAME_SWITCH,
        GAME_LIST;
      const data = await this.$store.dispatch("querySystemConfig");
      GAME_SWITCH = data["GAME_SWITCH"];
      gameLists = data["lotCcGameTypeConfig"];
      if (gameLists) {
        GAME_LIST = JSON.parse(gameLists).filter((item) => item.status === "1");
      }

      if (GAME_LIST) {
        // GAME_LIST.unshift({code: "LOTTERY",  sort: "0", typeName: "彩票"})
        GAME_LIST.unshift({
          code: "",
          sort: "-1",
          typeName: this.$tex("全部"),
        });
        // GAME_LIST = sortBy(GAME_LIST, function(o) { return o.sort; });
        for (let key in GAME_LIST) {
          const item = GAME_LIST[key];
          // this.activeTab.push({
          //   key: item.code,
          //   value: item.typeName,
          // });
        }
      }
    },
    switch2CurTabContent() {
      const tab = this.activeTab[this.curActiveIndex] || {};
      const type = tab.code;
      if (!type) {
        return (this.list = [...this.allList]);
      }
      const result = [];
      for (let key in this.allList) {
        const active = this.allList[key];
        const { platType } = active || {};

        if (platType.split(",").indexOf(type) !== -1) {
          result.push(active);
        }
      }
      this.list = [...result];
    },
    getData(page) {
      let resourceId = this.$route.query.resourceId;
      let vm = this;
      this.loading = true;
      this.paramData.current = page;
      this.$parent.offsetY = 0;
      this.$http
        .post("/api/v2/cms/queryDiscountActivityList", this.paramData, {
          unenc: true,
        })
        .then((response) => {
          this.loading = false;
          if (response.data.code !== 0) return;
          this.allList = this.list = response.data.data.list;
          this.paramData.total = response.data.data.total;
          this.switch2CurTabContent();
          //点击其它页面的海报进来的
          if (resourceId) {
            this.list.forEach((itm, idx) => {
              if (itm.resourceId === resourceId) {
                this.showActityDetail(itm, idx, false, true);
              }
            });
          }
        });
    },
    getElementTop(el) {
      var actualTop = el.offsetTop;
      var current = el.offsetParent;
      while (current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
      }
      return actualTop;
    },
    scrollToContent(idx) {
      const activeEle = this.$refs["activeItem"][idx];
      this.$nextTick(() => {
        const height = this.getElementTop(activeEle);
        window.scrollTo(0, height);
      });
    },
    setScrollTop() {
      var scrollTop = 0;
      if (document.documentElement && document.documentElement.scrollTop) {
        scrollTop = document.documentElement.scrollTop;
      } else if (document.body) {
        scrollTop = document.body.scrollTop;
      }
      return scrollTop;
    },
    showActityDetail(item, idx, again = false, scrolled) {
      if (this.showDetail === idx && !again) {
        this.showDetail = "";
        return;
      }
      this.showDetail = idx;
      this.resourceId = item;
      this.courtesyId = item.courtesyId;
      if (!item.taskDetails) {
        this.ActivityList(idx);
      }
      if (item.detailContent) {
        if (scrolled) {
          this.scrollToContent(idx);
        }
        return; //如果请求过内容了就不在请求
      }
      this.$http
        .post(
          "/api/v2/cms/queryDiscountActivityById",
          { resourceId: item.resourceId },
          { unenc: true }
        )
        .then((response) => {
          if (response.data.code !== 0) return;
          this.$set(
            this.list[idx],
            "detailContent",
            util.escapeHtml(response.data.data.content)
          );
          if (scrolled) {
            this.scrollToContent(idx);
          }
        });
    },
    // showActityDetailWrapper (item, idx) {
    //   if (this.showDetail === idx) {
    //     this.showDetail = '';
    //     return
    //   }
    //   this.showDetail = idx;
    //   this.showActityDetail(item, idx);
    // }
  },
};
</script>

<style scoped lang="less">
.active-tab {
  margin: 30px 0px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  li {
    padding: 5px 20px;
    margin: 0 10px;
    color: #ffffff;
  }
  li.active {
    position: relative;
    .active-tab__content {
      color: #ffd427 !important;
    }
    &::after {
      position: absolute;
      bottom: -4px;
      content: "";
      display: inline-block;
      width: 100%;
      height: 2px;
      background: #ffd427;
      left: 0;
    }
  }
}
.active-tab__content {
  cursor: pointer;
  background: transparent !important;
  font-family: PingFang-SC-Bold;
  font-size: 16px;

  letter-spacing: 0;
  line-height: 19px;
}
.active-page {
  margin: 0 auto;
  position: relative;
  &__mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background: url("~@/assets/images-v10/active/Promotions_bg_3.png") center /
      cover no-repeat !important;
    top: 0;
    //   background-size: contain;
    // background-position: center top;
  }
}
.content {
  z-index: 1;
  position: relative;
}

.active-page-height {
  height: 26px;
}
.active-page .title {
  width: 1000px;
  height: 89px;
  margin: 0 auto;
  position: relative;
  h1 {
    position: absolute;
    left: 46%;
    top: 0;
    color: #c1c1c1;
  }
}
.active-page .title img {
  width: 100%;
  // height: 1000px;
}
.active-page .active-list {
  width: 1000px;
  margin: 0 auto;
  margin-top: 10px;
  &__desc {
    display: flex;
    padding: 20px;
    > p {
      width: 100%;
      font-family: PingFang-SC-Medium;
      font-size: 18px;
      color: #fffffe;
      letter-spacing: 0;
      line-height: 16px;
      word-break: break-all;
    }
    > span {
      flex-shrink: 0;
      font-family: PingFang-SC-Medium;
      font-size: 18px;
      color: #ffd427;
      letter-spacing: 0;
      line-height: 16px;
    }
  }
}
.active-page .active-list li {
  margin-bottom: 26px;
  border-radius: 10px;
  overflow: hidden;
}
.active-page .active-list li .link {
  display: block;
  position: relative;
  width: 1000px;
  margin: 0 auto;
  height: 178px;
}
.item-detail-wrapper {
  background-color: #fff;
}
.item-detail {
  .active {
    margin-inline-start: auto;
    margin-inline-end: auto;
  }
}
.active-page .active-list li .link img {
  top: 50%;
  left: 50%;
  display: block;
  width: 1000px;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}
.active-page li .active {
  /* border: 1px solid @common-border-color; */
}
.active-page .item-detail {
  padding: 20px 30px;
  line-height: 27px;
}
.floorRright {
  float: left;
  width: 290px;
  padding: 0 0 0 15px;
  box-sizing: border-box;
}

.floorRright h2 {
  font-size: 19px;
  font-weight: inherit;
  margin: 0;
  // color: #e4393c;
  color: #e4393c;
  line-height: 30px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
}

.floorRright p {
  font-size: 14px;
  padding: 12px 0;
  height: 72px;
  color: #888888;
}

.floorRright a.btn {
  user-select: none;
  font-size: 17px;
  display: inline-block;
  width: 110px;
  background: #e4393c;
  color: #fff;
  border-radius: 4px;
  text-align: center;
  padding-right: 18px;
  box-sizing: border-box;
}
.imgNew-wrapper {
  display: flex;
  align-items: center;
  height: 160px;
  // padding: 5px 0;
}
.newLink {
  display: block;
  width: 750px;
  height: 160px;
  overflow: hidden;
  display: flex;
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}
.showDetail {
  cursor: pointer;
}

.promotion {
  padding: 10px 35px;
  border: 1px solid #d4d4d4;
}
.collectionList {
  border: 1px solid;
  border-radius: 20px;
  padding: 5px;
  width: 55%;
  box-shadow: 0 0.53333vw 1.06667vw 0 rgba(235, 43, 62, 0.31);
  background-color: #fff;
  overflow: hidden;
  margin: 1%;
}
.currentStatus {
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 5px;
  border-bottom: 1px solid #c5c1c1;
  p {
    padding: 10px 15px 10px 0px;
    font-size: 12px;
  }
  .receive {
    background: #e4393c;
    color: white;
  }
  .notAvailable {
    border: 1px solid gray;
    color: gray;
    cursor: no-drop;
    padding: 0 22px;
  }
}
.award {
  font-size: 20px;
  color: red;
  font-weight: 700;
}
</style>

<style lang="less">
.active-page img {
  float: none;
  max-width: 100%;
  width: inherit;
}
.active-page2 {
  margin-bottom: 20px;
}
</style>
