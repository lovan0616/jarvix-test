<template>
  <div class="card">
    <div
      v-if="columnList.length > 1"
      :class="{ 'disabled': isProcessing || isLoading }"
      class="card__delete-icon"
      @click="removeColumn">
      <svg-icon 
        icon-class="delete" 
        class="icon"/>
    </div>
    <div class="input-field">
      <label class="input-field__label">欄位</label>
      <div class="input-field__input">
        <default-select 
          v-validate="'required'"
          :option-list="dataColumnOptionList"
          :placeholder="$t('batchLoad.chooseColumn')"
          :is-disabled="isProcessing || isLoading"
          v-model="columnInfo.columnId"
          :name="columnInfo.id"
          filterable
          class="input-field__select"
          @change="$emit('updateDataColumn', $event)"
        />
        <div 
          v-show="errors.has(columnInfo.id)"
          class="error-text"
        >{{ errors.first(columnInfo.id) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import DefaultSelect from '@/components/select/DefaultSelect'

export default {
  name: 'SingleColumnCard',
  inject: ['$validator'],
  components: {
    DefaultSelect,
  },
  props: {
    columnList: {
      type: Array,
      default: () => ([])
    },
    dataColumnOptionList: {
      type: Array,
      default: () => ([])
    },
    columnInfo: {
      type: Object,
      default: () => ({})
    },
    isProcessing: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    removeColumn () {
      if (this.isProcessing || this.isLoading) return
      this.$emit('remove', this.columnInfo.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  padding: 16px;
  border-radius: 8px;
  background-color: rgba(72, 84, 84, .95);
  margin-bottom: 15px;
  position: relative;

  &__delete-icon {
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;

    &.disabled {
      opacity: .7;
      cursor: not-allowed;
    }
  }
}
</style>