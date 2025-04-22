<template>
    <table class="ball-table" :class="{
        'ball-table--show-title-true': showTitle,
        'ball-table--show-title-false': !showTitle
    }">
        <tr v-show="showTitle">
            <th class="ball-table__label-title">{{$tex("选项")}}</th>
            <th class="ball-table__odds-title">{{$tex("赔率")}}</th>
            <th class="ball-table__price-title">{{$tex("金额")}}</th>
        </tr>
        <tr>
            <td class="ball-table__label">
                <slot name="label">{{ label }}</slot>
            </td>
            <td class="ball-table__odds ball-table__color--primary">{{ odds }}</td>
            <td class="ball-table__price">
                <zk-input v-model="price" type="number" :min="0" @focus="$emit('focus')" @blur="$emit('blur')"></zk-input>
            </td>
        </tr>
    </table>
</template>

<script>
  import { ZkInput } from '@/components/ZkInput'

  export default {
    name: "BallTable",
    components: {
      ZkInput
    },
    props: {
      value: {
        type: Number,
        default: 0
      },
      showTitle: {
        type: Boolean,
        default: true
      },
      label: {
        type: String,
        default: "暂无"
      },
      odds: {
        type: String | Number,
        default: "0"
      }
    },
    computed: {
      price: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit("input", Number.isNaN(Number(value)) ? 0 : Number(value));
        }
      }
    }
  }
</script>

<style scoped lang="less">
    @deep: ~">>>";
    .ball-table {
        width: 100%;
        color: #5f5d5d;
        border-collapse: collapse;
        text-align: center;
        font-size: 14px;
        table-layout: fixed;
        th {
            font-weight: normal;
        }
        tr td {
            font-weight: bold;
        }
        .zk-input-wrap {
            padding: 0 30px;
            @{deep} .zk-input__inner {
                width: 80px;
                height: 22px;
                line-height: 22px;
            }
        }
    }
    .ball-table__color--primary {
        color: @primary-color;
    }
    .ball-table--show-title-true {
        tr th, tr td  {
            border:1px solid #eeeeee;
            padding: 14px 10px;
        }
    }
    .ball-table--show-title-false {
        tr th, tr td  {
            border:1px solid #eeeeee;
            border-top: none;
            padding: 14px 10px;
        }
    }
    .ball-table__price-title, .ball-table__price {
        width: 180px;
    }
</style>
