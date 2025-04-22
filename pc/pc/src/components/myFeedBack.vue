<template>
  <div>
    <modal
      :modalShow='showFeedBack'
      :hasFooter="false"
      :hasOkBtn="false"
      :hasNoBtn="false"
      :maskClosable="false"
      :title="$tex('我的反馈')"
      width="500"
      :claName="`home-feed-back-dialog ${className}`"
      @btn-cancel="close"
    >
      <div
        slot="content"
        class="content-wp"
      >
        <Spin
          size="large"
          fix
          v-if="spinShow"
        ></Spin>
        <div class="tool">
          <DatePicker
            type="daterange"
            :placeholder="$tex('选择日期')"
            style="width: 200px"
            :options="options"
            :editable="false"
            @on-change="getSelectDate"
          ></DatePicker>
          <Select
            v-model="selectCate"
            style="width:100px"
            @on-change='changeSpecialDate'
          >
            <Option
              v-for="item in cates"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
          <Button
            type="primary"
            class="whitespace-nowrap"
            @click.stop="addFeedBack"
          >{{$tex("我要反馈")}}</Button>
        </div>
        <div class="feed-back-list">
          <ul>
            <template v-if="feedBackList.length">
              <li
                v-for="(item,idx) of feedBackList"
                :key="idx"
              >
                <dl>
                  <dt>
                    <p class="sugg-title">{{item.title}}</p>
                    <div
                      class="content nice-scroll"
                      :class="{'show-hide':item.isShowHide}"
                    >
                      <span
                        ref="feedTxt"
                        class="content-txt"
                      >{{item.content}}</span>
                      <i
                        class="ivu-icon ivu-icon-arrow-down-b ivu-select-arrow"
                        @click.stop="showTotalTxt(item,idx)"
                      ></i>
                      <div
                        class="attachment"
                        v-if="item.attachment"
                      >
                        <img
                          :src="item.attachment"
                          alt=""
                        >
                        <div class="img-cover">
                          <i
                            class="ivu-icon ivu-icon-ios-eye-outline"
                            @click="onImgPreview(item.attachment)"
                          ></i>
                        </div>
                      </div>
                    </div>
                  </dt>
                  <dd>
                    <i class="iconfont icon-zxkf"></i>
                    <span class="feed nice-scroll">{{item.reply || $tex('暂无反馈结果')}}</span>
                    <span>{{item.createTime | getDate}}</span>
                  </dd>
                </dl>
              </li>
            </template>
            <template v-else-if="feedBackList && !feedBackList.length">
              <li class="empty">{{$tex("暂无数据")}}</li>
            </template>

          </ul>
        </div>
        <page
          class="active-page2"
          :showLastPage="false"
          :total="total"
          :currentPage="params.current"
          :pageSize="params.size"
          @get-Page-Data="getData"
        ></page>
      </div>
    </modal>
    <modal
      :title="$tex('图片预览')"
      claName="perview-img"
      :modalShow="isShowImgPreview"
      :scrollable="true"
      :hasFooter="false"
      :hasOkBtn="false"
      :hasNoBtn="false"
      @btn-cancel="onImgPreviewCancel"
    >
      <div slot="content">
        <img
          :src="imgPreviewUrl"
          style="width: 100%;float: none;"
        >
      </div>
    </modal>
  </div>
</template>

<script>
const TEXT_MAX_WIDTH = '286'
import modal from '@/components/modal.vue'
import page from '@/components/page.vue'
import DateUtil from '@/utils/format_date.js'
export default {
  props: {
    showFeedBack: {
      default: false,
      type: Boolean,
    },
    className: {
      default: '',
      type: String,
    },
  },
  components: {
    modal,
    page,
  },
  filters: {
    getDate(stamp) {
      return DateUtil.getFormatDate(stamp, 'yymmdd')
    },
  },
  data() {
    return {
      cates: [
        {
          value: '',
          label: this.$tex('全部'),
        },
        {
          value: '00',
          label: this.$tex('未处理'),
        },
        {
          value: '01',
          label: this.$tex('已处理'),
        },
        {
          value: '02',
          label: this.$tex('忽略'),
        },
        {
          value: '03',
          label: this.$tex('采纳'),
        },
      ],
      selectCate: '',
      params: {
        current: 1,
        endTime: '',
        size: 3,
        startTime: '',
        stauts: '',
      },
      feedBackList: '',
      total: 0,
      options: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now()
        },
      },
      spinShow: false,
      getFeedTxtTimer: '',
      isShowImgPreview: false,
      imgPreviewUrl: '',
    }
  },
  methods: {
    onImgPreviewCancel() {
      this.isShowImgPreview = false
    },
    onImgPreview(url) {
      console.log(url)
      this.imgPreviewUrl = url
      this.isShowImgPreview = true
    },
    close() {
      // this.$emit('update:showFeedBack',false);
      this.$emit('close-my-feed-back')
    },
    /**
     * 我要反馈
     */
    addFeedBack() {
      this.$emit('add-feed-back')
    },
    /**
     * 下拉菜单改变查询数据
     */
    changeSpecialDate(txt) {
      this.$set(this.params, 'stauts', txt)
      this.getData(1)
    },
    /**
     * 查询指定日期的反馈
     */
    getSelectDate(result) {
      if (result[0]) {
        this.$set(this.params, 'startTime', result[0])
        this.$set(this.params, 'endTime', result[1])
      } else {
        this.$set(this.params, 'startTime', '')
        this.$set(this.params, 'endTime', '')
      }
      this.getData(1)
    },
    /**
     * 显示所有内容
     */
    showTotalTxt(item, idx) {
      item.isShowHide = false
      this.$set(this.feedBackList, idx, item)
    },
    /**
     * 点击页数获取数据
     */
    async getData(page) {
      this.spinShow = true
      this.$set(this.params, 'current', page)
      const {
        data: { code, data: res },
      } = await this.getFeedBack()
      this.spinShow = false
      if (code !== 0) return
      this.feedBackList = res.userFeedbackList
      this.$nextTick(() => {
        this.setContentShowOrHide()
      })
    },
    /**
     * 获取我的反馈历史
     */
    getFeedBack() {
      return this.$http.post('/api/v2/user/queryCustomerFeedbackList', this.params, { userId: true, unenc: true })
    },
    /**
     * 设置内容是否应该隐藏
     */
    setContentShowOrHide() {
      const txts = Array.from(this.$refs.feedTxt)
      txts.forEach((item, idx) => {
        const width = item.scrollWidth
        if (width >= TEXT_MAX_WIDTH) {
          let listItem = this.feedBackList[idx]
          listItem.isShowHide = true
          this.feedBackList.splice(idx, 1, listItem)
        }
      })
    },
    /**
     * 设置文本的隐藏
     */
    isSetHideContent() {
      let vm = this
      const feedTxt = getFeedTxt()
      if (!feedTxt) {
        this.getFeedTxtTimer = setTimeout(() => {
          if (!getFeedTxt()) {
            this.isSetHideContent()
          } else {
            clearTimeout(this.getFeedTxtTimer)
            this.setContentShowOrHide()
          }
        }, 500)
      }

      function getFeedTxt() {
        return vm.$refs.feedTxt
      }
    },
  },
  mounted() {
    this.isSetHideContent()
  },
  async created() {
    this.spinShow = true
    const {
      data: { code, data: res },
    } = await this.getFeedBack()
    this.spinShow = false
    if (code !== 0) return
    this.feedBackList = res.userFeedbackList
    this.total = res.total
  },
  beforeDestroy() {
    this.getFeedTxtTimer && clearTimeout(this.getFeedTxtTimer)
  },
}
</script>

<style lang="less" scoped>
@deep: ~'>>>';
.v-transfer-dom {
  @{deep} .perview-img {
    .ivu-modal {
      top: 100px;
      transform: translateY(0);
    }
  }
  @{deep} .home-feed-back-dialog {
    .ivu-modal-body {
      padding: 16px 10px 0;
      background-color: #f5f5f5;
      .content-wp {
        .tool {
          margin-bottom: 12px;
          font-size: 0;
          text-align: center;
          > div {
            display: inline-block;
          }
          .ivu-select {
            margin: 0 12px;
          }
          button {
            display: inline-block;
            width: 88px;
            white-space: normal;
            height: auto;
            word-break: break-all;
            white-space: nowrap;
          }
        }
        .feed-back-list {
          overflow: hidden;
          li:not(.empty) {
            border: 1px solid #dddee1;
            border-radius: 4px;
            background-color: #fff;
          }
          .empty {
            text-align: center;
            margin-top: 10px;
            color: #999;
          }
          .sugg-title {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .content {
            position: relative;
            color: #999;
            max-height: 63px;
            overflow: auto;
            word-break: break-all;
            font-size: 0;
            > i {
              display: none;
            }
            &.show-hide {
              height: 40px;
              .content-txt {
                width: 368px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              .ivu-select-arrow {
                position: absolute;
                right: 0;
                top: 12px;
                cursor: pointer;
              }
              i {
                display: block;
              }
            }
            .attachment {
              height: 50px;
              width: 100px;
              position: relative;
              text-align: center;
              line-height: 70px;
              img {
                float: none;
                width: 100%;
                height: 100%;
              }
              &:hover .img-cover {
                display: block;
              }
              .img-cover {
                display: none;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(0, 0, 0, 0.6);
                i {
                  color: #fff;
                  font-size: 20px;
                  cursor: pointer;
                  margin: 12px 2px 0;
                }
              }
            }
          }

          .content-txt {
            display: inline-block;
            font-size: 14px;
          }
          .ivu-select-arrow {
            width: 10px;
            height: 10px;
            position: initial;
            color: @primary-color;
            cursor: pointer;
          }
          dt {
            padding: 6px 7px;
            border-bottom: 1px solid #f5f5f5;
          }
          dd {
            padding: 4px 7px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .feed {
              display: inline-block;
              width: 270px;
              margin: 0 10px;
              color: @primary-color;
              max-height: 60px;
              overflow-y: auto;
              word-break: break-all;
            }
            .icon-zxkf {
              width: 18px;
              color: @primary-color;
            }
          }
        }
      }
    }
    .ivu-modal-footer {
      background-color: #f5f5f5;
    }
    .ivu-select-dropdown {
      font-size: 14px;
    }
  }
}
</style>
