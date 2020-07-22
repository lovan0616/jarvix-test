<template>
  <page-layout>
    <div class="share-result">
      <spinner 
        v-if="isLoading"
        :title="$t('resultDescription.analysisProcessing')"
        class="layout-spinner"
        size="50"
      />
      <empty-result
        v-else-if="!layout"
        :result-info="emptyMsg"
      />
      <component
        v-else
        :is="layout"
        :data-result-id="currentResultId"
        :result-info="resultInfo"
        :restrictions="restrictInfo"
        :segmentation-payload="segmentationPayload"
      />
    </div>
  </page-layout>
</template>
<script>
import PageLayout from '@/components/layout/PageLayout'

export default {
  name: 'SingleResult',
  components: {
    PageLayout
  },
  data () {
    return {
      isLoading: true,
      layout: null,
      resultInfo: null,
      restrictInfo: [],
      segmentationPayload: null,
      timeoutFunction: null,
      currentResultId: this.$route.params.id
    }
  },
  computed: {
    emptyMsg () {
      return {
        title: this.$t('editing.emptyResult'),
        description: this.$t('editing.emptyPinboard')
      }
    }
  },
  mounted () {
    this.fetchData(this.currentResultId)
  },
  methods: {
    fetchData (resultId) {
      this.$store.dispatch('chatBot/getComponentList', resultId)
        .then(componentResponse => {
          switch (componentResponse.status) {
            case 'Process':
            case 'Ready':
              this.timeoutFunction = window.setTimeout(() => {
                this.fetchData(resultId)
              }, this.totalSec)

              this.totalSec += this.periodSec
              this.periodSec = this.totalSec
              break
            case 'Complete':
              this.totalSec = 50
              this.periodSec = 200
              this.resultInfo = componentResponse.componentIds
              this.restrictInfo = componentResponse.restrictions
              this.layout = this.getLayout(componentResponse.layout)
              this.segmentationPayload = componentResponse.segmentationPayload
              this.isLoading = false
              break
            case 'Disable':
            case 'Delete':
            case 'Warn':
            case 'Fail':
              this.layout = 'EmptyResult'
              this.isLoading = false
              break
          }
        })
        .catch(() => {
          this.isLoading = false
        })
    }
  },
}
</script>