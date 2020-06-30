<template>
  <confirm-dialog 
    :title="$t('remoteConnection.sqlCreateTable')"
    class="edit-sql-dialog"
    @close="cancel"
  >
    <div 
      slot="dialogBody" 
      class="content">
      <div class="table-name-block dialog-input-block">
        <label 
          for="tableName" 
          class="dialog-input-label">{{ $t('remoteConnection.dataFrameName') }}</label>
        <input-verify
          v-validate="`required|max:${max}`"
          v-model.trim="editSqlInfo.creatingSqlName"
          class="table-name-input"
          name="tableName"
        />
      </div>
      <div class="sql-content-block dialog-input-block">
        <label 
          for="sqlContnet"
          class="dialog-input-label"
        >{{ $t('remoteConnection.sql') }}</label>
        <textarea 
          v-validate="`required`" 
          id="sqlContnet"
          v-model.trim="editSqlInfo.creatingSql" 
          rows="5"
          label="SQL"
          class="sql-content-input"
          name="sqlContnet"
        />
        <div
          v-show="errors.has('sqlContnet')"
          class="error-text"
        >{{ errors.first('sqlContnet') }}</div>
      </div>
    </div>
    <template 
      slot="dialogFooter" 
      class="dialog-btn-block">
      <button 
        type="button" 
        class="btn btn-outline"
        @click="cancel"
      >{{ $t('button.cancel') }}</button>
      <button 
        :disabled="isProcessing" 
        type="button"
        class="btn btn-default"
        @click="confirm"
      >
        <span v-if="isProcessing"><svg-icon icon-class="spinner"/>{{ $t('button.testConnecting') }}</span>
        <span v-else>{{ $t('button.confirm') }}</span>
      </button>
    </template>
  </confirm-dialog>
</template>
<script>
import ConfirmDialog from '@/components/dialog/ConfirmDialog'
import InputBlock from '@/components/InputBlock'
import InputVerify from '@/components/InputVerify'
import { Message } from 'element-ui'
import { testCreateTableSql } from '@/API/RemoteConnection'

export default {
  name: 'EditSqlDialog',
  inject: ['$validator'],
  components: {
    ConfirmDialog,
    InputBlock,
    InputVerify
  },
  props: {
    connectionId: {
      type: Number,
      default: null
    },
    editIndex: {
      type: Number,
      default: null
    },
    sqlInfo: {
      type: Object,
      default: () => null
    },
    tableList: {
      type: Array,
      default: () => []
    },
    sqlTableList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      editSqlInfo: {
        creatingSqlName: null,
        creatingSql: null
      },
      isProcessing: false
    }
  },
  computed: {
    max () {
      return this.$store.state.validation.fieldCommonMaxLength
    }
  },
  mounted () {
    if (this.editIndex !== null) this.editSqlInfo = JSON.parse(JSON.stringify(this.sqlTableList[this.editIndex]))
  },
  methods: {
    confirm () {
      this.$validator.validateAll().then(result => {
        if (!result) return
        if (this.tableList.some(element => element === this.editSqlInfo.creatingSqlName)
        || this.sqlTableList.some(element => element.creatingSqlName === this.editSqlInfo.creatingSqlName)) {
          Message({
            message: this.$t('remoteConnection.tableNameDuplicate'),
            type: 'warning',
            duration: 3 * 1000
          })
          return false
        }
        this.isProcessing = true
        // 測試 SQL
        testCreateTableSql(this.connectionId, this.editSqlInfo.creatingSql).then(() => {
          this.$emit('confirm', this.editSqlInfo)
        }).finally(() => {
          this.isProcessing = false
        })
      })
    },
    cancel () {
      this.$emit('cancel')
    }
  },
}
</script>
<style lang="scss" scoped>
.edit-sql-dialog {
  .dialog-input-block {
    text-align: left;
  }

  .sql-content-input {
    width: 100%;
    background-color: rgba(0, 0, 0, 0.55);
    border-radius: 8px;
    padding: 8px;
  }

  .dialog-input-label {
    display: block;
    margin-bottom: 4px;
  }

  .dialog-btn-block {
    text-align: right;
  }
}
</style>
