<template>
  <div class="prize-record" v-loading="loading">
    <!--    <BackTop></BackTop>-->
    <div class="title-tab">
      <ul class="title">
        <li>{{ $tex("开奖历史") }}</li>
        <template v-if="subTitle.length">
          <li
            class="menu"
            v-for="(item, index) in subTitle"
            :key="item"
            @click="showOtherData(index)"
            :class="{ active: tabFlag[index] }"
          >
            {{ item }}
            <i class="iconfont icon-yxj-right" v-show="tabFlag[index]"></i>
            <!--  <img
              src="/configstatic/pc/images/choice_active.png"
              v-show="tabFlag[index]"
            > -->
          </li>
        </template>
      </ul>
      <div class="date-choice">
        <date-choice @sendData="getChiceDate"></date-choice>
      </div>
    </div>
    <div class="table-wrap">
      <template
        v-if="
          resultList.length &&
            (code !== 'ksan' ||
              code !== '6hc' ||
              code !== 'pcdd' ||
              code !== 'fc3d')
        "
      >
        <!-- 双面/号码统计 -->
        <div class="two-coin-wrap" v-if="tabFlag[0]">
          <div class="two-coin pk10">
            <h2>{{ $tex("今日双面统计") }}</h2>
            <table
              border="0"
              cellspacing="0"
              cellpadding="0"
              class="first-table"
            >
              <tbody>
                <!-- pk10 -->
                <tr v-if="code === 'pk10'">
                  <td>{{ $tex("名次") }}</td>
                  <td
                    v-for="(info, idx) in ranking"
                    :key="idx"
                    :colspan="info.colspan"
                  >
                    {{ info.title }}
                  </td>
                </tr>
                <tr
                  v-else-if="
                    code === 'ssc' || code === '11x5' || code === 'jwc'
                  "
                >
                  <td>{{ $tex("号码") }}</td>
                  <td
                    v-for="(info, idx) in resultList.totalNumCount"
                    :key="idx"
                  >
                    {{ info.num }}
                  </td>
                </tr>
                <!--klsf -->
                <tr v-if="code === 'klsf'">
                  <td rowspan="2">{{ $tex("号码") }}</td>
                  <td
                    v-for="(info, idx) in ranking"
                    :key="idx"
                    :colspan="info.colspan"
                  >
                    {{ info.title }}
                  </td>
                </tr>
                <tr v-if="code === 'klsf'" class="gray-bg">
                  <td v-for="(info, idx) in singleDoubleTitle" :key="idx">
                    {{ info }}
                  </td>
                </tr>
                <!-- pk10 -->
                <tr v-if="code === 'pk10'" class="gray-bg">
                  <td>{{ $tex("单双大小") }}</td>
                  <td v-for="(info, idx) in singleDoubleTitle" :key="idx">
                    {{ info }}
                  </td>
                </tr>
                <tr>
                  <td :class="code === 'pk10' ? 'pk10-times' : 'ssc-times'">
                    {{ $tex("出现次数") }}
                  </td>
                  <td
                    v-for="(item, idx) in resultList.totalNumCount"
                    :key="idx"
                  >
                    {{
                      code === "ssc" || code === "11x5" || code === "jwc"
                        ? item.count
                        : item
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              border="0"
              cellspacing="0"
              cellpadding="0"
              class="second-table"
            >
              <tbody>
                <template v-if="code === 'pk10'">
                  <tr>
                    <td
                      v-for="(item, idx) in dragonTigerTitle"
                      :key="idx"
                      :colspan="item.colspan"
                    >
                      {{ item.title }}
                    </td>
                  </tr>
                  <tr class="gray-bg">
                    <td v-for="(desc, idx) in dragonTigerSubTitle" :key="idx">
                      {{ desc }}
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $tex("出现次数") }}</td>
                    <td v-for="(count, idx) in resultList.mixinInfo" :key="idx">
                      {{ count }}
                    </td>
                  </tr>
                </template>
                <template
                  v-else-if="
                    code === 'ssc' || code === '11x5' || code === 'jwc'
                  "
                >
                  <tr>
                    <td rowspan="2" style="width:147px;">{{ $tex("球次") }}</td>
                    <td
                      v-for="(name, idx) in resultList.mixinInfo.name"
                      :key="idx"
                      colspan="4"
                    >
                      {{ name }}
                    </td>
                  </tr>
                  <tr class="gray-bg">
                    <td
                      v-for="(desc, idx) in resultList.mixinInfo.desc"
                      :key="idx"
                    >
                      {{ desc }}
                    </td>
                  </tr>
                  <tr>
                    <td style="width:147px;">{{ $tex("出现次数") }}</td>
                    <td
                      v-for="(count, idx) in resultList.mixinInfo.count"
                      :key="idx"
                    >
                      {{ count }}
                    </td>
                  </tr>
                </template>
                <template v-else-if="code === 'klsf'">
                  <tr>
                    <td rowspan="2">{{ $tex("球次") }}</td>
                    <td
                      v-for="(item, idx) in dragonTigerTitle"
                      :key="idx"
                      :colspan="item.colspan"
                    >
                      {{ item.title }}
                    </td>
                  </tr>
                  <tr class="gray-bg">
                    <td v-for="(desc, idx) in dragonTigerSubTitle" :key="idx">
                      {{ desc }}
                    </td>
                  </tr>
                  <tr>
                    <td style="width:147px;">{{ $tex("出现次数") }}</td>
                    <td v-for="(count, idx) in resultList.mixinInfo" :key="idx">
                      {{ count }}
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
        <!--长龙统计 -->
        <div class="long-wrap" v-show="tabFlag[1]">
          <h2>{{ $tex("长龙连开提醒") }}</h2>
          <div class="long">
            <ul>
              <li v-for="(item, idx) in resultList.longData" :key="idx">
                <span>{{ item.title }}:</span>
                <span>{{ item.content }}</span>
              </li>
            </ul>
          </div>
        </div>
        <!-- 号码分析 -->
        <div class="analy" v-show="tabFlag[2] && code !== 'klsf'">
          <ul class="clearfix">
            <li>{{ $tex("查看球号分析") }}:</li>
            <li
              class="ball-analy"
              v-for="(num, index) in ballsNum"
              :key="index"
              @click="ballNumAnaly(index)"
              :class="[
                code === '11x5' ? 'eleven-five' : '',
                isActiveNumber[index] === index ? 'active' : '',
              ]"
            >
              {{ num }}
            </li>
          </ul>
          <ul class="clearfix">
            <li>{{ $tex("大小单双分布") }}:</li>
            <li
              class="ball-single"
              v-for="(num, index) in singleDouble"
              :key="index"
              @click="singleDoubleAnaly(index)"
              :class="[
                code === '11x5' ? 'eleven-five' : '',
                (single && index === 0) ||
                (single === false && index === 1) ||
                (small === false && index === 2) ||
                (small && index === 3) ||
                (double && index === singleDouble.length - 2)
                  ? 'active'
                  : '',
              ]"
            >
              {{ num }}
            </li>
          </ul>
        </div>
        <!-- klsf号码分析 -->
        <div class="analy" v-show="tabFlag[2] && code === 'klsf'">
          <div class="klsf-analy-title clearfix">
            <div>{{ $tex("查看球号分析") }}:</div>
            <div>
              <ul>
                <li
                  class="ball-analy"
                  v-for="(num, index) in ballsNum"
                  :key="index"
                  @click="ballNumAnaly(index)"
                  :class="[isActiveNumber[index] === index ? 'active' : '']"
                >
                  {{ num }}
                </li>
              </ul>
            </div>
          </div>
          <ul>
            <li class="klsf-single-double-analy-title">
              {{ $tex("大小单双分布") }}:
            </li>
            <li
              class="ball-single"
              v-for="(num, index) in singleDouble"
              :key="index"
              @click="singleDoubleAnaly(index)"
              :class="[
                (single && index === 0) ||
                (single === false && index === 1) ||
                (small === false && index === 2) ||
                (small && index === 3) ||
                (double && index === singleDouble.length - 2)
                  ? 'active'
                  : '',
              ]"
            >
              {{ num }}
            </li>
          </ul>
        </div>
      </template>

      <!-- 开奖记录 -->
      <div
        class="record-list"
        v-if="resultList.length"
        :class="[!tabFlag[0] && !tabFlag[1] && !tabFlag[2] ? 'no-border' : '']"
      >
        <table
          border="0"
          cellspacing="0"
          cellpadding="0"
          :class="
            code === '6hc' ||
            code === 'pcdd' ||
            code === 'ksan' ||
            code === 'qwc' ||
            code === 'fc3d'
              ? 'other-ball'
              : ''
          "
        >
          <tbody>
            <template
              v-if="
                code === '6hc' ||
                  code === 'pcdd' ||
                  code === 'ksan' ||
                  code === 'qwc' ||
                  code === 'fc3d'
              "
            >
              <tr>
                <td
                  v-for="(item, index) in recordTitle"
                  :key="index"
                  :rowspan="index <= 1 && item.rowspan"
                  :colspan="index >= 1 && item.colspan"
                >
                  {{ item.title ? item.title : item }}
                </td>
              </tr>
              <!-- 六合彩 -->
              <tr v-if="openBalls.length">
                <td
                  v-for="(num, index) in openBalls"
                  :key="index"
                  :class="[index === 0 ? 'sixhe-td' : '']"
                >
                  <span>{{ num }}</span>
                </td>
              </tr>
              <tr
                v-for="(item, idx) in resultList"
                :key="idx"
                :class="[
                  code === 'pcdd'
                    ? 'pcdd-tr'
                    : code === '6hc'
                    ? 'six-he'
                    : code === 'fc3d'
                    ? 'fc-3d'
                    : '',
                ]"
              >
                <td>{{ item.periodNo }}</td>
                <!-- 快三 -->
                <template v-if="code === 'ksan'">
                  <td class="ksan">
                    <span
                      v-for="(ballInfo, index) in item.trendNumbers"
                      :key="index"
                      :class="[`ksan-${ballInfo}`]"
                    ></span>
                  </td>
                  <td v-for="(number, index) in item.sumInfo" :key="index">
                    <span
                      :class="[
                        number === $tex('大')
                          ? 'ksan-large'
                          : number === $tex('双')
                          ? 'ksan-double'
                          : '',
                      ]"
                      >{{ number }}</span
                    >
                  </td>
                  <td v-for="(number, index) in item.fishInfo" :key="index">
                    <span
                      :class="[
                        number === $tex('鱼')
                          ? 'fish'
                          : number === $tex('虾')
                          ? 'shrimp'
                          : number === $tex('葫芦')
                          ? 'gourd'
                          : number === $tex('金钱')
                          ? 'money'
                          : number === $tex('蟹')
                          ? 'crab'
                          : number === $tex('鸡')
                          ? 'chicken'
                          : '',
                      ]"
                      >{{ number }}</span
                    >
                  </td>
                </template>
                <!-- 趣味彩 -->
                <template v-if="code === 'qwc'">
                  <td class="qwc">
                    <qwc-ball :ball="item.trendNumbers"></qwc-ball>
                  </td>
                </template>
                <!-- pcdd -->
                <template v-else-if="code === 'pcdd'">
                  <td>
                    <span
                      v-for="(itm, index) in item.trendNumbers"
                      :key="index"
                      :class="[index % 2 === 0 ? 'prize-ball' : '']"
                      >{{ itm }}</span
                    >
                  </td>
                  <td
                    v-for="(number, index) in item.trendResultNumber"
                    :key="index"
                  >
                    <span
                      v-if="typeof number === 'object' && code === 'pcdd'"
                      :class="[
                        number.isDouble ? 'double-ball' : '',
                        number.isLarge ? 'large-ball' : '',
                      ]"
                      >{{ number.content }}</span
                    >
                    <span
                      v-else
                      :class="[
                        number === 'green'
                          ? 'green-ball'
                          : number === 'gray'
                          ? 'gray-ball'
                          : number === 'red'
                          ? 'red-ball'
                          : number === 'blue'
                          ? 'blue-ball'
                          : '',
                      ]"
                      >{{
                        number === "green"
                          ? $tex("绿波")
                          : number === "gray"
                          ? $tex("灰波")
                          : number === "red"
                          ? $tex("红波")
                          : number === "blue"
                          ? $tex("蓝波")
                          : number
                      }}</span
                    >
                  </td>
                </template>
                <!--六合彩 -->
                <template v-else-if="code === '6hc'">
                  <td>
                    <span
                      v-for="(itm, index) in item.trendNumbers"
                      :key="index"
                      :class="[typeof itm === 'string' ? 'sum-char' : '']"
                    >
                      <i
                        :class="[
                          typeof itm === 'object' && itm.clrFlag === 'red'
                            ? 'red'
                            : itm.clrFlag === 'green'
                            ? 'green'
                            : '',
                        ]"
                        >{{ typeof itm === "object" ? itm.content : itm }}</i
                      >
                      <i><animal :text="itm.zodiac"></animal></i>
                    </span>
                  </td>
                  <td
                    v-for="(item, index) in item.sumInfo"
                    :key="index"
                    :class="[
                      typeof item !== 'number' ? 'ball-info' : '',
                      item === '单'
                        ? 'six-he-single'
                        : item === '双'
                        ? 'six-he-double'
                        : '',
                      item === $tex('大')
                        ? 'six-he-large'
                        : item === $tex('小')
                        ? 'six-he-small'
                        : '',
                      item === $tex('红波')
                        ? 'six-he-red'
                        : item === $tex('蓝波')
                        ? 'six-he-blue'
                        : item === $tex('绿波')
                        ? 'six-he-green'
                        : item === $tex('和局')
                        ? 'six-he-equal'
                        : '',
                    ]"
                  >
                    <span>{{ item }}</span>
                  </td>
                  <td
                    v-for="(item, index) in item.specialBallInfo"
                    :key="index"
                    :class="[
                      'special-ball-info',
                      item === $tex('单')
                        ? 'six-he-single'
                        : item === $tex('双')
                        ? 'six-he-double'
                        : '',
                      item === $tex('大')
                        ? 'six-he-large'
                        : item === $tex('小')
                        ? 'six-he-small'
                        : '',
                      item === $tex('红波')
                        ? 'six-he-red'
                        : item === $tex('蓝波')
                        ? 'six-he-blue'
                        : item === $tex('绿波')
                        ? 'six-he-green'
                        : '',
                    ]"
                  >
                    <animal :text="item"></animal>
                  </td>
                </template>
                <!-- 福彩3D -->
                <template v-else-if="code === 'fc3d'">
                  <td class="ball">
                    <span
                      v-for="(itm, index) in item.trendNumbers"
                      :key="index"
                      >{{ itm }}</span
                    >
                  </td>
                  <td
                    v-for="(item, index) in item.sumInfo"
                    :key="index"
                    :class="{ 'double-clr': item === $tex('双') }"
                  >
                    {{ item }}
                  </td>
                </template>
              </tr>
            </template>
            <template v-else>
              <!-- 表格标题 -->
              <tr>
                <td>{{ titleInfo.periodNo }}</td>
                <td :colspan="titleInfo.otherOne.colspan" class="ssc ">
                  <span
                    v-for="(info, idx) in titleInfo.otherOne"
                    :key="idx"
                    :class="{ 'active-bg': btnActive === idx }"
                    @click="changeShowTab(idx)"
                    >{{ info }}</span
                  >
                </td>
                <template v-if="code === '11x5'">
                  <td :colspan="titleInfo.sum.colspan">
                    {{ titleInfo.sum.title }}
                  </td>
                  <td>{{ titleInfo.dragonTiger }}</td>
                  <td v-for="item in titleInfo.threeInfo" :key="item">
                    {{ item }}
                  </td>
                </template>
                <template v-else-if="code === 'klsf'">
                  <td :colspan="titleInfo.otherTwo.colspan">
                    {{ titleInfo.otherTwo.title }}
                  </td>
                  <td>{{ titleInfo.last }}</td>
                  <td :colspan="titleInfo.dragonTiger.colspan">
                    {{ titleInfo.dragonTiger.title }}
                  </td>
                </template>
                <template v-else>
                  <td
                    v-for="(item, idx) in titleInfo.otherTwo"
                    :key="idx"
                    :colspan="item.colspan"
                  >
                    <span>{{ item.title }}</span>
                  </td>
                </template>
              </tr>
              <!--显示号码-->
              <tr v-for="item in resultList" :key="item.periodNo">
                <td>{{ item.periodNo }}</td>
                <td class="ball">
                  <span
                    v-if="btnActive === 0"
                    v-for="(ballInfo, index) in item.ballsInfo.lotteryNumbers"
                    :key="index"
                    :class="[
                      btnActive === 0 && code === 'pk10'
                        ? 'pk-ten-num'
                        : code !== 'pk10'
                        ? 'num'
                        : '',
                      code === 'pk10' ? 'pk-ten' + ballInfo.content : '',
                      (choiceBalls.length &&
                        !choiceBalls.includes(ballInfo.content)) ||
                      (single && !ballInfo.single) ||
                      (single === false && ballInfo.single) ||
                      (ballInfo.content === '11' && !single) ||
                      (small === false && ballInfo.small) ||
                      (small && !ballInfo.small) ||
                      (double && !ballInfo.double)
                        ? 'opacity'
                        : '',
                    ]"
                  >
                    <template v-if="code === 'ssc'">
                      {{ ballInfo.content }}
                    </template>
                    <template v-else-if="code === 'pk10'"></template>
                    <template v-else>
                      {{ ballInfo.ball }}
                    </template>
                  </span>
                  <span
                    v-if="btnActive === 1"
                    v-for="(size, index) in item.ballsInfo.sizes"
                    :key="index"
                    :style="{ 'background-color': size.clr }"
                    :class="[
                      (choiceBalls.length &&
                        !choiceBalls.includes(size.number)) ||
                      (single && !size.single) ||
                      (single === false && size.single) ||
                      (small === false && size.small) ||
                      (small && !size.small) ||
                      (double && !size.double)
                        ? 'opacity'
                        : '',
                      btnActive === 1 && code === 'pk10'
                        ? 'pk-ten-num pk-ten-size'
                        : '',
                    ]"
                  >
                    {{ size.content }}
                  </span>
                  <span
                    v-if="btnActive === 2"
                    v-for="(singl, index) in item.ballsInfo.singles"
                    :key="index"
                    :style="{ 'background-color': singl.clr }"
                    :class="[
                      (choiceBalls.length &&
                        !choiceBalls.includes(singl.number)) ||
                      (single && !singl.single) ||
                      (single === false && singl.single) ||
                      (small === false && singl.small) ||
                      (small && !singl.small) ||
                      (double && !singl.double)
                        ? 'opacity'
                        : '',
                      btnActive === 2 && code == 'pk10'
                        ? 'pk-ten-num pk-ten-single'
                        : '',
                    ]"
                  >
                    {{ singl.content }}
                  </span>
                </td>
                <td class="ball-sum">{{ item.sumInfo.sum }}</td>
                <td
                  :class="[
                    (code === 'pk10' && item.sumInfo.sum > 11) ||
                    item.sumInfo.sum > 22
                      ? 'large-clr'
                      : 'small-clr',
                  ]"
                >
                  {{ item.sumInfo.small }}
                </td>
                <td
                  :class="[
                    item.sumInfo.sum % 2 === 0 ? 'double-clr' : 'single-clr',
                  ]"
                >
                  {{ item.sumInfo.single }}
                </td>
                <template v-if="code === 'pk10'">
                  <td
                    :class="[
                      item.sumInfo.oneLong === $tex('龙')
                        ? 'dragon'
                        : item.sumInfo.oneLong === $tex('虎')
                        ? 'tiger'
                        : 'sum',
                    ]"
                  >
                    {{ item.sumInfo.oneLong }}
                  </td>
                  <td
                    :class="[
                      item.sumInfo.twoLong === $tex('龙')
                        ? 'dragon'
                        : item.sumInfo.twoLong === $tex('虎')
                        ? 'tiger'
                        : 'sum',
                    ]"
                  >
                    {{ item.sumInfo.twoLong }}
                  </td>
                  <td
                    :class="[
                      item.sumInfo.threeLong === $tex('龙')
                        ? 'dragon'
                        : item.sumInfo.threeLong === $tex('虎')
                        ? 'tiger'
                        : 'sum',
                    ]"
                  >
                    {{ item.sumInfo.threeLong }}
                  </td>
                  <td
                    :class="[
                      item.sumInfo.fourLong === $tex('龙')
                        ? 'dragon'
                        : item.sumInfo.fourLong === $tex('虎')
                        ? 'tiger'
                        : 'sum',
                    ]"
                  >
                    {{ item.sumInfo.fourLong }}
                  </td>
                  <td
                    :class="[
                      item.sumInfo.fiveLong === $tex('龙')
                        ? 'dragon'
                        : item.sumInfo.fiveLong === $tex('虎')
                        ? 'tiger'
                        : 'sum',
                    ]"
                  >
                    {{ item.sumInfo.fiveLong }}
                  </td>
                </template>
                <template v-if="code === 'ssc'">
                  <td
                    :class="[
                      item.sumInfo.long === $tex('龙')
                        ? 'dragon'
                        : item.sumInfo.long === $tex('虎')
                        ? 'tiger'
                        : 'sum',
                    ]"
                  >
                    {{ item.sumInfo.long }}
                  </td>
                </template>
                <template v-if="code === '11x5'">
                  <td
                    :class="[
                      item.dragonTiger.dragon === $tex('龙')
                        ? 'dragon'
                        : item.dragonTiger.dragon === $tex('虎')
                        ? 'tiger'
                        : 'sum',
                    ]"
                  >
                    {{ item.dragonTiger.dragon }}
                  </td>
                  <td
                    v-for="(info, index) in item.threeInfo"
                    :key="index"
                    :style="{ color: info.clr }"
                  >
                    {{ info.clr ? info.content : info }}
                  </td>
                </template>
                <template v-if="code === 'klsf'">
                  <td
                    :class="[
                      item.sumInfo.sum % 10 > 4 ? 'large-clr' : 'small-clr',
                    ]"
                  >
                    {{ item.sumInfo.sumLastNum }}
                  </td>
                  <td
                    v-for="(tiger, index) in item.dragonTiger"
                    :key="index"
                    :class="[
                      tiger === $tex('龙')
                        ? 'dragon'
                        : tiger === $tex('虎')
                        ? 'tiger'
                        : 'sum',
                    ]"
                  >
                    {{ tiger }}
                  </td>
                </template>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div
        v-else
        style="height:100px;text-align:center;line-height:90px;border:1px solid #f1f1f1;border-top:none;"
      >
        {{ $tex("暂无数据") }}
      </div>
    </div>
  </div>
</template>
<script>
import config from "../const.js";
import dateChoice from "./dateChoice.vue";
import Animal from "@/components/Animal";
import QwcBall from "@/views/buyLottery/components/QwcBall";

export default {
  components: {
    dateChoice,
    Animal,
    QwcBall,
  },
  props: {
    code: {
      type: String,
    },
    lotteryId: {
      type: String,
    },
  },
  data() {
    return {
      resultList: [],
      openBalls: [], //六合彩
      recordTitle: [], //6hc、kan/pcdd的表格标题
      subTitle: [],
      tabFlag: [false, false, false], //切换号码、大小、单双
      dateIndex: 0, //日期查询索引
      params: {
        lotteryId: "",
        num: "200",
      },
      ranking: [], //双面号码统计标题
      singleDoubleTitle: [], //单双大小标题
      dragonTigerTitle: [], //双面统计冠亚龙虎
      dragonTigerSubTitle: [], //双面统计单双龙虎大小标题
      ballsNum: [], //号码
      isActiveNumber: [], //切换球号
      choiceBalls: [], //选择的球号
      small: null, //大小
      single: null, //单双
      double: false, //对子
      singleDouble: [],
      titleInfo: {}, //开奖记录的标题
      btnActive: 0,
      loading: false,
    };
  },
  methods: {
    changeShowTab(idx) {
      if ((this.btnActive = idx)) return;
      this.btnActive = idx;
    },
    /**
     * 球号分析
     */
    ballNumAnaly(index) {
      this.single = null;
      this.small = null;
      this.double = null;
      if (this.isActiveNumber[index] === index) {
        this.isActiveNumber.splice(index, 1, -1);
        if (
          this.code === "pk10" ||
          this.code === "11x5" ||
          this.code === "klsf"
        ) {
          index++;
        }
        this.choiceBalls.splice(this.choiceBalls.indexOf(index), 1);
        return;
      }
      this.isActiveNumber.splice(index, 1, index);
      if (
        this.code === "pk10" ||
        this.code === "11x5" ||
        this.code === "klsf"
      ) {
        this.choiceBalls.push(index + 1);
      } else if (this.code === "ssc" || this.code === "jwc") {
        this.choiceBalls.push(index);
      }
    },
    /**
     * 大小单双分布
     */
    singleDoubleAnaly(index) {
      if (this.code === "pk10" || this.code === "ssc" || this.code === "jwc") {
        this.isActiveNumber = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
      } else if (this.code === "11x5") {
        this.isActiveNumber = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]; //切换球号
      } else if (this.code === "klsf") {
        this.isActiveNumber = [
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
          -1,
        ]; //切换球号
      }
      this.choiceBalls = [];
      switch (
        index //单为true,小为true
      ) {
        case 0:
          this.double = false;
          this.single = this.single ? null : true;
          break;
        case 1:
          this.double = false;
          this.single = this.single === false ? null : false;
          break;
        case 2:
          this.double = false;
          this.small = this.small === false ? null : false;
          break;
        case 3:
          this.double = false;
          this.small = this.small ? null : true;
          break;
        case 4:
          this.double = !this.double;
          this.small = null;
          this.single = null;
          break;
        default:
          this.choiceBalls = [];
          if (
            this.code === "pk10" ||
            this.code === "ssc" ||
            this.code === "jwc"
          ) {
            this.isActiveNumber = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
          } else if (this.code === "11x5") {
            this.isActiveNumber = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]; //切换球号
          } else if (this.code === "klsf") {
            this.isActiveNumber = [
              -1,
              -1,
              -1,
              -1,
              -1,
              -1,
              -1,
              -1,
              -1,
              -1,
              -1,
              -1,
              -1,
              -1,
              -1,
              -1,
              -1,
              -1,
              -1,
              -1,
            ]; //切换球号
          }
          this.single = null;
          this.small = null;
          this.double = false;
          break;
      }
    },
    /**
     * 开奖记录菜单项
     */
    showOtherData(index) {
      this.tabFlag.splice(
        index,
        1,
        (this.tabFlag[index] = !this.tabFlag[index])
      );
    },
    getChiceDate(result) {
      //获取选择的时间
      this.params = Object.assign(result, this.params);
      this.getData();
    },
    getData() {
      this.loading = true;
      this.$http
        .post("/api/v2/trend/queryOpencodes", this.params, { unenc: true })
        .then((response) => {
          this.loading = false;
          if (response.data.code !== 0) return;
          let data = response.data.data;
          let recordList = data.records;
          if (recordList.length) {
            this.resultList = config[this.code].handlerRecordList(recordList);
          } else {
            this.resultList = [];
          }
        });
    },
  },
  created() {
    this.params.lotteryId = this.lotteryId;
    this.getData();
    if (
      this.code === "ksan" ||
      this.code === "6hc" ||
      this.code === "pcdd" ||
      this.code === "fc3d" ||
      this.code === "qwc"
    ) {
      //没有subTitle
      this.recordTitle = config[this.code].recordTitle;
      if (this.code === "6hc") {
        this.openBalls = config[this.code].openBalls;
      }
      return;
    }
    this.subTitle = config[this.code].subTitle;
    if (this.code === "pk10" || this.code === "klsf") {
      //时时彩没有
      this.dragonTigerTitle = config[this.code].dragonTigerTitle;
      this.dragonTigerSubTitle = config[this.code].dragonTigerSubTitle;
      this.ranking = config[this.code].ranking;
      this.singleDoubleTitle = config[this.code].singleDoubleTitle;
    }
    this.ballsNum = config[this.code].ballsNum;
    this.isActiveNumber = config[this.code].isActiveNumber;
    this.singleDouble = config[this.code].singleDouble;
    this.titleInfo = config[this.code].titleInfo;
  },
};
</script>
<style lang="less">
.prize-record .table-wrap .record-list table {
  tbody > tr:nth-child(1) > td:nth-child(2) {
    width: 290px;
  }
}
.prize-record {
  width: 100%;
  overflow-y: auto;
  border-bottom: 0;
  tr {
    &:first-child {
      td {
        height: 40px;
        background: #f5f5f5;
        font-size: 14px;
      }
    }
    td {
      &:last-child {
        border-right: none;
      }
    }
  }
  li {
    float: left;
    text-align: center;
  }
  .title-tab {
    height: 52px;
    line-height: 52px;
    border: 1px solid #ebebeb !important;
    border-top: none;
    overflow: hidden;
    background-color: #fff;
    .title {
      padding-left: 20px;
      &:first-child {
        float: left;
        line-height: 52px;
        li {
          cursor: pointer;
          margin: 0 10px;
          &:first-child {
            cursor: inherit;
            font-weight: bold;
            font-size: 18px;
            color: #333;
            margin-left: 0;
          }
          &.menu {
            position: relative;
            height: 32px;
            line-height: 32px;
            padding: 0 20px;
            margin-top: 10px;
            border-radius: 4px;
            opacity: 1;
            font-size: 14px;
            font-weight: normal;
            text-align: center;
            &.active {
              opacity: inherit;
              /*  border-color: @primary-color;
              color: @primary-color; */
            }
            &:hover {
              /*   border-color: @primary-color;
              color: @primary-color; */
            }
            .icon-yxj-right {
              position: absolute;
              bottom: -4px;
              right: 0;
              font-size: 24px;
            }
          }
        }
      }
    }
    .date-choice {
      float: right;
    }
  }
  .table-wrap {
    table {
      color: #282828;
      border: 1px solid #eaeaea;
      border-bottom: none;
      position: relative;
      width: 100%;
      table-layout: fixed;
      word-break: break-all;
      white-space: normal;
      td {
        // min-width: 32px;
        min-width: 21px;
        border-right: 1px solid #eaeaea;
        border-bottom: 1px solid #eaeaea;
        text-align: center;
        height: 40px;
        // padding: 0 6px;
        color: #575757;
        &.example-ball {
          width: 27px;
          font-size: 12px;
          &.weight-ball {
            font-size: 12px;
            font-weight: bold;
          }
          span {
            display: block;
            width: 19px;
            height: 19px;
            line-height: 19px;
          }
        }
        &.klsf {
          span {
            margin-right: 3px;
            /*      color: #be1204; */
            text-align: left;
          }
        }
        .win-ball {
          display: inline-block;
          width: 19px;
          height: 19px;
          line-height: 19px;
          position: relative;
          border-radius: 50%;
          color: #fff;
          z-index: 200;
          text-align: center;
          &.klsf {
            background-color: #3f99f2;
          }
        }
        &.ssc {
          //被继承
          font-size: 0;
          span {
            display: inline-block;
            width: 67px;
            height: 24px;
            line-height: 24px;
            font-size: 12px;
            margin: 0 4px;
            color: #fff;
            background: #b9b9b9;
            border-radius: 4px;
            &:hover {
              cursor: pointer;
              background-color: #50515f;
            }
            &.active-bg {
              background-color: #50515f;
            }
          }
        }
        &.ball {
          span {
            display: inline-block;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            text-align: center;
            line-height: 30px;
            margin: 0 2px;
            color: #fff;
            font-size: 14px;
            &.num {
              background: radial-gradient(#ff6050 7%, #e50000);
              color: #fff;
            }
            &.pk-ten-num {
              border-radius: 2px;
              background: none;
              color: #fff;
              // span {
              border-radius: 4px;
              // }
            }
            &.opacity {
              opacity: 0.1;
            }
            &.pk-ten1 {
              background: #fffc00;
              color: #313131;
            }
            &.pk-ten2 {
              background: #0054ff;
            }
            &.pk-ten3 {
              background: #001868;
            }
            &.pk-ten4 {
              background: #ff5b00;
            }
            &.pk-ten5 {
              background: #00c0ff;
            }
            &.pk-ten6 {
              background: #5d06f4;
            }
            &.pk-ten7 {
              background: #b2b2b2;
            }
            &.pk-ten8 {
              background: #f70400;
            }
            &.pk-ten9 {
              background: #ad0000;
            }
            &.pk-ten10 {
              background: #0ad500;
            }
          }
        }
        &.ball-sum {
          color: #be1204;
        }
        &.double-clr {
          color: #f12a31;
        }
        &.single-clr {
          color: #233fd4;
        }
        &.large-clr {
          color: #f12a31 !important;
        }
        &.small-clr {
          color: #233fd4;
        }
        &.dragon {
          color: #f12a31;
        }
        &.tiger {
          color: #233fd4;
        }
        &.sum {
          color: #00ab07;
        }
        &:last-child {
          border-right: none;
        }
      }
    }
    .two-coin-wrap {
      padding: 5px 19px 10px;
      background-color: #fafafa;
      border: 1px solid #f1f1f1;
      border-top: none;
      .two-coin {
        h2 {
          font-size: 16px;
          font-weight: normal;
          line-height: 44px;
          color: #333;
        }
        .first-table {
          td {
            min-width: 18px;
          }
        }
        tr {
          &.gray-bg {
            td {
              background: #f5f5f5;
            }
          }
        }
        .second-table {
          margin-top: 10px;
        }
      }
    }
    .long-wrap {
      &:extend(.prize-record .table-wrap .two-coin-wrap);
      padding-top: 16px;
      padding-bottom: 0;
      margin-bottom: 4px;
      border: 1px solid #f1f1f1;
      margin-top: 4px;
      &:after {
        display: block;
        clear: both;
        visibility: hidden;
        content: "";
      }
      h2 {
        &:extend(.prize-record .table-wrap .two-coin-wrap .two-coin h2);
        line-height: 42px;
      }
      .long {
        display: flex;
        justify-content: space-between;
        li {
          width: 146px;
          line-height: 40px;
          margin: 0 10px 10px 0;
          letter-spacing: 2px;
          color: #545454;
          border: 1px solid #e5e5e5;
          background: #fff;
          padding: 0 4px;
          word-break: break-all;
        }
      }
    }
    .analy {
      &:extend(.prize-record .table-wrap .long-wrap);
      padding-top: 18px;
      padding-bottom: 18px;
      .klsf-analy-title {
        div {
          float: left;
          &:first-child {
            width: 100px;
            font-size: 16px;
          }
          &:last-child {
            width: 860px;
          }
        }
        ul {
          display: inline-block;
          &:first-child {
            margin-bottom: 0;
            li {
              margin-bottom: 10px;
            }
          }
          li {
            margin: 0 10px;
            margin-bottom: 10px;
            &.ball-single {
              margin: 0 8px;
            }
          }
          &:last-child {
            li {
              .ball-single {
                &:first-child {
                  width: 100px;
                }
              }
            }
          }
        }
      }
      ul {
        line-height: 30px;
        &:first-child {
          margin-bottom: 10px;
        }
        li {
          color: #555;
          &:first-child {
            font-size: 16px;
            margin-right: 3px;
          }
          &.ball-analy {
            width: 58px;
            height: auto;
            line-height: 32px;
            margin: 0 12px;
            border-radius: 4px;
            border: 1px solid #dddddd;
            background-color: #fff;
            cursor: pointer;
            word-break: break-all;
            padding: 0 4px;
            /*   &.active {
              border-color: @primary-color;
              color: @primary-color;
            }
            &:hover {
              color: @primary-color;
              border-color: @primary-color;
            } */
          }
          &.eleven-five {
            margin: 0 9px;
          }
          &.ball-single {
            &:extend(.prize-record .table-wrap .analy ul li.ball-analy);
            &:last-child {
              /*       background: @primary-color; */
              color: #fff;
              border: none;
              -webkit-transition: opacity 0.2s linear;
              transition: opacity 0.2s linear;
            }
            &.active {
              /*   border: 1px solid @primary-color;
              color: @primary-color; */
            }
          }
        }
        &:last-child {
          li {
            &.klsf-single-double-analy-title {
              margin-right: 0;
            }
            &.ball-single {
              &.eleven-five {
                margin: 0 9px;
              }
              &:extend(.prize-record .table-wrap .analy ul li.ball-analy);
              &:last-child {
                width: 110px;
                line-height: 32px;
                /*     background: @primary-color; */
                color: #fff;
                border: none;
                transition: opacity 0.2s linear;
                &:hover {
                  opacity: 0.8;
                  color: #fff;
                  /*    border-color: @primary-color; */
                }
              }
              &.active {
                /*   border: 1px solid @primary-color;
                color: @primary-color; */
              }
              &:hover {
                /*    color: @primary-color;
                border-color: @primary-color; */
              }
            }
          }
        }
      }
      &:after {
        display: block;
        clear: both;
        visibility: hidden;
        content: "";
      }
    }
    .record-list {
      &:extend(.prize-record .table-wrap .long-wrap);
      padding: 9px 19px 29px;
      margin-top: 4px;
      &.no-border {
        margin-top: 0;
        border-top: none;
      }
      table {
        border-color: #d0d0d0;
        &.other-ball {
          tr {
            &:first-child {
              td {
                font-weight: bold;
                background-color: inherit;
              }
            }
            &:nth-child(odd) {
              td {
                background-color: inherit;
              }
            }
          }
        }
        tr {
          &:nth-child(odd) {
            td {
              background-color: #fff;
            }
          }
          td {
            background-color: #fff;
          }
          &:nth-child(odd) {
            td {
              background-color: #ededed;
            }
          }
          &:first-child {
            td {
              background-color: #e7e7e7;
            }
          }
          td {
            min-width: 32px;
            color: #555;
            border-right-color: #d0d0d0;
            border-bottom-color: #d0d0d0;
            text-align: center;
            height: 40px;
            color: #575757;
            &:first-child {
              width: 188px;
            }
            &.sixhe-td {
              width: inherit;
            }
            &.ball {
              span {
                display: inline-block;
                vertical-align: middle;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                text-align: center;
                line-height: 30px;
                margin: 0 2px;
                color: #fff;
                font-size: 14px;
                &.pk-ten-num {
                  //号码、大小、单双--->大小和单双背景内联了
                  border-radius: 0;
                  background: none;
                  color: #fff;
                  width: 24px;
                  height: 24px;
                  width: 24px;
                  line-height: 24px;
                  // margin: 0 -1px;
                }
                &.pk-ten-size {
                  border-radius: 4px;
                  width: 24px;
                  height: 24px;
                  margin: 0 2px;
                }
                &.pk-ten-single {
                  border-radius: 4px;
                  width: 24px;
                  height: 24px;
                  margin: 0 2px;
                }
                &.pk-ten1 {
                  background: url("/static/images/icon.png") no-repeat -242px -10px;
                }
                &.pk-ten2 {
                  background: url("/static/images/icon.png") no-repeat -210px -10px;
                }
                &.pk-ten3 {
                  background: url("/static/images/icon.png") no-repeat -178px -10px;
                }
                &.pk-ten4 {
                  background: url("/static/images/icon.png") no-repeat -147px -10px;
                }
                &.pk-ten5 {
                  background: url("/static/images/icon.png") no-repeat -20px -10px;
                }
                &.pk-ten6 {
                  background: url("/static/images/icon.png") no-repeat -52px -10px;
                }
                &.pk-ten7 {
                  background: url("/static/images/icon.png") no-repeat -272px -10px;
                }
                &.pk-ten8 {
                  background: url("/static/images/icon.png") no-repeat -83px -10px;
                }
                &.pk-ten9 {
                  background: url("/static/images/icon.png") no-repeat -115px -10px;
                }
                &.pk-ten10 {
                  background: url("/static/images/icon.png") no-repeat -305px -10px;
                }
              }
            }
            &.ball-sum {
              color: #be1204;
            }
            &.double-clr {
              color: #f12a31;
            }
            &.small-clr {
              color: #233fd4;
            }
            &.dragon {
              color: #f12a31;
            }
            &.sum {
              color: #00ab07;
            }
            &.tiger {
              color: #233fd4;
            }
            &.dragon {
              color: #f12a31;
            }
            &.ssc {
              font-size: 0;
              span {
                display: inline-block;
                width: 67px;
                height: auto;
                line-height: 1.2;
                font-size: 12px;
                margin: 4px;
                padding: 4px;
                color: #fff;
                background: #b9b9b9;
                border-radius: 4px;
                vertical-align: middle;
              }
              .active-bg {
                background-color: #50515f;
              }
            }
            &.ksan {
              span {
                display: inline-block;
                vertical-align: middle;
                width: 30px;
                height: 30px;
                background: url(/static/images/trend-icons.png);
                background-position: 0 0;
                margin-top: 3px;
                &.ksan-2 {
                  background-position: -32px 0;
                }
                &.ksan-3 {
                  background-position: -64px 0;
                }
                &.ksan-4 {
                  background-position: -96px 0;
                }
                &.ksan-5 {
                  background-position: -128px 0;
                }
                &.ksan-6 {
                  background-position: -160px 0;
                }
              }
            }
            .ksan-large {
              color: #f13214;
            }
            .ksan-double {
              color: #f13214;
            }
            .fish {
              color: #f13214;
            }
            .shrimp {
              color: #008000;
            }
            .gourd {
              color: #0000ff;
            }
            .money {
              color: #0000ff;
            }
            .crab {
              color: #008000;
            }
            .chicken {
              color: #f13214;
            }
          }
          &.pcdd-tr {
            td {
              font-weight: normal;
              &:nth-child(2) {
                span {
                  display: inline-block;
                  vertical-align: middle;
                  width: 24px;
                  height: 24px;
                  line-height: 24px;
                  margin-top: 2px;
                  &.prize-ball {
                    background-color: #0064ec;
                    color: #fff;
                    border-radius: 50%;
                    -webkit-border-radius: 50%;
                    &:last-child {
                      background-color: #f13214;
                    }
                  }
                }
              }
              span {
                &.double-ball {
                  color: #f13214;
                }
                &.large-ball {
                  color: #f13214;
                }
                &.green-ball {
                  color: #11c619;
                }
                &.red-ball {
                  color: #f13214;
                }
                &.blue-ball {
                  color: #0064ec;
                }
                &.gray-ball {
                  color: #989899;
                }
              }
            }
          }
          &.six-he {
            td {
              &:nth-child(2) {
                span {
                  font-size: 0;
                  margin: 6px 2px 0 2px;
                  vertical-align: top;
                }
              }
              &.ball-info {
                max-width: 32px;
                span {
                  border-radius: 50%;
                  line-height: 24px;
                  /*color: #fff;*/
                  margin: 0;
                }
              }
              &.six-he-single,
              &.six-he-double,
              &.six-he-small,
              &.six-he-large {
                span {
                  width: 30px;
                  line-height: 30px;
                  color: #ffffff;
                  font-size: 12px;
                }
              }
              &.six-he-single {
                span {
                  background-color: #b2b2b2;
                }
              }
              &.six-he-double {
                span {
                  background-color: #ff7614;
                }
              }
              &.six-he-small {
                span {
                  background-color: #b2b2b2;
                }
              }
              &.six-he-large {
                span {
                  background-color: #ff7614;
                  color: #ffffff;
                }
              }
              &.six-he-red {
                span {
                  width: inherit;
                  color: #ec0022;
                }
              }
              &.six-he-blue {
                span {
                  width: inherit;
                  color: #0064ec;
                }
              }
              &.six-he-green {
                span {
                  width: inherit;
                  color: #11c619;
                }
              }
              &.six-he-equal {
                span {
                  width: inherit;
                  color: inherit;
                }
              }
              &.special-ball-info {
                max-width: 32px;
                &:first-child {
                  color: inherit;
                }
                &:nth-child(3) {
                  color: inherit;
                }
                span {
                  // color: inherit;
                  border-radius: 50%;
                  /*line-height: 24px;*/
                  margin: 0;
                }
                &.six-he-single {
                  span {
                    background-color: #b2b2b2;
                    color: #fff;
                  }
                }
                &.six-he-double {
                  span {
                    background-color: #ff7614;
                    color: #fff;
                  }
                }
                &.six-he-small {
                  span {
                    background-color: #b2b2b2;
                    color: #fff;
                  }
                }
                &.six-he-large {
                  span {
                    background-color: #ff7614;
                    color: #fff;
                  }
                }
                &.six-he-red {
                  span {
                    width: inherit;
                    color: #ec0022;
                  }
                }
                &.six-he-blue {
                  span {
                    width: inherit;
                    color: #0064ec;
                  }
                }
                &.six-he-green {
                  span {
                    width: inherit;
                    color: #11c619;
                  }
                }
              }
              span {
                display: inline-block;
                vertical-align: middle;
                width: 24px;
                text-align: center;
                &.sum-char {
                  width: 12px;
                  i {
                    &:first-child {
                      background: none;
                    }
                  }
                }
                i {
                  display: inline-block;
                  vertical-align: middle;
                  width: 100%;
                  line-height: 24px;
                  font-size: 14px;
                  color: #1a8fdb;
                  &:first-child {
                    border-radius: 50%;
                    background: url("/static/images/trend-icons.png") no-repeat
                      0 -38px;
                    &.red {
                      background-position: -28px -38px;
                      color: #f13214;
                    }
                    &.green {
                      background-position: -58px -38px;
                      color: #28b169;
                    }
                  }
                  &:last-child {
                    color: #999;
                    line-height: 1.2;
                  }
                }
              }
            }
          }
          &.fc-3d {
            span {
              display: inline-block;
              background: radial-gradient(#ff6050 7%, #e50000);
            }
          }
          .qwc {
            .qwc-ball {
              display: inline-block;
            }
          }
        }
      }
    }
  }
}
</style>
