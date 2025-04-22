<template>
    <div class="longhelper">
        <mobile-modal
                v-model="modalOptions.show"
                :title="modalOptions.title"
                :ok-text="modalOptions.okText"
                :is-ok="modalOptions.isOk"
                :is-cancel="modalOptions.isCancel"
                :is-success-icon="modalOptions.isSuccessIcon"
                @ok="modalOptions.ok">
            <span>{{modalOptions.content}}</span>
        </mobile-modal>
        <long-header :back="false" :close="true" v-on="$listeners">
            <template slot="title">
                {{$tex("长龙助手")}}
            </template>
            <template slot="right">
                <i class="longhelper-explain-icon" @click="onExplainClick"></i>
            </template>
        </long-header>
        <div class="longhelper-tab">
            <div v-for="tab in tabs" :key="tab.view" class="longhelper-tab__item" :class="{
                'longhelper-tab--active': listView === tab.view
            }" @click="onTabClick(tab.view)">
                <span>{{tab.name}}</span>
            </div>
        </div>
        <div class="longhelper__body">
            <keep-alive>
                <component :is="listView" @modal="modal"></component>
            </keep-alive>
        </div>
    </div>
</template>

<script>
  import MobileModal from "../components/MobileModal";
  import LongHeader from "../components/LongHeader";
  import longHelperList from "./longHelperList";
  import longRecordList from "./longRecordList";

  export default {
    name: "LongHelper",
    components: {
      MobileModal,
      LongHeader,
      longHelperList,
      longRecordList
    },
    data() {
      return {
        listView: 'longHelperList',
        tabs: [
          {
            view: 'longHelperList',
            name: this.$tex("长龙助手")
          },
          {
            view: 'longRecordList',
            name: this.$tex("投注记录")
          },
        ],
        modalOptions: {
          show: false,
          title: null,
          okText: null,
          ok: () => {},
          isOk: false,
          isCancel: false,
          content: null,
          isSuccessIcon: false
        }
      }
    },
    methods: {
      onTabClick(view) {
        this.listView = view;
      },
      onExplainClick() {
        this.$emit('go', 'LongExplain');
      },
      modal(options) {
        if (options.show) {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.modalOptions = {
              ...this.modalOptions,
              show: false
            }
          }, 2000)
        }
        this.modalOptions = {
          ...this.modalOptions,
          ...options
        };
      }
    }
  }
</script>

<style scoped lang="less">
    .longhelper {
        position: absolute;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }
    .longhelper-tab {
        width: 335px;
        height: 46px;
        background: #FFFFFF;
        border: 0 solid #979797;
        box-shadow: 0 3px 4px 0 rgba(255,70,75,0.11);
        border-radius: 8px;
        margin: -25px auto 0 auto;
        font-size: 16px;
        display: flex;
        align-items: center;
        .longhelper-tab__item:nth-child(1) {
            &:before {
                display: none;
            }
        }
    }
    .longhelper-tab__line {
        background: #EEEEEE;
        border-right: 1px solid #EEEEEE;
        height: 25.5px;
    }
    .longhelper-tab__item {
        flex: 1;
        align-self: stretch;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
        &:before {
            content: '';
            display: inline-block;
            background: #EEEEEE;
            border-right: 1px solid #EEEEEE;
            height: 25.5px;
            position: absolute;
            left: 0;
        }
        &:after {
            content: '';
            display: inline-block;
            width: 32px;
            height: 3px;
            background: #FF464B;
            border-radius: 8px;
            position: absolute;
            bottom: 0;
            visibility: hidden;
        }
        &.longhelper-tab--active {
            &:after {
                visibility: visible;
            }
        }
    }
    .longhelper-tab--active {
        color: #FF464B;
    }
    .longhelper__body {
        flex: 1;
        overflow: hidden;
    }
    .longhelper-explain-icon {
        display: inline-block;
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        vertical-align: middle;
        cursor: pointer;
        width: 24px;
        height: 24px;
        background-image: url(~@/assets/images/longqueue/shuoming.png);
    }
</style>

