<template>
  <div class="choose-file-type">
    <div class="dialog-title">新增资料</div>
    <div class="dialog-body">
      <div class="input-block-container">
        <div class="input-block file-type-select-block"
          :class="{'has-error': errors.has('fileTypeSelect')}"
        >
          <sy-select class="file-type-select"
            name="fileTypeSelect"
            :selected="bookmarkInfo.type"
            :items="fileTypeList"
            placeholder="选择资料类型"
            @update:selected="bookmarkTypeChange"
            v-validate="'required'"
          ></sy-select>
          <div class="error-text">请先选择资料类型</div>
        </div>
        <input-block class="file-info-input-block"
          v-if="!currentBookmarkInfo"
          label="资料源名称"
          name="dataSourceName"
          v-model="bookmarkInfo.name"
          v-validate="'required'"
        ></input-block>
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
import InputBlock from '@/components/InputBlock'
import { createBookmark, createBookmarkStorage } from '@/API/Bookmark'

export default {
  inject: ['$validator'],
  name: 'ChooseFileType',
  components: {
    SySelect,
    InputBlock
  },
  data () {
    return {
      bookmarkInfo: {
        name: null,
        type: null
      },
      typeList: [
        {
          name: 'CSV',
          id: 'CSV'
        },
        {
          name: 'MySQL',
          id: 'mysql'
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
            let storageType = this.getStorageType(this.bookmarkInfo.type)
            promise = createBookmarkStorage(this.currentBookmarkInfo.id, storageType)
            // 將 name 塞進去
            this.bookmarkInfo.name = this.currentBookmarkInfo.name
          } else {
            /**
             * 新增bookmark
             * 這邊得這樣處理是因為，後端 MySQL 跟 SQLITE 在這邊送一樣的值，但是在後面連線的時候又要區分開來
             **/
            promise = createBookmark({
              name: this.bookmarkInfo.name,
              type: this.getStorageType(this.bookmarkInfo.type)
            })
          }

          promise.then(res => {
            this.$store.commit('dataManagement/updateCurrentUploadInfo', {
              bookmarkId: res.bookmark.id,
              storageId: res.storage.id,
              ...this.bookmarkInfo
            })
          })
        }
      })
    }
  },
  computed: {
    currentBookmarkInfo () {
      return this.$store.state.dataManagement.currentBookmarkInfo
    },
    fileTypeList () {
      if (this.currentBookmarkInfo) {
        return this.typeList.filter(element => {
          return element.id === this.currentBookmarkInfo.type
        })
      } else {
        return this.typeList
      }
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
