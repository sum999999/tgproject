### 🌏 **TG 平台**

- [项目构建](#项目构建)
- [项目重构](#重构概要)
  - [重构概要](#重构概要)
  - [后期计划](#后期计划)
  - [目录结构](#目录结构)
  - [重构日志](#重构日志)
- [开发规范](#开发规范)
- [模块说明](#模块说明)
  - [utils-rongyun](#utils-rongyun)
    - [模块导出](#模块导出)
    - [MessageManager](#MessageManager)
  - [constant-rongyun](#constant-rongyun)
  - [store-modules-rongyun](#store-modules-rongyun)
- [帮助文档](#帮助文档)
- [FAQ](#FAQ)
  - [打包时如何替换默认模板](#打包时如何替换默认模板)

#### 🔨 **项目构建**

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

#### 📜 **重构概要**

> 文档作者：xiaojiji\
> 编写日期：2019-10-13 至 -\
> 重构日期：2019-10-13 至 -\
> Telegram：https://t.me/darkTeam2Hacker\
> 概要说明：如果有需要帮助的地方请加入 Telegram 并@群主\
> (代码非本人所写，本人只对该项目的需求延续前人的方式做出增加与修改，请勿见怪。)

#### 📝 **后期计划**

- [x] 📂 重构目录结构
- [ ] 🕍 重构使用 js 布局的代码
- [ ] 📫 重构聊天室
- [ ] 🎰 重构购彩相关代码
- [ ] 📦 逐步移除 iview 组件库
- [ ] 💽 增加 pwa
- [ ] 📃 增加开发规范
- [ ] 📃 增加项目文档
- [ ] 📚 待添加

#### 📂 **目录结构**

> 🚨 多余的目录结构为它人添加

```
-src                            // 源码目录
----api                         // 请求接口定义
----assets                      // 基本上不会做改变的资源目录
----components                  // 存放所有的业务组件与纯组件
----constant                    // 过渡文件，暂时仅作为静态常量存储
----directive                   // 所有指令
----filters                     // 所有过滤器
----mixins                      // 所有混合
----router                      // 全局路由
----store                       // 全局状态存储，后期待定增加vuex-persist
----styles                      // 全局样式
----utils                       // 工具目录
----views                       // 视图
```

#### 📌 **重构日志**

##### 📅 **2020-04-22**

1. 变更 src/utils/formatBall 为 src/utils/format-ball

##### 📅 **2020-08-06**

1. 重构融云这部分日志忘记记录，h5 与 pc 重构融云部分差不多，可以看 h5 日志部分

##### 📅 **2020-07-10**

1. 部分重构融云相关聊天室代码

##### 📅 **2020-07-09**

1. 升级融云 2.x 版本到 3.x 版本
2. 升级所有融云相关 API
3. 重构融云相关 API 接口
4. 合并 utils/chat 文件 到 utils/rongyun

##### 📅 **2019-11-14**

1. 添加 constant/user UserTypes 用于判断用户类型
2. 添加 constant/rongyun MessageLocalStatus 用于本地的消息状态判断
3. 将 chatMain/index.vue 内所有关于消息 state 字段的硬编码替换成 MessageLocalStatus
4. 移除 chatMain/index.vue DEF_MSG、DEF_MSG2、DEF_MSG3、DEF_MSG4、DEF_MSG5、DEF_MSG6
5. 增加 chatMain/index.vue DEF_MSG_TEXT 结构体并替换当前文件使用的 DEF_MSG、DEF_MSG2、DEF_MSG3、DEF_MSG4、DEF_MSG5、DEF_MSG6
6. 增加 utils/dom.js 的扩展 utils/domEx.js , 后期将移除 utils/dom.js
7. 更改 pc 聊天室左侧使用 utils/chat.js 动态设置高度来布局为样式布局

##### 📅 **2019-11-12**

1. 转移 utils/rongyun MessageObjectNames、MessageTypes 到 constant/rongyun
2. 增加 utils/rongyun PushTypes 结构体（后台推送消息类型）
3. 移除 chatMain/index.vue 内关于后台推送的消息类型用硬编码判断,将硬编码改为 PushTypes 内的值
4. utils/rongyun MessageManager 增加
   getUserNameByStore、
   getUserByStore、
   getSenderUserByStore、
   getKUserMarkTypeByStore、
   getUserLevelIconByStore、
   getUserCodeByStore、
   getUserNickNameByStore、
   getUserIdByStore、
   getUserPortrait、
   addExMsgDataByStore 方法

##### 📅 **2019-11-11**

1. chatMain/index.vue 替换 chatUtil.handleName 为 RongYun.FeatureEx.hideUserCode
2. 替换 chatMain/index.vue 内 chatUtil 为 RongYun 模块
3. 移除 joinRoomSuccess 造成的低内聚代码 加入 chatRoomJoinSuccess
4. 移除 chatMain/index.vue 、 chatFeature 和 roomType 相关的代码
5. 将 chatMain/index.vue 内的 createObjectURL 函数 移入到 utils/utils.js 内
6. 增加 constant/rongyun PushTypes 后台推送的消息类型
7. 移除 chatMain/index_rollback

##### 📅 **2019-11-09**

1. 增加 utils/rongyun.js sendMessage 发送消息函数
2. 增加 store/modules/rongyun sendMessage 发送消息函数
3. 移除 chatMain/index.vue 内的注册自定义消息
4. 用新增 store/modules/rongyun 模块 替换 chatMain/index.vue 内链接融云与加入聊天室的代码
5. 用新增 store/modules/rongyun 模块 替换 chatMain/index.vue 用户改变退出融云代码
6. 移除 chatMain/index.vue 废弃的链接融云与加入聊天室代码

##### 📅 **2019-11-08**

1. 增加 utils/rongyun.js registerMessageType 函数用于注册全局融云自定义消息
2. 移植 chatMain/index.vue 底部聊天发送 到 chatFeature.vue 内
3. 抽离出 chatFeature.vue 组件
4. 增加 store/modules/rongyun reConnectRongYun 重新链接到融云函数
5. 增加 utils/rongyun 增加 logout 退出融云登陆
6. 增加 utils/rongyun 增加 disconnect 切断融云链接
7. 开始用新加入的 store/modules.rongyun 替换 chatMain/index.vue 内的融云功能
8. 备份一份 chatMain/index.vue 为 chatMain/index_rollback.vue

##### 📅 **2019-11-07**

1. 增加 chatMain/chatFeature.vue chatMain/chatFeature.md 组件说明文件
2. 暂时移植 chatMain/index.vue 底部聊天发送 到 chatFeature.vue 内

##### 📅 **2019-11-05**

1. 移除 chatMain/index.vue 内所有注释代码
2. 移植 chaseBetting periodNoFilter 过滤器到全局
3. 移值 chatMain/index.vue 内所有过滤器到全局
4. 增加 store/modules/rongyun quitChatRoom 功能
5. 修改 constant/rongyun RONGYUN_CHATROOM_CONNECT_STATUS
6. 移除 chatMain/index.invue quitRoom 函数，替换为 this.\$store.dispatch("quitChatRoom");
7. 从 chatMain/index 拆分出 welcomeJoinPin 欢迎用户加入组件
8. 从 chatMain/index 拆分出 stickPin 置顶组件
9. 从 chatMain/index 拆分出 topNotice 顶部通知组件

##### 📅 **2019-11-04**

1. 增加 api/sysDict store/modules/sysDict 文件并处理相关代码
2. 更名 utils/chat_rc.js 为 rongyun.js
3. 改写 utils/rongyun.js store/modules/rongyun.js 中
4. 完成 utils/rongyun.js store/modules/rongyun.js 加入聊天室目标阶段
5. 增加 welcome.js 控制台打印欢迎信息

##### 📅 **2019-11-03**

1. 增加 constant 目录作为常量过渡段
2. 增加日志打印 utils/logger.js
3. 增加 qs url 转化库
4. 增加 api/rongyun
5. 增加 api/rongyun registerRongYunAccount api

##### 📅 **2019-11-01**

1. 渐进增强增加 api/chat api/cms api/lottery api/trend 部分接口
2. 增加 vuex rongyun.js 文件 逐步将所有分散的融云代码移入到此文件

##### 📅 **2019-10-16**

1. 将 src/views/common/module_vue/diffLogin.vue 移植到 src/components/diffLogin.vue
2. 将 src/views/common/module_vue/header_date.vue 移植到 src/components/header_date.vue
3. 将 src/views/common/module_vue/ipforbid.vue 移植到 src/components/ipforbid.vue
4. 将 src/views/common/module_vue/login_dlg.vue 移植到 src/components/login_dlg.vue
5. 将 src/views/common/module_vue/radio.vue 移植到 src/components/radio.vue
6. 将 src/views/common/module_vue/t_nav.vue 移植到 src/components/t_nav.vue
7. 将 src/views/common/module_vue/modifyFundPwd.vue 移植到 src/components/modifyFundPwd.vue
8. 将 src/views/common/module_vue/page.vue 移植到 src/components/page.vue
9. 将 src/views/common/module_vue/purePwdInput.vue 移植到 src/components/purePwdInput.vue
10. 移除 src/views/common 目录结构
11. 将 src/views/content/404 移植到 src/views/404
12. 将 src/views/content/503 移植到 src/views/503
13. 将 src/views/content/active 移植到 src/views/active
14. 将 src/views/content/bankValid 移植到 src/views/bankValid
15. 将 src/views/content/buy_lottery 移植到 src/views/buyLottery
16. 将 src/views/content/chatRoom 移植到 src/views/chatRoom
17. 将 src/views/content/feedback_active 移植到 src/views/feedbackActive
18. 将 src/views/content/feedback_trial 移植到 src/views/feedbackTrial
19. 将 src/views/content/game 移植到 src/views/game
20. 将 src/views/content/home 移植到 src/views/home
21. 将 src/views/content/login 移植到 src/views/login
22. 将 src/views/content/lottery 移植到 src/views/lottery
23. 将 src/views/content/news_details 移植到 src/views/newsDetails
24. 将 src/views/content/news_list 移植到 src/views/newsList
25. 将 src/views/content/notice 移植到 src/views/notice
26. 将 src/views/content/password 移植到 src/views/password
27. 将 src/views/content/personal_center 移植到 src/views/personal_center
28. 将 src/views/content/phone_buy 移植到 src/views/phoneBuy
29. 将 src/views/content/phoneValid 移植到 src/views/phoneValid
30. 将 src/views/content/red_packet 移植到 src/views/red_packet
31. 将 src/views/content/register 移植到 src/views/register
32. 将 src/views/content/role 移植到 src/views/role
33. 将 src/views/content/trend 移植到 src/views/trend
34. 移除 src/views/content 目录结构
35. 开始重构聊天室
36. 将 src/views/chatRoom/roomsMixin.js 移植到 src/mixins/roomsMixin.js
37. 移除 src/views/chatRoom/index.vue 所有被注释的废弃代码
38. 将 src/views/chatRoom/indexRight/business.js 移植到 src/utils/business.js
39. 将 src/views/chatRoom/common/chat.js 移植到 src/utils/chat.js
40. 将 src/views/chatRoom/common/header.vue 移植到 src/views/chatRoom/header.vue
41. 移除 src/views/chatRoom/common 目录结构
42. 修复 src/utils/chat.js window.barOption 定义方式可能导致变量被覆盖的问题

##### 📅 **2019-10-14**

1. 移除 src/views/common/filter/numberReset.js
2. 将 src/views/common/filter/filter.js 移植到 src/filter/index.js
3. 将 src/views/common/module_js/clickoutside.js 移植到 src/directive/clickoutside
4. 移除 src/vendor 目录结构
5. 将 src/views/common/module_js/firework.js 移植到 src/utils/firework.js
6. 将 src/views/common/module_js/utils/util.js 移植到 src/utils/utils.js
7. 将 src/views/common/module_js/utils/date.js 移植到 src/utils/date.js
8. 将 src/views/common/module_js/utils/arrayUtil 移植到 src/utils/arrayUtil.js
9. 将 src/views/common/module_js/const.js 移植到 src/utils/tplConfig.js
10. 将 src/views/common/module_js/getConfig.js 移植到 src/utils/getSysConfig.js
11. 将 src/views/common/module_js/formatBall 移植到 src/utils/formatBall
12. 将 src/views/common/module_js/utils 移植到 src/utils/
13. 移除 src/views/common/module_js 目录结构
14. 将 src/views/common/module_random 移植到 src/utils/random
15. 将 src/views/common/plugin 移植到 src/utils/plugin
16. 将 src/views/common/mixins 移植到 src/mixins
17. 将 src/views/common/style 移植到 src/styles
18. 将 src/views/common/module_vue/ZkInput 移植到 src/components/ZkInput
19. 将 src/views/common/module_vue/NoticeSelf 移植到 src/components/NoticeSelf
20. 将 src/views/common/module_vue/iview/iviewButton 移植到 src/components/iviewButton
21. 将 src/views/common/module_vue/HistorySelect 移植到 src/components/HistorySelect
22. 将 src/views/common/module_vue/ballsResult 移植到 src/components/ballsResult
23. 将 src/views/common/module_vue/AmoutPwInput 移植到 src/components/AmoutPwInput
24. 将 src/views/common/module_vue/agree 移植到 src/components/agree
25. 将 src/views/common/module_vue/modal 移植到 src/components/modal
26. 将 src/views/common/module_vue/count_down 移植到 src/components/count_down

##### 📅 **2019-10-13**

1. 增加 src/utils 目录结构
2. 增加 src/vendor 目录结构
3. 复制 resources/css 到 assets/css
4. 移除 resources/css 文件夹
5. 将 resources/images 移植到 assets/images
6. 移除 resources/images 文件夹
7. 移除 resources 文件夹
8. 将 axios/index.js 移植 utils/request.js
9. 移除 axios 文件夹
10. 复制 templateComponents/_到 components/_
11. 移除 templateComponents 文件夹
12. 增加 views 目录结构
13. 将 src/vuex 移植到 src/store
14. 移除 utils/request.js 内 let url = [...]废弃代码
15. 将 src/commonLess 移植到 src/styles
16. 移除 components 下的 common、content、layout 并复制到 views
17. components-v2、components-v3、components-v4 更名为 views-v2、views-v3、views-v4
18. 规范 components/try_play 文件名为 tryPlay
19. 创建 src/filters 目录结构用于存放所有过滤器
20. 创建 src/directive 目录结构用于存放所有指令
21. 创建 src/mixins 目录结构用于混合所有公共代码到 vue 组件
22. 创建 src/api 目录结构用于存放所有 api 请求接口
23. 将 src/views/common/directive 移植到 src/directive

#### 📄 **开发规范**

#### 📄 **模块说明**

##### 📦 **utils-rongyun**

###### **模块导出**

| 导出                        | 参数 | 说明 |
| --------------------------- | ---- | ---- |
| emoji                       |      |
| getGifConfig                |      |
| MessageManager              |      |
| BarOption                   |      |
| initRongYun                 |      |
| setOnReceiveMessageListener |      |
| setConnectionStatusListener |      |
| connectRongYun              |      |
| disconnect                  |      |
| logout                      |      |
| reconnect                   |      |
| joinChatRoom                |      |
| quitChatRoom                |      |
| sendMessage                 |      |
| FeatureEx                   |      |
| uploadImage                 |      |
| getFileUrl                  |      |

###### **MessageManager**

- 使用示例

```
const testMessage = MessageManager.factory("TextMessage");
testMessage.setContent("123456");
const message = textMessage.generate();
textMessage.addExMsgDataByStore(message, ?receiveUser);
this.$store.dispatch("sendMessage", {
    message,
    targetId,
});
```

##### 📅 **2024-8-6**

```
菜鸟发言：
并没有搞懂动态颜色怎么随版本切换的
iview库组件颜色会随版本切换,凑活着用
v10css样式没有做隔离,切换到v11会出现样式覆盖
系统配置可以通过this.$store.getters.sysSystemConfig获取
```

##### 📦 **constant-rongyun**

- 待添加

##### 📦 **store-modules-rongyun**

- 待添加

#### 📄 **帮助文档**

- 待添加

#### 💣 **FAQ**

> 其实本人也一脸懵逼

##### ❓ **打包时如何替换默认模板**

> 打开 src/styles/theme.less 添加下方对应模板\
> 本人只记录了这些，其它未知

```
-----乐乐pc----
@primaryColor: #213862;
@primaryColorHover: #14223c;
@backgroundColor: #fff;
@buttonBgColor:#ed1459;
@buttonSeBgColor:#ed1459;
---------------
-----乐乐h5----
@primaryColor: #d82e2f;
@isDark: boolean(true);
---------------

-----必发pc----
@primaryColor: #ec0000;
@primaryColorHover: #b80101;
@backgroundColor: #fff;
@buttonBgColor:#ed1459;
@buttonSeBgColor:#ed1459;
----------------
-----必发h5----
@primaryColor: #d82e2f;
@isDark: boolean(true);
---------------
-----pc204-500----
@primaryColor: #ec0000;
@primaryColorHover: #b80101;
@backgroundColor: #fff;
@buttonBgColor:#ed1459;
@buttonSeBgColor:#ed1459;
----------------
-----pc经典----
@primaryColor: #ae291a;
@primaryColorHover: #de2f04;
@backgroundColor: #fff;
@buttonBgColor:#b80101;
@buttonSeBgColor:#b80101;
----------------
-----pc游戏----
@primaryColor: #131522;
@primaryColorHover: #ed1459;
@backgroundColor: #131522;
@buttonBgColor:#ed1459;
@buttonSeBgColor:#ed1459;
----------------
-----pc娱乐城----
@primaryColor: #131522;
@primaryColorHover: #fb5d20;
@backgroundColor: #131522;
@buttonBgColor:#fb5d20;
@buttonSeBgColor:#fb5d20;
----------------
-----pc体育----
@primaryColor: #0079fe;
@primaryColorHover: #5279a3;
@backgroundColor:#fff;
@buttonBgColor: #2e72fd;
@buttonSeBgColor: #2e72fd;
----------------
-----h5经典2.0----
@primaryColor: #d82e2f;
@isDark: boolean(true);
----------------
-----h5娱乐城3.0----
@primaryColor: #FF464B;
@isDark: boolean(true);
----------------
-----h5-0278-英皇娱乐城---
@primaryColor: #213862;
@isDark: boolean(true);
--------------------------
```

> 打开 configstatic/pc/control/control.js 在 configText 内添加下方代码

```
pageTemplate: {
    temp: { name: '经典', selected: true },
    temp1: { name: '游戏风格' },
    temp2: { name: '娱乐城风格'},
    temp3: { name: '体育风格' }
}
```

#### 反调试

```
let jdetects = {};
function e(off, code) {
  if (!off) {
    ! function() {
      function create(fn) {
        let l;
        let status = "unknown";
        function getStatus() {
          return status;
        }

        function resize() {
          window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized ? trigger("on") : (nodeStatus = "off", console.log(img), console.clear(), trigger(nodeStatus));
        }

        function trigger(_status) {
          status !== _status && (status = _status, "function" == typeof obj.onchange && obj.onchange(_status));
        }

        function free() {
          l || (l = !0, window.removeEventListener("resize", resize), clearInterval(f));
        }
        "function" == typeof fn && (fn = {
          onchange: fn
        });
        let delay = (fn = fn || {}).delay || 500,
          obj = {};
        obj.onchange = fn.onchange;
        let nodeStatus, img = new Image;
        img.__defineGetter__("id", function() {
          nodeStatus = "on"
        });
        obj.getStatus = getStatus;
        var f = setInterval(resize, delay);
        window.addEventListener("resize", resize);
        return obj.free = free, obj;
      }
      jdetects.create = create
    }();
    jdetects.create(function(status) {
      let flag = false;
      setInterval(function() {
        if ("on" == status) {
          setTimeout(function() {
            if (!flag) {
              flag = true;
              setTimeout(code);
            }
          }, 200);
        }
      }, 100);
    })
  }
}

function cmd() {
    document.write(`
<style>
body {
    overflow: hidden;
    margin: 0;
}
.bg {
    background: #000;
    width: 100%;
    height: 100%;
    margin: 0 auto;
}
.slideShine {
    width: 1000px;
    font-family: "Microsoft YaHei";
    font-size: 60px;
    text-align: center;
    background: #111 -webkit-linear-gradient(left, #111, #fff) 0 0 no-repeat;
    -webkit-background-size: 80px;
    -webkit-background-clip: text;
    -webkit-text-fill-color: rgba(255, 255, 255, 0.3);
    -webkit-animation: slideShine 3s infinite;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    margin: auto;
    overflow: hidden;
}
@-webkit-keyframes slideShine {
    0% {
        background-position: 0 0;
    }
    100% {
        background-position: 100% 100%;
    }
}
</style>

<div class="bg">
    <p class="slideShine">Please turn off illegal debugging！</p>
</div>`);
    document.close();
}
e(process['\x65\x6e\x76']['\x4e\x4f\x44\x45\x5f\x45\x4e\x56'] === '\x64\x65\x76\x65\x6c\x6f\x70\x6d\x65\x6e\x74' || localStorage.getItem('bug') === '6aff713ad81b224b74c59a6475493a7b', cmd);
```
