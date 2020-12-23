<template>
  <div class="single-comparing-value-card">
    <div class="input-field">
      <default-select
        v-model="selectedParam"
        :option-list="paramOptionList"
        :placeholder="$t('alert.chooseMessageParam')"
        class="input-field__select"
        @change="$emit('change', selectedParam)"
      />
    </div>
    <div
      class="delete-icon-box"
      @click="$emit('delete')"
    >
      <svg-icon
        icon-class="delete"
        class="delete-icon"
      />
    </div>
  </div>
</template>

<script>
import DefaultSelect from '@/components/select/DefaultSelect'

export default {
  name: 'SingleMessageParamCard',
  components: {
    DefaultSelect
  },
  props: {
    paramOptionList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      selectedParam: null
    }
  }
}
</script>

<style lang="scss" scoped>
.single-comparing-value-card {
  height: 68px;
  background: rgba(72, 84, 84, 0.95);
  border-radius: 8px;
  padding: 8px 20px;
  margin-bottom: 12px;
  position: relative;
  
  .delete-icon {
    position: absolute;
    top: 12px;
    right: 12px;
    cursor: pointer;
  }
}
</style>