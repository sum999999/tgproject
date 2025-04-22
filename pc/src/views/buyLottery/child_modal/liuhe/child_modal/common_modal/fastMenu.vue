<template>
  <div class="liuhe-fast-bet-menu">
    <table>
      <thead>
        <tr>
          <th colspan="3">{{$tex("快捷投注")}}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item,index) of fastMenu"
          :key="index"
        >
          <td
            v-for="(itm,idx) of item"
            :key="itm.label"
            @click.stop="selectBetType(itm,index,idx)"
            :class="{'active':index===trIndex && idx===tdIndex}"
          >
            <animal :text="itm.title"></animal>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Animal from '@/components/Animal'

export default {
  components: {
    Animal,
  },
  data() {
    return {
      trIndex: -1,
      tdIndex: -1,
      fastMenu: [
        [
          { label: 'single', title: this.$tex('单码') },
          { label: 'sm-single', title: this.$tex('小单') },
          { label: 'sum-single', title: this.$tex('合单') },
        ],

        [
          { label: 'double', title: this.$tex('双码') },
          { label: 'sm-double', title: this.$tex('小双') },
          { label: 'sum-double', title: this.$tex('合双') },
        ],

        [
          { label: 'big', title: this.$tex('大码') },
          { label: 'big-single', title: this.$tex('大单') },
          { label: 'sum-big', title: this.$tex('合大') },
        ],

        [
          { label: 'small', title: this.$tex('小码') },
          { label: 'big-double', title: this.$tex('大双') },
          { label: 'sum-small', title: this.$tex('合小') },
        ],

        [
          { label: 'start0', title: this.$tex('0头') },
          { label: 'end0', title: this.$tex('0尾') },
          { label: 'end5', title: this.$tex('5尾') },
        ],

        [
          { label: 'start1', title: this.$tex('1头') },
          { label: 'end1', title: this.$tex('1尾') },
          { label: 'end6', title: this.$tex('6尾') },
        ],

        [
          { label: 'start2', title: this.$tex('2头') },
          { label: 'end2', title: this.$tex('2尾') },
          { label: 'end7', title: this.$tex('7尾') },
        ],

        [
          { label: 'start3', title: this.$tex('3头') },
          { label: 'end3', title: this.$tex('3尾') },
          { label: 'end8', title: this.$tex('8尾') },
        ],

        [
          { label: 'start4', title: this.$tex('4头') },
          { label: 'end4', title: this.$tex('4尾') },
          { label: 'end9', title: this.$tex('9尾') },
        ],

        [
          { label: 'mouse', title: this.$tex('鼠') },
          { label: 'dragon', title: this.$tex('龙') },
          { label: 'monkey', title: this.$tex('猴') },
        ],

        [
          { label: 'cattle', title: this.$tex('牛') },
          { label: 'snake', title: this.$tex('蛇') },
          { label: 'chicken', title: this.$tex('鸡') },
        ],

        [
          { label: 'tiger', title: this.$tex('虎') },
          { label: 'horse', title: this.$tex('马') },
          { label: 'dog', title: this.$tex('狗') },
        ],

        [
          { label: 'rabbit', title: this.$tex('兔') },
          { label: 'sheep', title: this.$tex('羊') },
          { label: 'pig', title: this.$tex('猪') },
        ],

        [
          { label: 'red', title: this.$tex('红') },
          { label: 'blue', title: this.$tex('蓝') },
          { label: 'green', title: this.$tex('绿') },
        ],

        [
          { label: 'red-single', title: this.$tex('红单') },
          { label: 'blue-single', title: this.$tex('蓝单') },
          { label: 'green-single', title: this.$tex('绿单') },
        ],

        [
          { label: 'red-double', title: this.$tex('红双') },
          { label: 'blue-double', title: this.$tex('蓝双') },
          { label: 'green-double', title: this.$tex('绿双') },
        ],

        [
          { label: 'red-big', title: this.$tex('红大') },
          { label: 'blue-big', title: this.$tex('蓝大') },
          { label: 'green-big', title: this.$tex('绿大') },
        ],

        [
          { label: 'red-small', title: this.$tex('红小') },
          { label: 'blue-small', title: this.$tex('蓝小') },
          { label: 'green-small', title: this.$tex('绿小') },
        ],

        [
          { label: 'all', title: this.$tex('全选') },
          { label: 'inverse', title: this.$tex('反选') },
          { label: 'cancel', title: this.$tex('取消') },
        ],
      ],
    }
  },
  methods: {
    selectBetType(item, index, idx) {
      this.trIndex !== index && (this.trIndex = index)
      this.tdIndex !== idx && (this.tdIndex = idx)
      if (item.label === 'cancel') {
        this.trIndex = -1
        this.tdIndex = -1
      }
      this.$emit('select-bet-type', item)
    },
  },
}
</script>

<style lang="less" scoped>
.liuhe-fast-bet-menu {
  width: 100%;
  background: #fff;
  table {
    width: 100%;
    height: 462px;
    border-collapse: collapse;
    border-spacing: 0;
    text-align: center;
  }
  thead {
    color: #fff;
  }
  th {
    height: 28px;
  }
  tbody {
    tr {
      display: flex;
    }
  }
  td {
    padding: 0 2px;
    flex: 1;
    font-size: 12px;
    line-height: 23px;
    border: 1px solid #e0e0e0;
    border-top: none;
    border-right: none;
    &:nth-child(3n) {
      border-right: 1px solid #e0e0e0;
    }
    &:hover {
      cursor: pointer;
      opacity: 0.9;
    }
    &.active {
      background-color: #e79898;
      color: #fff;
    }
  }
}
</style>
