<template>
  <div class="help-page">
    <div class='top-title'>
      {{$tex("中奖")}}
    </div>
    <div class='pcontent'>
      <div
        class='content-item'
        v-for='(item,index) in helpContent'
        :key='item.essayId'
      >
        <p
          class="title"
          @click='showContent(index)'
        >{{index+1}}. {{item.title}}</p>
        <div
          class='item'
          v-if='itemIndex===index'
          ref='subContent'
        >
          <i class='triang'></i>
          <div v-html='item.content'></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import util from "@/utils/utils";
export default {
  props: {
    questionIndex: {
      default: 0,
      type: Number
    }
  },
  watch: {
    questionIndex(newIndex, oldIndex) {
      this.itemIndex = newIndex;
    }
  },
  data() {
    return {
      helpContent: [],
      itemIndex: this.questionIndex
    };
  },
  methods: {
    showContent(index) {
      //显示与隐藏问题详情
      this.itemIndex === index
        ? (this.itemIndex = "")
        : (this.itemIndex = index);
      setTimeout(() => {
        this.$emit("getListHeight");
      }, 20);
    }
  },
  mounted() {
    let timer = setInterval(() => {
      if (this.$refs.subContent) {
        clearInterval(timer);
        this.$emit("getListHeight");
      }
    }, 20);
  },
  created() {
    this.$http
      .post(
        "/api/v2/cms/queryHelpCenterByNameGuideList",
        { name: "中奖" },
        { unenc: true }
      )
      .then(response => {
        if (response.data.data === 1) return;
        this.helpContent = response.data.data;
        response.data.data.forEach(item => {
          item.content = util.escapeHtml(item.content);
        });
      });
  }
};
</script>

<style scoped>
.help-page {
  /* width: 780px; */
}
.help-page .top-title {
  height: 45px;
  line-height: 44px;
  color: #7f7f7f;
  font-size: 14px;
  border-bottom: 1px solid #eaeaea;
}
.help-page .title {
  line-height: 28px;
  font-size: 14px;
  color: #1d70d9;
  cursor: pointer;
}
.help-page .pcontent {
  width: 100%;
  padding: 20px 10px;
  overflow: hidden;
}
.help-page .pcontent .content-item {
  width: 100%;
  overflow: hidden;
}
.help-page .item {
  position: relative;
  margin: 10px 0;
  color: #313131;
  font-size: 12px;
  border: 1px solid #fff1cc;
  padding: 12px 16px;
  background: #fffaec;
}
.help-page .content p {
  line-height: 20px;
  font-size: 12px;
  color: #313131;
}
.help-page .triang {
  display: block;
  position: absolute;
  left: 30px;
  top: -4px;
  width: 8px;
  height: 8px;
  border: 1px solid #fffaec;
  border-right: 1px solid #fff1cc;
  border-top: 1px solid #fff1cc;
  background: #fffaec;
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
}
</style>
