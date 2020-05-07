<template>
  <div class="edit-table-join-relation-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">{{ $t('editing.foreignTable') }}
        <a href="javascript:void(0)" class="close-btn"
          @click="closeDialog"
         ><svg-icon icon-class="close"></svg-icon></a>
      </div>
      <div class="button-block">
        <button type="button" class="btn btn-secondary btn-has-icon"
         :disabled="isLoading || reachLimit"
          @click="addJoinTable"
        ><svg-icon icon-class="plus" class="icon"></svg-icon>{{ $t('button.newForeign') }}</button>
      </div>
      <spinner class="spinner-container"
        v-if="isLoading"
        :title="$t('editing.loading')"
        size="50"
      ></spinner>
      <template v-else>
        <empty-info-block
          class="empty-info-block"
          v-if="joinTableList.length === 0"
          :msg="$t('editing.emptyForeign')"
        ></empty-info-block>
        <table-join-relatoin-block
          v-else
          v-for="(relation, index) in joinTableList"
          :key="relation.key || relation.id"
          :index="index"
          :relation-info="relation"
          :data-frame-list="dataFrameOptionList()"
          @deleteJoinTable="deleteJoinTable"
          @cancelAddingJoinTable="cancelAddingJoinTable"
          @dataFrameUpdate="$emit('dataFrameUpdate')"
        ></table-join-relatoin-block>
      </template>
    </div>
  </div>
</template>
<script>
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import TableJoinRelatoinBlock from './TableJoinRelatoinBlock'
import { getJoinTableList } from '@/API/JoinTable'
import { Message } from 'element-ui'

export default {
  name: 'EditTableJoinRelationDialog',
  components: {
    TableJoinRelatoinBlock,
    EmptyInfoBlock
  },
  props: {
    reachLimit: {
      type: Boolean,
      required: true
    },
    dataFrameList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      currentDataSourceId: parseInt(this.$route.params.id),
      joinTableList: [],
      singleJoinTable: {
        dataFrameRelationList: [
          {
            joinType: '',
            leftDataFrame: { id: null },
            leftDataColumn: { id: null, dataType: null },
            rightDataFrame: { id: null },
            rightDataColumn: { id: null, dataType: null }
          }
        ],
        id: null,
        name: null
      },
      isLoading: true
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.isLoading = true
      getJoinTableList(this.currentDataSourceId)
        .then((res) => {
          if (res.length === 0) {
            const emptyJoinTable = JSON.parse(JSON.stringify(this.singleJoinTable))
            emptyJoinTable.key = new Date().getTime().toString()
            this.joinTableList.push(emptyJoinTable)
          } else {
            this.joinTableList = res.reduce((acc, cur) => {
              const selectedDataFrame = this.dataFrameList.find(dataFrame => dataFrame.id === cur.dataFrameId)
              if (!selectedDataFrame) return acc
              acc.push({...cur, state: selectedDataFrame.state})
              return acc
            }, [])
          }
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    updateJoinTableList () {
      this.joinTableList.forEach((table, index) => {
        const selectedDataFrame = this.dataFrameList.find(dataFrame => dataFrame.id === table.dataFrameId)
        if (table.state !== selectedDataFrame.state) {
          this.$set(this.joinTableList, index, {...table, state: selectedDataFrame.state})
        }
      })
    },
    dataFrameOptionList () {
      return this.dataFrameList.reduce((acc, cur) => {
        if (cur.state !== 'Enable' || cur.joinCount > 1) return acc
        acc.push({...cur, name: cur.primaryAlias})
        return acc
      }, [])
    },
    closeDialog () {
      this.$emit('cancel')
    },
    addJoinTable () {
      const emptyJoinTable = JSON.parse(JSON.stringify(this.singleJoinTable))
      emptyJoinTable.key = new Date().getTime().toString()
      this.joinTableList.unshift(emptyJoinTable)
    },
    cancelAddingJoinTable (index) {
      this.joinTableList.splice(index, 1)
    },
    deleteJoinTable (index) {
      this.joinTableList.splice(index, 1)
      this.$emit('dataFrameUpdate')
      Message({
        message: this.$t('message.correlationDeleteSuccess'),
        type: 'success',
        duration: 3 * 1000
      })
    }
  },
  watch: {
    dataFrameList: {
      deep: true,
      handler (val) {
        this.updateJoinTableList()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.edit-table-join-relation-dialog {
  .button-block {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .empty-info-block {
    margin-bottom: 16px;
  }
}
</style>
