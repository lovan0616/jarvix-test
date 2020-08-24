<template>
  <div class="single-edit-region">
    <div class="button-block">
      <button 
        v-if="!columnSet.id && isEditing" 
        type="button"
        class="btn btn-default btn-save"
        @click="saveColumnSet"
      >{{ $t('button.build') }}</button>
      <button 
        v-if="isEditing" 
        :class="columnSet.id ? 'btn-secondary' : 'btn-outline'"
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
              :value="columnSet.dataColumnList" 
              :clone="cloneSelectedColumn"
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
import { createColumnSet, addColumnSetColumn, removeColumnSetColumn, deleteColumnSet } from '@/API/ColumnSet'
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
      validateFieldKey: new Date().getTime().toString()
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
    this.filterColumnList()
  },
  methods: {
    filterColumnList () {
      if (this.columnSet.dataColumnList.length > 0) {
        // 調整資料格式
        // this.columnSet.dataColumnList = this.columnSet.dataColumnList.map(column => {
        //   return {
        //     id: column.dataColumnId,
        //     name: column.name,
        //     primaryAlias: column.primaryAlias
        //   }
        // })
        // 過濾已經被選擇的欄位
        this.columnOptionList = this.columnList.filter(element => {
          return this.columnSet.dataColumnList.findIndex(column => column.dataColumnId === element.id) === -1
        }).map(column => ({ ...column, primaryAlias: column.aliasList[0] }))
      } else {
        this.columnOptionList = JSON.parse(JSON.stringify(this.columnList))
      }
    },
    addColumnSetColumn (columnSetId, dataColumnId) {
      return addColumnSetColumn({ columnSetId, dataColumnId })
        .then(response => {
          Message({
            message: this.$t('message.saveSuccess'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
          return response
        })
    },
    selectColumn (index) {
      if (this.columnSet.id) {
        this.addColumnSetColumn(this.columnSet.id, this.columnOptionList[index].id)
          .then(response => {
            this.columnSet.dataColumnList.push(response)
            this.columnOptionList.splice(index, 1)
          })
      } else {
        this.columnSet.dataColumnList.push(this.columnOptionList[index])
        this.columnOptionList.splice(index, 1)
      }
    },
    removeColumnSetColumn (id) {
      return removeColumnSetColumn(id).then(() => {
        Message({
          message: this.$t('message.deleteSuccess'),
          type: 'success',
          duration: 3 * 1000,
          showClose: true
        })
      })
    },
    cancelSelect (index) {
      // if (this.columnSet.dataColumnList.length <= 1) {
      //   Message({
      //     message: this.$t('message.columnSetAtLeastOne'),
      //     type: 'warning',
      //     duration: 3 * 1000
      //   })
      //   return
      // }
      let cancelColumnInfo = this.columnSet.dataColumnList.splice(index, 1)
      const {id: dataColumnId, dataColumnId: id, ...otherData} = cancelColumnInfo[0]
      this.columnOptionList.push({id, dataColumnId, ...otherData})

      if (this.columnSet.id) this.removeColumnSetColumn(dataColumnId)
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
        createColumnSet({
          primaryAlias: this.columnSet.primaryAlias,
          dataFrameId: this.columnSet.dataFrameId,
          dataColumnIdList: this.columnSet.dataColumnList.map(column => column.id)
        }).then(response => {
          Message({
            message: this.$t('message.saveSuccess'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
          this.columnSet.id = response.id
          this.columnSet.dataColumnList = response.dataColumnList
          this.toggleIsEditing()
        })
      })
    },
    removeColumnSet () {
      if (this.columnSet.id) {
        deleteColumnSet(this.columnSet.id).then(() => {
          Message({
            message: this.$t('message.deleteSuccess'),
            type: 'success',
            duration: 3 * 1000,
            showClose: true
          })
          this.$emit('remove')
        })
      } else {
        this.$emit('remove')
      }
    },
    toggleIsEditing () {
      this.isEditing = !this.isEditing
    },
    updateDataSetOrder (oldIndex, newIndex) {
      if (this.columnSet.id) {
        // update order api
      }
      const movingColumn = this.columnSet.dataColumnList.splice(oldIndex, 1)[0]
      this.columnSet.dataColumnList.splice(newIndex, 0, movingColumn)
    },
    updateSelectedList (e) {
      if (e.hasOwnProperty('moved')) {
        return this.updateDataSetOrder(e.moved.oldIndex, e.moved.newIndex)
      } else if (e.hasOwnProperty('removed')) {
        if (!this.columnSet.id) return this.columnSet.dataColumnList.splice(e.removed.oldIndex, 1)
        this.removeColumnSetColumn(e.removed.element.id)
          .then(() => this.columnSet.dataColumnList.splice(e.removed.oldIndex, 1))
      } else if (e.hasOwnProperty('added')) {
        if (!this.columnSet.id) return this.columnSet.dataColumnList.push(e.added.element)
        this.addColumnSetColumn(this.columnSet.id, e.added.element.id)
          .then(response => this.columnSet.dataColumnList.splice(e.added.newIndex, 0, response))
      }
    },
    cloneSelectedColumn (columnData) {
      return {
        ...columnData,
        id: columnData.dataColumnId,
        dataColumnId: columnData.id
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
