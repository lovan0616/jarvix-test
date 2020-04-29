<template>
  <div class="feature-management-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('feature.featureManagement') }}
        <a href="javascript:void(0)" class="close-btn"
          @click="closeDialog"
        ><svg-icon icon-class="close"></svg-icon></a>
      </div>
      <div class="custom-feature-list">
        <div class="title-block">
          <default-select class="data-frame-select"
            v-model="currentDataFrame"
            :option-list="dataFrameList"
            @change="getDataFrameFeature"
          ></default-select>
          <button class="btn btn-secondary btn-has-icon"
            @click="showEditDialog"
          >
            <svg-icon icon-class="add-feature" class="icon"></svg-icon>{{ $t('button.addFeature') }}
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
            ></empty-info-block>
            <div class="data-table-row"
              v-for="feature in featureList"
              :key="feature.id"
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
                <a href="javascript:void(0)" class="action-link link"
                  @click="editFeature(feature)"
                >{{ $t('button.edit') }}</a>
              </div>
            </div>
          </div>
        </div>
        <edit-feature-dialog
          v-if="showEditFeatureDialog"
          :edit-feature-info="editFeatureInfo"
          @update="updateFeature"
          @cancel="closeEditDialog"
        ></edit-feature-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import EditFeatureDialog from './EditFeatureDialog'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import { getDataFrameById } from '@/API/DataSource'
import { getCustomFeatureList } from '@/API/Feature'

export default {
  name: 'FeatureManagementDialog',
  components: {
    DefaultSelect,
    EditFeatureDialog,
    EmptyInfoBlock
  },
  data () {
    return {
      dataSourceId: parseInt(this.$route.params.id),
      dataFrameList: [],
      currentDataFrame: null,
      featureList: [],
      showEditFeatureDialog: false,
      editFeatureInfo: null
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
        this.currentDataFrame = this.dataFrameList[0].value
        this.getDataFrameFeature(this.currentDataFrame)
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
    closeEditDialog () {
      this.editFeatureInfo = null
      this.showEditFeatureDialog = false
    },
    updateFeature () {
      this.getDataFrameFeature(this.currentDataFrame)
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
