<template>
  <div class="root-cause-description">
    <div class="description">
      {{description}}
    </div>
    <div class="causes">
      <div class="cause-item" v-for="(cause, index) in causes" v-bind:key="index">
        <div class="cause-item-header">
          <div class="cause-item-column">{{cause.column}}</div>
          <div class="cause-item-weight">权重: {{cause.weight}}</div>
        </div>
        <div class="cause-item-description">{{cause.description}}</div>
      </div>
    </div>
    <ul class="notes">
      <li v-for="(note, index) in notes" v-bind:key="index">
        # {{note}}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'RootCauseDescription',
  props: {
    description: {type: String, default: ''},
    causes: {type: Object, default: () => []},
    notes: {type: Object, default: () => []}
  }
}
</script>
<style lang="scss" scoped>
.root-cause-description {
  letter-spacing: 0.2em;
  padding-right: 36px;

  .description {
    font-size: 14px;
    margin-bottom: 24px;
  }

  .causes {
    margin-bottom: 48px;
  }

  .notes {
    font-size: 12px;
    color: #a7a7a7;
    padding: 0;
  }

  .cause-item {
    margin-bottom: 16px;
  }

  .cause-item-header {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 4px;

    .cause-item-column {
      font-size: 20px;
      margin-right: 20px;
      color: #FFDF6F;
    }
    .cause-item-weight {
      letter-spacing: 0.05em;
      font-size: 12px;
    }
  }
  .cause-item-description {
    font-size: 13px;
  }
}
</style>
