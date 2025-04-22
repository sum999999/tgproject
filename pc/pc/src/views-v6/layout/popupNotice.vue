<template>
    <div class="popup-notice">
        <modal
                :modalShow='showModal'
                :title="$tex('网站公告')"
                :okText="$tex('设置')"
                width="800"
                claName="popup-notice-modal"
                @btn-cancel="showModal = false"
        >
            <div slot="content">
<!--                <img class="bg" src="~@/assets/images-v3/popup_notice_bg/ylcfg.png" alt="">-->
                <ul>
                    <li
                            v-for="(item, idx) in list"
                            :key="idx"
                            :class="{active: currentId === item.essayId}"
                            @click="changeData(item)"
                    >
                        {{item.title}}
                    </li>
                </ul>
                <div class="cont">
                    <div class="title">{{currentData.title}}</div>
                    <div
                            class="detail"
                            v-html="escapeHtml(currentData.content)"
                    ></div>
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
    import modal from "@/components/modal.vue";
    import util from "@/utils/utils";
    export default {
        components: { modal },
        data() {
            return {
                showModal: false,
                list: [],
                currentData: "",
                currentId: ""
            };
        },
        methods: {
            escapeHtml(str) {
                if (str) {
                    return util.escapeHtml(str);
                }
            },
            changeData(item) {
                this.currentData = item;
                this.currentId = item.essayId;
            }
        },
        created() {
            let firstTime = sessionStorage.getItem("firstTime");
            if (firstTime) return;
          this.$store.dispatch("queryAnnounceEssayList", { type: '03' }).then(response => {
                    if (response.data.code !== 0) return;
                    this.list = response.data.data.list;
                    if (this.list.length) {
                        this.currentData = this.list[0];
                        this.currentId = this.list[0].essayId;
                        this.showModal = true;
                        sessionStorage.setItem("firstTime", "isTrue");
                    }
                });
        }
    };
</script>

<style scoped lang="less">
    @deep: ~'>>>';

    @{deep} .popup-notice-modal{
        .bg {
            position: absolute;
            top: -171px;
            right: -26px;
            width: 540px;
            z-index: -1;
        }
        .ivu-modal-content {
            position: relative;
            border: 1px solid #a6833f;
        }
        .ivu-modal-footer {
            display: none;
        }
        .ivu-modal-body {
            padding: 0;
            height: 430px;
            background: #2a2a2a;
            color: #fff;
        }
        .ivu-modal-header {
            color: #5b3b0e;
            background-image: linear-gradient(to top, #795d1b, #aa8743 40%, #f7df99);
        }
        .ivu-modal-body ul {
            height: 430px;
            width: 240px;
            overflow-y: auto;
            background: #2a2a2a;
            border-right: 1px solid #a6833f;
            float: left;
        }
        .ivu-modal-body ul li {
            height: 38px;
            line-height: 38px;
            font-size: 12px;
            border-bottom: 1px dashed #a6833f;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            position: relative;
            padding-left: 20px;
            padding-right: 10px;
            cursor: pointer;
        }
        .ivu-modal-body ul li:last-child {
            border: 0;
        }
        .ivu-modal-body ul li::before {
            content: "";
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #ddc17c;
            position: absolute;
            left: 5px;
            top: 15px;
        }
        .ivu-modal-body ul li:hover,
        .ivu-modal-body ul li.active {
            /*  color: #be1204; */
            color: #ddc17c;
        }
        .ivu-modal-body .cont {
            float: right;
            width: 558px;
        }
        .ivu-modal-body .cont .title {
            font-size: 20px;
            height: 60px;
            line-height: 60px;
            border-bottom: 1px solid #a6833f;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #ddc17c;
        }
        .ivu-modal-body .cont .detail {
            padding: 10px;
            height: 368px;
            overflow-y: auto;
        }
        .ivu-modal-body .cont .detail p {
            font-size: 14px !important;
        }
    }
</style>
