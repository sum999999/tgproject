import Vue from "vue";
import Router from "vue-router";
import notFound from "@/views/404/404";
import systemMaintenance from "@/views/503/503";
import ipLimit from "@/components/ipforbid";
import { Spin } from "iview";
const layout = (resolve) => require(["@/views/layout/index"], resolve);
const home = (resolve) => {
  Spin.show();
  // require.ensure(['@/views/home/home'], () => {
  //     resolve(require('@/views/home/home'))
  //     Spin.hide()
  // })
  require.ensure(["@/views/home/index"], () => {
    resolve(require("@/views/home/index"));
    Spin.hide();
  });
};
const buyLottery = (resolve) => {
  //  Spin.show()
  require.ensure(["@/views/buyLottery/buyLottery"], () => {
    resolve(require("@/views/buyLottery/buyLottery"));

    // Spin.hide()
  });
};
const lottery = (resolve) => {
  // Spin.show();
  require.ensure(["@/views/lottery/index"], () => {
    resolve(require("@/views/lottery/index"));
    Spin.hide();
  });
};
const active = (resolve) => {
  Spin.show();
  require.ensure(["@/views/active/index"], () => {
    resolve(require("@/views/active/index"));
    Spin.hide();
  });
};
const activeDetail = (resolve) => {
  Spin.show();
  require.ensure(["@/views/active/ActiveDetailPage"], () => {
    resolve(require("@/views/active/ActiveDetailPage"));
    Spin.hide();
  });
};
const game = (resolve) => {
  Spin.show();
  require.ensure(["@/views/game/index"], () => {
    resolve(require("@/views/game/index"));
    Spin.hide();
  });
};
const phoneBuy = (resolve) => {
  Spin.show();
  // require.ensure(['@/views/phoneBuy/phoneBuy'], () => {
  //     resolve(require('@/views/phoneBuy/phoneBuy'))
  //     Spin.hide()
  // })
  require.ensure(["@/views/phoneBuy/index"], () => {
    resolve(require("@/views/phoneBuy/index"));
    Spin.hide();
  });
};
const notice = (resolve) => {
  Spin.show();
  require.ensure(["@/views/notice/notice"], () => {
    resolve(require("@/views/notice/notice"));
    Spin.hide();
  });
};
const noticeDetail = (resolve) => {
  Spin.show();
  require.ensure(["@/views/notice/notice_detail"], () => {
    resolve(require("@/views/notice/notice_detail"));
    Spin.hide();
  });
};
const trend = (resolve) => {
  Spin.show();
  require.ensure(["@/views/trend/trend"], () => {
    resolve(require("@/views/trend/trend"));
    Spin.hide();
  });
};
const trendDetail = (resolve) => {
  Spin.show();
  require.ensure(["@/views/trend/trend_detail"], () => {
    resolve(require("@/views/trend/trend_detail"));
    Spin.hide();
  });
};
const register = (resolve) => {
  Spin.show();
  require.ensure(["@/views/register/index"], () => {
    resolve(require("@/views/register/index"));
    Spin.hide();
  });
};
const login = (resolve) => {
  Spin.show();
  require.ensure(["@/views/login/index"], () => {
    resolve(require("@/views/login/index"));
    Spin.hide();
  });
};
const personalCenter = (resolve) => {
  Spin.show();
  require.ensure(["@/views/personalCenter/personalCenter"], () => {
    resolve(require("@/views/personalCenter/personalCenter"));
    Spin.hide();
  });
};
const freeTrial = (resolve) => {
  Spin.show();
  require.ensure(["@/views/freeTrial/freeTrial"], () => {
    resolve(require("@/views/freeTrial/freeTrial"));
    Spin.hide();
  });
};
const helpCenter = (resolve) => {
  Spin.show();
  require.ensure(["@/views/helpCenter/helpCenter"], () => {
    resolve(require("@/views/helpCenter/helpCenter"));
    Spin.hide();
  });
};
const role = (resolve) => {
  Spin.show();
  require.ensure(["@/views/role/role"], () => {
    resolve(require("@/views/role/role"));
    Spin.hide();
  });
};
const newsDetail = (resolve) => {
  Spin.show();
  require.ensure(["@/views/newsDetail/newsDetail"], () => {
    resolve(require("@/views/newsDetail/newsDetail"));
    Spin.hide();
  });
};
const newsList = (resolve) => {
  Spin.show();
  require.ensure(["@/views/newsList/newsList"], () => {
    resolve(require("@/views/newsList/newsList"));
    Spin.hide();
  });
};

const redPacket = (resolve) => {
  Spin.show();
  require.ensure(["@/views/redPacket/redPacket"], () => {
    resolve(require("@/views/redPacket/redPacket"));
    Spin.hide();
  });
};

const feedbackActive = (resolve) => {
  Spin.show();
  require.ensure(["@/views/feedbackActive/feedbackActive"], () => {
    resolve(require("@/views/feedbackActive/feedbackActive"));
    Spin.hide();
  });
};

const chatRoom = (resolve) => {
  Spin.show();
  require.ensure(["@/views/chatRoom/index"], () => {
    resolve(require("@/views/chatRoom/index"));
    Spin.hide();
  });
};

const another = (resolve) => {
  Spin.show();
  require.ensure(
    ["@/views/personalCenter/child_modal/recharge/Another"],
    () => {
      resolve(require("@/views/personalCenter/child_modal/recharge/Another"));
      Spin.hide();
    }
  );
};
const password = (resolve) => {
  Spin.show();
  require.ensure(["@/views/password/password"], () => {
    resolve(require("@/views/password/password"));
    Spin.hide();
  });
};
const bankValid = (resolve) => {
  Spin.show();
  require.ensure(["@/views/bankValid/bankValid"], () => {
    resolve(require("@/views/bankValid/bankValid"));
    Spin.hide();
  });
};
const phoneValid = (resolve) => {
  Spin.show();
  require.ensure(["@/views/phoneValid/phoneValid"], () => {
    resolve(require("@/views/phoneValid/phoneValid"));
    Spin.hide();
  });
};

Vue.use(Router);

let routerObj = new Router({
  // mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      path: "/",
      name: "layout",
      component: layout,
      redirect: "/home",
      children: [
        {
          path: "/home",
          name: "home",
          component: home,
        },
        {
          path: "/buyLottery/:id",
          name: "buyLottery",
          component: buyLottery,
        },
        {
          path: "/lottery",
          name: "lottery",
          component: lottery,
        },
        {
          path: "/active",
          name: "active",
          component: active,
        },

        {
          path: "/active/:id",
          name: "activeDetail",
          component: activeDetail,
        },
        {
          path: "/game/:id",
          name: "game",
          component: game,
        },
        {
          path: "/password",
          name: "password",
          component: password,
        },
        {
          path: "/bankValid",
          name: "bankValid",
          component: bankValid,
        },
        {
          path: "/phoneValid",
          name: "phoneValid",
          component: phoneValid,
        },
        // {
        //   path: '/active_detail/:id',
        //   name: 'active_detail',
        //   component: activeDetail
        // },
        {
          path: "/phoneBuy",
          name: "phone_buy",
          component: phoneBuy,
        },
        {
          path: "/notice",
          name: "notice",
          component: notice,
        },
        {
          path: "/noticeDetail/:id",
          name: "notice_detail",
          component: noticeDetail,
        },
        {
          path: "/trend",
          name: "trend",
          component: trend,
        },
        {
          path: "/trendDetail/:id",
          name: "trend_detail",
          component: trendDetail,
        },
        {
          path: "/register",
          name: "register",
          component: register,
        },
        {
          path: "/login",
          name: "login",
          component: login,
        },
        {
          path: "/personalCenter/:id",
          name: "personalCenter",
          component: personalCenter,
        },
        {
          path: "/freeTrial",
          name: "free_trial",
          component: freeTrial,
        },
        {
          path: "/helpcenter/:id",
          name: "helpcenter",
          component: helpCenter,
        },
        {
          path: "/role/:id",
          name: "role",
          component: role,
        },
        {
          path: "/newsDetail/:id",
          name: "newsDetail",
          component: newsDetail,
        },
        {
          path: "/newsList/:id",
          name: "newsList",
          component: newsList,
        },
        {
          path: "/redPacket",
          name: "redPacket",
          component: redPacket,
        },
        {
          path: "/feedbackActive",
          name: "feedbackActive",
          component: feedbackActive,
        },
        {
          path: "/chatRoom",
          name: "chatRoom",
          component: chatRoom,
        },
      ],
    },
    {
      path: "/test",
      name: "test",
      component: () => import("@/views/test"),
    },
    {
      path: "/another",
      name: "another",
      component: another,
    },
    {
      path: "/ipLimit",
      name: "ipLimit",
      component: ipLimit,
    },
    {
      path: "*",
      name: "404",
      component: notFound,
    },
    {
      path: "/503",
      name: "503",
      component: systemMaintenance,
    },
  ],
});
//2019 1.2 by xiaojiji
routerObj.beforeEach((to, from, next) => {
  let {
    name,
    query: { exp, ttcode },
  } = to;
  // let { name, query: { exp } } = to
  if (name !== "register") {
    //不是去注册页面
    next();
  } else {
    // 从游戏，购彩大厅，首页进到注册
    if (from.name) {
      next();
      return;
    }
    let ttcodeFlag = to.query.hasOwnProperty("ttcode"); // 判断路由中是否有这个属性
    let newTtCode = null;
    if (!exp && !ttcodeFlag) {
      // 如果url中不存在，则从sessionStorage中取，若值为空，表示之前该窗口的页面未以邀请码的形式访问过注册页面
      const oldExp = sessionStorage.getItem("exp");
      if (!oldExp) {
        next();
      } else {
        const newTtCodeObj = JSON.parse(sessionStorage.getItem("ttcode"));
        newTtCode = newTtCodeObj.value;
      }
    } else if (exp && ttcodeFlag) {
      newTtCode = ttcode || "";
      const time = Date.now();
      const expStr = JSON.stringify({ value: exp, time: time });
      const ttcodeStr = JSON.stringify({ value: newTtCode, time: time });
      sessionStorage.setItem("exp", expStr);
      sessionStorage.setItem("ttcode", ttcodeStr);
    }
    if (!ttcode) {
      return next();
    }
    if (newTtCode === "TG_GAME") {
      // 官方
      // routerObj.replace({name: 'lottery'});
      // return;
      // if(!ttcode) {
      //     return next();
      // }
      return next({
        name: "lottery",
      });
    } else if (newTtCode === "CHAT_ROOM_LIST") {
      //聊天室类型
      // if(!ttcode) {
      //     return next();
      // } else {
      return next({
        name: "chatRoom",
      });
      // }
    } else {
      // if(!ttcode) {
      //     return next();
      // }
      if (newTtCode) {
        //默认注册时为空
        newTtCode = newTtCode.split("-")[1];
        return next({
          name: "game",
          params: {
            id: newTtCode,
          },
        });
      }
    }
    next();
  }
  // let { name, query: { exp, ttcode } } = to
  // // let { name, query: { exp } } = to
  // // debugger;
  // if(name!=='register') { //不是去注册页面
  //     next();
  // } else {
  //     let ttcodeFlag = to.query.hasOwnProperty('ttcode'); // 判断路由中是否有这个属性
  //     let newTtCode = null;
  //     if(!exp && !ttcodeFlag) { // 如果url中不存在，则从sessionStorage中取，若值为空，表示之前该窗口的页面未以邀请码的形式访问过注册页面
  //         const oldExp = sessionStorage.getItem('exp');
  //         if(!oldExp) {
  //             next();
  //         } else {
  //             const newTtCodeObj = JSON.parse(sessionStorage.getItem('ttcode'));
  //             newTtCode = newTtCodeObj.value;
  //         }
  //     } else if(exp && ttcodeFlag) {
  //         newTtCode = ttcode || '';
  //         const time = Date.now();
  //         const expStr = JSON.stringify({value: exp,time: time});
  //         const ttcodeStr = JSON.stringify({value: newTtCode,time: time});
  //         sessionStorage.setItem('exp',expStr);
  //         sessionStorage.setItem('ttcode',ttcodeStr);
  //     }
  //     if (newTtCode === 'TG_GAME') {
  //         routerObj.replace({name: 'lottery'})
  //         // return; // comment or not comment
  //     } else if (newTtCode === 'CHAT_ROOM_LIST') {
  //         routerObj.replace('/chatRoom')
  //         // return // comment or not comment
  //     } else {
  //         // routerObj.replace({ name: 'game', query: { type: ttcode } })
  //         if (newTtCode) {
  //             //默认注册时为空
  //             newTtCode = newTtCode.split('-')[1]
  //             return next({
  //                 name: 'game',
  //                 params: {
  //                     id: newTtCode
  //                 }
  //             })
  //         }
  //     }
  //     next()
  // }
});
export default routerObj;
