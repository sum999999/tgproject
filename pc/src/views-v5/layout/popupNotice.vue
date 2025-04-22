<template>
    <div class="popup-notice">
        <modal
                :modalShow='showModal'
                title="系统公告"
                okText="设置"
                width="800"
                claName="popup-notice-modal"
                @btn-cancel="showModal = false"
        >
            <div slot="content">
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
          this.$store.dispatch("queryAnnounceEssayList", { type: "03" }).then(response => {
                    if (response.data.code !== 0) return;
                    // console.log(response.data.data);
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
        .ivu-modal-content {
            overflow: hidden;
        }
        .ivu-modal-footer {
            display: none;
        }
        .ivu-modal-body {
            padding: 0;
            height: 430px;
        }
        .ivu-modal-header {
            color: #fff;
        }
        .ivu-modal-body ul {
            height: 430px;
            width: 240px;
            overflow-y: auto;
            background: #f2f2f2;
            border-right: 1px solid #ccc;
            float: left;
        }
        .ivu-modal-body ul li {
            height: 38px;
            line-height: 38px;
            font-size: 12px;
            border-bottom: 1px dashed #ccc;
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
            /*   background: #be1204; */
            position: absolute;
            left: 5px;
            top: 15px;
        }
        .ivu-modal-body ul li:hover,
        .ivu-modal-body ul li.active {
            /*  color: #be1204; */
        }
        .ivu-modal-body .cont {
            float: right;
            width: 558px;
        }
        .ivu-modal-body .cont .title {
            font-size: 20px;
            height: 60px;
            line-height: 60px;
            border-bottom: 1px solid #ccc;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
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
