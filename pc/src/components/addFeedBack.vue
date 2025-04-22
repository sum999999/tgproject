<template>
  <div>
    <modal
      :modalShow='showAddFeedBack'
      :hasFooter="false"
      :hasNoBtn="false"
      :okText="$tex('提交')"
      :title="$tex('意见反馈')"
      width="522"
      :claName="`add-feed-back-dialog ${className}`"
      @btn-cancel="close"
    >
      <div
        slot="content"
        class="form"
      >
        <Spin
          size="large"
          fix
          v-if="spinShow"
        ></Spin>
        <div class="form-item">
          <p class="label">{{$tex("标题")}}</p>
          <Input
            v-model="title"
            :maxlength="25"
            :placeholder="$tex('请输入25字以内的反馈标题')"
            style="width: 100%"
          />
        </div>
        <div class="form-item">
          <p class="label">{{$tex("反馈类型")}}</p>
          <Select
            v-model="selectCate"
            style="width:100px"
          >
            <Option
              v-for="item in cates"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </div>
        <div class="form-item content-area">
          <div class="label clearfix">
            {{$tex("内容")}}
            <div class="ivu-upload ivu-upload-select">
              <input
                ref="upload-image-input"
                accept="image/png,image/gif,image/jpeg"
                type="file"
                class="ivu-upload-input"
                @change="uploadImgChange"
              />
              <button
                type="button"
                class="ivu-btn ivu-btn-ghost"
                @click="uploadImage"
              >
                <i class="ivu-icon ivu-icon-ios-cloud-upload-outline"></i>
                <span>{{$tex("点击上传图片")}}</span>
              </button>
            </div>
          </div>
          <Input
            v-model="content"
            type="textarea"
            :autosize="{minRows: 4,maxRows: 4}"
            :maxlength="100"
            :placeholder="$tex('请输入100字以内的反馈内容')"
          />
          <div
            class="upload-img"
            v-if="uploadImgObject.preview"
          >
            <img :src="uploadImgObject.preview">
            <div class="upload-img-cover">
              <i
                class="ivu-icon ivu-icon-ios-eye-outline"
                @click="onImgPreview"
              ></i>
              <i
                class="ivu-icon ivu-icon-ios-trash-outline"
                @click="onUploadImgClear"
              ></i>
            </div>
          </div>
        </div>
        <div class="bottom">
          <Button
            type="primary"
            @click.stop="submit"
            :disabled="disabledBtn"
            v-preventReClick="2000"
          >{{$tex("提交")}}</Button>
        </div>
      </div>
    </modal>
    <modal
      :title="$tex('图片预览')"
      claName="perview-img"
      :modalShow="isShowImgPreview"
      :scrollable="true"
      :hasFooter="false"
      :hasOkBtn="false"
      :hasNoBtn="false"
      @btn-cancel="onImgPreviewCancel"
    >
      <div slot="content">
        <img
          :src="uploadImgObject.preview"
          style="width: 100%;float: none;"
        >
      </div>
    </modal>
  </div>
</template>

<script>
import modal from '@/components/modal.vue'
import * as CmsApi from '@/api/cms'
import Utils from '@/utils/utils'
import * as ImgUtil from '@/utils/img'

export default {
  props: {
    showAddFeedBack: {
      default: false,
      type: Boolean,
    },
    className: {
      default: '',
      type: String,
    },
  },
  components: {
    modal,
  },
  data() {
    return {
      spinShow: false,
      selectCate: '01',
      title: '',
      content: '',
      cates: [
        {
          label: this.$tex('产品bug'),
          value: '01',
        },
        {
          label: this.$tex('吐槽'),
          value: '02',
        },
        {
          label: this.$tex('功能建议'),
          value: '03',
        },
        {
          label: this.$tex('其它'),
          value: '04',
        },
      ],
      uploadImgObject: {
        preview: '',
        file: null,
        fileBolb: null,
      },
      isShowImgPreview: false,
    }
  },
  computed: {
    disabledBtn() {
      return !this.title || !this.content
    },
  },
  methods: {
    onImgPreview() {
      this.isShowImgPreview = true
    },
    onImgPreviewCancel() {
      this.isShowImgPreview = false
    },
    onUploadImgClear() {
      this.uploadImgObject.preview = ''
      this.uploadImgObject.file = null
      this.uploadImgObject.bolb = null
    },
    async uploadImgChange(event) {
      const target = event.target || event.srcElement
      const files = target.files
      const file = files[0]
      if (!file) {
        return this.$Message.success(this.$tex('图片不能为空'))
      }
      const imgBlob = await ImgUtil.zipImgPromise(file, file.type)
      if (imgBlob.size > 1024 * 1024 * 4) {
        return this.$Message.info(this.$tex('图片不能超过{num}M', { num: 4 }))
      }
      this.uploadImgObject.preview = Utils.createObjectURL(file)
      this.uploadImgObject.file = file
      this.uploadImgObject.fileBolb = imgBlob
      const uploadImgInput = this.$refs['upload-image-input']
      uploadImgInput.value = null
    },
    uploadImage() {
      if (this.uploadImgObject.preview) {
        return this.$Message.info(this.$tex('已存在上传图片，请先删除后再上传！'))
      }
      const uploadImgInput = this.$refs['upload-image-input']
      uploadImgInput.click()
    },
    close() {
      this.$emit('close-add-feed-back')
    },
    async submit() {
      this.spinShow = true
      const { PLATFORM_FLAG } = await this.$store.dispatch('querySystemConfig')
      let uploadImgUrl = ''
      if (this.uploadImgObject.preview) {
        const formData = new FormData()
        formData.append('imagefiles', this.uploadImgObject.fileBolb, this.uploadImgObject.file.name)
        formData.append('flag', PLATFORM_FLAG)
        const qiniuRes = await CmsApi.upload2qiniu(formData)
        const { code, data = [] } = qiniuRes.data
        if (code !== 0) {
          return (this.spinShow = false)
        }
        const urlObj = data[0] || {}
        uploadImgUrl = urlObj.url
      }
      const feedBackRes = await this.$http.post(
        '/api/v2/user/addCustomerFeedback',
        {
          title: this.title,
          content: this.content,
          type: this.selectCate,
          attachment: uploadImgUrl,
        },
        { userId: true }
      )
      this.spinShow = false
      if (feedBackRes.data.code !== 0) return
      this.close()
      this.$Message.success(this.$tex('提交成功'))
    },
  },
}
</script>

<style lang="less" scoped>
@deep: ~'>>>';

.ivu-upload {
  float: right;
}

.ivu-btn-ghost {
}

.v-transfer-dom {
  @{deep} .perview-img {
    .ivu-modal {
      top: 100px;
      transform: translateY(0);
    }
  }
  @{deep} .add-feed-back-dialog {
    .ivu-modal-body {
      background-color: #f5f5f5;

      .form-item {
        position: relative;
        margin-bottom: 6px;

        .label {
          padding-left: 6px;
          margin-bottom: 6px;
        }

        .ivu-select-selection {
          text-align: center;
        }

        .ivu-select-dropdown-list {
          text-align: center;
        }
      }

      .form-item.content-area {
        .label {
          line-height: 30px;
        }

        textarea {
          padding-bottom: 58px;
          height: 148px !important;
          min-height: 148px !important;
          max-height: 148px !important;
        }

        .upload-img {
          width: 100px;
          height: 50px;
          line-height: 50px;
          text-align: center;
          position: absolute;
          left: 8px;
          bottom: 8px;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
          border-radius: 4px;
          img {
            width: 100%;
            height: 100%;
          }
          &:hover .upload-img-cover {
            display: block;
          }
          .upload-img-cover {
            display: none;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.6);
            i {
              color: #fff;
              font-size: 20px;
              cursor: pointer;
              margin: 0 2px;
            }
          }
        }
      }

      .bottom {
        margin-top: 18px;
        text-align: center;

        button {
          width: 76px;
          height: 30px;
        }
      }
    }

    .ivu-modal-footer {
      padding: 0;
      background-color: #f5f5f5;
    }
  }
}
</style>
