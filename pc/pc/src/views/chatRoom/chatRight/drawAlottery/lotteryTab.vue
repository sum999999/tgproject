<template>
    <div>
        <ul class="drawALottery-tab clearfix">
            <li
                    v-for="(item, idx) in tabs"
                    :key="idx"
                    :class="{active: idx === activeIndex}"
                    @click="onTabClick(idx)">
                <i class="iconfont" :class="[item.icon]"></i>
                {{item.name}}
            </li>
        </ul>
        <keep-alive>
            <component
                    :is="componentView"
                    @on-tab-click="onTabClick">
            </component>
        </keep-alive>
    </div>
</template>

<script>
    import LotteryHistory from "./lotteryHistory";
    import LotterySelect from "./lotterySelect";

    export default {
        name: "lotteryTab",
        components: {
            LotteryHistory,
            LotterySelect
        },
        data() {
            return {
                componentView: LotteryHistory,
                activeIndex: 0,
                tabs: [
                    {
                        icon: "icon-kaijianglishi1",
                        name: this.$tex("开奖历史"),
                        view: LotteryHistory,
                        callback: null
                    },
                    {
                        icon: "icon-caipiaoxuanze1",
                        name: this.$tex("彩票选择"),
                        view: LotterySelect,
                        callback: null
                    },
                ],
            };
        },
        methods: {
            onTabClick(index) {
                this.activeIndex = index;
                const {view, callback} = this.tabs[index];
                this.componentView = view;
                callback && callback();
            },
        }
    }
</script>

<style scoped lang="less">
    .drawALottery-tab {
        text-align: center;
        font-size: 16px;
        background-color: #323c4b;
        color: #ffffff;
        cursor: pointer;
        position: sticky;
        top: 0;
        z-index: 1;
        li {
            width: 50%;
            float: left;
            padding: 14px 0;
            opacity: 0.7;
            &:hover {
                opacity: 1;
            }
        }
        li.active {
            opacity: 1;
        }
    }
</style>
