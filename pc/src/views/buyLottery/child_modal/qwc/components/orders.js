import SeBoOrder from "./SeBoOrder";
import ZhengMaOrder from "./ZhengMaOrder";

export { default as SeBoOrder } from "./SeBoOrder";
export { default as ZhengMaOrder } from "./ZhengMaOrder";

export default {
  viewMatch(lotteryPlayId) {
    switch (lotteryPlayId) {
      case "1201":
        return SeBoOrder;
      case "1202":
        return ZhengMaOrder;
    }
  }

}
