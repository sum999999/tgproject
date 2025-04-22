<template>
  <div
    class="packet"
    :class="{
      en: !checkChineseKey(),
    }"
  >
    <div class="packet-fix" v-if="fixShow">
      <a
        :href="servicer.url"
        target="_blank"
        @click.stop="openService(servicer.url)"
        class="online"
      ></a>
      <a href="#" class="top" @click.prevent="toTop"></a>
      <span class="icon-close" @click.prevent="fixClose"></span>
    </div>
    <div class="head">
      <div class="w">
        <a href="#" class="logo">
          <img :src="picture + `${key}`" alt="" />
        </a>
        <ul class="nav">
          <li @click="goPage('/home')">
            <i class="icon-index"></i>{{ $tex("网站首页") }}
          </li>
          <li @click="showDlg(true)">
            <i class="icon-packet"></i>{{ $tex("我的红包") }}
          </li>
          <li>
            <a
              :href="servicer.url"
              target="_blank"
              @click.stop="openService(servicer.url)"
            >
              <i class="icon-kf"></i>{{ $tex("在线客服") }}
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="banner">
      <div class="time-wrap">
        <div class="packet-times">
          <i18n class="item day" path="{d}天" tag="div">
            <template slot="d">
              <p class="val">{{ robDay }}</p>
            </template>
          </i18n>
          <i18n class="item hour" path="{h}时" tag="div">
            <template slot="h">
              <p class="val">{{ robHour }}</p>
            </template>
          </i18n>
          <i18n class="item minus" path="{m}分" tag="div">
            <template slot="m">
              <p class="val">{{ robMinus }}</p>
            </template>
          </i18n>
          <i18n class="item sec" path="{s}秒" tag="div">
            <template slot="s">
              <p class="val">{{ robSec }}</p>
            </template>
          </i18n>
        </div>
        <span class="tip">{{ getRacketTxt }}</span>
      </div>
      <div class="hb" ref="hb">
        <img src="/static/images/packet/hb-bg.png" alt="" />
        <span class="icon-btn" @click="getPacket"></span>
      </div>
    </div>
    <div class="body">
      <div class="w">
        <div class="box-inner">
          <div class="notice">
            <span class="tit">{{ $tex("活动公告") }}：</span>

            <div class="txt">
              <marquee direction="left" align="middle">{{ notice }}</marquee>
            </div>
          </div>
          <div class="packet-box">
            <div class="box-hd rp"></div>
            <div class="box-bd">
              <div class="order-wrap">
                <div class="item">
                  <ul
                    class="order-list"
                    ref="scroll1"
                    @mouseover="scrollEnd('scroll1')"
                    @mouseout="scroll('scroll1')"
                  >
                    <li v-for="(item, index) in orderList" :key="index">
                      {{
                        $tex("恭喜 {user} 获得 {name}", {
                          user: item.userName,
                          name: item.redType,
                        })
                      }}
                      {{ item.money | keepDecimalOf2 }}{{ $tex("元") }}
                    </li>
                    <li v-for="(item, index) in orderList" :key="index">
                      {{
                        $tex("恭喜 {user} 获得 {name}", {
                          user: item.userName,
                          name: item.redType,
                        })
                      }}
                      {{ item.money | keepDecimalOf2 }}{{ $tex("元") }}
                    </li>
                  </ul>
                </div>
                <div class="item">
                  <ul
                    class="order-list rihgt"
                    ref="scroll2"
                    @mouseover="scrollEnd('scroll2')"
                    @mouseout="scroll('scroll2')"
                  >
                    <li v-for="(item, index) in orderList2" :key="index">
                      {{
                        $tex("恭喜 {user} 获得 {name}", {
                          user: item.userName,
                          name: item.redType,
                        })
                      }}
                      {{ item.money | keepDecimalOf2 }}{{ $tex("元") }}
                    </li>
                    <li v-for="(item, index) in orderList2" :key="index">
                      {{
                        $tex("恭喜 {user} 获得 {name}", {
                          user: item.userName,
                          name: item.redType,
                        })
                      }}
                      {{ item.money | keepDecimalOf2 }}{{ $tex("元") }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="packet-active" id="activityRule">
            <div class="packet-box">
              <div class="box-hd xq"></div>
              <div class="box-bd">
                <table class="xq-tb">
                  <thead>
                    <tr>
                      <th>{{ $tex("充值金额") }}</th>
                      <th>{{ $tex("有效投注") }}</th>
                      <th>{{ $tex("抽奖次数") }}</th>
                      <th>{{ $tex("流水") }}</th>
                      <th>{{ $tex("抽奖规则") }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in tableInfo" :key="index">
                      <td>
                        {{ $tex("{num}以上", { num: item.rechargeMoney }) }}
                      </td>
                      <td>
                        {{ $tex("{num}以上", { num: item.effectiveBetting }) }}
                      </td>
                      <td>{{ item.prizeTime }}</td>
                      <template v-if="index === 0">
                        <td :rowspan="tableInfo.length">
                          <span v-if="flowingWater">
                            {{ $tex("{num}倍流水", { num: flowingWater }) }}
                          </span>
                          <span v-else>{{ $tex("无需流水") }}</span>
                        </td>
                        <td :rowspan="tableInfo.length">
                          抢到红包后 系统自动派彩 秒到账
                        </td>
                      </template>
                    </tr>
                    <!-- <tr>
                                            <td v-if="tableInfoshow[0].rechargeMoney!==undefined">{{tableInfoshow[0].rechargeMoney}}以上</td>
                                            <td v-else>暂未查询到相关信息</td>
                                            <td v-if="tableInfoshow[0].effectiveBetting!==undefined">{{tableInfoshow[0].effectiveBetting}}以上</td>
                                            <td v-else>暂未查询到相关信息</td>
                                            <td v-if="tableInfoshow[0].prizeTime!==undefined">{{tableInfoshow[0].prizeTime}}</td>
                                            <td v-else>暂未查询到相关信息</td>
                                            <td rowspan="3">
                                                <span v-if="flowingWater">
                                                    {{flowingWater}}倍流水
                                                </span>
                                                <span v-else>无需流水</span>
                                            </td>
                                            <td rowspan="3">
                                                <p class="tip">抢到红包后 系统自动派彩 秒到账</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td v-if="tableInfoshow[1].rechargeMoney!==undefined">{{tableInfoshow[1].rechargeMoney}}以上</td>
                                            <td v-else>暂未查询到相关信息</td>
                                            <td v-if="tableInfoshow[1].rechargeMoney!==undefined">{{tableInfoshow[1].effectiveBetting}}以上</td>
                                            <td v-else>暂未查询到相关信息</td>
                                            <td v-if="tableInfoshow[1].rechargeMoney!==undefined">{{tableInfoshow[1].prizeTime}}</td>
                                            <td v-else>暂未查询到相关信息</td>
                                        </tr>
                                        <tr>
                                            <td v-if="tableInfoshow[2].rechargeMoney!==undefined">{{tableInfoshow[2].rechargeMoney}}以上</td>
                                            <td v-else>暂未查询到相关信息</td>
                                            <td v-if="tableInfoshow[2].rechargeMoney!==undefined">{{tableInfoshow[2].effectiveBetting}}以上</td>
                                            <td v-else>暂未查询到相关信息</td>
                                            <td v-if="tableInfoshow[2].rechargeMoney!==undefined">{{tableInfoshow[2].prizeTime}}</td>
                                            <td v-else>暂未查询到相关信息</td>
                                        </tr> -->
                  </tbody>
                </table>
              </div>
            </div>
            <div class="packet-box">
              <div class="box-hd xz"></div>
              <div class="box-bd" style="padding-bottom:0">
                <div
                  class="xz-list"
                  v-html="escapeHtml(activityRuleDetail)"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="foot">
      <p>{{ $configText.main }} © Copyright {{ $tex("版权所有") }}</p>
    </div>

    <div class="packet-shadow" v-show="digShow || digShow2 || digShow3"></div>
    <div class="packet-dlalog dlalog" v-show="digShow">
      <i class="icon-close" @click="showDlg(false)"></i>
      <div class="dlalog-hd">{{ $tex("我的红包") }}</div>
      <div class="dlalog-bd">
        <div class="search-info">
          <div class="left">
            {{ $tex("红包总额") }}：{{ redpacketAmount | keepDecimalOf2
            }}{{ $tex("元") }}
          </div>
          <div class="right">{{ $tex("红包个数") }}：{{ redpacketCount }}</div>
        </div>
        <table class="search-tb">
          <thead>
            <tr>
              <th>{{ $tex("时间") }}</th>
              <th>{{ $tex("红包类型") }}</th>
              <th>{{ $tex("红包金额") }}</th>
              <th>{{ $tex("状态") }}</th>
            </tr>
          </thead>
          <tbody v-if="userRedPacketList && userRedPacketList.length > 0">
            <tr v-for="(item, index) in userRedPacketList" :key="index">
              <td>{{ item.createTime | formateDate }}</td>
              <td>{{ item.redpacketType }}</td>
              <td>{{ item.money | keepDecimalOf2 }}{{ $tex("元") }}</td>
              <td>
                <span
                  class="btn"
                  v-if="item.status === '01'"
                  @click="takeMoney(item, $event)"
                  >{{ $tex("提现") }}</span
                >
                <!-- 红包状态：00冻结，01未提现，02已提现 -->
                <span class="" v-else>{{ item.statusDesc }}</span>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td class="empty" colspan="4">
                {{ $tex("亲,您还没抢过红包哦") }}
              </td>
            </tr>
          </tbody>
          <Spin v-if="tbLoading">{{ $tex("加载中") }}...</Spin>
        </table>
        <Page
          class="packetPage"
          :currentPage="currentPage"
          :total="total"
          :pageSize="pageSize"
          @get-Page-Data="getPageData"
        ></Page>
      </div>
    </div>

    <div class="packet-dlalog2 dlalog" v-show="digShow2">
      <span class="icon-close2" @click="closeDlalog2"></span>
      <div class="cont">
        <p class="money">{{ getMoney }}{{ $tex("元") }}</p>
        <p class="type">{{ getRedpacketName }}</p>
      </div>
    </div>

    <div class="packet-dlalog3 dlalog" v-show="digShow3">
      <span class="icon-close2" @click="closeDlalog3"></span>
      <div class="dlg-name">{{ $tex("很抱歉") }}</div>
      <div class="cont">
        <div class="tip">{{ warnMsg }}</div>
        <span class="rule-btn" @click="goRule">{{ $tex("查看规则") }}</span>
      </div>
    </div>
    <div class="packet-shadow closeDlalog4" v-show="digShow4"></div>
    <div class="packet-dlalog4 dlalog" v-show="digShow4">
      <span class="icon-close2" @click="closeDlalog4"></span>
    </div>
  </div>
</template>

<script>
import dateModal from "@/utils/format_date.js";
import Page from "@/components/page";
import eleInfo from "@/utils/dom.js";
import Util from "@/utils/utils";
import { checkChineseKey } from "@/lang";

export default {
  data() {
    return {
      orderList: [],
      orderList2: [],
      notice: "",
      fixShow: true,
      robBeginTime: "", // 活动开始时间
      robEndTime: "", // 活动结束时间
      robDay: 0,
      robHour: 0,
      robMinus: 0,
      robSec: 0,
      digShow: false,
      digShow2: false,
      digShow3: false,
      digShow4: false,
      currentPage: 1,
      total: 0,
      pageSize: 10,
      redpacketAmount: 0, // 红包总额度
      redpacketCount: 0, // 红包总数量
      userRedPacketList: [], // 用户红包列表
      redPacketFlag: -1, // 0 还未开始, 1:已经开始,2:已经结束,
      getRedpacketName: "", // 获取红包类型
      getMoney: 0, // 获取红包金额
      warnMsg: "",
      tbLoading: false,
      clientType: "pc",
      host: window.location.host,
      tableInfo: [],
      hasMoreClick: false,
      // configList: [],//全局配置
      flowingWater: 0, //流水
      activityRuleDetail: "", // 活动规则
      picture: "/configstatic/pc/images/",
      key: "logo.png",
      mark: "",
    };
  },
  computed: {
    servicer() {
      return this.$store.state.servicer;
    },
    getRacketTxt() {
      return this.redPacketFlag === 0
        ? this.$tex("距离运气红包开始")
        : this.redPacketFlag === 1
        ? this.$tex("距离运气红包结束")
        : this.$tex("红包已结束");
    },
    configList() {
      return this.$store.state.configList;
    },
  },
  watch: {
    //   configList: {
    //     handler (newVal) {
    //       this.initConfig(newVal);
    //     },
    //     deep: true
    //   }
    "$store.getters.pageTemplate.index"(value) {
      if (this.mark == "tgdemo") this.pictureSwitching(value);
    },
  },
  filters: {
    formateDate(val) {
      return val ? dateModal.getFormatDate(val) : "";
    },
    keepDecimalOf2(val) {
      return val ? val.toFixed(2) : "0.00";
    },
  },
  methods: {
    checkChineseKey,
    openService(url) {
      //打开客服
      eleInfo.openWin(url);
    },
    async initConfig() {
      const configList = await this.$store.dispatch("querySystemConfig");
      const keys = Object.keys(configList);
      for (const key of keys) {
        if (key == "robBeginTime") {
          this.robBeginTime = configList[key];
        }
        if (key == "robEndTime") {
          this.robEndTime = configList[key];
        }
        if (key == "activityRule") {
          this.tableInfo = JSON.parse(configList[key]);
        }
        if (key == "flowingWater") {
          this.flowingWater = configList[key];
        }
        if (key == "settingId") {
          this.activeId = configList[key];
        } else {
          this.activeId = "";
        }
      }
    },
    getPageData(currentPage) {
      // 获取用户红包列表
      this.tbLoading = true;
      this.$http
        .post(
          "/api/v2/user/redpacket/me",
          {
            current: currentPage,
            size: this.pageSize,
          },
          { userId: true, unenc: true }
        )
        .then((response) => {
          if (response.data.code !== 0) return;
          let data = response.data.data;
          this.total = data.total;
          this.redpacketAmount = data.redpacketAmount;
          this.redpacketCount = data.redpacketCount;
          this.userRedPacketList = data.userRedPacketList;
          this.tbLoading = false;
        })
        .catch(() => {
          this.tbLoading = false;
        });
    },
    fixClose() {
      //关闭右边浮动宽度
      this.fixShow = false;
    },
    toTop() {
      eleInfo.setScrollTop(0);
    },
    showDlg(flag) {
      // 用户红包弹框
      this.digShow = flag;
      if (flag) {
        this.getPageData(1);
      }
    },
    closeDlalog2() {
      // 关闭获取红包成功弹框
      this.digShow2 = false;
    },
    closeDlalog3() {
      // 关闭查看规则弹框
      this.digShow3 = false;
    },
    closeDlalog4() {
      this.digShow4 = false;
    },
    goPage(url) {
      this.$router.push(url);
    },
    goRule() {
      eleInfo.setScrollTop(1200);
      this.digShow3 = false;
    },
    takeMoney(info, event) {
      if (!event.target.className) return;
      if (this.hasMoreClick) {
        //阻止连续提交
        return;
      }
      this.hasMoreClick = true;
      this.$http
        .post(
          "/api/v2/user/redpacket/take",
          {
            redpacketId: info.redpacketId,
          },
          { userId: true }
        )
        .then((response) => {
          this.hasMoreClick = false;
          if (response.data.code === 139) {
          } else if (response.data.code === 0) {
            // event.target.className = '';
            // event.target.innerText = '已提现';
            info.status = "02";
            info.statusDesc = this.$tex("已提现");
            this.digShow4 = true;
          }
        });
    },
    getPacket() {
      // 抢红包
      if (this.clickBtn) return;
      if (this.redPacketFlag === 0) {
        this.$Message.info(thhis.$tex("红包还没开始哦！"));
      } else if (this.redPacketFlag === 2) {
        this.$Message.info(this.$tex("红包已结束咯！"));
      } else {
        this.clickBtn = true;
        this.$http
          .post(
            "/api/v2/user/get/redpacket",
            {
              clientType: this.clientType,
              id: this.activeId,
            },
            { user: true, userId: true, stopDialog: true }
          )
          .then((response) => {
            var code = response.data.code;
            if (code != 0) {
              this.warnMsg = response.data.msg;
              this.digShow3 = true;
            } else {
              this.getRedpacketName = response.data.data.redpacketName;
              this.getMoney = response.data.data.money;
              this.digShow2 = true;
            }
            this.clickBtn = false;
          })
          .catch(() => {
            this.clickBtn = false;
          });
      }
      return false;
    },
    scroll(dom) {
      // 人气榜单滚动
      let scroll = this.$refs[dom];
      this["timer" + dom] = setInterval(() => {
        let top = parseFloat(scroll.style.top ? scroll.style.top : 0) - 2;
        if (scroll.scrollHeight + top <= 180) {
          top = 0;
        }
        scroll.style.top = top + "px";
      }, 100);
    },
    scrollEnd(dom) {
      clearInterval(this["timer" + dom]);
    },
    escapeHtml(str) {
      //转义html
      return Util.escapeHtml(str);
    },
    setDownTime(time, callBack) {
      // 倒计时
      let dirTime = this.sysDate - time,
        dirAbsTime = Math.abs(dirTime),
        dirSec = dirAbsTime % (24 * 60 * 60 * 1000), //计算天数后剩余的毫秒数
        dirSec2 = dirSec % (60 * 60 * 1000), //计算小时数后剩余的毫秒数
        dirSec3 = dirSec2 % (60 * 1000); //计算分钟数后剩余的毫秒数
      if (this.redPacketFlag === 0 && dirTime > 0) {
        //红包开始
        this.redPacketFlag = 1;
        clearInterval(this.countDownTimer);
        this.countDown(this.robEndTime);
      } else if (this.redPacketFlag === 1 && dirTime > 0) {
        this.redPacketFlag = 2;
        this.robSec = 0;
        clearInterval(this.countDownTimer);
      } else {
        this.robDay = Math.floor(dirAbsTime / (24 * 60 * 60 * 1000));
        this.robHour = Math.floor(dirSec / (60 * 60 * 1000));
        this.robMinus = Math.floor(dirSec2 / (60 * 1000));
        this.robSec = Math.round(dirSec3 / 1000);
      }
    },
    countDown(time, callBack) {
      // 倒计时
      let vm = this;
      if (vm.countDownTimer) {
        vm.countDownTimer = null;
        clearInterval(vm.countDownTimer);
      }
      vm.countDownTimer = setInterval(function() {
        vm.sysDate = vm.sysDate + 1000;
        vm.setDownTime(time, callBack);
      }, 1000);
    },
    pictureSwitching(value) {
      if (value == 10) {
        this.key = "logo_A.png";
      } else if (value == 2 || value == 3) {
        this.key = "logo_C.png";
      } else {
        this.key = "logo_B.png";
      }
    },
  },
  destroyed() {
    clearInterval("timerscroll1");
    clearInterval("timerscroll2");
    clearInterval(this.countDownTimer);
  },
  components: { Page },
  mounted() {
    this.mark = this.$store.getters.sysPlatformFlag;
    if (this.mark == "tgdemo") {
      const pictureKey = this.$store.getters.pageTemplate.index;
      this.pictureSwitching(pictureKey);
    }
    this.$refs.hb.className = "hb swing animated";
    this.$http
      .post("/api/v2/user/redpacket/pattern", "", { unenc: true })
      .then((response) => {
        // 查询榜单
        if (response.data.code !== 0) return;
        this.orderList = response.data.data;
        this.orderList2 = this.orderList.slice().reverse();
        setTimeout(() => {
          this.scroll("scroll1");
          this.scroll("scroll2");
        });
      });
    this.$http
      .post(
        "/api/v2/user/redpacketSetting/info",
        {
          id: this.activeId,
        },
        { unenc: true, userId: true }
      )
      .then((response) => {
        // 查询活动信息
        if (response.data.code !== 0) return;
        let data = response.data.data,
          vm = this;
        this.activityRuleDetail = data.activityRuleDetail;
        this.sysDate = data.sysDate;
        this.notice = data.noticeDesc;
        let robBeginTime = (this.robBeginTime = data.robBeginTime),
          robEndTime = (this.robEndTime = data.robEndTime);
        var nt = dateModal.getFormatDate(this.sysDate, "yymmddhhmmss");
        if (this.sysDate < robBeginTime) {
          // 红包还没开始
          this.redPacketFlag = 0;
          this.countDown(robBeginTime);
        } else if (this.sysDate >= robBeginTime && this.sysDate < robEndTime) {
          // 红包中
          this.redPacketFlag = 1;
          this.countDown(robEndTime);
        } else {
          // 红包已结束
          this.redPacketFlag = 2;
        }
      });
  },
  async created() {
    let vm = this;
    this.initConfig();
  },
};
</script>

<style scoped lang="less">
.packet {
  min-width: 1200px;
  .w {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;
  }
  [class^="icon"] {
    display: inline-block;
    vertical-align: middle;
    background: url(/static/images/packet/icons.png) no-repeat;
  }
  .icon-close2 {
    width: 48px;
    height: 48px;
    background-position: 0 -220px;
    cursor: pointer;
    &:before {
      display: none;
    }
  }
  .empty {
    text-align: center;
    padding: 20px 0;
    width: 100%;
  }
  .head {
    background-color: #cc0000;
    height: 70px;
    line-height: 70px;
    .logo {
      float: left;
      max-height: 70px;
      width: auto;
      img {
        max-height: 70px;
        width: auto;
      }
    }
    .nav {
      float: right;
      width: 410px;
      height: 70px;
      overflow: hidden;
      li {
        float: left;
        height: 70px;
        line-height: 70px;
        width: 135px;
        text-align: center;
        color: #fff;
        font-size: 16px;
        cursor: pointer;
        background: url(/static/images/packet/nav-bg2.png);
        a {
          color: #fff;
        }
        i {
          width: 30px;
          height: 30px;
        }
        .icon-packet {
          background-position: -30px 0;
        }
        .icon-kf {
          background-position: -67px 0;
        }
        &:hover {
          background: url(/static/images/packet/nav-bg1.png);
        }
      }
    }
  }
  .banner {
    border-top: 4px solid @banner-border-top;
    height: 599px;
    width: 100%;
    background-image: url(/static/images/packet/banner-bg.jpg);
    background-position: center center;
    background-repeat: no-repeat;
    position: relative;
    .time-wrap {
      position: absolute;
      width: 480px;
      height: 80px;
      left: 50%;
      top: 240px;
      margin-left: -240px;
      text-align: center;
      z-index: 10;
      .tip {
        color: @tip-color;
        font-size: 22px;
        border-top: 1px solid @tip-boder-color;
        border-bottom: 1px solid @tip-boder-color;
        width: 200px;
        height: 45px;
        line-height: 43px;
        display: inline-block;
        color: #fff;
      }
    }
    .hb {
      height: 234px;
      width: 640px;
      position: absolute;
      bottom: 65px;
      left: 50%;
      margin-left: -320px;
      // background: url(/static/images/packet/hb-bg.png) center center
      //     no-repeat;
      .icon-btn {
        position: absolute;
        bottom: 66px;
        left: 50%;
        margin-left: -163px;
        height: 130px;
        width: 326px;
        background-position: 0 -40px;
        cursor: pointer;
      }
    }
  }
  .body {
    background: url(/static/images/packet/bg.png) center center repeat;
    width: 100%;
    /* max-height: 1351px; */
  }
  .box-inner {
    width: 100%;
    background-color: @box-inner-bg;
    padding: 30px 0;
    margin-bottom: 10px;
  }
  .notice {
    width: 1128px;
    height: 70px;
    line-height: 70px;
    overflow: hidden;
    background: url(/static/images/packet/notice-bg.png);
    margin: 0 auto 15px;
    font-size: 16px;
    color: @notice-color;
    .tit {
      float: left;
      width: 125px;
      text-align: right;
    }
    .txt {
      float: left;
      width: 950px;
      overflow: hidden;
    }
  }
  .order-wrap {
    width: 848px;
    height: 174px;
    margin: 0 auto;
    color: @order-wrap-color;
    padding: 35px 50px;
    background: url(/static/images/packet/order-bg.png);
    box-sizing: content-box;
    font-size: 14px;
    line-height: 30px;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      width: 2px;
      background-color: @order-wrap-before-bg;
      height: 190px;
      left: 50%;
      top: 50%;
      margin-top: -95px;
    }
  }
  .item {
    width: 50%;
    float: left;
    height: 180px;
    overflow: hidden;
  }
  .order-list {
    position: relative;
    li {
      padding-left: 100px;
      height: 30px;
      line-height: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    /*   &.rihgt{

    } */
  }
  .xq-tb {
    border-collapse: collapse;
    color: #fff;
    width: 1125px;
    margin: 0 auto;
    td,
    th {
      border: 1px solid #000;
      text-align: center;
      width: 20%;
    }
    thead {
      background-color: #c60001;
      th {
        font-size: 16px;
        height: 56px;
      }
    }
    tbody {
      background-color: #860000;
      td {
        font-size: 14px;
        height: 40px;
      }
    }
    .tip {
      width: 86px;
      margin: 0 auto;
    }
  }
  .xz-list {
    font-size: 14px;
    color: @xz-list-color;
    padding: 0 35px;
    line-height: 30px;
  }
  .foot {
    text-align: center;
    background-color: #2e0800;
    color: @foot-color;
    padding: 15px 0;
    a {
      color: @foot-color;
    }
  }
  .dlalog {
    position: fixed;
    left: 50%;
    top: 50%;
    z-index: 1000;
    min-width: 300px;
  }
  .page-wrapper {
    padding: 0;
  }
  &.en {
    .banner {
      background-image: url(/static/images/packet/banner-bg-en.jpg);
    }
    .banner .hb .icon-btn {
      background: url(/static/images/packet/anniu.png) no-repeat;
      width: 512px;
      height: 151px;
      margin-left: -256px;
    }
    .packet-box {
      .box-hd {
        &.rp {
          background: url(/static/images/packet/packet-rp-bg-en.png);
        }
        &.xq {
          background: url(/static/images/packet/packet-xq-bg-en.png);
        }
        &.xz {
          background: url(/static/images/packet/packet-xz-bg-en.png);
        }
      }
    }
  }
}

.packet-box {
  position: relative;

  .box-hd {
    width: 1000px;
    height: 154px;
    &.rp {
      background: url(/static/images/packet/packet-rp-bg.png);
    }
    &.xq {
      background: url(/static/images/packet/packet-xq-bg.png);
    }
    &.xz {
      background: url(/static/images/packet/packet-xz-bg.png);
    }
  }
  .box-bd {
    padding: 20px 0;
  }
}
.packet-times {
  .item {
    position: absolute;
    top: -2px;
    width: 53px;
    height: 60px;
    background: url(/static/images/packet/time-bg.png);
    color: #fff;
    font-size: 14px;
    .val {
      font-size: 28px;
      font-weight: bold;
      margin-top: -3px;
      color: #eee;
    }
  }

  .hour {
    left: 80px;
  }
  .day {
    left: 10px;
  }
  .minus {
    left: 360px;
  }
  .sec {
    left: 426px;
  }
}
.packet-active {
  padding: 0 34px;
}
.packet-fix {
  position: fixed;
  right: 0;
  top: 200px;
  width: 248px;
  height: 346px;
  z-index: 100;
  background: url(/static/images/packet/floor-bg.png);
  .online {
    display: block;
    width: 107px;
    height: 52px;
    margin: 100px 0 40px 100px;
    background: url(/static/images/packet/online.png);
  }
  .top {
    display: block;
    width: 108px;
    height: 74px;
    margin-left: 100px;
    margin-bottom: 10px;
    background: url(/static/images/packet/top.png);
  }
  .icon-close {
    width: 30px;
    height: 30px;
    background-position: -102px 0;
    margin-left: 140px;
    cursor: pointer;
    &:before {
      display: none;
    }
  }
}
.packet-shadow {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.5);
  &.closeDlalog4 {
    z-index: 1001;
  }
}
.packet-dlalog {
  position: fixed;
  width: 588px;
  left: 50%;
  top: 50%;
  margin-top: -234px;
  /*  top: 200px; */
  margin-left: -294px;
  z-index: 1000;
  min-width: 300px;
  .icon-close {
    width: 20px;
    height: 20px;
    background-position: -147px 0;
    cursor: pointer;
    position: absolute;
    right: 20px;
    top: 9px;
    z-index: 10;
    &:before {
      display: none;
    }
  }
  .dlalog-hd {
    height: 36px;
    line-height: 36px;
    color: #f1f3b3;
    font-size: 16px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    padding: 0 15px;
    background: url(/static/images/packet/dlg-hd-bg.png) repeat;
  }
  .dlalog-bd {
    height: 480px;
    padding: 10px 60px;
    background: url(/static/images/packet/dig-bg.png) repeat;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
}
.packet-dlalog3 {
  background: url(/static/images/packet/dlg-bg2.png) no-repeat;
  width: 680px;
  height: 600px;
  margin-left: -340px;
  margin-top: -300px;
  .icon-close2 {
    position: absolute;
    right: 105px;
    top: 42px;
    cursor: pointer;
    &:before {
      display: none;
    }
  }
  .dlg-name {
    text-align: center;
    margin-top: 78px;
    margin-bottom: 30px;
    color: #795548;
    font-size: 23px;
  }
  .cont {
    width: 240px;
    margin: 0 auto;
  }
  .tip {
    font-size: 16px;
    color: #795548;
  }
  .rule-btn {
    font-size: 24px;
    color: #fff;
    position: absolute;
    width: 200px;
    height: 60px;
    left: 50%;
    margin-left: -100px;
    bottom: 68px;
    text-align: center;
    cursor: pointer;
  }
}
.packet-dlalog2 {
  background: url(/static/images/packet/hb-bg2.png) no-repeat;
  width: 570px;
  height: 500px;
  margin-top: -250px;
  margin-left: -285px;
  .icon-close2 {
    position: absolute;
    right: 42px;
    top: 55px;
    cursor: pointer;
    &:before {
      display: none;
    }
  }
  .cont {
    text-align: center;
    margin-top: 210px;
    padding-left: 10px;
    .money {
      font-size: 30px;
      color: @money-color;
      font-weight: bold;
      margin-bottom: 15px;
    }
    .type {
      font-size: 18px;
      color: @type-color;
    }
  }
}
.search-info {
  height: 30px;
  line-height: 30px;
  overflow: hidden;
  color: #f1f3b3;
  font-size: 14px;
  margin-bottom: 10px;
  .left {
    float: left;
    width: 50%;
  }
  .right {
    float: left;
    width: 50%;
    text-align: right;
  }
}
.search-tb {
  width: 100%;
  border-collapse: collapse;
  position: relative;
  .ivu-spin {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    line-height: 120px;
    color: #fff;
    background-color: #aaa;
    background-color: rgba(0, 0, 0, 0.5);
  }
  th,
  td {
    text-align: center;
    width: 25%;
    border: 1px solid @td-border-color;
  }
  .btn {
    border: 0;
    cursor: pointer;
    color: #fff;
    background-color: @td-border-color;
    padding: 1px 5px;
  }
  thead {
    th {
      font-size: 16px;
      height: 30px;
      color: #fff;
      font-weight: normal;
    }
  }
  tbody {
    td {
      height: 30px;
      background-color: #efddb7;
      color: @tbody-td-color;
    }
  }
}
.swing {
  transform-origin: top center;
  animation-name: swing;
}
@keyframes swing {
  20% {
    transform: rotate(15deg);
  }
  40% {
    transform: rotate(-10deg);
  }
  60% {
    transform: rotate(5deg);
  }
  80% {
    transform: rotate(-5deg);
  }
  to {
    transform: rotate(0deg);
  }
}
.animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}

.packet .packet-dlalog4 {
  background: url(/static/images/packet/txcg.png) no-repeat;
  width: 452px;
  height: 325px;
  margin-left: -226px;
  top: 50%;
  margin-top: -162px;
  z-index: 1002;
  .icon-close2 {
    right: 0;
    position: absolute;
    top: -21px;
    &:before {
      display: none;
    }
  }
}
</style>
<style lang="less">
.packetPage {
  .first-page,
  .last-page {
    background-color: #fff;
  }
  .last-page-wrapper {
    .jump-to {
      color: #fff;
    }
  }
}
</style>
