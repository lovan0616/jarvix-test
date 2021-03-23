<template>
  <div class="block__form">
    <div class="form__item">
      <div class="form__label">
        *Utilization
      </div>
      <div class="form__content">
        <default-select
          v-model="setting.capacity"
          :options="priorityOptions"
        />
      </div>
    </div>
    <div class="form__item">
      <div class="form__label">
        *Resource
      </div>
      <div class="form__content">
        <default-select
          v-model="setting.ofr"
          :options="priorityOptions"
        />
      </div>
    </div>
    <div class="form__item">
      <div class="form__label">
        *Turnover Time
      </div>
      <div class="form__content">
        <default-select
          v-model="setting.cycleTime"
          :options="priorityOptions"
        />
      </div>
    </div>
    <div class="form__item">
      <div class="form__label">
        *Cost
      </div>
      <div class="form__content">
        <default-select
          v-model="setting.utilization"
          :options="priorityOptions"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'KpiSetting',
  props: {
    setting: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      priorityOptions: [
        { value: 1, lable: '1' },
        { value: 2, lable: '2' },
        { value: 3, lable: '3' },
        { value: 4, lable: '4' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped></style>
