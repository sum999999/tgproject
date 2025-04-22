<template>
  <Dropdown
    v-if="appLanguage && appLanguage.code"
    class="language-dropdown"
    @on-click="onLanguageClick"
  >
    <a
      :class="[appLanguage.code, 'text-font-primary']"
      href="javascript:void(0)"
    >
      <!--            <i class="language-dropdown-icon"></i>-->
      <span>{{ appLanguage.name }}</span>
      <Icon type="arrow-down-b"></Icon>
    </a>
    <DropdownMenu slot="list">
      <DropdownItem
        v-for="language in appLanguageConfig"
        :key="language.code"
        :class="[language.code]"
        :name="language.code"
      >
        <!--                <i class="language-dropdown-icon"></i>-->
        <span>{{ language.name }}</span>
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>

<script>
import { mapGetters } from "vuex";
import { ApiCache } from "@/utils/request";

export default {
  name: "LanguageSwitch",
  computed: {
    ...mapGetters(["user", "appLanguage", "appLanguageConfig"]),
  },
  methods: {
    onLanguageClick(code, index) {
      this.$store.commit("SAVE_APP_LANGUAGE", code);
      this.showLanguage = false;
      this.$nextTick(() => {
        ApiCache.clearAll();
        window.location.reload();
      });
    },
  },
};
</script>

<style scoped lang="less">
@deep: ~">>>";
.language-dropdown {
  cursor: pointer;
  background-color: transparent;
  @{deep} {
    .ivu-select-dropdown {
      box-shadow: none;
      background-color: transparent;
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
  .zh_CN {
    .language-dropdown-icon {
      background-image: url("~@/assets/images-v6/zh_CN.png");
    }
  }
  .en_US {
    .language-dropdown-icon {
      background-image: url("~@/assets/images-v6/en_US.png");
    }
  }
  .vi_VN {
    .language-dropdown-icon {
      background-image: url("~@/assets/images-v6/vi_VN.png");
    }
  }
  .th_TH {
    .language-dropdown-icon {
      background-image: url("~@/assets/images-v6/th_TH.png");
    }
  }
  .in_ID {
    .language-dropdown-icon {
      background-image: url("~@/assets/images-v6/in_ID.png");
    }
  }
  .hi_IN {
    .language-dropdown-icon {
      background-image: url("~@/assets/images-v6/hi_IN.png");
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
    .language-dropdown-icon {
      display: inline-block;
      width: 16px;
      height: 16px;
    }
    .ivu-icon {
      margin-left: 8px;
    }
  }
}
</style>
