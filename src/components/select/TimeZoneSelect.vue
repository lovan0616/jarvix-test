<template>
  <default-select 
    v-model="timeZoneId"
    :option-list="timeZoneList"
    :filterable="true"
    :popper-append-to-body="true"
    class="timezone-select"
  />
</template>

<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import moment from 'moment-timezone'

export default {
  components: {DefaultSelect},
  props: {
    value: {
      type: [String, Number],
      default: null
    }
  },
  computed: {
    timeZoneList() {
      return moment.tz.names().map((item) => {
        return {
          value: item,
          name: item
        }
      })
    },
    timeZoneId: {
      get(){
        return this.value
      },
      set(val){
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .timezone-select {
    padding-bottom: 0;
    border-bottom: 1px solid #fff;
  }
</style>