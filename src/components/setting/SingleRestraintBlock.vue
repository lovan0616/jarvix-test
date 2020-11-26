<template>
  <div class="single-restraint-block restraint">
    <div class="restraint__header">
      {{ $t('resultDescription.restrict') + index }}
    </div>
    <div class="restraint__content">
      <template
        v-if="restraint.type === 'compound'"
      >
        <div
          v-for="(sub_restraint, restraintsIndex) in restraint.restraints"
          :key="'restraints-' + index + '-' + restraintsIndex"
          class="restraint__list"
        > 
          <span class="restraint__list--name">{{ sub_restraint.properties.display_name }} : </span>
          <template v-if="sub_restraint.type === 'enum'">
            {{ sub_restraint.properties['display_datavalues'].join(', ') }}
          </template>
          <template v-if="sub_restraint.type === 'range'">
            {{ isDateTime(sub_restraint.properties.data_type) ? customerTimeFormatter(sub_restraint.properties.start, sub_restraint.properties.timeScope) : roundNumber(sub_restraint.properties.start) }}
            - {{ isDateTime(sub_restraint.properties.data_type) ? customerTimeFormatter(sub_restraint.properties.end, sub_restraint.properties.timeScope) : roundNumber(sub_restraint.properties.end) }}
          </template>
        </div>
      </template>
      <template v-else>
        <div class="restraint__list">
          <span class="restraint__list--name">{{ restraint.properties.display_name }} : </span>
          <template v-if="restraint.type === 'enum'">
            {{ restraint.properties['display_datavalues'].join(', ') }}
          </template>
          <template v-if="restraint.type === 'range'">
            {{ isDateTime(restraint.properties.data_type) ? customerTimeFormatter(restraint.properties.start, restraint.properties.timeScope) : roundNumber(restraint.properties.start) }}
            - {{ isDateTime(restraint.properties.data_type) ? customerTimeFormatter(restraint.properties.end, restraint.properties.timeScope) : roundNumber(restraint.properties.end) }}
          </template>
        </div>
      </template>
    </div>
    <div class="restraint__action">
      <div
        class="restraint__action--edit"
        @click="editRestraint"
      >
        <svg-icon
          icon-class="edit"/>
      </div>
      <div
        class="restraint__action--delete"
        @click="deleteRestraint"
      >
        <svg-icon
          icon-class="delete"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SingleRestraintBlock",
  components: {
  },
  props: {
    restraint: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      required: true
    }
  },
  methods: {
    isDateTime (type) {
      return type === "datetime"
    },
    editRestraint() {
      this.$emit('restraint-edit')
    },
    deleteRestraint() {
      this.$emit('restraint-delete')
    }
  },

}
</script>

<style lang="scss" scoped>
.single-restraint-block {
  padding: 12px;
  border-radius: 8px;
  background: #1C292B;

  &:not(:last-child) {
    margin-bottom: 8px;
  }

  .restraint {
    &__header {
      margin-bottom: 8px;
      font-size: 14px;
      line-height: 22px;
      font-weight: 600;
    }

    &__list {
      position: relative;
      margin-left: 10px;
      font-size: 12px;
      line-height: 22px;
      color: #FFF;

      &:not(:last-child) {
        margin-bottom: 8px;
      }

      &:before {
        content: '';
        position: absolute;
        top: 8px;
        left: -10px;
        border: 2px solid $theme-color-primary;
      }

      &--name {
        display: block;
      }
    }

    &__action {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;

      &--edit, &--delete {
        color: #FFF;

        &:hover {
          color: $theme-color-primary;
        }
      }

      &--edit {
        margin-right: 8px;
      }
    }
  }
}
</style>