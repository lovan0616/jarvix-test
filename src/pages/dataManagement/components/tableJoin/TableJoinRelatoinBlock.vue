<template>
  <div class="single-join-table">
    <div class="button-block">
      <span
        v-if="relationInfo.state === 'Process'"
        class="spinner"
      >
        <svg-icon icon-class="spinner" />
      </span>
      <template v-else>
        <button
          v-if="relationInfo.id && isEditing"
          :disabled="isLoading"
          class="btn btn-secondary"
          @click="deleteJoinTable()"
        >
          {{ $t('button.delete') }}
        </button>
        <button
          v-if="isEditing && !relationInfo.id"
          type="button"
          class="btn btn-outline"
          @click="cancelAddingJoinTable()"
        >
          {{ $t('button.cancel') }}
        </button>
        <button
          v-if="!isEditing"
          type="button"
          class="btn btn-outline"
          @click="toggleIsEditing()"
        >
          {{ $t('button.edit') }}
        </button>
        <button
          v-if="isEditing && relationInfo.id"
          type="button"
          class="btn btn-outline"
          @click="cancelEdit()"
        >
          {{ $t('button.close') }}
        </button>
      </template>
    </div>
    <div
      v-if="!isEditing"
      class="title-block"
    >
      <el-tooltip
        :content="relationInfo.name"
        placement="bottom"
      >
        <h3 class="table-name">
          {{ relationInfo.name }}
        </h3>
      </el-tooltip>
      <h6 class="join-type">
        {{ $t('editing.joinType') }}
        <span
          v-for="(relation, relationIndex) in relationInfo.dataFrameRelationList"
          :key="relationIndex"
        >{{ getJoinTypeName(relation.joinType) }}</span>
      </h6>
    </div>
    <template v-else>
      <div
        :class="{'is-editing': isEditing, 'disabled': isPreviewingResult, 'invalid': errors.has(relationInfo.key)}"
        class="input-block"
      >
        <label
          for=""
          class="label"
        >*{{ $t('editing.tableName') }}</label>
        <input-block
          v-validate="`required|max:${max}`"
          v-if="!relationInfo.id"
          :placeholder="$t('editing.pleaseEnterName')"
          :disabled="isPreviewingResult"
          :name="relationInfo.key"
          v-model="editedRelationInfo.name"
          type="text"
        />
        <div
          v-else
          class="name"
        >
          {{ relationInfo.name }}
        </div>
      </div>
      <section
        :class="{'disabled': isPreviewingResult}"
        class="join-relation-list"
      >
        <div
          v-for="(relation, relationIndex) in editedRelationInfo.dataFrameRelationList"
          :key="relationIndex"
          class="join-relation"
        >
          <div
            :class="{'is-editing': isEditing}"
            class="input-block select"
          >
            <label class="label">{{ $t('editing.joinType') }}</label>
            <default-select
              v-model="relation.joinType"
              :option-list="joinTypeOptions"
              :is-disabled="isPreviewingResult"
              :placeholder="$t('editing.selectJoinType')"
              class="join-type-select input"
            />
          </div>
          <div class="correlation-block">
            <relation-select-block
              :data-frame-list="dataFrameList"
              :initial-data-frame-id.sync="relation.leftDataFrame.id"
              :data-column="relation.leftDataColumn"
              :index="relationIndex"
            />
            <svg-icon
              icon-class="table-correlation"
              class="correlation-icon"
            />
            <relation-select-block
              :data-frame-list="dataFrameList"
              :initial-data-frame-id.sync="relation.rightDataFrame.id"
              :data-column="relation.rightDataColumn"
              :index="relationIndex"
            />
          </div>
        </div>
      </section>
      <div
        v-if="!isPreviewingResult"
        class="reminder-block"
      >
        <span class="reminder-title">
          <svg-icon icon-class="lamp" />
          {{ $t('resultDescription.prompt') }}：
        </span>
        <span class="reminder-description">
          {{ '1. ' + $t('message.remindNotAllowSelfJoin') + ' 2. ' + $t('message.remindSameDataTypeColumns') }}
        </span>
      </div>
      <preview-table-join-result
        v-else
        :result="previewResultData"
      />
      <div class="footer-button-block">
        <template v-if="!isPreviewingResult">
          <button
            v-if="!isLoading"
            :disabled="isLoading"
            type="button"
            class="btn btn-default"
            @click="getPreviewResult()"
          >
            {{ $t('button.setting') }}
          </button>
          <span
            v-else
            class="remark-text"
          >
            <svg-icon icon-class="spinner" /> {{ $t('editing.systemSetting') }}
          </span>
        </template>
        <template v-else>
          <button
            :disabled="isLoading"
            type="button"
            class="btn btn-outline"
            @click="isPreviewingResult = false"
          >
            {{ $t('button.reset') }}
          </button>
          <button
            :disabled="isLoading"
            type="button"
            class="btn btn-default"
            @click="relationInfo.id ? updateJoinTable() : buildJoinTable()"
          >
            {{ $t('button.confirmBuild') }}
          </button>
        </template>
      </div>
    </template>
    <div
      v-if="newTableCreated && !isEditing"
      class="reminder-block"
    >
      <span class="reminder-title">
        <svg-icon icon-class="lamp" />
        {{ $t('resultDescription.prompt') }}：
      </span>
      <span class="reminder-description">
        {{ '1. ' + $t('message.remindAdjustMainDate') }}
      </span>
      <span class="reminder-description">
        {{ '2. ' + $t('message.remindAdjustColumnAlias') }}
      </span>
    </div>
  </div>
</template>
<script>
import RelationSelectBlock from './RelationSelectBlock'
import TooltipDialog from '@/components/dialog/TooltipDialog'
import DefaultSelect from '@/components/select/DefaultSelect'
import PreviewTableJoinResult from './PreviewTableJoinResult'
import inputBlock from '@/components/InputBlock'
import { createJoinTable, updateJoinTable, deleteJoinTable, createJoinTablePreviewResult } from '@/API/JoinTable'
import { Message } from 'element-ui'

export default {
  name: 'TableJoinRelationBlock',
  inject: ['$validator'],
  components: {
    TooltipDialog,
    DefaultSelect,
    RelationSelectBlock,
    PreviewTableJoinResult,
    inputBlock
  },
  props: {
    relationInfo: {
      type: Object,
      required: true
    },
    dataFrameList: {
      type: Array,
      default: () => []
    },
    index: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      showConfirmDeleteDialog: false,
      isEditing: !this.relationInfo.id,
      isPreviewingResult: false,
      currentDataSourceId: parseInt(this.$route.params.id),
      isLoading: false,
      isPreviewing: false,
      newTableCreated: false,
      joinTypeOptions: [
        {
          name: 'Inner Join',
          value: 'Inner'
        },
        {
          name: 'Left Join',
          value: 'Left'
        },
        {
          name: 'Right Join',
          value: 'Right'
        }
      ],
      previewResultData: null,
      editedRelationInfo: JSON.parse(JSON.stringify(this.relationInfo))
    }
  },
  computed: {
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    }
  },
  methods: {
    checkDeleteRelations () {
      this.showConfirmDeleteDialog = true
    },
    cancelAddingJoinTable () {
      this.$emit('cancelAddingJoinTable', this.index)
    },
    cancelDelete () {
      this.showConfirmDeleteDialog = false
    },
    deleteJoinTable () {
      this.isLoading = true
      deleteJoinTable(this.relationInfo.id)
        .then(() => { this.$emit('deleteJoinTable', this.index) })
        .finally(() => { this.isLoading = false })
    },
    getDataFrameRelationList () {
      return this.editedRelationInfo.dataFrameRelationList.map(relation => ({
        joinType: relation.joinType,
        leftDataColumnId: relation.leftDataColumn.id,
        leftDataFrameId: relation.leftDataFrame.id,
        rightDataColumnId: relation.rightDataColumn.id,
        rightDataFrameId: relation.rightDataFrame.id
      }))
    },
    validateDataColumns () {
      if (!this.editedRelationInfo.name) {
        Message({
          message: this.$t('message.formColumnEmpty'),
          type: 'warning',
          duration: 3 * 1000,
          showClose: true
        })
        return false
      }
      for (let dataFrame of this.editedRelationInfo.dataFrameRelationList) {
        if (!dataFrame.leftDataColumn.id || !dataFrame.rightDataColumn.id) {
          Message({
            message: this.$t('message.formColumnEmpty'),
            type: 'warning',
            duration: 3 * 1000,
            showClose: true
          })
          return false
        }
        if (!dataFrame.joinType) {
          Message({
            message: this.$t('message.joinTypeEmpty'),
            type: 'warning',
            duration: 3 * 1000,
            showClose: true
          })
          return false
        }
        if (dataFrame.leftDataFrame.id === dataFrame.rightDataFrame.id) {
          Message({
            message: this.$t('message.remindNotAllowSelfJoin'),
            type: 'warning',
            duration: 3 * 1000,
            showClose: true
          })
          return false
        }
        if (dataFrame.leftDataColumn.dataType !== dataFrame.rightDataColumn.dataType) {
          Message({
            message: this.$t('message.remindSameDataTypeColumns'),
            type: 'warning',
            duration: 3 * 1000,
            showClose: true
          })
          return false
        }
      }
      return true
    },
    checkDataCount () {
      return localStorage.getItem('joinLimit') ? localStorage.getItem('joinLimit') === 'true' : true
    },
    getJoinTableData () {
      return {
        dataSourceId: this.currentDataSourceId,
        name: this.editedRelationInfo.name,
        dataFrameRelationList: this.getDataFrameRelationList(),
        isCheckDataCount: this.checkDataCount()
      }
    },
    updateRelationInfo (responseData) {
      this.relationInfo.id = this.relationInfo.id || responseData.joinTableId
      this.relationInfo.dataFrameId = this.relationInfo.dataFrameId || responseData.dataFrameId
      this.relationInfo.state = 'Process'
      this.relationInfo.name = this.editedRelationInfo.name
      this.relationInfo.dataFrameRelationList = this.editedRelationInfo.dataFrameRelationList
    },
    buildJoinTable () {
      this.$validator.validateAll().then((isValidate) => {
        if (!isValidate || !this.validateDataColumns()) return
        this.isLoading = true
        const joinTableData = this.getJoinTableData()
        createJoinTable(joinTableData)
          .then(response => {
            this.updateRelationInfo(response)
            this.isPreviewingResult = false
            this.toggleIsEditing()
            this.newTableCreated = true
            this.$emit('dataFrameUpdate')
            Message({
              message: this.$t('message.joinTableBuilding'),
              type: 'success',
              duration: 3 * 1000,
              showClose: true
            })
          })
          .finally(() => { this.isLoading = false })
      })
    },
    updateJoinTable () {
      this.$validator.validateAll().then((isValidate) => {
        if (!isValidate || !this.validateDataColumns()) return
        this.isLoading = true
        const joinTableData = {
          id: this.relationInfo.id,
          name: this.relationInfo.name,
          dataFrameRelationList: this.getDataFrameRelationList(),
          isCheckDataCount: this.checkDataCount()
        }
        updateJoinTable(joinTableData)
          .then(response => {
            this.updateRelationInfo()
            this.isPreviewingResult = false
            this.toggleIsEditing()
            this.$emit('dataFrameUpdate')
            Message({
              message: this.$t('message.joinTableBuilding'),
              type: 'success',
              duration: 3 * 1000,
              showClose: true
            })
          })
          .finally(() => { this.isLoading = false })
      })
    },
    getJoinTypeName (joinType) {
      return this.joinTypeOptions.find(option => option.value === joinType).name
    },
    toggleIsEditing () {
      this.isEditing = !this.isEditing
    },
    getPreviewResult () {
      this.$validator.validateAll().then((isValidate) => {
        if (!isValidate || !this.validateDataColumns()) return
        this.isLoading = true
        const joinTableData = this.getJoinTableData()
        createJoinTablePreviewResult(joinTableData)
          .then(previewResultData => {
            if (!previewResultData.valueList.length) {
              return Message({
                message: this.$t('message.noMatchedKey'),
                type: 'warning',
                duration: 3 * 1000,
                showClose: true
              })
            }
            this.previewResultData = previewResultData
            this.isPreviewingResult = true
          })
          .finally(() => { this.isLoading = false })
      })
    },
    cancelEdit () {
      this.toggleIsEditing()
      this.isPreviewingResult = false
      this.editedRelationInfo = JSON.parse(JSON.stringify(this.relationInfo))
    }
  }
}
</script>
<style lang="scss" scoped>
.single-join-table {
  position: relative;
  padding: 24px;
  border-radius: 4px;
  background-color: rgba(50, 58, 58, 0.95);

  &:not(:last-child) {
    margin-bottom: 12px;
  }

  &:last-child {
    margin-bottom: 16px;
  }

  .title-block {
    display: flex;
    justify-content: space-between;
    padding-right: 80px;

    .table-name,
    .join-type {
      margin: 0;
      line-height: 36px;
      font-weight: normal;
    }

    .table-name {
      font-size: 18px;
      flex: 1;
      @include text-hidden;
      margin-right: 16px;
    }

    .join-type {
      font-size: 14px;
      color: #DDDDDD;
    }
  }

  .input-block {
    width: 290px;
    display: inline-block;

    &.is-editing {
      margin-bottom: 17px;
    }

    &.invalid {
      margin-bottom: 30px;
    }

    &.select {
      position: absolute;
      top: 24px;
      left: 340px;
      width: 160px;
      .label {
        margin-bottom: 0;
      }
    }

    .label {
      display: block;
      font-size: 14px;
      line-height: 20px;
      color: #ccc;
      margin-bottom: 8px;
    }

    .input {
      height: 40px;
    }

    .name {
      line-height: 32px;
    }
  }

  .button-block {
    position: absolute;
    top: 24px;
    right: 24px;

    .spinner {
      display: inline-block;
      width: 76px;
      text-align: center;
      line-height: 36px;
    }

    .btn:not(:last-child) {
      margin-right: 7px;
    }
  }

  .confirm-delete-dialog {
    right: 0;
  }

  .join-relation {
    &:not(:last-of-type) {
      margin-bottom: 17px;
    }
  }

  .correlation-block {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .correlation-icon {
      width: 60px;
      font-size: 60px;
      color: #485454;
    }
  }

  .footer-button-block {
    display: flex;
    justify-content: flex-end;
    margin-top: 17px;

    .btn:not(:last-child) {
      margin-right: 7px;
    }

    .remark-text {
      color: $theme-color-warning;
      font-size: 14px;
      margin-right: 12px;
    }
  }

  .reminder-block {
    background-color: rgba(0, 0, 0, 0.55);
    border-radius: 5px;
    padding: 8px;
    font-size: 14px;
    margin-top: 17px;
    display: flex;
    flex-direction: column;

    .reminder-title {
      color: #FFDF6F;
      font-weight: $theme-font-weight-semi-bold;
      line-height: 32px;
    }

    .reminder-description {
      line-height: 32px;
    }

    .btn-link {
      color: #00C9DC;
      text-decoration: underline;
    }
  }

  .disabled {
    opacity: .5;
    transition: opacity .2s linear;
    pointer-events: none;
    cursor: not-allowed;
  }

  & >>> .join-type-select.el-select {
    .el-input__inner {
      padding-left: 0;
    }
  }
}
</style>
