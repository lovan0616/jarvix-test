<template>
  <div class="file-upload-finished">
    <div class="dialog-title">
      <span v-if="uploadFileList.length === successList.length">上传成功</span>
      <span v-else-if="uploadFileList.length === failList.length">上传失败</span>
      <span v-else>上传完成</span>
    </div>
    <div class="finished-img-block">
      <img v-if="uploadFileList.length === successList.length" src="../../../assets/images/success.gif" alt="上传成功" class="finished-img">
      <img v-if="uploadFileList.length === failList.length" src="../../../assets/images/error.gif" alt="上传失敗" class="finished-img">
      <div class="finished-file-info">总共 {{uploadFileList.length}} 项资料表，{{ successList.length }} 项上传成功， {{ failList.length }} 项未上传</div>
    </div>
    <div class="dialog-body">
      <file-list-block
        v-if="successList.length > 0"
        title="已上传"
        :file-list="successList"
      >
        <div class="uploaded-data-info" slot="fileListTitle">资料类型：{{ currentUploadInfo.type }} 资料源名称：{{ currentUploadInfo.name }}</div>
      </file-list-block>
      <file-list-block
        v-if="failList.length > 0"
        title="未上传"
        type="fail"
        :file-list="failList"
      ></file-list-block>
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button class="btn btn-default"
          @click="buildBookmark"
        >我知道了</button>
      </div>
    </div>
  </div>
</template>
<script>
import { uploadStatus } from '@/utils/general'
import { mapState } from 'vuex'
import FileListBlock from './FileListBlock'

export default {
  name: 'LocalFileUploadFinished',
  components: {
    FileListBlock
  },
  data () {
    return {
      uploadStatus
    }
  },
  methods: {
    buildBookmark () {
      // close fileUploadDialog
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
      this.$store.dispatch('bookmark/getBookmarkList')
    }
  },
  computed: {
    ...mapState('dataManagement', ['currentUploadInfo', 'uploadFileList']),
    successList () {
      return this.uploadFileList.filter(element => {
        return element.status === uploadStatus.success
      })
    },
    failList () {
      return this.uploadFileList.filter(element => {
        return element.status === uploadStatus.fail
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.file-upload-finished {
  .dialog-title {
    margin-bottom: 32px;
  }
  .finished-img-block {
    text-align: center;
    margin-bottom: 44px;
  }
  .finished-img {
    width: 70px;
    margin-bottom: 32px;
  }
  .finished-file-info {
    line-height: 20px;
  }
  .uploaded-data-info {
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.5px;
  }
}
</style>
