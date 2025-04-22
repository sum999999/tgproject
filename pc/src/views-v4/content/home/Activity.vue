<template>
  <div class="activity">
    <div class="activity-top-div">
      <span class="activity-left-span fl">热门体育</span>
      <div class="activity-right-span rt">
        <span
          class="more"
          @click="$router.push({path:'/active'})"
        >查看全部</span>
        <i class="icon"></i>
      </div>
    </div>
    <div class="activity-bottom-div">
      <ul>
        <li
          v-for="(item,index) in list"
          :key="index"
        >
          <a
            href="javascript:void(0)"
            @click="$router.push({path:'/active'})"
          >
            <img
              :src="item.url"
              alt=""
            >
            <h5>{{item.tit}}</h5>
            <p>{{item.txt}}</p>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    console.log('this.$configText', this.$configText)
    return {
      list: (this.$configText.tiyu && this.$configText.tiyu.homeActivity) || [],
    }
  },
}
</script>
<style lang="less" scoped>
@sectionTextColor: #676565;
@activityTitleTextColor: #08070b;
@activityContentTextColor: #cfccc9;
.activity {
  background-color: #f3f7fb;
  margin-top: -53px;
  padding-top: 90px;
}
.activity-top-div {
  width: 1200px;
  margin: auto;
  height: 24px;
  line-height: 24px;
}
.activity-left-span {
  font-size: 24px;
  color: @sectionTextColor;
}
.activity-right-span {
  font-size: 0;
}
.more {
  display: inline-block;
  font-size: 14px;
  line-height: 14px;
  color: #2c73ff;
  margin-right: 12px;
  vertical-align: middle;
  cursor: pointer;
}
.icon {
  display: inline-block;
  width: 9px;
  height: 14px;
  line-height: 14px;
  vertical-align: middle;
  background: url(../../images/all.png) no-repeat center center;
  background-size: contain;
}
.fl {
  float: left;
}
.rt {
  float: right;
}
.activity-bottom-div {
  width: 1200px;
  margin: auto;
  margin-top: 20px;
  border-radius: 4px;
  height: 371px;
  & > ul > li {
    float: left;
    margin-right: 20px;
    &:last-child {
      margin: 0;
    }
    & > a {
      width: 284px;
      height: 284px;
      display: block;
      font-size: 0;
      overflow: hidden;
      border-radius: 13px;
      box-shadow: 0 0 18px rgba(0, 0, 0, 0.16);
      img {
        width: 284px;
        height: 198px;
        float: initial;
        display: block;
      }
      h5 {
        font-size: 18px;
        line-height: 18px;
        color: @activityTitleTextColor;
        font-weight: normal;
        margin-top: 18px;
        padding-left: 18px;
      }
      p {
        font-size: 14px;
        line-height: 14px;
        margin-top: 14px;
        padding-left: 18px;
        color: @activityContentTextColor;
      }
    }
  }
}
</style>
