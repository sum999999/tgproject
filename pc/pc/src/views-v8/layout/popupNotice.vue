<template>
  <div class="popup-notice">
    <modal
      :modalShow='showModal'
      :has-header="true"
      :okText="$tex('设置')"
      width="800"
      claName="popup-notice-modal"
      @btn-cancel="showModal = false"
    >
      <div
        class="ivu-modal-header"
        slot='header'
      >
        <Icon
          type="volume-medium"
          style="font-size:24px;"
        ></Icon>
        <span>{{$tex('网站公告')}}</span>
        <span @click="showModal = false">
          <Icon type="close-round"></Icon>
        </span>
      </div>
      <div slot="content">
        <img
          class="bg"
          src="~@/assets/images-v8/yxfgbg.png"
          alt=""
        >
        <ul>
          <li
            v-for="(item, idx) in list"
            :key="idx"
            :class="{active: currentId === item.essayId}"
            @click="changeData(item)"
          >
            {{item.title}}
          </li>
        </ul>
        <div class="cont">
          <div class="title">{{currentData.title}}</div>
          <div
            class="detail"
            v-html="escapeHtml(currentData.content)"
          ></div>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import modal from '@/components/modal.vue'
import util from '@/utils/utils'
export default {
  components: { modal },
  data() {
    return {
      showModal: false,
      list: [],
      currentData: '',
      currentId: '',
    }
  },
  methods: {
    escapeHtml(str) {
      if (str) {
        return util.escapeHtml(str)
      }
    },
    changeData(item) {
      this.currentData = item
      this.currentId = item.essayId
    },
  },
  created() {
    let firstTime = sessionStorage.getItem('firstTime')
    if (firstTime) return
    this.$store.dispatch('queryAnnounceEssayList', { type: '03' }).then((response) => {
      if (response.data.code !== 0) return
      this.list = response.data.data.list
      if (this.list.length) {
        this.currentData = this.list[0]
        this.currentId = this.list[0].essayId
        this.showModal = true
        sessionStorage.setItem('firstTime', 'isTrue')
      }
    })
  },
}
</script>

<style scoped lang="less">
@deep: ~'>>>';

@{deep} .popup-notice-modal {
  .bg {
    position: absolute;
    top: -197px;
    right: 48px;
    width: 481px;
    z-index: -1;
  }
  .ivu-modal-content {
    position: relative;
    border: 1px solid #fed136;
  }
  .ivu-modal-footer {
    display: none;
  }
  .ivu-modal-body {
    padding: 0;
    height: 470px;
    background: #2a2a2a;
    color: #fff;
  }
  .ivu-modal-header {
    display: flex;
    align-items: center;
    text-align: left;
    color: #313131;
    background: #fed136;
    background-image: linear-gradient(0deg, #efbe16 0%, #fddd49 100%);
    border: 1px solid #313131;
    box-shadow: inset 0 0 8px 0 rgba(255, 255, 255, 0.5);
    margin: -2px -2px;
    > span:nth-of-type(1) {
      flex: 1;
      padding-left: 10px;
    }
  }
  .ivu-modal-body ul {
    height: 430px;
    width: 240px;
    overflow-y: auto;
    background: #2a2a2a;
    border-right: 1px solid #fed136;
    border-top: 1px solid #fed136;
    float: left;
  }
  .ivu-modal-body ul li {
    height: 38px;
    line-height: 38px;
    font-size: 12px;
    border-bottom: 1px dashed #fff;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    position: relative;
    padding-left: 34px;
    padding-right: 10px;
    cursor: pointer;
  }
  .ivu-modal-body ul li:last-child {
    border: 0;
  }
  .ivu-modal-body ul li::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #fed136;
    position: absolute;
    left: 16px;
    top: 15px;
  }
  .ivu-modal-body ul li:hover,
  .ivu-modal-body ul li.active {
    /*  color: #be1204; */
    color: #ddc17c;
  }
  .ivu-modal-body .cont {
    float: right;
    width: 558px;
  }
  .ivu-modal-body .cont .title {
    font-size: 20px;
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #fed136;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #fed136;
  }
  .ivu-modal-body .cont .detail {
    padding: 10px;
    height: 368px;
    overflow-y: auto;
  }
  .ivu-modal-body .cont .detail p {
    font-size: 14px !important;
  }
}
</style>
