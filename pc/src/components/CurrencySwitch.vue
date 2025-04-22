<template>
  <Dropdown
    v-if="sysApiCoinList && sysApiCoinList.length > 1"
    class="coin-dropdown"
    @on-click="onCoinClick"
  >
    <a
      href="javascript:void(0)"
      class="text-font-primary"
    >
      <span>{{sysApiCoin.cur}} - {{sysApiCoin.icon}}</span>
      <Icon type="arrow-down-b"></Icon>
    </a>
    <DropdownMenu slot="list">
      <DropdownItem
        v-for="coin in sysApiCoinList"
        :key="coin.cur"
        :name="coin.cur"
      >
        <span>{{coin.cur}}</span> -
        <span>{{coin.icon}}</span>
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>

<script>
import { mapGetters } from 'vuex'
import { ApiCache } from '@/utils/request'

export default {
  name: 'CurrencySwitch',
  computed: {
    ...mapGetters(['user', 'sysApiCoin', 'sysApiCoinList']),
  },
  methods: {
    onCoinClick(cur, index) {
      this.$store.commit('SAVE_SYSTEM_API_COIN', cur)
      this.$store.dispatch('querySysExChangeInfo')
    },
  },
}
</script>

<style scoped lang="less">
@deep: ~'>>>';
.coin-dropdown {
  cursor: pointer;
  background-color: transparent;
  @{deep} {
    .ivu-select-dropdown {
      box-shadow: none;
      background-color: transparent;
      overflow-y: auto;
      max-height: 170px;
    }
    .ivu-dropdown-item {
      border-bottom: 1px solid #444444;
      &:hover {
        background: transparent;
      }
    }
    .ivu-dropdown-menu {
      text-align: center;
      border: 1px solid #444444;
      background-color: rgba(0, 0, 0, 0.8);
      .ivu-dropdown-item:nth-last-child(1) {
        border-bottom: none;
      }
    }
  }
  i {
    display: inline-block;
    width: 15px;
    height: 15px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    vertical-align: middle;
    margin-right: 8px;
  }
  span {
    vertical-align: middle;
  }
  a {
    .ivu-icon {
      margin-left: 8px;
    }
  }
}
</style>
