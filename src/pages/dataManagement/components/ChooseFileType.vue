<template>
  <div class="choose-file-type">
    <div class="dialog-title">新增資料</div>
    <div class="dialog-body">
      <div class="input-block-container">
        <div class="input-block file-type-select-block"
          :class="{'has-error': errors.has('fileTypeSelect')}"
        >
          <sy-select class="file-type-select"
            name="fileTypeSelect"
            :selected="bookmarkInfo.type"
            :items="fileTypeList"
            placeholder="選擇資料類型"
            @update:selected="bookmarkTypeChange"
            v-validate="'required'"
          ></sy-select>
          <div class="error-text">請先選擇資料類型</div>
        </div>
        <div class="input-block file-info-input-block"
          v-if="!currentBookmarkInfo"
          :class="{'has-error': errors.has('dataSourceName')}"
        >
          <input type="text" class="input file-source-input"
            name="dataSourceName"
            v-model.trim="bookmarkInfo.name"
            placeholder="輸入資料源名稱"
            v-validate="'required'"
          >
          <div class="error-text">請先選擇資料類型</div>
        </div>
      </div>
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button class="btn btn-outline"
          @click="cancelFileUpload"
        >取消</button>
        <button class="btn btn-default"
          @click="nextStep"
        >下一步</button>
      </div>
    </div>
  </div>
</template>
<script>
import SySelect from '@/components/select/SySelect'
import { createBookmark, createBookmarkStorage } from '@/API/Bookmark'

export default {
  inject: ['$validator'],
  name: 'ChooseFileType',
  components: {
    SySelect
  },
  data () {
    return {
      bookmarkInfo: {
        name: null,
        type: null
      },
      fileTypeList: [
        {
          name: 'CSV',
          id: 'CSV'
        }
      ]
    }
  },
  watch: {
    'bookmarkInfo.type' (value) {
      this.$validator.validate('fileTypeSelect', value)
    }
  },
  methods: {
    bookmarkTypeChange (id) {
      this.bookmarkInfo.type = id
    },
    cancelFileUpload () {
      this.$store.commit('dataManagement/updateShowCreateDataSourceDialog', false)
    },
    nextStep () {
      this.$validator.validateAll().then(result => {
        if (result) {
          let promise
          if (this.currentBookmarkInfo) {
            // 編輯 bookmark 取得 storageId
            promise = createBookmarkStorage(this.currentBookmarkInfo.id, this.bookmarkInfo.type)
            // 將 name 塞進去
            this.bookmarkInfo.name = this.currentBookmarkInfo.name
          } else {
            // 新增bookmark
            promise = createBookmark(this.bookmarkInfo)
          }

          promise.then(res => {
            this.$store.commit('dataManagement/updateCurrentUploadInfo', {
              bookmarkId: res.bookmark.id,
              storageId: res.storage.id,
              ...this.bookmarkInfo
            })
            this.$store.commit('dataManagement/updateFileTypeChosen', true)
          })
        }
      })
    }
  },
  computed: {
    currentBookmarkInfo () {
      return this.$store.state.dataManagement.currentBookmarkInfo
    }
  }
}
</script>
<style lang="scss" scoped>
.choose-file-type {
  .dialog-body {
    background: #FAFAFA;
    margin-bottom: 16px;
  }

  .input-block-container {
    width: 53.41%;
    margin: 0 auto;
    // padding: 52px 0 176px;

    padding-bottom: 176px;
    height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    .input-block {
      &:not(:last-child) {
        margin-bottom: 92px;
      }
    }
  }

  .file-type-select-block {
    position: relative;
  }

  .file-type-select {
    width: 100%;
  }

  .file-info-input-block {
    position: relative;

    .file-source-input {
      height: 40px;
    }
  }

  .upload-input-label {
    position: absolute;
    top: -21px;
    font-size: 14px;
    line-height: normal;
    letter-spacing: 0.5px;
    color: #979797;
  }
}
</style>
