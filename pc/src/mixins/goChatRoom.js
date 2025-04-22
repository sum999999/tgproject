/**
 * 从其它地方去聊天室
 */
export default {
    data() {
        return {

        }
    },
    methods:{
      hasRight(levelStr) {
        let vm = this;
        function getLevel(levelStr) {
            if(!levelStr) return [];
            return levelStr.split('|')
        }
        function isFormatUser(){
            return !(!vm.userInfo.userId || vm.userInfo.userType === '09');
        }
        let levelArr = getLevel(levelStr)
        if (!isFormatUser()) {
            return levelArr.includes('-1')
        }
        return levelArr.includes(vm.userInfo.userLevel)
      }
    }
}