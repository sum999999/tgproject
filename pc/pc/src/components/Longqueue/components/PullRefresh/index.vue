<template>
    <div class="pull-refresh">
        <div ref="track" class="pull-refresh__track" :style="trackStyle" :no-select="noSelect">
            <div class="pull-refresh__head" :style="headStyle">
                <div v-if="genStatusText" class="pull-refresh__text">{{ genStatusText }}</div>
            </div>
            <slot></slot>
        </div>
    </div>
</template>

<script>
  import { TouchMixin } from "./touch";
  import { getScrollContainer, getScrollTop, preventDefault } from '@/utils/domEx';

  const DEFAULT_HEAD_HEIGHT = 50;
  const TEXT_STATUS = ['pulling', 'loosing', 'success'];

  export default {
    name: "PullRefresh",
    mixins: [TouchMixin],
    props: {
      disabled: Boolean,
      successText: String,
      pullingText: {
        type: String,
        default() {
          return `${this.$tex("下拉即可刷新")}...`
        }
      },
      loosingText: {
        type: String,
        default() {
          return `${this.$tex("释放即可刷新")}...`
        }
      },
      loadingText: {
        type: String,
        default() {
          return `${this.$tex("加载中")}...`
        }
      },
      value: {
        type: Boolean,
        required: true
      },
      successDuration: {
        type: [Number, String],
        default: 500
      },
      animationDuration: {
        type: [Number, String],
        default: 300
      },
      headHeight: {
        type: [Number, String],
        default: DEFAULT_HEAD_HEIGHT
      }
    },
    data() {
      return {
        status: 'normal',
        distance: 0,
        duration: 0,
        noSelect: false
      }
    },
    computed: {
      touchable() {
        return this.status !== 'loading' && this.status !== 'success' && !this.disabled;
      },
      trackStyle() {
        return {
          transitionDuration: this.duration + "ms",
          transform: this.distance ? "translate3d(0," + this.distance + "px, 0)" : ''
        };
      },
      headStyle() {
        if (this.headHeight !== DEFAULT_HEAD_HEIGHT) {
          return {
            height: this.headHeight + "px"
          };
        }
      },
      genStatusText() {
        const { status } = this;
        if (status === 'normal') {
          return '';
        }
        return this[`${status}Text`];
      }
    },
    watch: {
      value(loading) {
        this.duration = this.animationDuration;

        if (loading) {
          this.setStatus(+this.headHeight, true);
        } else if (this.successText) {
          this.showSuccessTip();
        } else {
          this.setStatus(0, false);
        }
      }
    },
    mounted() {
      this.bindTouchEvent(this.$refs.track);
      this.scrollEl = getScrollContainer(this.$el, true);
    },
    methods: {
      checkPullStart(event) {
        this.ceiling = getScrollTop(this.scrollEl) === 0;

        if (this.ceiling) {
          this.duration = 0;
          this.touchStart(event);
        }
      },
      onTouchStart(event) {
        if (this.touchable) {
          this.checkPullStart(event);
        }
      },
      onTouchMove(event) {
        if (!this.touchable) {
          return;
        }

        if (!this.ceiling) {
          this.checkPullStart(event);
        }

        this.touchMove(event);

        if (this.ceiling && this.deltaY >= 0 && this.direction === 'vertical') {
          this.noSelect = true;
          preventDefault(event);
          this.setStatus(this.ease(this.deltaY));
        }
      },
      onTouchEnd() {
        this.noSelect = false;
        if (this.touchable && this.ceiling && this.deltaY) {
          this.duration = this.animationDuration;
          if (this.status === 'loosing') {
            this.setStatus(+this.headHeight, true);
            this.$emit('input', true); // ensure value change can be watched

            this.$nextTick(() =>{
              this.$emit('refresh');
            });
          } else {
            this.setStatus(0);
          }
        }
      },
      ease(distance) {
        const headHeight = +this.headHeight;

        if (distance > headHeight) {
          if (distance < headHeight * 2) {
            distance = headHeight + (distance - headHeight) / 2;
          } else {
            distance = headHeight * 1.5 + (distance - headHeight * 2) / 4;
          }
        }

        return Math.round(distance);
      },
      setStatus(distance, isLoading) {
        let status;

        if (isLoading) {
          status = 'loading';
        } else if (distance === 0) {
          status = 'normal';
        } else {
          status = distance < this.headHeight ? 'pulling' : 'loosing';
        }

        this.distance = distance;

        if (status !== this.status) {
          this.status = status;
        }
      },
      showSuccessTip() {
        this.status = 'success';
        setTimeout(() => {
          this.setStatus(0);
        }, this.successDuration);
      }
    }
  }
</script>

<style scoped lang="less">
    .pull-refresh {
        height: 100%;
        &__track {
            position: relative;
            height: 100%;
            will-change: transform;
        }
        &__head {
            position: absolute;
            left: 0;
            width: 100%;
            height: 50px;
            overflow: hidden;
            color: #969799;
            font-size: 14px;
            line-height: 50px;
            text-align: center;
            transform: translateY(-100%);
        }
    }
</style>
