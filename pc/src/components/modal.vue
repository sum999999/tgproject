<template>
  <Modal
    v-model="isShow"
    :width="width"
    :mask-closable="maskClosable"
    :closable="false"
    :class-name="claName"
    :scrollable="scrollable"
    @on-cancel="$emit('btn-cancel')"
  >
    <!-- 页眉 -->
    <slot name="header" v-if="hasHeader">
      <div slot="header">
        <slot name="icon-title"></slot>
        <span>{{ title }}</span>
        <span @click="$emit('btn-cancel')">
          <Icon type="close-round"></Icon>
        </span>
      </div>
    </slot>
    <!-- 内容 -->
    <slot name="content"></slot>
    <slot name="lee-footer"></slot>
    <!-- 页脚 -->
    <div class="modal-footer" slot="footer" v-if="hasFooter">
      <Button
        type="primary"
        v-preventReClick="2000"
        @click="$emit('btn-ok')"
        v-if="hasOkBtn"
        >{{ okText }}</Button
      >
      <Button
        v-preventReClick="2000"
        type="text"
        @click="$emit('btn-cancel')"
        v-if="hasNoBtn"
        >{{ noText }}</Button
      >
    </div>
    <!-- 默认无页脚 -->
    <div slot="footer"></div>
  </Modal>
</template>
<script>
export default {
  props: {
    title: {
      //标题
      type: String,
      default: "",
    },
    modalShow: {
      //显示与隐藏弹框
      type: Boolean,
      default: false,
    },
    claName: {
      //类名
      type: String,
      default: "",
    },
    width: {
      //宽度
      type: [Number, String],
      default: 520,
    },
    maskClosable: {
      //是否用遮罩层关闭
      type: Boolean,
      default: true,
    },
    hasHeader: {
      //是否显示页眉
      type: Boolean,
      default: true,
    },
    hasFooter: {
      //是否显示页脚
      type: Boolean,
      default: true,
    },
    hasOkBtn: {
      //是否显示确定按钮
      type: Boolean,
      default: true,
    },
    hasNoBtn: {
      //是否显示取消按钮
      type: Boolean,
      default: true,
    },
    noText: {
      //取消按钮文字
      type: String,
      default() {
        return this.$tex("取消");
      },
    },
    okText: {
      //确定按钮文字
      type: String,
      default() {
        return this.$tex("确定");
      },
    },
    scrollable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isShow: {
      get: function() {
        return this.modalShow;
      },
      set: function(val) {},
    },
    // sureText(){
    //     return this.okText;
    // },
    // cancelText() {
    //     return this.noText;
    // }
  },
};
</script>
<style scoped>
.modal-footer {
  display: flex;
  justify-content: center;
}
.ivu-modal-mask {
  background-color: rgba(55, 55, 55, 0.6);
}
.v-transfer-dom >>> .ivu-modal {
  top: 50%;
  transform: translateY(-50%);
  transform-origin: center center;
}
.v-transfer-dom >>> .ivu-icon-close-round:hover {
  color: #444;
}
.v-transfer-dom >>> .ivu-modal-header {
  height: 40px;
  color: #fff;
  font-weight: normal;
  border: none;
  /*   background: #be1204; */
  text-align: center;
}
.v-transfer-dom >>> .ivu-modal-header span {
  /* float: left; */
}
.v-transfer-dom >>> .ivu-modal-header span:last-child {
  float: right;
  cursor: pointer;
}
.v-transfer-dom >>> .ivu-modal-content {
  border-radius: 4px;
  -webkit-border-radius: 4px;
  -ms-border-radius: 4px;
  -moz-border-radius: 4px;
  -o-border-radius: 4px;
  /*  border: 1px solid #be1204; */
}
.v-transfer-dom >>> .ivu-modal-body {
  font-size: 14px;
}
.v-transfer-dom >>> .ivu-modal-close {
  top: 5px;
}
.v-transfer-dom >>> .ivu-icon-ios-close-empty {
  color: #fff;
}
.v-transfer-dom >>> .ivu-icon-ios-close-empty:hover {
  color: #444;
}
.v-transfer-dom >>> .ivu-modal-header-inner {
  height: 12px;
  line-height: 12px;
  color: #fff;
  font-weight: normal;
}
.v-transfer-dom >>> .ivu-modal-footer button {
  min-width: 80px;
  height: 32px;
  line-height: 18px;
}
.v-transfer-dom >>> .ivu-modal-footer .ivu-btn-text {
  background: #a9a9a9;
  color: #fff;
}
</style>
<style>
.ivu-modal-wrap {
  height: 100%;
}
@keyframes ivuEaseIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes ivuEaseOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
