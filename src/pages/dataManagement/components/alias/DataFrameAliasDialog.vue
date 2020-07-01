<template>
  <writing-dialog
    :button="$t('button.save')"
    :title="$t('editing.dataFrameAliasSetting')"
    :show-both="true"
    @closeDialog="$emit('close')"
    @confirmBtn="createAlias"
  >
    <spinner 
      v-if="isSaving || isLoading"
      :title="getSpinnerTitle"
      class="layout-spinner"
      size="50"
    />
    <div 
      v-else 
      class="dialog-container">
      <empty-info-block
        v-if="dataFrameAlias.length === 0"
        :msg="$t('editing.emptyDataFrameAlias')"
        class="empty-info-block"
      />
      <div
        v-for="(alias, index) in dataFrameAlias"
        v-else
        :key="index"
        class="alias-item"
      >
        <input-verify
          v-validate="`required|max:${max}`"
          v-model="alias.name"
          :placeholder="$t('editing.dataFrameAliasInputPlaceholder')"
          :name="'alias' + '-' + index"
          class="dialog-input"
        />
        <a
          href="javascript:void(0)"
          class="link remove"
          @click="removeDataFrameAlias(index)">
          {{ $t('button.remove') }}
        </a>
      </div>
      <button 
        class="btn btn-secondary add" 
        @click="addNewAlias">
        <svg-icon icon-class="plus"/>
        {{ $t('button.add') }}
      </button>
    </div>
  </writing-dialog>
</template>

<script>
import { getDataFrameAlias, patchDataFrameAlias } from '@/API/Alias'
import InputVerify from '@/components/InputVerify'
import EmptyInfoBlock from '@/components/EmptyInfoBlock'
import WritingDialog from '@/components/dialog/WritingDialog'
import { Message } from 'element-ui'

export default {
  name: 'DataFrameAliasDialog',
  inject: ['$validator'],
  components: {
    WritingDialog,
    InputVerify,
    EmptyInfoBlock
  },
  props: {
    dataFrameInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isSaving: false,
      isLoading: false,
      dataFrameAlias: []
    }
  },
  computed: {
    getSpinnerTitle () {
      return this.isLoading ? this.$t('editing.loading') : this.$t('editing.isSaving')
    },
    max () {
      return this.$store.getters['validation/fieldCommonMaxLength']
    }
  },
  mounted () {
    this.fetchDataFramAlias()
  },
  methods: {
    fetchDataFramAlias () {
      this.isLoading = true
      getDataFrameAlias(this.dataFrameInfo.id)
        .then(res => {
          const result = res[0]
          if (result) {
            this.dataFrameAlias = result.alias.map(alias => {
              return { name: alias }
            })
          }
        })
        .catch(() => {})
        .finally(() => {
          this.isLoading = false
        })
    },
    createAlias () {
      this.$validator.validateAll().then(isValidate => {
        if (!isValidate) return
        this.isSaving = true
        patchDataFrameAlias([{
          alias: this.dataFrameAlias.map(a => a.name),
          dataFrameId: this.dataFrameInfo.id,
          dataValue: this.dataFrameInfo.primaryAlias
        }])
          .then(() => {
            Message({
              message: this.$t('message.saveSuccess'),
              type: 'success',
              duration: 3 * 1000
            })
            this.isSaving = false
            this.$emit('close')
          })
          .catch(() => {})
          .finally(() => {
            this.isSaving = false
          })
      })
    },
    removeDataFrameAlias (index) {
      this.dataFrameAlias.splice(index, 1)
    },
    addNewAlias () {
      this.dataFrameAlias.push({
        name: ''
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.dialog-box {
  .dialog-inner-box {
    position: relative;
    .dialog-container {
      .alias-item:first-child {
        margin-top: 24px;
      }
    }
  }
  .alias-item {
    width: 100%;
    display: flex;
    align-items: top;
    justify-content: space-between;
    .dialog-input {
      flex: 1;
    }
    .link.remove {
      margin-left: 12px;
      line-height: 40px;
    }
  }

  .btn.add {
    position: absolute;
    left: 24px;
    bottom: 24px;
  }
}

.layout-spinner {
  height: auto;
}

.empty-info-block {
  margin: 20px 0;
}
</style>
