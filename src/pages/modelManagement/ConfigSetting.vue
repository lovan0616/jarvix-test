<template>
  <div class="management-info-page model-config-setting">
    <bread-crumb :name="modelInfo.name" />
    <div class="page-title-row">
      <div class="title">
        {{ $t('sideNav.configSetting') }}
      </div>
    </div>
    <spinner
      v-if="isLoading" 
      :title="$t('editing.loading')"
    />
    <div 
      v-else
      class="setting-container">
      <!-- Input 參數設定 -->
      <div 
        class="setting-block">
        <div class="setting-block__title">
          {{ $t('model.upload.inputArgsSetting') }}
          <div class="setting-block__reminder">
            {{ "*" + $t('model.upload.columnReminder') }}
          </div>
        </div>
        <div class="setting-block__warning">
          <svg-icon icon-class="data-explanation" />
          {{ $t('model.upload.argsReminder', {mainScriptName}) }}
        </div>
        <draggable
          v-model="tempArgs.input">
          <model-column-setting-card
            v-for="(column, index) in tempArgs.input"
            :column-info="column"
            :data-type-option-list="statsTypeOptionList"
            :column-list="tempArgs.input"
            :key="`input-${column.id}`"
            @updateDataColumn="updateDataColumn($event, column.id, tempArgs.input)"
            @remove="removeColumnCard(index, tempArgs.input)"
          />
        </draggable> 
        <button
          class="btn btn-m btn-outline"
          @click="addNewColumnCard(tempArgs.input)"
        >
          <svg-icon 
            icon-class="plus" 
            class="icon" />{{ $t('button.add') }}
        </button>
      </div>
      <!-- Output 參數設定 -->
      <div 
        class="setting-block">
        <div class="setting-block__title">
          {{ $t('model.upload.outputArgsSetting') }}
          <div class="setting-block__reminder">
            {{ "*" + $t('model.upload.columnReminder') }}
          </div>
        </div>
        <draggable
          v-model="tempArgs.output">
          <model-column-setting-card
            v-for="(column, index) in tempArgs.output"
            :column-info="column"
            :data-type-option-list="statsTypeOptionList"
            :column-list="tempArgs.output"
            :key="`output-${column.id}`"
            @updateDataColumn="updateDataColumn($event, column.id, tempArgs.output)"
            @remove="removeColumnCard(index, tempArgs.output)"
          />
        </draggable> 
        <button
          class="btn btn-m btn-outline"
          @click="addNewColumnCard(tempArgs.output)"
        >
          <svg-icon 
            icon-class="plus" 
            class="icon" />{{ $t('button.add') }}
        </button>
      </div>
      <button
        v-if="isArgsTouched"
        :disabled="isProcessing"
        class="btn btn-default"
        @click="save"
      >
        <span v-if="isProcessing">
          <svg-icon 
            v-if="isProcessing" 
            icon-class="spinner"/>
          {{ $t('button.processing') }}
        </span>
        <span v-else>{{ $t('button.save') }}</span>
      </button>
    </div>
  </div>
</template>
<script>
import BreadCrumb from './components/BreadCrumb.vue'
import ModelColumnSettingCard from './scriptExecution/components/ModelColumnSettingCard'
import draggable from 'vuedraggable'
import { getModelInfo, modifyModelInfo } from '@/API/Model'
import { statsTypeOptionList } from '@/utils/general'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'ConfigSetting',
  inject: ['$validator'],
  components: {
    BreadCrumb,
    ModelColumnSettingCard,
    draggable
  },
  data () {
    return {
      isLoading: false,
      isProcessing: false,
      modelInfo: {},
      tempArgs: {},
      statsTypeOptionList,
      mainScriptName: 'main.py'
    }
  },
  computed: {
    modelId () {
      return this.$route.params['model_id']
    },
    isArgsTouched () {
      return JSON.stringify(this.tempArgs) !== JSON.stringify(this.modelInfo.ioArgsDo)
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.isLoading = true
      getModelInfo(this.modelId)
        .then((response) => {
          
          response = {
            createdAt: "2019.02.03",
            createdBy: "youtuber",
            id: 0,
            ioArgsDo: {
              input: [
                {
                  modelColumnName: "時間",
                  statsType: "DATETIME"
                },
                {
                  modelColumnName: "成本",
                  statsType: "Numeric"
                }
              ],
              output: [
                {
                  modelColumnName: "成本",
                  statsType: "Numeric"
                },
                {
                  modelColumnName: "數量",
                  statsType: "Numeric"
                }
              ]
            },
            models: [
              "model1", "model2"
            ],
            name: "modelName",
            updatedAt: "2019.02.03"
          }
          this.modelInfo = response
          this.modelInfo = {
            ...response,
            ioArgsDo: {
              input: response.ioArgsDo.input.map(item => {
                return {
                  ...item,
                  id: uuidv4()
                }
              }),
              output: response.ioArgsDo.output.map(item => {
                return {
                  ...item,
                  id: uuidv4()
                }
              }),
            }
          }
          this.tempArgs = JSON.parse(JSON.stringify(this.modelInfo.ioArgsDo))
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    addNewColumnCard (args) {
      args.push({
        statsType: null,
        modelColumnName: null,
        id: uuidv4()
      })
    },
    removeColumnCard(index, args) {
      args.splice(index, 1)
    },
    updateDataColumn(statesType, selectedColumnCardId, args) {
      const columnCard = args.find(columnCard => columnCard.id === selectedColumnCardId)
      columnCard.statsType = statesType
    },
    save () {
      this.$validator.validateAll().then(isValidate => {
        if (!isValidate) return
        this.isProcessing = true
        modifyModelInfo(this.modelId, { 
          ...this.modelInfo,
          ioArgsDo: this.tempArgs
        }).finally(() => {
          this.isShowRenameDialog = false
        })
      })
    }
  }
  
}
</script>
<style lang="scss" scoped>
.model-config-setting {
  .setting-block {
    /deep/ .el-input__inner {
      padding-left: 0;
      border-bottom: 1px solid #FFFFFF;
    }

    /deep/ .input-field {
      &__label {
        font-size: 14px;
        color: #CCCCCC;
      }

      .el-input__inner {
        &::placeholder { 
          font-size: 14px;
        }
      }
    }
  }
}
</style>

