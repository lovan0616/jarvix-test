<template>
  <div class="single-edit-region">
    <div class="button-block">
      <button 
        v-if="!columnSet.id && isEditing" 
        :disabled="isProcessing"
        type="button"
        class="btn btn-default btn-save"
        @click="saveColumnSet"
      >{{ $t('button.build') }}</button>
      <button 
        v-if="isEditing" 
        :class="columnSet.id ? 'btn-secondary' : 'btn-outline'"
        :disabled="isProcessing"
        type="button"
        class="btn btn-delete"
        @click="removeColumnSet"
      >{{ columnSet.id ? $t('button.delete') : $t('button.cancel') }}</button>
      <button 
        v-if="!isEditing" 
        type="button"
        class="btn btn-outline"
        @click="toggleIsEditing()"
      >{{ $t('button.edit') }}</button>
      <button 
        v-if="columnSet.id && isEditing" 
        type="button"
        class="btn btn-outline"
        @click="toggleIsEditing()"
      >{{ $t('button.close') }}</button>
    </div>
    <div
      v-if="!isEditing">
      <el-tooltip
        :content="columnSet.primaryAlias"
        placement="bottom"
      >
        <div class="region-title">{{ columnSet.primaryAlias }}</div>
      </el-tooltip>
    </div>
    <template v-else>
      <div class="input-block">
        <label 
          for="" 
          class="label">*{{ $t('editing.columnSetName') }}</label>
        <input-block
          v-validate="`required|max:${max}`"
          v-if="!columnSet.id"
          :placeholder="$t('editing.pleaseEnterName')"
          v-model="columnSet.primaryAlias"
          :name="validateFieldKey"
        />
        <div
          v-else
        >{{ columnSet.primaryAlias }}</div>
      </div>
      <div class="select-container">
        <div class="select-block">
          <div class="block-title">{{ $t('editing.notSelect') }}</div>
          <div class="option-list-block">
            <draggable
              :disabled="isProcessing"
              :list="columnOptionList"
              :group="draggableGroupName"
              class="list-group">
              <div 
                v-for="(column, index) in columnOptionList"
                :key="column.id"
                class="single-option"
              >
                <div class="info name">{{ column.name }}</div>
                <div class="info alias">{{ column.primaryAlias }}</div>
                <button
                  :disabled="isProcessing"
                  class="btn-m btn-default btn-select"
                  @click="selectColumn(index)"
                >{{ $t('button.select') }}</button>
              </div>
            </draggable>            
          </div>
        </div>
        <div class="icon-block">
          <svg-icon 
            icon-class="go-right" 
            class="arrow-icon"/>
          <svg-icon 
            icon-class="go-right" 
            class="arrow-icon left"/>
        </div>
        <div class="select-block">
          <div class="block-title">{{ $t('editing.alreadySelect') }}</div>
          <div class="option-list-block">
            <draggable
              :disabled="isProcessing"
              :value="columnSet.dataColumnList" 
              :group="selectedListGroup"
              class="list-group"
              @change="updateSelectedList">
              <div 
                v-for="(column, index) in columnSet.dataColumnList"
                :key="column.id"
                :class="{ 'disabled': columnSet.id && columnSet.dataColumnList.length <= 1 }"
                class="single-option"
              >
                <div class="info name">{{ column.name }}</div>
                <div class="info alias">{{ column.primaryAlias }}</div>
                <button
                  v-if="!(columnSet.id && columnSet.dataColumnList.length <= 1)"
                  :disabled="isProcessing"
                  class="btn-m btn-secondary btn-select"
                  @click="cancelSelect(index)"
                >{{ $t('button.cancel') }}</button>
              </div>
              <div
                v-if="columnSet.dataColumnList.length === 0"
                slot="footer"
                class="empty-select"
              >{{ $t('editing.selectYet') }}</div>
            </draggable>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import draggable from 'vuedraggable';
import { createColumnSet, deleteColumnSet, updateColumnSet } from '@/API/ColumnSet'
import inputBlock from '@/components/InputBlock'
import { Message } from 'element-ui'

export default {
  name: 'SingleColumnSet',
  inject: ['$validator'],
  components: {
    inputBlock,
    draggable
  },
  props: {
    columnList: {
      type: Array,
      default: () => []
    },
    columnSet: {
      type: Object,
      default () {
        return {
          dataColumnList: [],
          dataFrameId: null,
          id: null,
          primaryAlias: null
        }
      }
    }
  },
  data () {
    return {
      columnOptionList: [],
      isEditing: !this.columnSet.id,
      validateFieldKey: new Date().getTime().toString(),
      sortedColumnSet: {},
      isProcessing: false
    }
  },
  computed: {
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    },
    selectedListGroup () {
      const isPullable =  !(this.columnSet.id && this.columnSet.dataColumnList.length <= 1)
      // put 限定接受當前 dataset 來的 column
      return { name: this.draggableGroupName, pull: isPullable, put: this.draggableGroupName }
    },
    draggableGroupName () {
      return 'columnSetColumn' + this.$vnode.key
    }
  },
  mounted () {
    this.sortColumnSet()
    this.filterColumnList()
  },
  methods: {
    sortColumnSet () {
      if (this.columnSet.dataColumnList.length === 0) return this.columnSet
      this.columnSet.dataColumnList.sort((a, b) => a.sequence - b.sequence)
    },
    filterColumnList () {
      let columnOptionList = this.columnList.map(column => {
        // 統一 columnList 和 columnSet.dataColumnList 中的 column id 為 dataColumnId
        const { id: dataColumnId, ...otherData } = column
        return { dataColumnId, ...otherData, primaryAlias: column.aliasList[0] }
      })

      // 過濾已經被選擇的欄位
      if (this.columnSet.dataColumnList.length > 0) {
        columnOptionList = columnOptionList.filter(element => {
          return this.columnSet.dataColumnList.findIndex(column => column.dataColumnId === element.dataColumnId) === -1
        })
      } 
      this.columnOptionList = columnOptionList
    },
    updateColumnSetColumn (columnSetId, columnList) {
      return updateColumnSet(columnSetId, {
        dataFrameId: this.columnSet.dataFrameId,
        columnSetColumnList: columnList.map((column, index) => (
          { 
            columnId: column.dataColumnId,
            sequence: index + 1
          }
        ))
      }).then(() => {
        Message({
          message: this.$t('message.saveSuccess'),
          type: 'success',
          duration: 3 * 1000,
          showClose: true
        })
      })
    },
    async selectColumn (index) {
      if (this.columnSet.id) {
        this.isProcessing = true
        const newColumnList = [...this.columnSet.dataColumnList, this.columnOptionList[index]]
        try { await this.updateColumnSetColumn(this.columnSet.id, newColumnList) } 
        catch(e) { return this.isProcessing = false }
      } 
      this.columnSet.dataColumnList.push(this.columnOptionList[index])
      this.columnOptionList.splice(index, 1)
      this.isProcessing = false
    },
    async cancelSelect (index) {
      if (this.columnSet.id) {
        this.isProcessing = true
        const newColumnList = [...this.columnSet.dataColumnList]
        newColumnList.splice(index, 1)
        try { await this.updateColumnSetColumn(this.columnSet.id, newColumnList) } 
        catch(e) { return this.isProcessing = false }
      }
      let cancelColumnInfo = this.columnSet.dataColumnList.splice(index, 1)[0]
      this.columnOptionList.push(cancelColumnInfo)
      this.isProcessing = false
    },
    saveColumnSet () {
      this.$validator.validate(this.validateFieldKey).then((isValidate) => {
        if (!isValidate) return
        if (!this.columnSet.primaryAlias) {
          Message({
            message: this.$t('message.columnSetNameEmpty'),
            type: 'warning',
            duration: 3 * 1000,
            showClose: true
          })
          return false
        }
        if (this.columnSet.dataColumnList.length === 0) {
          Message({
            message: this.$t('message.columnSetChosenEmpty'),
            type: 'warning',
            duration: 3 * 1000,
            showClose: true
          })
          return false
        }

        this.isProcessing = true
        createColumnSet({
          primaryAlias: this.columnSet.primaryAlias,
          dataFrameId: this.columnSet.dataFrameId,
          dataColumnIdList: this.columnSet.dataColumnList.map((column, index) => (
            { 
              columnId: column.dataColumnId,
              sequence: index + 1
            }
          ))
        }).then(response => {
          Message({
            message: this.$t('message.saveSuccess'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
          this.columnSet.id = response.id
          this.toggleIsEditing()
        })
        .finally(() => this.isProcessing = false)
      })
    },
    removeColumnSet () {
      if (this.columnSet.id) {
        this.isProcessing = true
        deleteColumnSet(this.columnSet.id).then(() => {
          Message({
            message: this.$t('message.deleteSuccess'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
          this.$emit('remove')
        })
        .finally(() => this.isProcessing = false)
      } else {
        this.$emit('remove')
      }
    },
    toggleIsEditing () {
      this.isEditing = !this.isEditing
    },
    async updateDataSetOrder (oldIndex, newIndex) {  
      if (this.columnSet.id) {
        const newColumnList = [...this.columnSet.dataColumnList]
        const tempMovingColumn = newColumnList.splice(oldIndex, 1)[0]
        newColumnList.splice(newIndex, 0, tempMovingColumn)
        await this.updateColumnSetColumn(this.columnSet.id, newColumnList)
      }
      const movingColumn = this.columnSet.dataColumnList.splice(oldIndex, 1)[0]
      this.columnSet.dataColumnList.splice(newIndex, 0, movingColumn)
    },
    async updateSelectedList (e) {
      try {
        this.isProcessing = true
        if (e.hasOwnProperty('moved')) {
          await this.updateDataSetOrder(e.moved.oldIndex, e.moved.newIndex)
        } else if (e.hasOwnProperty('removed')) {
          if (this.columnSet.id) {
            const newColumnList = [...this.columnSet.dataColumnList]
            newColumnList.splice(e.removed.oldIndex, 1)
            await this.updateColumnSetColumn(this.columnSet.id, newColumnList)
          }
          this.columnSet.dataColumnList.splice(e.removed.oldIndex, 1)
        } else if (e.hasOwnProperty('added')) {
          if (this.columnSet.id) {
            const newColumnList = [...this.columnSet.dataColumnList]
            newColumnList.splice(e.added.newIndex, 0, e.added.element)
            await this.updateColumnSetColumn(this.columnSet.id, newColumnList)
          }
          this.columnSet.dataColumnList.splice(e.added.newIndex, 0, e.added.element)
        }
      } catch(e) {
        return  
      } finally {
        this.isProcessing = false
      }
    }
  },
}
</script>
<style lang="scss" scoped>
.single-edit-region {
  position: relative;
  width: 100%;
  padding: 24px;
  background: rgba(50, 58, 58, 0.95);
  border-radius: 5px;
  margin-bottom: 12px;
  &::after {
    content: '';
    display: block;
    clear: both;
  }

  .button-block {
    position: absolute;
    top: 24px;
    right: 24px;

    .btn:not(:last-child) {
      margin-right: 12px;
    }

    .btn {
      &-outline {
        &:hover {
          border-color: $theme-text-color;
          color: $theme-text-color;
          background-color: $theme-color-primary;
        }
      }

      &-delete {
        &:hover {
          background-color: transparent;
          color: $theme-color-primary;
          border: 1px solid $theme-color-white;
        }
      }
    }
  }

  .empty-select {
    color: #aaa;
    text-align: center;
    padding-top: 20px;
  }

  .input-block {
    width: 301px;
    margin-bottom: 30px;

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
  }

  .region-title {
    float: left;
    max-width: calc(100% - 80px);
    line-height: 36px;
    @include text-hidden;
  }

  .select-container {
    display: flex;
    justify-content: space-between;

    .select-block {
      width: 46%;
      background: rgba(38, 46, 46, 0.95);
      border-radius: 8px;
      padding: 16px;
      height: 358px;

      .block-title {
        margin-bottom: 12px;
        font-size: 14px;
      }
    }

    .icon-block {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .arrow-icon {
        &.first-child {
          margin-bottom: 12px;
        }
        &.left {
          transform: rotate(180deg);
        }
      }
    }

    .option-list-block {
      height: 308px;
      overflow: auto;
      .list-group {
        height: 100%;
      }
    }

    .list-group {
      height: 100%;
    }

    .single-option {
      position: relative;
      background: #475353;
      border-radius: 5px;
      padding: 12px;
      cursor: grab;

      &:not(:last-child) {
        margin-bottom: 8px;
      }

      &.sortable-chosen,
      &.sortable-drag {
        cursor: grabbing;
      }

      &.sortable-ghost {
        opacity: .4;
      }

      &.disabled {
        cursor: no-drop;
      }

      .info {
        font-size: 14px;
        line-height: 20px;
        width: calc(100% - 80px);

        &:first-child {
          margin-bottom: 4px;
        }

        &.alias {
          color: #ccc;
        }
      }

      .btn-select {
        position: absolute;
        top: 12px;
        right: 12px;
      }
    }
  }
}
</style>
