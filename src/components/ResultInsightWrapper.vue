<template>
  <div class="insight-wrapper">
    <div class="insight__title">
      <svg-icon
        v-if="iconName"
        :icon-class="iconName"
      />
      {{ title }}
    </div>
    <keep-alive>
      <task
        :key="415847"
        :component-id="415847"
        :is-show-legend="false"
        :is-as-result-insight="true"
        intend="sub_insight"
        @setDiagram="setDiagram"
      />
    </keep-alive>
    <div class="insight_description" />
    <!-- <keep-alive>
      <task
        :key="taskKey"
        :component-id="componentId"
        intend="sub_insight"
        @setDiagram="setDiagram"
      />
    </keep-alive> -->
  </div>
</template>

<script>
export default {
  name: 'ResultInsightWrapper',
  props: {
    taskKey: {
      type: Number,
      default: null
    },
    componentId: {
      type: Number,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    iconName: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      diagram: null
    }
  },
  computed: {
    isGraphicInsight () {
      switch (this.diagram) {
        case 'bar_chart':
          return true
        default:
          return false
      }
    }
  },
  methods: {
    setDiagram (diagram) {
      this.diagram = diagram
    }
  }
}
</script>
