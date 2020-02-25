<template>
  <div class="unknown-info-block">
    <div class="icon-block">
      <svg-icon
        icon-class="alert-circle-outline"
        class="icon"
      ></svg-icon>
    </div>
    <div class="content-block">
      <div class="content">{{ $t('resultDescription.systemQuestionAnalysis', {question: segmentationInfo.question}) }}
        <span v-if="segmentationInfo.unknownToken.length > 0">“{{ unknowTokenList }}” {{ $t('resultDescription.systemUnknownTokenList') }}</span>
        <span v-if="segmentationInfo.unknownToken.length > 0 && segmentationInfo.nlpToken.length > 0">，</span>
        <template
          v-if="segmentationInfo.nlpToken.length > 0"
        >
          <span
            v-for="(nlpToken, index) in segmentationInfo.nlpToken"
            :key="index"
          >“{{ nlpToken.word }}” {{ $t('resultDescription.beRecognized') }} “{{ nlpToken.matchedWord }}”<span v-if="index < segmentationInfo.nlpToken.length - 1">、</span></span>
        </template>。
      </div>
      <a href="javascript:void(0)" class="remove-link"
        @click="close"
      >
        <svg-icon icon-class="remove-circle"></svg-icon>
      </a>
    </div>
  </div>
</template>
<script>
export default {
  name: 'UnkonwnInfoBlock',
  props: {
    segmentationInfo: {
      type: Object,
      default () {
        return {
          question: null,
          unknownToken: [],
          nlpToken: []
        }
      }
    }
  },
  methods: {
    close () {
      this.$emit('close')
    }
  },
  computed: {
    unknowTokenList () {
      return this.segmentationInfo.unknownToken.map(element => element.matchedWord).join(', ')
    }
  }
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
