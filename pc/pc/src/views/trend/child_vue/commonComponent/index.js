import base from './baseTrend.vue';
import road from './roadBeads.vue';
import complexAnaly from './complexAnaly.vue';
import direct from './directTrend.vue';
import prize from './prizeRecord.vue';
export default Object.assign({}, {
    'kjjl': prize,
    'zhfx': complexAnaly,
    'lzfx': road,
    'wzzs': direct,
    'jbzs': base
})