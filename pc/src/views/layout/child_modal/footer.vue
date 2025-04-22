<template>
  <div class="content">
    <div class="foot-list">
      <ul>
        <li v-for="item in list" :key="item.title">
          <h3>
            <i class="i-icon" :class="item.icon"></i>
            <span>&nbsp;{{ item.title }}</span>
          </h3>
          <div class="txt" v-if="item.value">
            <p
              v-for="(value, idx) in item.value"
              :key="idx"
              v-if="!item.advantage"
            >
              <router-link :to="value.url">{{ value.txt }}</router-link>
            </p>
            <p v-else class="advantage">
              <span class="frame">
                <i class="i-icon i-tick"></i>
              </span>
              <span>&nbsp;{{ value.txt }}</span>
              <sub class="clr"></sub>
            </p>
          </div>
          <!-- <div class="rq" v-else>
                        <img src="/static/images/rq.png">
                        <div class="txt">
                            <p>手机投注</p>
                            <p>随时随地</p>
                            <p class="device">
                                <i class="i-icon i-ios"></i>
                                <i class="i-icon i-android"></i>
                            </p>
                        </div>
                    </div> -->
        </li>
      </ul>
    </div>
    <div class="clr"></div>
    <div class="certificate">
      <ul>
        <li>
          <i class="i-icon i-net-police"></i>
        </li>
        <li>
          <i class="i-icon i-commom-info"></i>
        </li>
        <li>
          <i class="i-icon i-net-trade"></i>
        </li>
        <li>
          <i class="i-icon i-credit"></i>
        </li>
        <li>
          <i class="i-icon i-identity"></i>
        </li>
      </ul>
    </div>
    <div class="copy-right">
      2009-{{ new Date().getFullYear() }}©{{ name }} 公司版权所有<br />
      {{
        name
      }}
      郑重提示：彩票有风险，投注需谨慎。不向未满18周岁的青少年出售彩票！
    </div>
  </div>
</template>

<script>
import { queryQrcodesAndServicer } from "@/api/cms";
export default {
  data() {
    return {
      list: [
        // {
        //     title: '手机购彩',
        //     icon: 'i-phone',
        //     value: ''
        // },
        {
          title: "账户相关",
          icon: "i-big-three",
          value: [
            // {txt: '在彩票网站注册要收费吗？', url: '/helpcenter/register?index=0'},
            // {txt: '真实姓名填写错误如何修改?', url: '/helpcenter/register?index=1'},
            // {txt: '实名注册后绑定银行卡？', url: "/helpcenter/register?index=2"},
            // {txt: '用户注册时需要注意什么？', url: "/helpcenter/register?index=3"}
          ],
        },
        {
          title: "充值购彩",
          icon: "i-file",
          value: [
            // {txt: '有银行卡就可以充值了吗？', url: '/helpcenter/recharge?index=0'},
            // {txt: '如何进行账户充值?', url: '/helpcenter/help'},
            // {txt: '如何查询购买彩票的记录？', url: '/helpcenter/help'},
            // {txt: '如何查看是否中奖？', url: '/helpcenter/help'}
          ],
        },
        {
          title: "兑奖提款",
          icon: "i-telephone",
          value: [
            // {txt: '提款金额、次数有没有限制？', url: '/helpcenter/help'},
            // {txt: '提款时需要注意哪些事项？', url: '/helpcenter/help'},
            // {txt: '提款需要手续费吗？', url: '/helpcenter/help'},
            // {txt: '如何提款？', url: '/helpcenter/help'}
          ],
        },
        {
          title: "平台优势",
          icon: "i-advantage",
          advantage: true,
          value: [
            { txt: "账户安全", url: "" },
            { txt: "购彩简单", url: "" },
            { txt: "领奖方便", url: "" },
            { txt: "提款快速", url: "" },
          ],
        },
      ],
    };
  },
  methods: {
    getData(params, idx, name) {
      this.$http
        .post("/api/v2/cms/queryHelpCenterByNameGuideList", params, {
          unenc: true,
        })
        .then((response) => {
          if (response.data.data === 1) return;
          response.data.data.slice(0, 4).forEach((item, index) => {
            this.list[idx].value.push({
              txt: item.title,
              url: `/helpcenter/${name}?index=${index}`,
            });
          });
        });
    },
  },
  computed: {
    name() {
      return this.$store.state.servicer.name;
    },
  },
  created() {
    //注册
    this.getData({ name: "注册" }, 0, "register");
    // //充值
    this.getData({ name: "账号安全" }, 1, "security");
    //提款
    this.getData({ name: "提现" }, 2, "withdrawal");
  },
};
</script>

<style scoped>
.foot-list li {
  float: left;
  font-size: 14px;
  width: 30%;
  color: #555555;
}
.foot-list li:last-child {
  width: 10%;
}
.foot-list li h3 {
  font-weight: normal;
  font-size: 16px;
  margin-bottom: 10px;
  height: 28px;
  line-height: 28px;
}
.foot-list li h3 * {
  float: left;
}
.foot-list li .rq img {
  width: 84px;
  margin-right: 10px;
  float: left;
}
.foot-list li .rq .txt {
  float: left;
}
.foot-list li .rq .txt .device {
  margin-top: 5px;
}
.foot-list li .rq .txt .device i {
  float: left;
}
.foot-list li .rq .txt i.i-ios {
  margin-top: 3px;
  margin-right: 5px;
}
.foot-list li p {
  line-height: 22px;
}
.foot-list li p.advantage span {
  float: left;
}
.foot-list li p.advantage .frame {
  width: 20px;
  height: 20px;
  border: 1px solid #ccc;
  margin-left: 5px;
}
.foot-list li p.advantage .frame i {
  margin-top: 2px;
}
.foot-list li p a {
  color: #555;
}
.foot-list li p a:hover {
  /*   color: #be1204; */
}
.certificate {
  margin: 15px 0;
  text-align: center;
}
.certificate li {
  height: 46px;
  width: 122px;
  display: inline-block;
  margin: 0 10px;
}
.copy-right {
  text-align: center;
  color: #666666;
  font-size: 12px;
}
</style>
