<template>
  <div class="restriction-setting">
    <div
      class="restriction-setting__back-icon" 
      @click="backToPreviousPage">
      <svg-icon icon-class="arrow-left"/>
      {{ $t('dataFrameAdvanceSetting.filterCriteria') }}
    </div>
    <div class="restriction-setting__header">
      <h1 class="restriction-setting__title">{{ $t('dataFrameAdvanceSetting.restrictionSetting') }}</h1>
    </div>
    <button
      type="button"
      class="btn-m btn-outline add-restriction-btn"
      @click="addRestraint"
    ><span>
      <svg-icon icon-class="plus" />
      {{ $t('dataFrameAdvanceSetting.addRestriction') }}
    </span>
    </button>
    <div class="restriction-setting__content">
      <div 
        v-if="tempRestrictionList.length === 0" 
        class="empty-message">
        {{ $t('dataFrameAdvanceSetting.noRestrictionYet') }}
      </div>
      <template v-else>
        <single-restraint-block 
          v-for="(restraint, index) in tempRestrictionList" 
          :key="index"
          :index="index + 1"
          :restraint="restraint"
          @restraint-edit="editRestraint(index)"
          @restraint-delete="deleteRestraint(index)"
        />
      </template>
    </div>
  </div>
</template>
<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import SingleRestraintBlock from '@/components/setting/SingleRestraintBlock'
import { mapState } from 'vuex'

export default {
  name: 'FilterRestrictionSetting',
  components: {
    DefaultSelect,
    SingleRestraintBlock
  },
  props: {
    restriction: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      selectedColumn: [],
      tempRestrictionList: []
    }
  },
  computed: {
    ...mapState('dataFrameAdvanceSetting', ['columnList']),
    options () {
      return this.columnList.map((column, index) => {
        return {
          value: index,
          name: column.name,
          active: false
        }
      })
    }
  },
  mounted () {
    this.tempRestrictionList = JSON.parse(JSON.stringify(this.restriction))
  },
  methods: {
    backToPreviousPage () {
      this.$emit('prev')
    },
    addRestraint () {
      this.tempRestrictionList.push({
        restraints: [],
        type: 'compound'
      })
      this.$emit('edit-restraint', this.tempRestrictionList.length - 1)
    },
    editRestraint (index) {
      this.$emit('edit-restraint', index)
    },
    deleteRestraint (index) {
      this.tempRestrictionList.splice(index, 1)
      if(this.tempRestrictionList.length === 0)
        this.$emit('empty-restraint')
      else
        this.$emit('updated:restriction', this.tempRestrictionList)
    }
  },
}
</script>

<style lang="scss" scoped>
.restriction-setting {
  display: flex;
  flex-direction: column;
  padding: 16px 24px;
  height: 100%;
  background-color: transparent;

  &__back-icon {
    margin-bottom: 15px;
    font-size: 14px;
    color: $theme-color-primary;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }

  &__header {
    position: relative;
    margin: 0 0 15px 0;
    display: flex;
    flex-direction: row;
  }

  &__title {
    flex: 1;
    margin: 0;
    font-weight: 600;
    font-size: 16px;
    line-height: 22px;
  }

  .add-restriction-btn {
    margin-bottom: 15px;
    width: 100%;
  }

  &__content {
    flex: 1 1 auto;
    margin-bottom: 22px;
    overflow-y: auto;
    .empty-message {
      color: #AAAAAA;
      font-size: 12px;
    }
  }
}
</style>
