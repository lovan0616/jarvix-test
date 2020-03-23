<template>
  <div class="single-join-table">
    <div
      v-if="!isEditing"
      class="title-block"
    >
      <h3 class="table-name">{{ relationInfoData.name }}</h3>
      <h6 class="join-type">
        關聯方式:
        <span
          v-for="(relation, relationIndex) in relationInfoData.dataFrameRelationList"
          :key="relationIndex"
        >{{ getJoinTableName(relation.joinType) }}</span>
      </h6>
    </div>
    <div
      v-if="isEditing"
      class="input-block"
      :class="{'is-editing': isEditing}"
    >
      <label for="" class="label">*{{ $t('editing.tableName') }}</label>
      <input
        type="text"
        class="input"
        v-if="!relationInfoData.id"
        :placeholder="$t('editing.pleaseEnterName')"
        v-model="relationInfoData.name"
      >
      <div class="name" v-else>{{ relationInfoData.name }}</div>
    </div>
    <div class="button-block">
      <button type="button" class="btn btn-default btn-save"
        v-if="isEditing"
        :disabled="isLoading"
        @click="relationInfoData.id ? updateJoinTable() : buildJoinTable()"
      >{{ relationInfoData.id ? $t('button.update') : $t('button.build') }}</button>
      <button type="button" class="btn btn-outline"
        v-if="isEditing && !relationInfoData.id"
        :disabled="isLoading"
        @click="cancelAddingJoinTable()"
      >{{ $t('button.cancel') }}</button>
      <button type="button" class="btn btn-outline"
        v-if="!isEditing"
        @click="toggleIsEditing()"
      >{{ $t('button.edit') }}</button>
      <button type="button" class="btn btn-outline"
        v-if="isEditing && relationInfoData.id"
        :disabled="isLoading"
        @click="toggleIsEditing()"
      >{{ $t('button.close') }}</button>
    </div>
    <section
      v-if="isEditing"
      class="join-relation-list"
    >
      <div
        class="join-relation"
        v-for="(relation, relationIndex) in relationInfoData.dataFrameRelationList"
        :key="relationIndex"
      >
        <div
          class="input-block select"
          :class="{'is-editing': isEditing}"
        >
          <label for="" class="label">{{ $t('editing.selectJoinType') }}</label>
          <default-select
            class="tag-select input"
            v-model="relation.joinType"
            :option-list="joinTypeOptions"
          />
        </div>
        <div
          class="correlation-block"
        >
          <relation-select-block
            :data-frame-list="dataFrameList"
            :initial-data-frame-id.sync="relation.leftDataFrame.id"
            :initial-data-column-id.sync="relation.leftDataColumn.id"
            :index="relationIndex"
          />
          <svg-icon icon-class="table-correlation" class="correlation-icon"></svg-icon>
          <relation-select-block
            :data-frame-list="dataFrameList"
            :initial-data-frame-id.sync="relation.rightDataFrame.id"
            :initial-data-column-id.sync="relation.rightDataColumn.id"
            :index="relationIndex"
          />
        </div>
      </div>
    </section>
    <div
      class="footer-button-block"
      v-if="relationInfoData.id && isEditing"
    >
      <!-- <a href="javascript:void(0)" class="btn btn-secondary btn-delete"
        @click="checkDeleteRelations(relationInfoData.id)"
      >{{ $t('button.delete') }}</a> -->
      <a
        href="javascript:void(0)"
        class="btn btn-secondary btn-delete"
        @click="deleteJoinTable()"
      >{{ $t('button.delete') }}</a>
    </div>
    <div
      v-if="newTableCreated"
      class="reminder-block"
    >
      <span class="reminder-title">
        <svg-icon icon-class="lamp" />
        {{$t('resultDescription.prompt')}}：
      </span>
      <span class="reminder-description">
        {{$t('message.remindAdjustMainDate')}}
      </span>
      <!--TODO: 轉換到設定 main date 的 component-->
      <a
        href="javascript:void(0)"
        class="btn-link"
      >{{$t('guiding.goAdjust')}}</a>
    </div>
  </div>
</template>
<script>
import RelationSelectBlock from './RelationSelectBlock'
import TooltipDialog from '@/components/dialog/TooltipDialog'
import DefaultSelect from '@/components/select/DefaultSelect'
import { createJoinTable, updateJoinTable, deleteJoinTable } from '@/API/JoinTable'
import { Message } from 'element-ui'

export default {
  name: 'TableJoinRelationBlock',
  components: {
    TooltipDialog,
    DefaultSelect,
    RelationSelectBlock
  },
  props: {
    relationInfo: {
      type: Object,
      required: true
    },
    dataFrameList: {
      type: Array
    },
    index: {
      type: Number,
      required: true
    },
    joinTypeOptions: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      deleteJoinId: null,
      showConfirmDeleteDialog: false,
      leftTableColumnList: [],
      rightTableColumnList: [],
      isEditing: !this.relationInfo.id,
      currentDataSourceId: parseInt(this.$route.params.id),
      isLoading: false,
      relationInfoData: JSON.parse(JSON.stringify(this.relationInfo)),
      newTableCreated: false
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
      deleteJoinTable(this.relationInfoData.id)
        .then(() => {
          this.$emit('deleteJoinTable', this.index)
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    getDataFrameRelationList () {
      return this.relationInfoData.dataFrameRelationList.map(relation => ({
        joinType: relation.joinType,
        leftDataColumnId: relation.leftDataColumn.id,
        leftDataFrameId: relation.leftDataFrame.id,
        rightDataColumnId: relation.rightDataColumn.id,
        rightDataFrameId: relation.rightDataFrame.id
      }))
    },
    buildJoinTable () {
      this.isLoading = true
      const joinTableData = {
        dataSourceId: this.currentDataSourceId,
        name: this.relationInfoData.name,
        dataFrameRelationList: this.getDataFrameRelationList()
      }
      createJoinTable(joinTableData)
        .then(response => {
          this.relationInfoData.id = response
          this.isLoading = false
          this.isEditing = false
          this.newTableCreated = true
          Message({
            message: this.$t('message.joinTableBuilt'),
            type: 'success',
            duration: 3 * 1000
          })
        })
        .catch(() => { this.isLoading = false })
    },
    updateJoinTable () {
      this.isLoading = true
      const joinTableData = {
        id: this.relationInfoData.id,
        name: this.relationInfoData.name,
        dataFrameRelationList: this.getDataFrameRelationList()
      }
      updateJoinTable(joinTableData)
        .then(response => {
          this.isEditing = false
          this.isLoading = false
          Message({
            message: this.$t('message.saveSuccess'),
            type: 'success',
            duration: 3 * 1000
          })
        })
        .catch(() => { this.isLoading = false })
    },
    getJoinTableName (joinType) {
      return this.joinTypeOptions.find(option => option.value === joinType).name
    },
    toggleIsEditing () {
      this.isEditing = !this.isEditing
    }
  }
}
</script>
<style lang="scss" scoped>
.single-join-table {
  position: relative;
  padding: 24px 32px;
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

    .table-name,
    .join-type {
      margin: 0;
      line-height: 36px;
      font-weight: normal;
    }

    .table-name {
      font-size: 18px;
      width: 290px;
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
      margin-bottom: 20px;
    }

    &.select {
      position: absolute;
      top: 24px;
      left: 340px;
      width: 160px;
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
      line-height: 40px;
    }
  }

  .button-block {
    position: absolute;
    top: 24px;
    right: 32px;

    .btn:not(:last-child) {
      margin-right: 7px;
    }
  }

  .confirm-delete-dialog {
    right: 0;
  }

  .correlation-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    .correlation-icon {
      width: 60px;
      font-size: 60px;
      color: #485454;
    }
  }

  .footer-button-block {
    display: flex;
    justify-content: flex-end;

    .btn-delete {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .reminder-block {
    background-color: rgba(0, 0, 0, 0.55);
    border-radius: 5px;
    padding: 8px;
    font-size: 14px;
    margin-top: 17px;

    .reminder-title {
      color: #FFDF6F;
      font-weight: $theme-font-weight-semi-bold;
    }

    .btn-link {
      color: #00C9DC;
      text-decoration: underline;
    }
  }

  & >>> .tag-select.el-select {
    .el-input__inner {
      padding-left: 0;
    }
  }
}
</style>
