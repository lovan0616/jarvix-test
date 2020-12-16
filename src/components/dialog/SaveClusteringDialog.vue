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
            name="columnPrimaryAlias"
          />
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

export default {
  name: 'SaveClusteringDialog',
  inject: ['$validator'],
  components: {
    InputBlock
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
      columnPrimaryAlias: '',
      isProcessing: false
    }
  },
  computed: {
    ...mapState('userManagement', ['userId']),
    ...mapGetters('userManagement', ['getCurrentAccountId', 'getCurrentGroupId', 'getCurrentGroupName']),
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    }
  },
  methods: {
    save () {
      this.$validator.validate('columnPrimaryAlias')
        .then(isValid => {
          if (!isValid) return

          this.isProcessing = true
          saveClusteringColumn({
            primaryAlias: this.columnPrimaryAlias,
            askResultId: this.resultId
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