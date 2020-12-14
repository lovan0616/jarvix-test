<template>
  <div class="feature-management-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('feature.featureManagement') }}
        <a 
          href="javascript:void(0)" 
          class="close-btn"
          @click="closeDialog"
        ><svg-icon icon-class="close"/></a>
      </div>
      <div class="custom-feature-list">
        <div class="title-block">
          <default-select 
            v-model="currentDataFrameId"
            :option-list="dataFrameList"
            class="data-frame-select"
            @change="getDataFrameFeature"
          />
          <button 
            class="btn btn-secondary btn-has-icon"
            @click="showEditDialog"
          >
            <svg-icon 
              icon-class="add-feature" 
              class="icon"/>{{ $t('button.addColumn') }}
          </button>
        </div>
        <div class="data-table feature-list">
          <div class="data-table-row table-head">
            <div class="data-table-cell">{{ $t('editing.columnName') }}</div>
            <!-- <div class="data-table-cell">{{ $t('feature.featureSetting') }}</div> -->
            <div class="data-table-cell">{{ $t('editing.action') }}</div>
          </div>
          <div class="data-table-body">
            <empty-info-block
              v-if="featureList.length === 0"
            />
            <div 
              v-for="feature in featureList"
              :key="feature.id"
              class="data-table-row"
            >
              <div class="data-table-cell">{{ feature.name }}</div>
              <!-- <div class="data-table-cell">{{ feature.description }}
                <el-tooltip placement="top"
                  :content="$t('resultDescription.modelConfidence')"
                >
                  <svg-icon icon-class="info" class="info-icon"></svg-icon>
                </el-tooltip>
              </div> -->
              <div class="data-table-cell">
                <a 
                  href="javascript:void(0)" 
                  class="action-link link"
                  @click="editFeature(feature)"
                >{{ $t('button.edit') }}</a>
                <a 
                  href="javascript:void(0)" 
                  class="action-link link"
                  @click="deleteFeature(feature.dataColumnId)"
                >{{ $t('button.delete') }}</a>
              </div>
            </div>
          </div>
        </div>
        <edit-feature-dialog
          v-if="showEditFeatureDialog"
          :edit-feature-info="editFeatureInfo"
          :current-data-frame-info="currentDataFrameInfo"
          @update="updateFeature"
          @cancel="closeEditDialog"
        />
      </div>
      <decide-dialog
        v-if="isShowDelete"
        :title="`${$t('editing.confirmDelete')}？`"
        :type="'delete'"
        :is-processing="isProcessing"
        @closeDialog="closeDelete"
        @confirmBtn="confirmDelete"
      />
    </div>
  </div>
</template>
<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import EditFeatureDialog from './EditFeatureDialog'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import DecideDialog from '@/components/dialog/DecideDialog'
import { getDataFrameById } from '@/API/DataSource'
import { getCustomFeatureList, deleteCustomFeature } from '@/API/Feature'

export default {
  name: 'FeatureManagementDialog',
  components: {
    DefaultSelect,
    EditFeatureDialog,
    EmptyInfoBlock,
    DecideDialog
  },
  data () {
    return {
      dataSourceId: parseInt(this.$route.params.id),
      dataFrameList: [],
      currentDataFrameId: null,
      featureList: [],
      showEditFeatureDialog: false,
      isShowDelete: false,
      editFeatureInfo: null,
      deleteFeatureId: null,
      isProcessing: false
    }
  },
  computed: {
    currentDataFrameInfo () {
      return this.dataFrameList.filter(element => element.value === this.currentDataFrameId)[0]
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      getDataFrameById(this.dataSourceId).then(response => {
        this.dataFrameList = response.map(element => {
          return {
            name: element.primaryAlias,
            value: element.id
          }
        })
        this.currentDataFrameId = this.dataFrameList[0].value
        this.getDataFrameFeature(this.currentDataFrameId)
      })
    },
    getDataFrameFeature (id) {
      getCustomFeatureList(id).then(response => {
        this.featureList = response
      })
    },
    closeDialog () {
      this.$emit('close')
    },
    showEditDialog () {
      this.showEditFeatureDialog = true
    },
    editFeature (id) {
      this.editFeatureInfo = id
      this.showEditDialog()
    },
    closeDelete () {
      this.isShowDelete = false
    },
    deleteFeature (id) {
      this.isShowDelete = true
      this.deleteFeatureId = id
    },
    confirmDelete () {
      this.isProcessing = true
      deleteCustomFeature(this.deleteFeatureId).then(() => {
        const sliceIndex = this.featureList.findIndex(item => item.dataColumnId === this.deleteFeatureId)
        this.featureList.splice(sliceIndex, 1)
        this.isShowDelete = false
      }).finally(() => {
        this.isProcessing = false
      })
    },
    closeEditDialog () {
      this.editFeatureInfo = null
      this.showEditFeatureDialog = false
    },
    updateFeature () {
      this.getDataFrameFeature(this.currentDataFrameId)
      this.closeEditDialog()
    }
    // descriptionTransform (value) {
    //   let feature = JSON.parse(value)
    //   return feature
    // }
  }
}
</script>
<style lang="scss" scoped>
.custom-feature-list {
  .title-block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  .data-frame-select {
    width: 188px;
    border-bottom: 1px solid #fff;
  }
  .feature-list {
    .data-table-body {
      .data-table-cell {
        color: #ddd;
      }
    }
  }
}
</style>
