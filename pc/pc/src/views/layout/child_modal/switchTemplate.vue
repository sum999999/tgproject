<template>
  <!-- 模板切换 -->
  <div class="SwitchTemplate" v-if="isShowSwitchTemplate">
    <!-- <div class="SwitchTemplate"> -->
    <Dropdown placement="bottom-end" @on-click="onSwitch">
      <a class="cur" href="javascript:void(0)">
        {{ pageTemplate.name }}
        <Icon type="ios-arrow-down"></Icon>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem v-for="item in tpls" :key="item.name" :name="item.name">{{
          item.name
        }}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { getTemplateConfig } from "@/utils/tplConfig";
export default {
  data() {
    return {
      isShowSwitchTemplate:
        configText.pageTemplate && configText.isShowSwitchTemplate,
      tpls: [],
    };
  },
  computed: {
    ...mapGetters(["pageTemplate"]),
  },
  created() {
    this.tpls = getTemplateConfig();
  },
  methods: {
    ...mapActions(["changTemplate"]),
    onSwitch(name) {
      const currentTpl = this.tpls.find((item) => item.name == name) || {};
      this.changTemplate({ pageTemplate: currentTpl });
    },
  },
};
</script>

<style lang="less" scoped>
.SwitchTemplate {
  position: fixed;
  left: 100px;
  top: 6px;
  z-index: 900;
  .cur {
    color: #ae291a;
  }
}
</style>
