<template>
  <div class="information-member">
    <div class="search">
      <div class="button">
        <Button
          type="primary"
          class="wxbutton"
          @click="search"
        >{{$tex("搜索")}}</Button>
      </div>
      <div class="selectDate">
        <Row>
          <Col span="12">
          <DatePicker
            v-model="informateTime"
            type="daterange"
            placement="bottom-end"
            :placeholder="$tex('请选择查询时间')"
            :options="option"
            :editable="false"
            style="width: 200px"
          ></DatePicker>
          </Col>
        </Row>
      </div>
      <div class="datetext">{{$tex("起始日期")}}：</div>
    </div>

    <div class="newstitle">
      <span class="sender">{{$tex("发件人")}}</span>
      <span class="mtitle">{{$tex("标题")}}</span>
      <span class="mdate">{{$tex("日期")}}</span>
    </div>
    <div style='width:100%;'>
      <ul>
        <li
          v-for="(item, idx) in datas"
          :key="idx"
          :class="{active: item.notifyId == dataId}"
          @click="dataId === item.notifyId ? dataId = '' : dataId = item.notifyId"
          class="all"
        >
          <div class="newslist">
            <span class="sender">{{$tex("系统消息")}}</span>
            <span class="mtitle">{{item.title}}</span>
            <span class='mdate'>{{item.createTime | convert2LocalDateTime}}</span>
          </div>
          <transition name='newscontent'>
            <div
              class="news-content"
              v-if="item.notifyId == dataId"
            >
              <p v-html="escapeHtml(item.content)"></p>
            </div>
          </transition>
        </li>
        <li
          class="no-data all"
          v-if="!datas.length"
          style='text-align:center;font-size:12px;line-height:36px;'
        >
          {{$tex("暂无数据")}}
        </li>
      </ul>
    </div>
    <page
      :total="paramData.total"
      :current="paramData.current"
      :pageSize="10"
      @get-Page-Data="getData"
    ></page>
  </div>
</template>
<script>
import formatDate from "@/utils/format_date.js";
import page from "@/components/page.vue";
import util from "@/utils/utils";
import common from "../../common/mixin";
import { mapGetters } from "vuex";
import isEmpty from "lodash/isEmpty";
import * as RongYun from "@/utils/rongyun";
import { convert2ServerDateTime } from "@/filters";

export default {
  components: { page },
  mixins: [common],
  data() {
    const startTime = new Date();
    startTime.setHours(0);
    startTime.setMinutes(0);
    startTime.setSeconds(0);
    const endTime = new Date();
    endTime.setHours(23);
    endTime.setMinutes(59);
    endTime.setSeconds(59);
    return {
      // essayId:'',
      dataId: "",
      datas: [],
      // startTime: '',
      // endTime: '',
      informateTime: [],
      paramData: {
        current: 1,
        size: 5,
        total: 0
      }
    };
  },
  computed: {
    ...mapGetters(["chatPushMemberMsg", "user"])
  },
  watch: {
    chatPushMemberMsg(message) {
      if (isEmpty(message)) {
        return;
      }
      const extra = RongYun.MessageManager.getInstance().getExtraByMessage(message);
      const { userId } = extra;
      if (this.user.userId !== userId) {
        return;
      }
      this.search();
    }
  },
  methods: {
    escapeHtml(str) {
      return util.escapeHtml(str);
    },
    fDate(value) {
      return formatDate.getFormatDate(value, "yymmddhhmmss");
    },
    search() {
      this.getData(1);
    },
    getData(page = 1) {
      this.$emit("handler-spin", true);
      let vm = this;
      let params = Object.assign({}, this.paramData);
      if (this.informateTime.length) {
        if (this.informateTime[0] !== null) {
          params.startTime = convert2ServerDateTime(this.informateTime[0]);
        } else {
          params.startTime = "";
        }
        if (this.informateTime[1] !== null) {
          this.informateTime[1].setHours(23);
          this.informateTime[1].setMinutes(59);
          this.informateTime[1].setSeconds(59);
          params.endTime = convert2ServerDateTime(this.informateTime[1]);
        } else {
          params.endTime = "";
        }
      }
      params.current = page;
      this.$http
        .post("/api/v2/user/queryUserMessage", params, {
          userId: true,
          unenc: true
        })
        .then(response => {
          this.$emit("handler-spin", false);
          if (response.data.code !== 0) return;
          let data = response.data.data;
          vm.datas = data.messageList;
          vm.$set(vm.paramData, "total", data.total);
        });
    }
  },
  created() {
    this.getData();
  }
};
</script>
<style lang="less">
.information-member {
}
.information-member .search {
  height: 30px;
  text-align: right;
}
.information-member .selectWay {
  width: 100px;
  float: left;
}
.information-member .datetext {
  float: right;
  margin-top: 4px;
  margin-left: 5%;
}
.information-member .selectDate {
  float: right;
  margin-left: 2px;
}
.information-member .button {
  float: right;
  margin-left: 20px;
}
.information-member .wxbutton {

}
.information-member .all {
  cursor: pointer;
}
.information-member li img {
  width: auto;
  float: none;
}
.information-member li.no-data {
  text-align: center;
  line-height: 40px;
  font-size: 12px;
}
.information-member .newslist {
  height: 36px;
  text-align: left;
  line-height: 36px;
  padding-left: 18px;
}
.information-member .newstitle {
  height: 36px;
  /*   background-color: @primary-color; */
  color: #fff;
  padding-left: 18px;
  margin-top: 13px;
  /* font-size:14px; */
  line-height: 36px;
}
.information-member .newstitle span,
.information-member .newslist span {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 12px;
}
.information-member .sender {
  width: 13%;
}
.information-member .mtitle {
  width: 61%;
}
.information-member .mdate {
  width: 22%;
}
.information-member .active {
  /*  color: @primary-color; */
}
.information-member .all:nth-child(even) {
  background: #ebebeb;
}
.information-member .all:hover {
  background: #ebf7ff;
}
.information-member .active .newslist {
  /*  border-bottom: 1px dashed @primary-color; */
  background: #fff;
}
.information-member .news-content {
  padding-left: 18px;
  padding: 10px 18px;
  color: #313131;
  font-size: 12px;
  background-color: #fff;
}
.information-member .news-content p {
  line-height: 18px;
  text-indent: 22px;
  word-wrap: break-word;
}
.information-member .all:hover .news-content {
  background: #fff;
}
.information-member .newscontent-enter-active,
.information-member .newscontent-leave-active {
  transition: all 0.05s ease;
  -webkit-transition: all 0.05s ease;
  -o-transition: all 0.05s ease;
  -moz-transition: all 0.05s ease;
  -ms-transition: all 0.05s ease;
}
.information-member .newscontent-enter,
.information-member .newscontent-leave-to {
  height: 0;
}

</style>
