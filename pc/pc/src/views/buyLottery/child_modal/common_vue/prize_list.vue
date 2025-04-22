<template>
  <div class="history-prize">
    <div class="title">
      <div class="lf">
        {{ $tex("期号") }}
      </div>
      <div class="rt">
        <div class="fresh-wrap" @click="refreshResult">
          <span
            >{{ $tex("刷新") }}
            <span class="refresh"></span>
          </span>
        </div>
        <div class="more-wrap">
          <router-link
            :to="{ name: 'notice_detail', params: { id: $route.params.id } }"
            target="_blank"
          >
            <span>
              {{ $tex("更多") }}
              <span class="more"> </span>
            </span>
          </router-link>
        </div>
      </div>
    </div>
    <div class="content">
      <Table :columns="columns" :data="prePrizeList" :height="440"></Table>
    </div>
  </div>
</template>
<script>
import formatKsan from "@/utils/format-ball/format_ksan.js";
import { formatSsc } from "@/utils/format-ball/format_ssc.js";
import formatPcdd from "@/utils/format-ball/format_pcdd.js";
import getZodiac from "@/utils/format-ball/zodica.js"; // 6hc
// import { getBallsStyle } from '@/views/common/module_js/format_pk10.js'
import Animal from "@/components/Animal";
import QwcBall from "../../components/QwcBall";

export default {
  props: {
    prePrizeList: {
      type: Array,
    },
  },
  computed: {
    codes() {
      return this.$attrs.code;
    },
  },
  data() {
    return {
      loading: true,
      lotteryId: "",
      columns: [
        {
          title: this.$tex("期号"),
          width: 95,
          key: "periodNo",
        },
        {
          title: this.$tex("开奖号码"),
          key: "lotteryNumber",
          width: 343,
          render: (h, params) => {
            if (!params.row.lotteryNumber) {
              return h("div", `${this.$tex("正在开奖")}...`);
            }
            let str = params.row.lotteryNumber.replace(/\+/g, ",");
            let listArray = str.split(",");
            if (this.codes === "pcdd") {
              listArray = formatPcdd(listArray);
            }
            let arr = [];
            listArray.forEach((item, index) => {
              if (this.codes === "ksan") {
                arr.push(
                  h("span", {
                    class: ["ball", `ksan-${item}`],
                  })
                );
                if (index === listArray.length - 1) {
                  let info = formatKsan(listArray);
                  arr.push(
                    h(
                      "span",
                      {
                        class: "ksan-sum",
                      },
                      [
                        `${this.$tex("和值")}=`,
                        h(
                          "span",
                          { style: "display:inline-block;min-width:18px;" },
                          `${info.sum} `
                        ),
                        h(
                          "span",
                          {
                            class:
                              info.size === this.$tex("大")
                                ? "history-prize-infos__big"
                                : "history-prize-infos__small",
                          },
                          info.size
                        ),
                        " | ",
                        h(
                          "span",
                          {
                            class:
                              info.num === this.$tex("双")
                                ? "history-prize-infos__even"
                                : "history-prize-infos__odd",
                          },
                          info.num
                        ),
                      ]
                    )
                  );
                }
              } else if (this.codes === "ssc") {
                arr.push(
                  h(
                    "span",
                    {
                      class: "ball",
                    },
                    item
                  )
                );
                if (index === listArray.length - 1) {
                  let info = formatSsc(listArray);
                  arr.push(
                    h(
                      "span",
                      {
                        style: {
                          // width: "80px",
                          marginLeft: "5px",
                          background: "none",
                          color: "#313131",
                          textAlign: "left",
                          verticalAlign: "middle",
                        },
                      },
                      [
                        h(
                          "span",
                          { style: "display:inline-block;min-width:18px;" },
                          `${info.sum}`
                        ),
                        " ",
                        h(
                          "span",
                          {
                            class:
                              info.size === this.$tex("大")
                                ? "history-prize-infos__big"
                                : "history-prize-infos__small",
                          },
                          info.size
                        ),
                        " | ",
                        h(
                          "span",
                          {
                            class:
                              info.num === this.$tex("双")
                                ? "history-prize-infos__even"
                                : "history-prize-infos__odd",
                          },
                          info.num
                        ),
                        " | ",
                        info.niuniu,
                      ]
                    )
                  );
                }
              } else if (this.codes === "pk10") {
                // let clrInfo = getBallsStyle(item)
                if (listArray.length < 10) {
                  return;
                }
                arr.push(
                  h(
                    "span",
                    {
                      // style: {
                      //     color: clrInfo.clr,
                      //     background: `${clrInfo.bg}`
                      // },
                      class: ["ball", "pk10", `pk10-` + item],
                    }
                    // item
                  )
                );
              } else if (this.codes === "pcdd") {
                arr.push(
                  h(
                    "span",
                    {
                      class:
                        index % 2 !== 0
                          ? "pcdd-char"
                          : index === listArray.length - 1
                          ? `${item.clr}-pcdd`
                          : "ball",
                    },
                    item.content
                  )
                );
                if (index === listArray.length - 1) {
                  // console.log('item.desc', item.desc, item.desc.split('|'))
                  const sizeAndOddEven = (item.desc || "")
                    .split("|")
                    .map((item) => item.trim());
                  arr.push(
                    h(
                      "span",
                      {
                        class: "pcdd-content",
                        // domProps: {
                        //   innerHTML: item.desc
                        // },
                      },
                      [
                        h(
                          "span",
                          {
                            class:
                              sizeAndOddEven[0] === this.$tex("大")
                                ? "history-prize-infos__big"
                                : "history-prize-infos__small",
                          },
                          sizeAndOddEven[0]
                        ),
                        " | ",
                        h(
                          "span",
                          {
                            class:
                              sizeAndOddEven[1] === this.$tex("双")
                                ? "history-prize-infos__even"
                                : "history-prize-infos__odd",
                          },
                          sizeAndOddEven[1]
                        ),
                      ]
                    )
                  );
                }
              } else if (this.codes === "6hc") {
                getZodiac(params.row.prizeTime).forEach((value) => {
                  value.data.forEach((ball, idx) => {
                    if (ball === item) {
                      if (index === listArray.length - 2) {
                        arr.push(
                          h("div", {}, [
                            h(
                              "span",
                              {
                                class: [`${value.clrs[idx]}-sixpk`],
                              },
                              item
                            ),
                            h(Animal, {
                              props: {
                                text: value.label,
                              },
                            }),
                          ])
                        );
                        arr.push(
                          h(
                            "div",
                            {
                              class: "sum-char",
                            },
                            "+"
                          )
                        );
                      } else {
                        arr.push(
                          h("div", {}, [
                            h(
                              "span",
                              {
                                class: [`${value.clrs[idx]}-sixpk`],
                              },
                              item
                            ),
                            h(Animal, {
                              props: {
                                text: value.label,
                              },
                            }),
                          ])
                        );
                      }
                    }
                  });
                });
              } else if (this.codes === "qwc") {
                // arr.push(
                //         h(
                //                 QwcBall,
                //                 {
                //                   ball: 1
                //                 }
                //         )
                // );
                arr.push(
                  h(
                    QwcBall,
                    {
                      props: {
                        ball: item,
                      },
                    },
                    item
                  )
                );
              } else {
                arr.push(
                  h(
                    "span",
                    {
                      class: "ball",
                    },
                    item
                  )
                );
              }
            });
            return h(
              "div",
              {
                class: [
                  "history-prize-infos",
                  this.codes === "6hc"
                    ? "sixhc-wrap"
                    : this.codes === "ksan"
                    ? "ksan-wrap"
                    : "",
                ],
              },
              arr
            );
          },
        },
      ],
    };
  },
  methods: {
    gopage() {
      this.$router.push({
        name: "notice_detail",
        params: { id: this.$route.params.id },
      });
    },
    refreshResult() {
      this.$emit("getRefresh", "");
    },
  },
};
</script>
<style lang="less" scoped>
@deep: ~">>>";
.history-prize {
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 10px 10px 7px 4px;
  color: #313131;
  overflow: hidden;
  @{deep} {
    .history-prize-infos {
      display: flex;
      align-items: center;
      padding-right: 10px;
      .ball {
        flex-shrink: 0;
      }
    }
    .history-prize-infos__big,
    .history-prize-infos__small,
    .history-prize-infos__odd,
    .history-prize-infos__even {
      display: inline-block;
      font-size: 12px;
      color: #333333 !important;
      width: 21px;
      height: 21px;
      border-radius: 2px;
      text-align: center;
      line-height: 21px;
    }
    .history-prize-infos__small,
    .history-prize-infos__odd {
      background-color: #5596d4;
    }
    .history-prize-infos__big,
    .history-prize-infos__even {
      background-color: #f2a03a;
    }
  }
}
.history-prize .title {
  height: 14px;
  line-height: 14px;
  font-size: 14px;
  color: #505c66;
}
.history-prize .title .lf {
  float: left;
  padding-left: 4px;
}
.history-prize .title .rt {
  float: right;
  padding-right: 12px;
}
.history-prize .title .fresh-wrap {
  margin-right: 12px;
}
.more-wrap a {
  color: #505c66;
}
.more-wrap a:hover {
  /*   color: @primary-color; */
}
.history-prize .title .more-wrap,
.history-prize .title .fresh-wrap {
  display: inline-block;
  cursor: pointer;
}
.history-prize .title .more-wrap:hover {
  /* color: @primary-color; */
}
.history-prize .title .refresh,
.history-prize .title .more {
  display: inline-block;
  vertical-align: middle;
  width: 14px;
  height: 16px;
  margin-left: 2px;
  background: url("~@/assets/images/icon.png") no-repeat -543px -383px;
}
.history-prize .title .more {
  margin-top: 3px;
  background-position: -511px -385px;
}
.history-prize .content {
  width: 100%;
  padding-top: 7px;
}
</style>

<style scoped>
.history-prize >>> .ivu-table-wrapper .ivu-table-header {
  height: 0;
}
.history-prize >>> .ivu-table td {
  height: 44px !important;
  padding: 8px 0 7px 0;
  font-size: 12px;
  border-bottom: 1px solid #ffc899 !important;
}
.history-prize >>> .ivu-table-row td:first-child {
  padding-left: 4px;
}
.history-prize >>> .ivu-table-row {
  width: 458px;
  height: 44px;
  padding: 0 4px;
}
.history-prize >>> .ivu-table-cell {
  padding-top: 0;
  padding-bottom: 0;
  overflow: visible;
}
.history-prize >>> td:first-child .ivu-table-cell {
  padding-left: 0 !important;
}
.history-prize >>> td:last-child .ivu-table-cell {
  padding-left: 13px;
}
/* 球 */
.history-prize >>> .ivu-table-cell .ball,
.history-prize >>> .ivu-table-cell .green-pcdd,
.history-prize >>> .ivu-table-cell .red-pcdd,
.history-prize >>> .ivu-table-cell .blue-pcdd,
.history-prize >>> .ivu-table-cell .other-pcdd,
.history-prize >>> .ivu-table-cell .pcdd-content,
.history-prize >>> .ivu-table-cell .pcdd-char,
.history-prize >>> .ivu-table-cell .sixhc-wrap,
.history-prize >>> .ivu-table-cell .blue-sixpk,
.history-prize >>> .ivu-table-cell .red-sixpk,
.history-prize >>> .ivu-table-cell .green-sixpk {
  display: inline-block;
  vertical-align: middle;
  width: 28px;
  height: 28px;
  margin: 0 2px;
  line-height: 28px;
  font-size: 12px;
  color: #fff;
  text-align: center;
  border-radius: 50%;
  background: radial-gradient(#ff6050 7%, #e50000);
  background: -webkit-radial-gradient(#ff6050 7%, #e50000);
  background: -moz-radial-gradient(#ff6050 7%, #e50000);
  background: -o-radial-gradient(#ff6050 7%, #e50000);
}
/* 快三号码 */
.history-prize >>> .ivu-table-cell .ksan-1,
.history-prize >>> .ivu-table-cell .ksan-2,
.history-prize >>> .ivu-table-cell .ksan-3,
.history-prize >>> .ivu-table-cell .ksan-4,
.history-prize >>> .ivu-table-cell .ksan-5,
.history-prize >>> .ivu-table-cell .ksan-6 {
  background-color: none;
  border-radius: 0;
  background: url(~@/assets/images/icon.png) no-repeat;
  background-position: -326px -463px;
}
.history-prize >>> .ivu-table-cell .ksan-2 {
  background-position: -355px -463px;
}
.history-prize >>> .ivu-table-cell .ksan-3 {
  background-position: -385px -463px;
}
.history-prize >>> .ivu-table-cell .ksan-4 {
  background-position: -414px -463px;
}
.history-prize >>> .ivu-table-cell .ksan-5 {
  background-position: -444px -463px;
}
.history-prize >>> .ivu-table-cell .ksan-6 {
  background-position: -473px -463px;
}
/* pk10 */
.history-prize >>> .ivu-table-cell .pk10 {
  border-radius: 0;
  -webkit-border-radius: 0;
  -moz-border-radius: 0;
  -ms-border-radius: 0;
  -o-border-radius: 0;
  width: 24px;
  height: 24px;
  margin: 0 2px;
  background: url("/static/images/icon.png") no-repeat -242px -10px;
}
.history-prize >>> .ivu-table-cell .pk10-02 {
  background-position: -210px -10px;
}
.history-prize >>> .ivu-table-cell .pk10-03 {
  background-position: -178px -10px;
}
.history-prize >>> .ivu-table-cell .pk10-04 {
  background-position: -147px -10px;
}
.history-prize >>> .ivu-table-cell .pk10-05 {
  background-position: -20px -10px;
}
.history-prize >>> .ivu-table-cell .pk10-06 {
  background-position: -52px -10px;
}
.history-prize >>> .ivu-table-cell .pk10-07 {
  background-position: -272px -10px;
}
.history-prize >>> .ivu-table-cell .pk10-08 {
  background-position: -83px -10px;
}
.history-prize >>> .ivu-table-cell .pk10-09 {
  background-position: -115px -10px;
}
.history-prize >>> .ivu-table-cell .pk10-10 {
  background-position: -305px -10px;
}
/* pcdd */
.history-prize >>> .ivu-table-cell .green-pcdd {
  background: radial-gradient(#1acb01 3%, #017019);
  background: -webkit-radial-gradient(#1acb01 3%, #017019);
  background: -moz-radial-gradient(#1acb01 3%, #017019);
  background: -o-radial-gradient(#1acb01 3%, #017019);
}
.history-prize >>> .ivu-table-cell .blue-pcdd {
  background: radial-gradient(#007ef9 27%, #0035ae);
  background: -webkit-radial-gradient(#007ef9 27%, #0035ae);
  background: -moz-radial-gradient(#007ef9 27%, #0035ae);
  background: -o-radial-gradient(#007ef9 27%, #0035ae);
}
.history-prize >>> .ivu-table-cell .other-pcdd {
  background: #aaa;
}
.history-prize >>> .ivu-table-cell .pcdd-content,
.history-prize >>> .ivu-table-cell .pcdd-char {
  background: none;
  width: inherit;
  color: #313131;
  margin: 0;
}
.history-prize >>> .ivu-table-cell .sixhc-wrap {
  width: 100%;
  line-height: 30px;
  text-align: left;
  border-radius: 0;
  background: none;
  color: #313131;
  display: flex;
  align-items: flex-start;
  height: auto;
}
.history-prize >>> .ivu-table-cell .sixhc-wrap > div {
  display: inline-block;
  width: 28px;
  text-align: center;
  margin: 0 2px;
}
.history-prize >>> .ivu-table-cell .blue-sixpk,
.history-prize >>> .ivu-table-cell .red-sixpk,
.history-prize >>> .ivu-table-cell .green-sixpk {
  margin: 0;
}
.history-prize >>> .ivu-table-cell .sixhc-wrap > .sum-char {
  display: inline-block;
  vertical-align: top;
  width: 12px;
  height: 28px;
  margin: 0;
}
.history-prize >>> .ivu-table-cell .sixhc-wrap > div span:last-child {
  display: block;
  width: 28px;
  line-height: 18px;
  text-align: center;
}
.history-prize >>> .ivu-table-cell .blue-sixpk {
  background: #0035ae;
  background: radial-gradient(#007ef9 27%, #0035ae);
  color: #fff;
}
.history-prize >>> .ivu-table-cell .green-sixpk {
  background: #017019;
  background: radial-gradient(#1acb01 3%, #017019);
  color: #fff;
}
/* 6hc */
</style>
