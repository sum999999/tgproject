<template>
     <modal
        :modalShow="isShowThemeList"
            :title="$tex('更改主题')"
            claName="login-game-dlg-wrap"
            width="430"
            @btn-cancel="closeThemeDialog"
            @btn-ok="switchTheme"
            >
            <div
                slot="content"
                class=""
            >
            <ul class="theme-list">
                <li
                    :class="{selected:item.primaryColor==currentTheme.primaryColor}"
                    v-for="(item,idx) in currentThemeList"
                    :key="idx"
                    @click="selTheme(item)"
                ></li>
            </ul>
            </div>
    </modal>
</template>

<script>
import modal from '@/components/modal.vue';
import { THEME_CONFIG } from '@/utils/tplConfig'
export default {
    props: {
        isShowThemeList: {
            type: Boolean,
            defautl: false
        }
    },
    components: {modal},
    data() {
        return  {
            currentThemeList: THEME_CONFIG,
            currentTheme: THEME_CONFIG[0],
        }
    },
    mounted() {
        this.currentTheme = this.$store.state.theme.themeColorList;
    },
    methods: {
        switchTheme() {
            this.$store.dispatch('changTheme', {
                themeColorList: this.currentTheme
            })
            this.afterSwitchClose();
        },
        /**
         * 确定后关闭弹框
         */
        afterSwitchClose() {
          this.closeThemeDialog();
        },
        /**
         * 关闭主题弹框
         */
        closeThemeDialog() {
            this.$emit('close-theme-dialog');
            this.currentTheme = this.$store.state.theme.themeColorList;
        },
        /**
         *选择主题
         */
        selTheme(info) {
            this.currentTheme = info;
        },
    }
}
</script>

<style lang="less" scoped>
@themeUrl: '~@/assets/images';
.theme-list {
  li {
    width: 395px;
    height: 53px;
    cursor: pointer;
    margin-bottom: 15px;
    position: relative;
    border: 2px solid transparent;
    border-radius: 10px;
    box-shadow: 0 3px 5px 1px #999;
    &.selected {
      border: 2px solid #be1204;
      &::after {
        content: "";
        right: 0px;
        position: absolute;
        bottom: 0px;
        z-index: 9;
        border: 12px solid #fff;
        border-top-color: transparent;
        border-left-color: transparent;
      }
      &::before {
        content: "\e8b7";
        font-family: "iconfont" !important;
        font-size: 16px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #be1204;
        z-index: 10;
        font-size: 34px;
        right: -1px;
        position: absolute;
        bottom: -9px;
        border-bottom-right-radius: 18px;
      }
    }
    &:nth-child(1) {
      &.selected {
        border: 2px solid #ff7614;
        &::before {
          color: #ff7614;
        }
      }

      background: url('@{themeUrl}/theme-0.png');
    }
    &:nth-child(2) {
      background: url('@{themeUrl}/theme-1.png');
    }
    &:nth-child(3) {
      background: url('@{themeUrl}/theme-2.png');
    }
    &:nth-child(4) {
      background: url('@{themeUrl}/theme-3.png');
    }
    &:nth-child(5) {
      background: url('@{themeUrl}/theme-4.png');
    }
    &:nth-child(6) {
      background: url('@{themeUrl}/theme-5.png');
    }
    &:nth-child(7) {
      background: url('@{themeUrl}/theme-6.png');
    }
    &:nth-child(8) {
      background: url('@{themeUrl}/theme-7.png');
    }
    &:nth-child(9) {
      background: url('@{themeUrl}/theme-8.png');
    }
  }
}
</style>
