<template>
    <div class="chat-room" ref="chatRoomInner">
        <div class="room-name-wp">
            <!-- 标题 -->
            <div class="room-name" @click.stop="toggleRoomList">
                <span>{{currChatRoomName}}</span><Icon type="ios-arrow-down" :class="{'active':showRoomList}"/>
            </div>
        </div>
        <!-- 房间列表 -->
        <div class="room-list-wp" :class="{'active':showRoomList}">
            <div class="room-list" >
                <ul>
                    <li v-for="item of rooms" :key="item.roomId"
                        :class="{'disabled':currRoomId==item.ryChatRoomId}"
                        @click="choiceRoom(item)">
                        <div class="inner">
                            <i></i><span>{{item.roomName}}</span>
                        </div>
                    </li>
                    <li v-if="isMore && rooms.length" @click="more">
                        <div>
                            <i class="more"></i>
                            <span>{{$tex("更多")}}</span>
                        </div>
                    </li>
                    <li class='empty' v-if="!rooms.length">{{$tex("暂无房间")}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import roomsMixin from '@/mixins/roomsMixin.js'
export default {
    props:['ryChatRoomInfo'],
    mixins:[roomsMixin],
    data(){
        return {
            showRoomList:false, //是否显示房间列表
            chatRoomList:[],
            currChatRoomName:'',
            currRoomId:'',
            selectRoom:{}, //存储临时选择的房间
        }
    },
    watch:{
        ryChatRoomInfo({ryChatRoomId,ryChatRoomName}) {
            this.currChatRoomName = ryChatRoomName;
            this.currRoomId = ryChatRoomId;
        }
    },
    computed:{
        user () {
            return this.$store.state.user
        },
        rooms() { //房间列表
        // console.log(this.chatRoomList.slice(0,20));
            return this.chatRoomList.slice(0,20);
        },
         isMore(){ //是否显示更多
            return this.chatRoomList.length < 20;
        }
    },
    methods:{
        /**
         * 更多
         */
        more(){
            this.$emit('show-more-rooms');
            this.showRoomList = false;
        },
        /**
         * 设置当前房间
         */
        setCurrRoom(selectRoom){ //父组件调用,从moreRoom.vue传进来selectRoom不为空
            let isBand = false;
            let selectedRoom = selectRoom || this.selectRoom
            let  {roomName,ryChatRoomId,bankLevel} = selectedRoom;
            this.currRoomId = ryChatRoomId;
            this.currChatRoomName = roomName;
            this.showRoomList  = false;

            if (this.hasJoinRoomAuto(bankLevel)) { //被禁言了
                isBand = true
            }
            // this.$set(this.selectedRoom,'isBand',isBand);
            selectedRoom.isBand = isBand;
            let selectedRoomInfo =  JSON.parse(JSON.stringify(selectedRoom));
            this.$emit('setChatRoomInfo', selectedRoomInfo)
            this.selectRoom = {};
        },
        /**
         * 显示房间列表
         */
       async toggleRoomList() {
            if(this.chatRoomList.length) {
                this.showRoomList = !this.showRoomList;
                return;
            }
            this.chatRoomList  = await this.getChatRoomList();
            // console.log(this.chatRoomList);
            this.showRoomList = !this.showRoomList;
        },

        /**
        * 获取房间列表
        */
        async getChatRoomList(){
            let loading = this.$Message.loading({
                content: `${this.$tex("加载中")}...`,
                duration: 0
            });
            return new Promise((resolve,reject) =>{
                this.$http.post("/api/v2/chat/queryChatRoomComboBox",{userId: this.user.userId},{ unenc: true}).then(res =>{
                loading();
                if(res.data.code !== 0) {
                    reject(res.data.data);
                    return;
                }
                let chatRoomList = res.data.data.slice(0,21);
                resolve(chatRoomList);
                })
            })
        },
             /**
         *点击其它部分隐藏房间
         */
        hideRoomList(e) {
           if(!this.showRoomList) return;
           let inner = this.$refs['chatRoomInner'];
           if(!inner) return;
           let target = e.target;
           if(!inner.contains(target)){
               this.showRoomList = false;
           }
        }
    },
    mounted(){
        //点击元素外面关闭下拉房间列表
        this.$nextTick(() =>{
            window.addEventListener('click',this.hideRoomList,false)
        })
    },
    beforeDestroy(){
        window.removeEventListener('click',this.hideRoomList);
    }

}
</script>

<style lang="less" scoped>
    .chat-room {
        font-size:16px;
        color:#303b4e;
        position:relative;
        .room-name-wp{
            position:relative;
            display:flex;
            align-items:center;
            width: 100%;
            height: 46px;
            margin-left: 6px;
            justify-content: center;
            border-bottom: 1px solid #ebebeb;
        }
        .room-name {
            cursor: pointer;
            &:hover{
                color:@primary-color;
            }
           .ivu-icon{
               position:relative;
               top:2px;
               margin-left:14px;
               transition: transform .3s;
               font-size: 18px;
               font-weight:bold;
               &.active{
                     transform:rotate(180deg);
               }
           }
        }
        .room-list-wp{
            position:absolute;
            top: 47px;
            width:100%;
            height:0;
            background-color:#fff;
            transition: height .4s;
            overflow:hidden;
            z-index:101;
            box-shadow: 0 6px 8px -4px #999;
            &.active{
            height: 310px;
            }
        }
        .room-list {
            height: 310px;
            padding: 16px 0;
            overflow:hidden;
            ul {
                height: 100%;
                padding: 0 21px;
                overflow:auto;
                font-size:0;
                li{
                    float:left;
                    // display:block;
                    width:25%;
                    height: 40px;
                    padding: 0 21px;
                    margin: 8px 0;
                    font-size: 16px;
                    line-height: 40px;
                    text-align:center;
                    color:#fff;
                    transition: opacity .3s;
                    &:hover{
                        cursor: pointer;
                        opacity: .9;
                    }
                    &.empty {
                        width: 100%;
                        line-height: 278px;
                        text-align:center;
                        color:#999;
                    }
                    &.disabled {
                        &:hover{
                            cursor: not-allowed;
                        }
                        .inner{
                            background-color:#999;
                            background-image: none;
                            border-radius: 6px;
                        }
                    }
                    div {
                        display:flex;
                        align-items:center;
                        justify-content: center;
                        width: 100%;
                        height: 40px;
                        background:url(/static/images/chat/roomListBg/red.png) no-repeat;
                        background-size: 100% 40px;
                        overflow:hidden;
                    }
                    i {
                        display:block;
                        width: 21px;
                        height: 18px;
                        background:url(/static/images/chat/roomListBg/gem.png) no-repeat left center;
                        margin-right: 14px;
                    }
                    .more{
                        height: 20px;
                        background-image:url(/static/images/chat/roomListBg/more.png);
                    }
                    span {
                        display:block;
                        max-width: 80%;
                        text-overflow: ellipsis;
                        overflow:hidden;
                        white-space: nowrap;
                    }
                    &:nth-child(2) {
                        div{
                            background-image: url(/static/images/chat/roomListBg/pink.png);
                        }
                    }
                    &:nth-child(5) {
                        div{
                            background-image: url(/static/images/chat/roomListBg/blue.png);
                        }
                    }
                    &:nth-child(6) {
                        div{
                            background-image: url(/static/images/chat/roomListBg/purple.png);
                        }
                    }
                    &:nth-child(7) {
                        div{
                            background-image: url(/static/images/chat/roomListBg/blue.png);
                        }
                    }
                    &:nth-child(8) {
                        div {
                        background-image: url(/static/images/chat/roomListBg/blue.png);
                        }
                    }
                    &:nth-child(10) {
                        div{
                        background-image: url(/static/images/chat/roomListBg/pink.png);
                        }
                    }
                    &:nth-child(13) {
                        div{
                            background-image: url(/static/images/chat/roomListBg/blue.png);
                        }
                    }
                    &:nth-child(14) {
                        div{
                        background-image: url(/static/images/chat/roomListBg/purple.png);
                        }
                    }
                    &:nth-child(15) {
                        div {
                            background-image: url(/static/images/chat/roomListBg/blue.png);
                        }
                    }
                    &:nth-child(16) {
                        div {
                            background-image: url(/static/images/chat/roomListBg/blue.png);
                        }
                    }
                    &:nth-child(20) {
                        div{
                            background-image: url(/static/images/chat/roomListBg/orange.png);
                        }
                    }
                }
            }
    }
    @media only screen and (max-width: 1750px) {
          .room-list {
              ul {
                  li {
                      width:33.333333%;
                  }
              }
          }
    }
    @media only screen and (max-width: 1550px) {
          .room-list {
              ul {
                  li {
                      width:50%;
                  }
              }
          }
    }
    @media only screen and (max-width: 1350px) {
          .room-list {
              ul {
                  li {
                      width: 100%;
                  }
              }
          }
    }
    }
</style>
