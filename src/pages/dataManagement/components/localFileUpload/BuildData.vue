<template>
  <div class="build-data">
    <div class="dialog-body">
      {{ $t('editing.dataBuildingReminding') }}
    </div>
    <div class="dialog-footer">
      <div class="dialog-button-block">
        <button class="btn btn-default"
          @click="$emit('next')"
        >{{ $t('button.confirm') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { dataSourcePreprocessor } from '@/API/DataSource'

export default {
  data () {
    return {
    }
  },
  created () {
    let promiseList = []
    this.etlTableList.forEach((element, index) => {
      promiseList.push(dataSourcePreprocessor(element))
    })

    Promise.all(promiseList)
      .then(() => { this.$emit('next') })
      .catch(() => {})
  },
  computed: {
    etlTableList () {
      return this.$store.state.dataManagement.etlTableList
    }
  }
}
</script>

<style lang="scss" scoped>
.build-data {
  height: 50vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center
}
</style>
