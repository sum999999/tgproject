<template>
    <div class="table-container">
        <keep-alive>
            <component :is="$attrs.code" v-bind="$attrs"></component>
        </keep-alive>
    </div>
</template>

<script>
import allTrends from './child_vue/index.js';
export default {
    components: allTrends,
    inheritAttrs: false,
    data () {
        return {
            titleInfo: [], //开奖记录的标题
            recordsList: [],//开奖结果
            sscBtnActive: ''
        }
    }
};
</script>
<style lang="less">
.table-container {
    canvas {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
    }
}
</style>

