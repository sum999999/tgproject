<template>
    <div v-if="show" class="mobile-modal">
        <div class="mobile-modal__mask"></div>
        <div class="mobile-modal__wrap" @click="onMaskClick">
            <div class="mobile-modal__dialog">
                <div ref="content" class="mobile-modal__content">
                    <div class="mobile-modal__header">
                        <span class="mobile-modal__title">{{title}}</span>
                    </div>
                    <div class="mobile-modal__body">
                        <i v-if="isSuccessIcon" class="mobile-modal__success"></i><slot></slot>
                    </div>
                    <div class="mobile-modal__footer">
                        <span v-if="isOk" class="mobile-modal__btn mobile-modal__cancel" @click="onCancelClick">{{cancelText}}</span>
                        <span v-if="isCancel" class="mobile-modal__btn mobile-modal__sure" @click="onOkClick">{{okText}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "MobileModal",
    props: {
      value: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default() {
          return this.$tex('提示');
        }
      },
      okText: {
        type: String,
        default() {
          return this.$tex('确认');
        }
      },
      cancelText: {
        type: String,
        default() {
          return this.$tex('取消');
        }
      },
      isOk: {
        type: Boolean,
        default: false
      },
      isCancel: {
        type: Boolean,
        default: false
      },
      isSuccessIcon: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      show: {
        set(value) {
          this.$emit("input", value);
        },
        get() {
          return this.value;
        }
      },
    },
    methods: {
      onMaskClick(event) {
        if (!this.$refs.content || this.$refs.content.contains(event.target)) {
          return void 0;
        }
        this.closeHandler();
      },
      onCancelClick() {
        this.$emit('cancel');
        this.closeHandler();
      },
      onOkClick() {
        this.$emit('ok');
        this.closeHandler();
      },
      closeHandler() {
        this.show = false;
      }
    }
  }
</script>

<style scoped lang="less">
    .mobile-modal {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
        font-size: 15px;
        &__mask {
            position: absolute;
            inset: 0;
            z-index: 1000;
            background-color: #00000073;
        }
        &__wrap {
            position: absolute;
            inset: 0;
            overflow: auto;
            outline: 0;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        &__dialog {
            padding: 0 20px;
        }
        &__content {
            padding: 15px 16px;
            background: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 5px;
            box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d;
        }
        &__title {
            color: #ff464b;
        }
        &__body {
            color: #333333;
            padding: 35px 0 43px;
            text-align: center;
            span {
                vertical-align: middle;
            }
        }
        &__footer {
            text-align: center;
        }
        &__btn {
            display: inline-block;
            padding: 5px 24px;
            color: #ffffff;
            border-radius: 5px;
            cursor: pointer;
            margin: 0 4px;
        }
        &__cancel {
            background: #888888;
        }
        &__sure {
            background: #FF464B;
        }
        &__success {
            display: inline-block;
            vertical-align: middle;
            background: url("~@/assets/images/longqueue/gou.png") no-repeat center center;
            background-size: 100% 100%;
            width: 20px;
            height: 20px;
            margin: 2px 5px;
        }
    }
</style>
