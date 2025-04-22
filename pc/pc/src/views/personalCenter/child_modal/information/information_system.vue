<template>
  <div class="information-system">
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
            :options="option"
            :editable="false"
            placement="bottom-end"
            :placeholder="$tex('请选择查询时间')"
            style="width: 200px"
          ></DatePicker>
          </Col>
        </Row>
      </div>
      <div class="datetext">{{$tex("起始日期")}}：</div>
    </div>

    <div class="newstitle">
      <span class="mtitle">{{$tex("标题")}}</span>
      <!-- <span class="mdate">{{$tex("日期")}}</span> -->
    </div>
    <div class="list-wrap">
      <ul>
        <li
          v-for="item in datas"
          :key="item.essayId"
          :class="{active: item.essayId == dataId}"
          @click="dataId === item.essayId ? dataId = '' : dataId = item.essayId"
          class="all"
        >
          <div class="newslist lee-newsList">
            <!-- <span class="sender">系统消息</span> -->
            <span class="mtitle">{{item.title}}</span>
            <!-- <span class='mdate'>{{item.createDate | convert2LocalDateTime}}</span> -->
          </div>
          <transition name='newscontent'>
            <div
              class="news-content"
              v-if="item.essayId == dataId"
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
import formatDate from '@/utils/format_date.js'
import page from '@/components/page.vue'
import util from '@/utils/utils'
import common from '../../common/mixin'
import { convert2ServerDateTime } from '@/filters'

export default {
  components: { page },
  mixins: [common],
  data() {
    const startTime = new Date()
    startTime.setHours(0)
    startTime.setMinutes(0)
    startTime.setSeconds(0)
    const endTime = new Date()
    endTime.setHours(23)
    endTime.setMinutes(59)
    endTime.setSeconds(59)
    return {
      // essayId:'',
      dataId: '',
      datas: [],
      informateTime: [],
      paramData: {
        current: 1,
        size: 10,
        total: 0,
        type: '01,03',
        startTime: '',
        endTime: '',
      },
    }
  },
  watch: {
    $route() {
      this.getData()
      this.dataId = this.$route.query.essayId
    },
  },
  computed: {
    user() {
      return this.$store.state.user
    },
  },
  methods: {
    clickDiv(value, idx) {
      let vm = this
      var v = value
      v.isShow = !v.isShow
      vm.datas.splice(idx, 1, v)
    },
    escapeHtml(str) {
      return util.escapeHtml(str)
    },
    // fDate(value){
    //     return formatDate.getFormatDate(value,'yymmddhhmmss');
    // },
    search() {
      // this.startTime = this.informateTime[0] || '';
      // this.endTime = this.informateTime[1] || '';
      this.getData(1)
    },
    fDate(value) {
      return formatDate.getFormatDate(value, 'yymmddhhmmss')
    },
    getData(page = 1) {
      this.$emit('handler-spin', true)
      let vm = this
      let params = Object.assign({}, this.paramData)
      if (this.informateTime.length) {
        if (this.informateTime[0] !== null) {
          params.startTime = convert2ServerDateTime(this.informateTime[0])
        } else {
          params.startTime = ''
        }
        if (this.informateTime[1] !== null) {
          this.informateTime[1].setHours(23)
          this.informateTime[1].setMinutes(59)
          this.informateTime[1].setSeconds(59)
          params.endTime = convert2ServerDateTime(this.informateTime[1])
        } else {
          params.endTime = ''
        }
      }
      params.current = page

      params.userId = this.user.userId
      this.$store.dispatch('queryAnnounceEssayList', params).then((response) => {
        this.$emit('handler-spin', false)
        if (response.data.code !== 0) return
        let data = response.data.data
        vm.datas = data.list
        vm.datas.forEach((element) => {
          element.isShow = false
        })
        vm.$set(vm.paramData, 'total', data.total)
      })
    },
  },
  created() {
    let essayId = this.$route.query.essayId
    if (essayId) {
      this.dataId = essayId
    }
    this.getData()
  },
}
</script>
<style lang = "less">
@fr: right;
.height(@he;@lh) {
  height: @he;
  line-height: @lh;
}
.information-system {
  font-size: 14px;
  .search {
    height: 30px;
    text-align: @fr;
    .button {
      float: @fr;
      margin-left: 20px;
      .wxbutton {
      }
    }
    .datetext {
      float: @fr;
      margin-top: 4px;
      margin-left: 5%;
    }
    .selectDate {
      float: @fr;
      margin-left: 2px;
    }
  }
  .newstitle {
    .height(36px;36px);
    font-size: 12px;
    padding-left: 18px;
    margin-top: 13px;
    color: #f1f1f1;
    /*     background-color: @primary-color; */
    .mtitle {
      width: 74%;
    }
    .mdate {
      width: 24%;
    }
  }
  .list-wrap {
    width: 100%;
    font-size: 12px;
    li {
      img {
        width: auto;
        float: none;
        max-width: 100%;
      }
      &.no-data {
        text-align: center;
        line-height: 35px;
      }
      .newslist {
        .height(36px;36px);
        text-align: left;
        padding-left: 18px;
        display: flex;
      }
    }
  }
}
.lee-newsList span:first-child {
  width: 68%;
}
.information-system .newslist {
  height: 36px;
  text-align: left;
  line-height: 36px;
  padding-left: 18px;
}
.information-system .newstitle span,
.information-system .newslist span {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.information-system .all {
  cursor: pointer;
}
.information-system .no-data.all {
  text-align: center;
  line-height: 36px;
  height: 36px;
  font-size: 12px;
}

.information-system .all:hover {
  background: #ebf7ff;
}
.information-system .active {
  /*   color: @primary-color; */
}
.information-system .all.active .newslist {
  background: #fff;
}
.information-system .active .news-content {
  background: #fff;
}
.information-system .all:nth-child(odd).active .newslist {
  /*   border-bottom: 1px dashed @primary-color; */
}
.information-system .all:nth-child(even) {
  background: #ebebeb;
}
.information-system .active .news-content {
  background-color: #fff;
}
.information-system .news-content {
  padding-left: 18px;
  /* height:70px; */
  padding: 10px 18px;
  color: #313131;
  font-size: 12px;
  background-color: #fff;
}
.information-system .news-content p {
  line-height: 18px;
  text-indent: 22px;
  word-wrap: break-word;
}
.information-system .newscontent-enter-active,
.information-system .newscontent-leave-active {
  transition: all 0.05s ease;
  -webkit-transition: all 0.05s ease;
  -o-transition: all 0.05s ease;
  -moz-transition: all 0.05s ease;
  -ms-transition: all 0.05s ease;
}
.information-system .newscontent-enter,
.information-system .newscontent-leave-to {
  height: 0;
}
</style>
