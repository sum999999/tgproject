<template>
  <div class="personal-center role-center content">
    <div class="navList lf">
      <ul class='outer-wrap'>
        <li
          v-for="item in lotteryTypeList"
          :key="item.code"
        >
          <div>
            <div
              class="title"
              @click='titleLable===item.code? titleLable="" :titleLable=item.code'
              :class="{'active':titleLable===item.code}"
            >
              <img :src="item.icon" />
              <span>{{item.lotteryTypeName}}</span>
              <Icon
                :type="titleLable===item.code?'chevron-down':'chevron-right'"
                style='float:right;'
              ></Icon>
            </div>
            <ul
              class='inner-wrap'
              v-show='item.code===titleLable'
            >
              <li
                v-for='list in item.lotteryList'
                :key='list.lotteryId'
                @click="changeTab(list)"
                :class="{isActive:list.lotteryId===lotteryId}"
              >
                <img :src="list.lotteryIcon">
                <span>{{list.lotteryName}}</span>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
    <div class="personal-content rf">
      <role-detail :lottery-item="lotteryItem"></role-detail>
    </div>
    <div class="clr"></div>
  </div>
</template>

<script>
import roleDetail from "./roleDetail.vue";
export default {
  components: { roleDetail },
  data() {
    return {
      lotteryId: "",
      lotteryItem: {},
      titleLable: "pk10",
      lotteryTypeList: [],
      flag: false,
    };
  },
  watch: {
    $route() {
      if (this.lotteryId === this.$route.params.id) {
        return;
      }
      this.lotteryId = this.$route.params.id;
      this.searchPlay();
    }
  },
  methods: {
    changeTab(list) {
      if (this.lotteryId === list.lotteryId) {
        return;
      }
      this.lotteryId = list.lotteryId;
      this.lotteryItem = list;
      this.$router.push({ params: { id: this.lotteryId } });
    },
    searchPlay() {
      outer: for (let i = 0, len = this.lotteryTypeList.length; i < len; i++) {
        for (let j = 0, len2 = this.lotteryTypeList[i].lotteryList.length;j < len2;j++) {
          if (
            this.lotteryTypeList[i].lotteryList[j].lotteryId === this.lotteryId
          ) {
            let list = this.lotteryTypeList[i];
            let item = this.lotteryTypeList[i].lotteryList[j];
            this.lotteryItem = item;
            this.titleLable = list.code;
            break outer;
          }
        }
      }
    },
    getData() {
      this.$http
        .post("/api/v2/lottery/lotteryPlayRulesForPC", "", { unenc: true })
        .then(response => {
          if (response.data.code !== 0) return;
          this.lotteryTypeList = response.data.data.lotteryTypeList;
          this.searchPlay();
        });
    }
  },
  created() {
    this.lotteryId = this.$route.params.id;
    this.getData();
  }
};
</script>

<style lang="less" scoped>
.personal-center {
  padding: 30px 0;
  margin: 0 auto;
}
.personal-center .personal-content {
  width: 780px;
  background-color: #fff;
  /*  border: 1px solid @common-border-color; */
  padding: 20px;
  padding: 30px 28px 15px 28px;
  border-radius: 4px;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  -ms-border-radius: 4px;
  -o-border-radius: 4px;
}
.personal-center .navList {
  width: 192px;
  /*   border: 1px solid @common-border-color; */
  border-radius: 4px;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  -ms-border-radius: 4px;
  -o-border-radius: 4px;
  font-size: 14px;
  min-height: 100%;
  background-color: #fff;
}
.personal-center .navList .outer-wrap {
  /* border-top: 3px solid @primary-color; */
  color: #313131;
}
.personal-center .navList .outer-wrap > li {
  line-height: 47px;
  border-bottom: 1px solid #eaeaea;
}
.personal-center .navList .outer-wrap > li:last-child {
  border-bottom: none;
}
.personal-center .navList .outer-wrap > li > div {
  position: relative;
}
.personal-center .navList .outer-wrap > li .title {
  display: block;
  height: 48px;
  width: 100%;
  cursor: pointer;
  border-radius: 3px;
  background: #f9f9f9;
}
.personal-center .navList .outer-wrap > li .title.active {
  /*   color: @primary-color; */
  background: #fff;
}
.personal-center .navList .outer-wrap > li.active span:hover,
.personal-center .navList .inner-wrap li:hover {
  /*  color: @primary-color; */
}
.personal-center .navList .outer-wrap > li .title > img {
  display: inline-block;
  width: 18px;
  height: 18px;
  margin: 15px 16px 0 17px;
}
.personal-center .navList .inner-wrap li {
  cursor: pointer;
  transition: padding-left 0.1s linear;
  -webkit-transition: padding-left 0.1s linear;
  -moz-transition: padding-left 0.1s linear;
  -ms-transition: padding-left 0.1s linear;
  -o-transition: padding-left 0.1s linear;
  display: flex;
  align-items: center;
  line-height: initial;
  padding: 6px 15px;
}
.personal-center .navList .inner-wrap li:hover {
  padding-left: 25px;
}
.personal-center .navList .inner-wrap li img {
  width: 22px;
  height: 22px;
  margin: 0px 14px 0 0;
}
.personal-center .navList .inner-wrap li.isActive {
  /*  color: @primary-color; */
  background: #ffe8e8;
}
.personal-center .navList .ivu-icon {
  position: absolute;
  right: 9px;
  top: 10px;
}
.personal-center .navList .outer-wrap li .title > i {
  display: block;
  position: absolute;
  right: 9px;
  top: 18px;
  width: 18px;
  height: 18px;
}
.personal-center .navList .outer-wrap li .title > i:first-child {
  left: 17px;
  top: 16px;
  width: 19px;
  height: 19px;
}
</style>

