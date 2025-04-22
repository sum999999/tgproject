<template>
  <div>
    <modal :modalShow="showModal"
           @btn-ok="onSureDialog"
           @btn-cancel="onCancleDialog"
           :title="$tex('选择邀请码')">
      <div class="table"
           slot="content">
        <Table :columns="columns"
               :data="expandList"
               :loading="loading"
               stripe></Table>
        <page :total="param.total"
              :current="param.current"
              :pageSize="param.size"
              :showLastPage="false"
              @get-Page-Data="getListData"></page>
      </div>
    </modal>
  </div>
</template>

<script>
import modal from "@/components/modal.vue";
import page from "@/components/page.vue";
import {ExpandStatus} from '@/constant/user';

export default {
  components: {
    modal,
    page
  },
  props: {
    showDlg: null,
    checkRow: null
  },
  data() {
    return {
      expandList: [],
      loading: false,
      showModal: this.showDlg,
      param: {
        current: 1,
        size: 10
      },
      columns: [
        {
          title: this.$tex("选中"),
          align: "center",
          key: "checkBox",
          width: 80,
          render: (h, params) => {
            return h("div", [
              h("Checkbox", {
                props: {
                  value: params.row.checkBox
                },
                on: {
                  "on-change": e => {
                    this.expandList.forEach(items => {
                      //先取消所有对象的勾选，checkBox设置为false
                      this.$set(items, "checkBox", false);
                    });
                    this.currentCode = this.expandList[params.index];
                    this.currentCode.checkBox = e; //再将勾选的对象的checkBox设置为true
                  }
                }
              })
            ]);
          }
        },
        {
          title: this.$tex("邀请码"),
          key: "expandCode",
          width: 150,
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: "#be1204"
                }
              },
              params.row.expandCode
            );
          }
        },

        {
          title: this.$tex("返点"),
          key: "bonusGroupName",
          width: 90,
          render: (h, params) => {
            return h("div", [
              h("p", parseInt(params.row.bonusGroupName)),
              h(
                "p",
                "(" +
                  ((params.row.bonusGroupName - 1800) / 20).toFixed(1) +
                  "%" +
                  ")"
              )
            ]);
          }
        },
        {
          title: this.$tex("用户类别"),
          key: "type",
          width: 80,
          render: (h, params) => {
            const type = params.row.type === "00" ? this.$tex("会员") : this.$tex("代理");
            return h("span", type);
          }
        },
        {
          title: this.$tex("推广类型"),
          width: 80,
          key: "platformName"
        }
      ]
    };
  },
  watch: {
    showDlg(v) {
      this.showModal = v;
    },
    showModal(v) {
      this.$emit("update:showDlg", v);
    },
    checkRow(v) {
      this.expandList.forEach(items => {
        this.$set(items, "checkBox", false);
      });
      const currentRow = this.expandList.find(
        item => item.expandCode == v.expandCode
      );
      if (currentRow) {
        currentRow.checkBox = true;
      }
    }
  },
  mounted() {
    //进到myExpand,进到这里
    this.getListData();
  },
  methods: {
    onSureDialog() {
      this.$emit("on-selected-code", this.currentCode, this.expandList.length);
      this.onCancleDialog();
    },
    onCancleDialog() {
      this.showModal = false;
    },
    getListData(page) {
      this.loading = true;
      // this.param.current++;
      if(page) {
        this.$set(this.param,'current',page);
      }
      this.$http
        .post("/api/v2/user/queryUserExpandList", this.param, {
          userId: true,
          unenc: true
        })
        .then(response => {
          this.loading = false;
          if (response.data.code !== 0) return;
          // const
          const expandList = response.data.data.expandList.filter(item => item.status!== ExpandStatus.kDisable && item.status!== ExpandStatus.kForceDisable);
          this.param.total = response.data.data.total;
          // if (expandList != null && expandList.length > 0 ) {
          //   // this.expandList.push(...expandList);
          // }
          this.expandList = expandList;
          if (this.param.current == 1) {
            this.currentData = this.expandList[0];
            if (this.currentData) {
              this.currentData.checkBox = true;
            }
            this.$emit(
              "on-selected-code",
              this.currentData,
              this.expandList.length
            );
          }
        });
    }
  }
};
</script>

<style>
</style>
