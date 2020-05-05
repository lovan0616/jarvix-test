<template>
  <div class="single-edit-region">
    <div class="button-block">
      <button type="button" class="btn btn-default btn-save"
        v-if="!columnSet.id && isEditing"
        @click="saveColumnSet"
      >{{ $t('button.build') }}</button>
      <button type="button" class="btn btn-delete"
        @click="removeColumnSet"
        v-if="isEditing"
        :class="columnSet.id ? 'btn-secondary' : 'btn-outline'"
      >{{ columnSet.id ? $t('button.delete') : $t('button.cancel') }}</button>
      <button type="button" class="btn btn-outline"
        @click="toggleIsEditing()"
        v-if="!isEditing"
      >{{ $t('button.edit') }}</button>
      <button type="button" class="btn btn-outline"
        @click="toggleIsEditing()"
        v-if="columnSet.id && isEditing"
      >{{ $t('button.close') }}</button>
    </div>
    <div class="region-title" v-if="!isEditing">
      {{ columnSet.primaryAlias }}
    </div>
    <template v-else>
      <div class="input-block">
        <label for="" class="label">*{{ $t('editing.columnSetName') }}</label>
        <input-block
          v-if="!columnSet.id"
          :placeholder="$t('editing.pleaseEnterName')"
          v-model="columnSet.primaryAlias"
          :name="validateFieldKey"
          v-validate="`required|max:${max}`"
        ></input-block>
        <div
          v-else
        >{{ columnSet.primaryAlias }}</div>
      </div>
      <div class="select-container">
        <div class="select-block">
          <div class="block-title">{{ $t('editing.notSelect') }}</div>
          <div class="option-list-block">
            <div class="single-option"
              v-for="(column, index) in columnOptionList"
              :key="column.id"
            >
              <div class="info name">{{ column.name }}</div>
              <div class="info alias">{{ column.primaryAlias }}</div>
              <button class="btn-m btn-default btn-select"
                @click="selectColumn(index)"
              >{{ $t('button.select') }}</button>
            </div>
          </div>
        </div>
        <div class="icon-block">
          <svg-icon icon-class="go-right" class="arrow-icon"></svg-icon>
          <svg-icon icon-class="go-right" class="arrow-icon left"></svg-icon>
        </div>
        <div class="select-block">
          <div class="block-title">{{ $t('editing.alreadySelect') }}</div>
          <div class="option-list-block">
            <div class="single-option"
              v-for="(column, index) in columnSet.dataColumnList"
              :key="column.id"
            >
              <div class="info name">{{ column.name }}</div>
              <div class="info alias">{{ column.primaryAlias }}</div>
              <button class="btn-m btn-secondary btn-select"
                @click="cancelSelect(index)"
              >{{ $t('button.cancel') }}</button>
            </div>
            <div class="empty-select"
              v-if="columnSet.dataColumnList.length === 0"
            >{{ $t('editing.selectYet') }}</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { createColumnSet, addColumnSetColumn, removeColumnSetColumn, deleteColumnSet } from '@/API/ColumnSet'
import inputBlock from '@/components/InputBlock'
import { Message } from 'element-ui'

export default {
  name: 'SingleColumnSet',
  inject: ['$validator'],
  components: {
    inputBlock
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
        })
      } else {
        this.columnOptionList = JSON.parse(JSON.stringify(this.columnList))
      }
    },
    selectColumn (index) {
      if (this.columnSet.id) {
        addColumnSetColumn({
          columnSetId: this.columnSet.id,
          dataColumnId: this.columnOptionList[index].id
        }).then(response => {
          Message({
            message: this.$t('message.saveSuccess'),
            type: 'success',
            duration: 3 * 1000
          })
          this.columnSet.dataColumnList.push(response)
          this.columnOptionList.splice(index, 1)
        })
      } else {
        this.columnSet.dataColumnList.push(this.columnOptionList[index])
        this.columnOptionList.splice(index, 1)
      }
    },
    cancelSelect (index) {
      let cancelColumnInfo = this.columnSet.dataColumnList.splice(index, 1)
      const {id: dataColumnId, dataColumnId: id, ...otherData} = cancelColumnInfo[0]
      this.columnOptionList.push({id, dataColumnId, ...otherData})

      if (this.columnSet.id) {
        removeColumnSetColumn(dataColumnId).then(() => {
          Message({
            message: this.$t('message.deleteSuccess'),
            type: 'success',
            duration: 3 * 1000
          })
        })
      }
    },
    saveColumnSet () {
      if (!this.columnSet.primaryAlias) {
        Message({
          message: this.$t('message.columnSetNameEmpty'),
          type: 'warning',
          duration: 3 * 1000
        })
        return false
      }
      if (this.columnSet.dataColumnList.length === 0) {
        Message({
          message: this.$t('message.columnSetChosenEmpty'),
          type: 'warning',
          duration: 3 * 1000
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
          duration: 3 * 1000
        })
        this.columnSet.id = response.id
        this.columnSet.dataColumnList = response.dataColumnList
        this.toggleIsEditing()
      })
    },
    removeColumnSet () {
      if (this.columnSet.id) {
        deleteColumnSet(this.columnSet.id).then(() => {
          Message({
            message: this.$t('message.deleteSuccess'),
            type: 'success',
            duration: 3 * 1000
          })
          this.$emit('remove')
        })
      } else {
        this.$emit('remove')
      }
    },
    toggleIsEditing () {
      this.isEditing = !this.isEditing
    }
  },
  computed: {
    max () {
      return this.$store.state.validation.fieldCommonMaxLength
    }
  }
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
    width: 301px;
    line-height: 36px;
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

      &:not(:last-child) {
        margin-bottom: 8px;
      }

      .info {
        font-size: 14px;
        line-height: 20px;

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
