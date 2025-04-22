<template>
    <modal :modalShow='isShow'
           :title="$tex('发送')"
           claName="unBoxingSnedModal"
           :width="330"
           :hasHeader="true"
           :hasFooter="true"
           :maskClosable="true"
           :hasOkBtn="true"
           :hasNoBtn="true"
           :okText="$tex('确认')"
           @btn-ok="onOk"
           @btn-cancel="onCancel">
        <template slot="content">
            <Spin size="large" fix v-if="loading"></Spin>
            <CheckboxGroup v-model="ryRoomIds">
                <Scroll height="330" :on-reach-bottom="handleReachBottom">
                    <div class="share-item" v-for="(record, idx) in chatRoom.records" :key="record.ryChatRoomId">
                        <Checkbox :label="record.ryChatRoomId">
                            <div class="share-item__content">
                                <img src="~@/assets/images/kefu.png">
                                <span>{{record.roomName}}</span>
                            </div>
                        </Checkbox>
                    </div>
                </Scroll>
            </CheckboxGroup>
        </template>
    </modal>
</template>

<script>
    import modal from "@/components/modal.vue";

    export default {
        name: "unBoxingSendModal",
        components: {modal},
        props: {
            value: {
                type: Boolean,
                default: false
            },
            loading: {
                type: Boolean,
                default: false
            },
            userBettingRecordId: ""
        },
        data() {
            return {
                isShow: this.value,
                ryRoomIds: [],
                chatRoom: {
                    total: 0,
                    current: 1,
                    pages: 1,
                    size: 10,
                    records: [
                        // "roomId":"1155805005752619009",
                        // "roomName":"jerry",
                        // "roomType":"lottery",
                        // "roomNo":"89102612",
                        // "roomDesc":"怀彼佳人兮以虚室，恐日迟迟兮成蹉跎！",
                        // "roomIcon":"https://cdn.haobinfen.com/d23bf8df-bd47-42ac-b291-234e39817492.jpg",
                        // "chatIcon":"https://cdn.haobinfen.com/fed8b499-0c8f-4831-ad5f-96456a7bfe0d.png",
                        // "ryChatRoomId":"childroom_1155805005752619009",
                        // "openLevel":"-1|1164544995391188993|1011931473037807617|1050240705201819650|944486420864311297|904282295733053000|904282295993053185|904282431594564000|904282431594563000|1050245068548853762|1050245244646707202|1050245380206612481|974967957752893442",
                        // "passwordLevel":"",
                        // "bankLevel":"",
                        // "type":"1",
                        // "virtualPeopleMin":100,
                        // "virtualPeopleMax":300,
                        // "onlineAmount":null,
                        // "roomPassword":"false",
                        // "banSpeakTime":"",
                        // "forbidPrivateChat":"0",
                        // "chatListTopUserId":null,
                        // "sysMessage":null,
                        // "quickDialogue":"0"
                    ]
                }
            }
        },
        watch: {
            value(value) {
                this.isShow = value;
                if (value) {
                    this.queryLotteryChatRooms({
                        current: 1,
                        size: 10
                    });
                }
            },
            isShow(value) {
                if (value !== this.value) {
                    this.$emit("input", value);
                }
            }
        },
        created() {
            this.queryLotteryChatRooms({
                current: 1,
                size: 10
            });
        },
        methods: {
            async onOk() {
                if (!this.ryRoomIds.length) {
                    return this.$Message.error('请选择你要发送的聊天室！');
                }
                this.$emit("send-click", this.ryRoomIds.join(","));
            },
            onCancel() {
                this.isShow = false;
            },
            async handleReachBottom() {
                const {current, size, pages} = this.chatRoom;
                if (current < pages) {
                    this.chatRoom.current++;
                    await this.queryLotteryChatRooms({current: this.chatRoom.current, size});
                }
            },
            async queryLotteryChatRooms({current, size}) {
                if (current === 1) {
                    this.chatRoom.records = []
                }
                const curChatRoom = await this.$store.dispatch("queryLotteryChatRooms", {current, size, userBettingRecordId: this.userBettingRecordId});
                const preRecords = this.chatRoom.records;
                const curRecords = curChatRoom.records;
                return this.chatRoom = {
                    ...curChatRoom,
                    records: [
                        ...preRecords,
                        ...curRecords
                    ]
                }
            }
        }
    }
</script>

<style scoped>
    .share-item span {
        font-size: 14px;
    }

    .share-item >>> .ivu-checkbox {
        float: left;
        line-height: 60px;
        margin-right: 10px;
    }

    .share-item__content {
        line-height: 54px;
        margin-left: 26px;
        border-bottom: 1px solid #f2f2f2;
    }

    .share-item__content img {
        width: 25px;
        height: 25px;
        float: none;
        vertical-align: middle;
        margin-right: 20px;
    }

    .ivu-checkbox-wrapper {
        width: 100%;
        margin-right: 0;
    }

    .share-item >>> .ivu-checkbox-inner {
        border-radius: 100%;
        width: 16px;
        height: 16px;
    }

    .share-item >>> .ivu-checkbox-inner:after {
        width: 5px;
        height: 9px;
        top: 2px;
        left: 4px;
    }

    .v-transfer-dom >>> .unBoxingSnedModal .ivu-modal-header {
        text-align: left;
    }

    .v-transfer-dom >>> .unBoxingSnedModal .ivu-modal-body {
        padding-right: 0;
        padding-top: 0;
    }
</style>
