<template>
    <div class="lottery-history">
        <component :is="componentView" :list="lotteryInfo.prizeHistoryList"></component>
    </div>
</template>

<script>
    // https://webpack.js.org/guides/dependency-management/#requirecontext
    const modulesFiles = require.context('./', true, /history_.*?\.vue$/);

    // you do not need `import app from './modules/app'`
    // it will auto require all vuex module from modules file
    const moduleNames = modulesFiles.keys().reduce((modules, modulePath) => {
        const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
        modules.push(moduleName.replace("history_", ""));
        return modules;
    }, []);

    import {mapGetters} from "vuex";
    import isEmpty from "lodash/isEmpty";
    import AsyncLoading from "@/components/AsyncLoading";
    import HistoryDefault from "./history_default";

    export default {
        name: "lotteryHistory",
        data() {
            return {
                componentView: null,
                code: ""
            };
        },
        computed: {
            ...mapGetters(["defaultLotterySelect", "lotteryInfo"]),
        },
        watch: {
            lotteryInfo: {
                deep: true,
                handler(newValue = {}, oldValue = {}) {
                    if (!isEmpty(newValue)) {
                        const {prize: prize1 = {}} = newValue;
                        const {prize: prize2 = {}} = oldValue;
                        if (this.code === this.defaultLotterySelect.code) {
                            return;
                        }
                        if (moduleNames.indexOf(this.defaultLotterySelect.code) !== -1) {
                            this.componentView = () => ({
                                component: import(`./history_${this.defaultLotterySelect.code}.vue`),
                                loading: AsyncLoading,
                                delay: 0,
                                error: HistoryDefault
                            });
                        } else {
                            this.componentView = () => ({
                                component: import(`./history_default.vue`),
                                loading: AsyncLoading,
                                delay: 0,
                                error: HistoryDefault
                            });
                        }

                        this.code = this.defaultLotterySelect.code;
                    }
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .lottery-history {
        min-height: 100px;
        position: relative;
    }
</style>
