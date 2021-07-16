<template>
  <div class="unknown-info-block">
    <div class="icon-block">
      <svg-icon
        icon-class="alert-circle-outline"
        class="icon"
      />
    </div>
    <div class="content-block">
      <div class="content">{{ $t('resultDescription.systemQuestionAnalysis', {question: segmentationInfo.question}) }}
        <span v-if="unknownTokenCount">
          “{{ unknowTokenList }}” {{ $tc('resultDescription.systemUnknownTokenList', unknownTokenCount) }}
        </span>
      </div>
      <a 
        href="javascript:void(0)" 
        class="remove-link"
        @click="close"
      >
        <svg-icon icon-class="remove-circle"/>
      </a>
    </div>
  </div>
</template>
<script>
export default {
  name: 'UnknownInfoBlock',
  props: {
    segmentationInfo: {
      type: Object,
      default () {
        return {
          question: null,
          unknownToken: [],
        }
      }
    }
  },
  computed: {
    unknowTokenList () {
      return this.segmentationInfo.unknownToken.map(element => element.matchedWord).join(', ')
    },
    unknownTokenCount () {
      return this.segmentationInfo.unknownToken.length
    }
  },
  methods: {
    close () {
      this.$emit('close')
    }
  },
}
</script>
<style lang="scss" scoped>
.unknown-info-block {
  display: flex;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.55);
  border: 2px solid $theme-color-warning;
  min-height: 48px;
  margin-bottom: 16px;

  .icon-block {
    display: flex;
    width: 48px;
    background: $theme-color-warning;
    justify-content: center;
    align-items: center;

    .icon {
      font-size: 28px;
      color: #032D32;
    }
  }
  .content-block {
    flex: 1;
    display: flex;
    align-items: center;

    .content {
      flex: 1;
      padding: 12px 12px;
      letter-spacing: 0.1em;
    }

    .remove-link {
      width: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: rgba(255, 255, 255, 0.3);
      font-size: 20px;
    }
  }
}
</style>
