<template>
  <div class="edit-feature-dialog full-page-dialog">
    <div class="dialog-container">
      <div class="dialog-title">
        {{ $t('clustering.createClusteringColumn') }}
      </div>
      <div class="feature-block">
        <div class="block-title">{{ $t('editing.tableName') }}</div>
        {{ dataFrameAlias }}
      </div>
      <div class="feature-block">
        <div class="block-title">{{ $t('clustering.clusteringColumnName') }}（{{ $t('editing.isRequired') }}）</div>
        <div class="input-block name">
          <input-block
            v-validate="`required|max:${max}`"
            v-model="columnPrimaryAlias"
            :placeholder="$t('editing.pleaseEnterName')"
            name="columnPrimaryAlias"
          />
        </div>
      </div>
      <div class="feature-block">
        <div class="block-title">{{ $t('clustering.clusteringNameSetting') }}</div>
        <div class="block-header">
          <div class="cell">{{ $t('clustering.clusteringName') }}</div>
          <div class="cell">{{ $t('clustering.customName') }}</div>
        </div>
        <div 
          v-for="(input, index) in labelSettingList" 
          :key="input + '-' + index" 
          class="block-list list">
          <div class="list__label">{{ labelList[index] }}</div>
          <svg-icon 
            icon-class="go-right" 
            class="list__icon"/>
          <div class="list__value">
            <div class="input-field__input-box">
              <input-verify
                v-validate="`required|max:${max}`"
                v-model.trim="input.customValue"
                :placeholder="$t('editing.pleaseEnterName')"
                :name="'input' + index"
                type="text"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="button-block">
        <button
          :disabled="isProcessing"
          class="btn btn-outline"
          @click="$emit('close')"
        >{{ $t('button.cancel') }}</button>
        <button
          :disabled="isProcessing"
          class="btn btn-default"
          @click="save"
        >
          <span v-if="isProcessing"><svg-icon icon-class="spinner"/>{{ $t('button.processing') }}</span>
          <span v-else>{{ $t('button.create') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { saveClusteringColumn } from '@/API/DataSource'
import { Message } from 'element-ui'
import { mapState, mapGetters } from 'vuex'
import InputBlock from '@/components/InputBlock'
import InputVerify from '@/components/InputVerify'

export default {
  name: 'SaveClusteringDialog',
  inject: ['$validator'],
  components: {
    InputBlock,
    InputVerify
  },
  props: {
    resultId: {
      type: Number,
      default: null
    },
    dataFrameAlias: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isProcessing: false,
      columnPrimaryAlias: '',
      labelList: [],
      labelSettingList: []
    }
  },
  computed: {
    ...mapState('dataSource', ['clusteringInfo']),
    ...mapState('userManagement', ['userId']),
    ...mapGetters('userManagement', ['getCurrentAccountId', 'getCurrentGroupId', 'getCurrentGroupName']),
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    }
  },
  mounted () {
    this.labelSettingList = [
      ...this.clusteringInfo.hasOutlier ? [{ clusterIndex: 0, customValue: 'outlier' }] : [],
      ...Array.from(this.clusteringInfo.clusterList, (element, idx) => ({
        clusterIndex: idx + 1,
        customValue: element
      }))
    ]

    this.labelList = this.labelSettingList.map(element => element.customValue)
  },
  methods: {
    save () {
      this.$validator.validate()
        .then(isValid => {
          if (!isValid) return

          this.isProcessing = true
          saveClusteringColumn({
            primaryAlias: this.columnPrimaryAlias,
            askResultId: this.resultId,
            labelSettings: this.labelSettingList
          }).then(({ taskId }) => {
              Message({
                message: this.$t('clustering.buildingClusteringColumn'),
                type: 'success',
                duration: 3 * 1000,
                showClose: true
              })
              this.$store.commit('dataSource/addProcessingDataColumnList', {
                taskId,
                userId: this.userId,
                accountId: this.getCurrentAccountId,
                groupId: this.getCurrentGroupId,
                groupName: this.getCurrentGroupName
              })
            })
            .catch(() => {})
            .finally(() => {
              this.$emit('close')
              this.isProcessing = false
            })
        })
    }
  }
}
</script>
