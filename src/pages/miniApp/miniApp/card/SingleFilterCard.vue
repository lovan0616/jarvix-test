<template>
  <div class="card">
    <div
      v-if="filterInfoList.length > 1"
      class="card__delete-icon"
      @click="$emit('remove', filterInfo.id)">
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
          :is-disabled="isProcessing"
          v-model="filterInfo.columnId"
          :name="name"
          filterable
          class="input-field__select"
          @change="$emit('updateDataColumn', $event)"
        />
        <div 
          v-show="errors.has(name)"
          class="error-text"
        >{{ errors.first(name) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import DefaultSelect from '@/components/select/DefaultSelect'

export default {
  name: 'SingleFilterCard',
  inject: ['$validator'],
  components: {
    DefaultSelect,
  },
  props: {
    filterInfoList: {
      type: Array,
      default: () => ([])
    },
    dataColumnOptionList: {
      type: Array,
      default: () => ([])
    },
    filterInfo: {
      type: Object,
      default: () => ({})
    },
    name: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isLoading: true,
      isProcessing: false
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
  }
}
</style>