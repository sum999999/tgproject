import {
    UserTypes
} from "@/constant/user";

export default {
    methods: {
        /**
         * 是否为正式用户
         */
        isFormatUser() {
            //游客、试玩用户为false
            return !(!this.user.userId || this.user.userType === '09')
        },
        /**
         * 判断用户是否有权限进入房间
         */
        hasJoinRoomAuto(levelStr) {
            let levelArr = getLevel(levelStr);
            if (!this.isFormatUser()) {
                return levelArr.includes('-1');
            }
            function getLevel(levelStr) {
                if (!levelStr) return [];
                return levelStr.split('|');
            }
            return levelArr.includes(this.user.userLevel);
        },
    }
}
