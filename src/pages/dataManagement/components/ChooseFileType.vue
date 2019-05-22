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
import { createBookmark } from '@/API/Bookmark'

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
          // 新增bookmark
          // createBookmark(this.bookmarkInfo)
          //   .then(res => {
          //     this.$store.commit('dataManagement/updateBookmarkInfo', {
          //       bookmarkId: res.bookmark,
          //       storageId: res.storage,
          //       ...this.bookmarkInfo
          //     })
          //     this.$store.commit('dataManagement/updateFileTypeChosen', true)
          //   })
          this.$store.commit('dataManagement/updateBookmarkInfo', {
            bookmarkId: '1',
            storageId: '2',
            ...this.bookmarkInfo
          })
          this.$store.commit('dataManagement/updateFileTypeChosen', true)
        }
      })
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
    padding: 52px 0 176px;
  }

  .file-type-select-block {
    position: relative;
    margin-bottom: 92px;
  }

  .file-type-select {
    width: 100%;
  }

  .file-info-input-block {
    position: relative;
    flex: 1;

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
