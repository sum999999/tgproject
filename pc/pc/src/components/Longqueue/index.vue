<template>
    <transition name="melt">
        <mobile-box v-if="show">
            <div class="longqueue">
                <transition :name="transitionName">
                    <keep-alive>
                        <component :is="view" @go="go" @back="back" @close="handleClose"></component>
                    </keep-alive>
                </transition>
            </div>
        </mobile-box>
    </transition>
</template>

<script>
  import MobileBox from "@/components/MobileBox.vue";
  import LongHelper from './long-helper';
  import LongExplain from './long-explain';

  export default {
    name: "Longqueue",
    components: {
      MobileBox,
      LongHelper,
      LongExplain
    },
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        transitionName: 'slide-l',
        view: 'LongHelper',
        historyStack: ['LongHelper']
      };
    },
    computed: {
      show: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit("input", value);
        }
      },
    },
    watch: {
      historyStack(cur = [], old = []) {
        if (cur.length > old.length) {
          this.transitionName = 'slide-l';
        }
        if (cur.length < old.length) {
          this.transitionName = 'slide-r';
        }
        this.view = cur[cur.length - 1];
      },
    },
    methods: {
      handleClose() {
        this.show = false;
      },
      go(view) {
        const lastView = this.historyStack[this.historyStack.length - 1];
        if (lastView !== view) {
            const arr = this.historyStack.concat([]);
            arr.push(view);
            this.historyStack = arr;
        }
      },
      back() {
        if (this.historyStack && this.historyStack.length > 1) {
          const arr = this.historyStack.concat([]);
          arr.pop();
          this.historyStack = arr;
        }
      }
    }
  }
</script>

<style scoped lang="less">
    .longqueue {
        position: relative;
        width: 100%;
        height: 100%;
        background: #f1f1f1;
    }
    .slide-l-enter-active, .slide-l-leave-active, .slide-r-enter-active, .slide-r-leave-active {
        transition: all .3s ease;
    }
    .slide-l-enter{
        transform: translateX(375px);
    }
    .slide-l-leave-to{
          transform: translateX(-375px);
      }
    .slide-r-enter{
        transform: translateX(-375px);
    }
    .slide-r-leave-to{
        transform: translateX(375px);
    }
    .melt-enter-active, .melt-leave-active {
        transition: clip-path 0.3s linear;
    }
    .melt-enter {
        clip-path: polygon(100% 0, 100% 0, 100% 100%, 100% 100%);
    }

    .melt-enter-to {
        clip-path: polygon(0% 0, 100% 0, 100% 100%, 0% 100%);
    }
    .melt-leave {
        clip-path: polygon(0% 0, 100% 0, 100% 100%, 0% 100%);
    }
    .melt-leave-to {
        clip-path: polygon(100% 0, 100% 0, 100% 100%, 100% 100%);
    }
    .mobile-box {
        /*clip-path: path('M0 199.88C8.33 270.71 16.67 306.13 25 306.13C37.5 306.13 35.91 231.4 50 231.13C64.09 230.85 62.5 284.25 75 284.25C87.5 284.25 87.17 208.05 100 212.38C112.83 216.7 112.71 300.8 125 300.47C137.29 300.13 137.76 239.04 150.48 237.38C163.19 235.71 162.16 293.63 174.54 293.63C182.79 293.63 191.28 262.38 200 199.88L200 0.13L0 0.13L0 199.88Z');*/
    }
</style>
