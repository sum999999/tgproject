
<template>
  <div>
    <div class='news-wrapper'>
      <div class='news-content'>
        <ul>
          <li
            v-for="(item,index) in news"
            :key='index'
            class='news-item'
          >
            <router-link :to='item.essayId'>
              <span>{{item.name}}</span>
              <span>{{item.time}}</span>
            </router-link>
          </li>
          <li
            class="not-data"
            v-if="!news.length"
          >{{$tex("暂无公告")}}</li>
        </ul>
      </div>
      <page
        v-if="pageParams.realTotal"
        :total="pageParams.realTotal"
        :currentPage="pageParams.currentPage"
        :pageSize="10"
        @get-Page-Data="getAnnounceList"
      ></page>
    </div>
  </div>
</template>
<script type='text/ecmascript-6'>
import getFormatDate from "@/utils/format_date";
import page from "@/components/page.vue";
export default {
  components: { page },
  props: {
    typeId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      news: [{ name: "", time: "", essayId: "" }],
      pageParams: {
        total: 0,
        currentPage: 1,
        size: 10,
        realTotal:0
      }
    };
  },
  watch: {
    $route(newVal, oldVal) {
      if(newVal != oldVal ) {
        this.getAnnounceList(1,true);
      }
    }
  },
  methods: {
    getAnnounceList(page = 1,first = false) {
      this.pageParams.currentPage = page;
      let vm = this;
      let urlStr = "queryAdvisoryEssayList";
      let type = "01";
      if (this.typeId === "announce") {
        urlStr = "queryAnnounceEssayList";
      }
      if (this.typeId === "skills") {
        type = "03";
      }
      if (this.typeId === "guide") {
        type = "04";
        urlStr = "queryAdvisoryEssayList";
      }
      this.$http
        .post(
          `/api/v2/cms/${urlStr}`,
          { type: type, current: page, size: this.pageParams.size },
          { unenc: true }
        )
        .then(response => {
          if (response.data.code !== 0) return;
          let news = [];
          response.data.data.list.slice(0, 11).forEach((newsitem, index) => {
            let item = {};
            item.name = newsitem.title;
            item.time = getFormatDate.getFormatDate(
              newsitem.createDate,
              "yymmddhhmmss"
            );
            item.essayId = `/newsDetail/${newsitem.essayId}?type=${
              vm.$route.params.id
            }&index=${index}`;
            news.push(item);
          });
          vm.news = news;
          vm.pageParams.total = response.data.data.total;
          if (first) {
            vm.pageParams.realTotal =  response.data.data.total;
          }
        });
    }
  },
  created() {
    this.getAnnounceList(1,true);
  }
};
</script>

<style lang="less">
.news-wrapper {
  font-size: 14px;
  padding: 24px 0 22px 0;
}
.news-wrapper ul li.news-item {
  height: 70px;
  line-height: 70px;
  padding: 0 60px;
}
.news-wrapper ul li.news-item:hover {
  box-shadow: 0 6px 16px #dbdbdb;
  -webkit-box-shadow: 0 6px 16px #dbdbdb;
}
.news-wrapper ul li.news-item:hover a {
  border-bottom: 1px solid transparent;
}
.news-wrapper ul li.news-item a {
  display: block;
  float: left;
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: #282828;
  /*  border-bottom: 1px solid @news-list-nav-border; */
}
.news-wrapper ul li.news-item a span {
  display: inline-block;
}
.news-wrapper ul li.news-item a span:first-child {
  float: left;
  width: 45%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.news-wrapper ul li.news-item a span:last-child {
  float: right;
}
.news-wrapper ul li.news-item:hover a {
  /*  color: @primary-color; */
}
.news-wrapper .not-data {
  text-align: center;
  font-size: 18px;
}
</style>



