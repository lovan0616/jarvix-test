<template>
  <default-select 
    v-model="timeZoneId"
    :option-list="timeZoneList"
    class="timezone-select"
  />
</template>

<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import moment from 'moment-timezone'

export default {
  components: {DefaultSelect},
  props: {
    currentId: {
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
        return this.currentId
      },
      set(val){
        this.$emit('update:currentId',val)
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