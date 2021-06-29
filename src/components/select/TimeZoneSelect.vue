<template>
  <default-select 
    v-model="timeZoneId"
    :option-list="timeZoneList"
    class="timezone-select"
  />
</template>

<script>
import DefaultSelect from '@/components/select/DefaultSelect'
import timeZoneList from '@/utils/timeZone'

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
      return timeZoneList.map((item, i) => {
        return {
          value: i,
          name: `(${item.GMT}) ${item.zone[this.$i18n.locale]}`
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