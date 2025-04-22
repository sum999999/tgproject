<template>
    <div class="tab-body">
        <keep-alive>
            <component :is="$attrs.displayCode" :lotteryId="$attrs.lotteryId" :openBallCount="$attrs.openBallCount" :code="codeParam"></component>
        </keep-alive>
    </div>
</template>
<script>
import alltrend from './commonComponent/index.js';
export default {
    components: alltrend,
    computed: {
        codeParam () {
            if (this.$attrs.lotteryId === '35') {
                return 'ssc';
            }
            return 'qtcp';
        }
    }
}
</script>
<style lang='less'>
.tab-body {
    width: 100%;
}
</style>
