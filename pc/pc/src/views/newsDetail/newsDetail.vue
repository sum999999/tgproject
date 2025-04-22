<template>
  <div class="new-detail">
    <div class="sub-nav">
      <router-link to="/home">{{ $tex("首页") }}</router-link>
      <span>></span>
      <router-link :to="newsListPath">{{ $tex("资讯列表") }}</router-link>
      <span>></span>
      <span>{{ $tex("资讯详情") }}</span>
    </div>
    <div class="news-content">
      <div class="title-content">
        <h1>{{ news.title }}</h1>
        <p>
          <span>{{ $tex("发表时间") }}：{{ news.time }}</span
          >{{ $tex("来源") }}：{{ title }}
        </p>
      </div>
      <div class="news-content__content">
        <div v-html="news.content" class="text-content"></div>
        <!-- 分享 -->
        <div class="image-wraper" id="shareNews">
          <div class="lee-share">
            <!-- <div
              class="share-component"
              id="share"
            ></div> -->
          </div>
        </div>
        <!--分享结束-->
        <div class="other-news">
          <p class="prev" v-if="prefixUrl">
            <span>{{ $tex("上一篇") }}</span
            >&nbsp;:&nbsp;
            <router-link :to="prefixUrl">{{ prefixTitle }}</router-link>
          </p>
          <p classs="next" v-if="suffixUrl">
            <span>{{ $tex("下一篇") }}</span
            >&nbsp;:&nbsp;
            <router-link :to="suffixUrl">{{ suffixTitle }}</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script type='text/ecmascript-6'>
import util from "@/utils/utils";
import getFormatDate from "@/utils/format_date";
import eleInfo from "@/utils/dom.js";
import { convert2LocalDateTime } from "@/filters";
import { checkChineseKey } from "@/lang";

export default {
  data() {
    return {
      news: { title: "", content: "", time: "", id: "" },
      prefixUrl: "",
      suffixUrl: "",
      prefixTitle: "",
      suffixTitle: "",
      newsData: [],
      nodeDemo: null,
      newsListPath: sessionStorage.getItem("newsView") || "/newsList/announce",
      title: document.title || "",
    };
  },
  watch: {
    $route() {
      let vm = this;
      let { essayId, type, itemIndex, url } = this.getInitParams();
      this.$http
        .post(url, { id: essayId }, { unenc: true })
        .then((response) => {
          if (response.data.code !== 0) return;
          let data = response.data.data;
          vm.setData(
            data.title,
            data.content,
            data.createDate,
            data.type,
            type
          );
          vm.setPrefixAndSuffiTitleInfo(vm.newsData, itemIndex, type, essayId);
          eleInfo.setScrollTop(0);
        });
    },
  },
  mounted() {
    let vm = this;
    window.socialShare(document.getElementById("shareNews"), {
      title: document.title,
      url: window.location.href,
      disabled: !checkChineseKey()
        ? [
            "weibo",
            "qq",
            "wechat",
            "tencent",
            "douban",
            "qzone",
            "linkedin",
            "diandian",
          ]
        : ["tencent"],
    });
    this.title = document.title;
  },
  created() {
    this.getNewsDetail();
  },
  methods: {
    getNewsDetail() {
      let vm = this;
      let { essayId, type, itemIndex, url } = this.getInitParams(); //id,news,undefined,url
      this.$http
        .post(url, { id: essayId }, { unenc: true })
        .then((response) => {
          if (response.data.code !== 0) return;
          let data = response.data.data;
          vm.setData(
            data.title,
            data.content,
            data.createDate,
            data.type,
            type
          );
          let dataHtml = "";
          if (data.content) {
            dataHtml = util.escapeHtml(data.content).replace(/<[^>]+>/g, "");
          }
          socialShare("#share", {
            title: data.title,
            description: dataHtml,
          });
          if (vm.newsData.length === 0) {
            if (type === "announce") {
              this.$store
                .dispatch("queryAnnounceEssayList", {
                  type: "01",
                  current: 1,
                  size: 10,
                })
                .then((newresponse) => {
                  vm.newsData = newresponse.data.data.list;
                  vm.setPrefixAndSuffiTitleInfo(
                    vm.newsData,
                    itemIndex,
                    type,
                    essayId
                  );
                });
            } else {
              let newType = type === "skills" ? "03" : "01";
              vm.$http
                .post(
                  "/api/v2/cms/queryAdvisoryEssayList",
                  { type: newType, current: 1, size: 10 },
                  { unenc: true }
                )
                .then((newresponse) => {
                  vm.newsData = newresponse.data.data.list;
                  vm.setPrefixAndSuffiTitleInfo(
                    vm.newsData,
                    itemIndex,
                    type,
                    essayId
                  );
                });
            }
          } else {
            vm.setPrefixAndSuffiTitleInfo(
              vm.newsData,
              itemIndex,
              type,
              essayId
            );
          }
        });
    },
    getInitParams() {
      let essayId = this.$route.params.id;
      let type = this.$route.query.type;
      let itemIndex = this.$route.query.index;
      let url =
        type === "announce"
          ? "/api/v2/cms/queryAnnounceEssayById"
          : "/api/v2/cms/queryAdvisoryEssayById";
      return { essayId: essayId, type: type, itemIndex: itemIndex, url: url };
    },
    setData(title, content, createDate, id, type) {
      let vm = this;
      vm.news.title = title;
      vm.news.content = util.escapeHtml(content);
      vm.news.time = convert2LocalDateTime(createDate);
      vm.news.id =
        id === "03"
          ? "/newsList/skills/"
          : type === "news"
          ? "/newsList/news/"
          : "/newsList/announce";
    },
    setPrefixAndSuffiTitleInfo(dateArray, itemIndex, type, essayId) {
      let vm = this;
      if (itemIndex === undefined) {
        dateArray.forEach((item, index) => {
          if (item.essayId === essayId) {
            itemIndex = index;
          }
        });
      }
      dateArray.forEach((item, index) => {
        if (itemIndex == 0) {
          vm.prefixUrl = 0;
        }
        if (itemIndex == this.newsData.length - 1) {
          vm.suffixUrl = 0;
        }
        if (itemIndex - index === 1) {
          vm.prefixUrl = `/newsDetail/${item.essayId}?type=${type}&index=${index}`;
          vm.prefixTitle = item.title;
        }
        if (index - itemIndex === 1) {
          vm.suffixUrl = `/newsDetail/${item.essayId}?type=${type}&index=${index}`;
          vm.suffixTitle = item.title;
        }
      });
    },
  },
};
</script>

<style lang="less">
.new-detail {
  width: 1000px;
  margin: 40px auto;
  /*     border: 1px solid @news-detail-border; */
  border-radius: 2px;
  -webkit-border-radius: 2px;
  -ms-border-radius: 2px;
  -moz-border-radius: 2px;
  -o-border-radius: 2px;
}
.new-detail .sub-nav {
  height: 44px;
  line-height: 44px;
  padding-left: 58px;
  font-size: 12px;
  /*   border-bottom: 1px solid @news-detail-border;
    background: @news-detail-title-bg; */
}
.new-detail .sub-nav a {
  color: #989898;
}
.new-detail .sub-nav a:hover {
  color: @primary-color;
}
.new-detail .news-content {
  padding: 22px 60px;
  background-color: #fff;
}
.new-detail .news-content .text-content img {
  display: inline-block;
  width: auto;
  max-width: 100%;
  float: none;
}
.new-detail .title-content {
  text-align: center;
}
.new-detail .title-content h1 {
  font-size: 25px;
  line-height: 37px;
  /*     color: @primary-color; */
}
.new-detail .title-content p {
  line-height: 42px;
  font-size: 12px;
  color: #989898;
}
.new-detail .title-content p span {
  margin-right: 35px;
}
.new-detail .news-content__content {
  width: 100%;
  padding: 20px 0 0 6px;
  /*     border-top: 1px solid @news-detail-border; */
  color: #282828;
}
.new-detail .news-content__content p {
  text-indent: 25px;
  line-height: 26px;
  font-size: 14px;
}
/* 分享*/
.new-detail .image-wraper {
  width: 100%;
  padding: 0 0 25px 70px;
  text-align: right;
}
/*分享结束*/
.new-detail .news-content__content .other-news {
  line-height: 26px;
  padding: 8px 0 6px 0;
  /*   border-top: 1px solid @news-detail-border;
    border-bottom: 1px solid @news-detail-border; */
}
.new-detail .news-content__content .other-news p {
  height: 26px;
}
.new-detail .news-content__content .other-news p a {
  font-size: 14px;
  color: #282828;
}
.new-detail .news-content__content .other-news p span {
  color: #989898;
}
.new-detail .news-content__content .other-news p a:hover {
  /* color: @primary-color; */
}
</style>


