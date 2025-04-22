<template>
    <div class="longexplain">
        <long-header v-on="$listeners">
            <template slot="title">
                {{$tex("说明")}}
            </template>
        </long-header>
        <div class="longexplain-rule">
            <p>{{$tex("长龙助手是对快3、时时彩、PK10、六合彩特定玩法的“大小单双” 开奖结果进行跟踪统计，并可进行快捷投注的助手工具；")}}</p>
            <br>
            <p>{{$tex("每期出现大、小、单、双的概率相同，如果连续3期及以上的开奖结果相同，称之为“长龙”通常会采用倍投的方式进行“砍龙”或“顺龙”")}}</p>
            <br>
            <p class="longexplain-rule__title"><span>{{$tex("什么是砍龙？")}}</span></p>
            <p>{{$tex("如连续开5期“单”，可以选择“双”进行投注，这种投注方案称之为“砍龙”；")}}</p>
            <br>
            <p class="longexplain-rule__title"><span>{{$tex("什么是顺龙？")}}</span></p>
            <p>{{$tex("如连续开5期“单”，继续选择“单”进行投注，这种投注方案称之为“顺龙”；")}}</p>
            <br>
            <p class="longexplain-rule__title"><span>{{$tex("什么是倍投？")}}</span></p>
            <p>{{$tex("倍投是一种翻倍投注方式，是为了保障能够在“砍龙”或“顺龙”的过程中持续盈利的一种投注方式。")}}</p>
        </div>
    </div>
</template>

<script>
  import LongHeader from "../components/LongHeader";

  export default {
    name: "LongExplain",
    components: {
      LongHeader
    }
  }
</script>

<style scoped lang="less">
    .longexplain {
        position: absolute;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }

    .longexplain-rule {
        background: #FFFFFF;
        margin: -25px 7px;
        min-height: 400px;
        border-radius: 8px;
        padding: 13px 13px 42px;
        white-space: pre-line;
        &__title {
            font-size: 17px;
            color: #FF464B;
            &:before {
                content: "";
                display: inline-block;
                width: 4px;
                height: 17px;
                background: #FF464B;
                border-radius: 8px;
                vertical-align: middle;
                margin-right: 10px;
            }
            span {
                vertical-align: middle;
            }
        }
    }
</style>

