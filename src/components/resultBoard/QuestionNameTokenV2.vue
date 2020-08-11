<template>
  <el-tooltip 
    :tabindex="999"
    :popper-class="tokenInfo.type"
    :hide-after="0"
    placement="bottom"
  >
    <div slot="content">{{ tooltipContent(tokenInfo) }}</div>
    <span 
      :class="tokenInfo.type"
      class="question-token"
    >{{ tokenInfo.word }}</span>
  </el-tooltip>
</template>
<script>
export default {
  name: 'QuestionNameToken',
  props: {
    tokenInfo: {
      type: Object,
      required: true
    }
  },
  computed: {
  },
  methods: {
    tooltipContent (tokenInfo) {
      switch (tokenInfo.type) {
        case 'COLUMN_SET':
          return this.$t('segmentationToken.ColumnSetToken', {
            matchedWord: tokenInfo.matchedWord
          })
        case 'DATA_VALUE':
          return this.$t('segmentationToken.DataValueToken', {
            matchedWord: tokenInfo.matchedWord
          })
        case 'DATA_COLUMN':
          return this.$t('segmentationToken.DataColumnToken', {
            matchedWord: tokenInfo.matchedWord
          })
        case 'NUMBER_RULE':
          if (tokenInfo.properties) {
            return this.$t('segmentationToken.NumRuleTokenHasProperty', {
              matchedWord: tokenInfo.matchedWord
            })
          } else {
            return this.$t(`segmentationToken.${tokenInfo.type}`)
          }
        case 'DATA_ROW':
          return this.$t('segmentationToken.DatarowToken', {
            matchedWord: tokenInfo.matchedWord
          })
        default:
          return this.$t(`segmentationToken.${tokenInfo.type}`)
      }
    }
  },
}
</script>
<style lang="scss" scoped>
.question-token {
  display: inline;
  position: relative;
  cursor: pointer;
  margin-right: 2px;

  &.filter {
    border-color: #FF9559;
  }

  &.Datacolumn {
    border-bottom: 1px solid #44D2FF;

    &:hover {
      background-color: rgba(68, 210, 255, 0.7);
    }
  }
  &.numeric {
    border-color: #CA66DA;
  }
  &.Datavalue {
    border-bottom: 1px solid #CA66DA;

    &:hover {
      background-color: rgba(202, 102, 218, 0.7);
    }
  }
  &.DtToken, &.FuzzyDtToken, &.TimeScope, &.NumRuleToken {
    border-bottom: 1px solid #FF9559;

    &:hover {
      background-color: rgba(255, 149, 89, 0.7);
    }
  }
}
</style>
<style lang="scss">
.el-tooltip__popper {
  box-shadow: 0px 2px 15px rgba(71, 235, 251, 0.5);
  border-radius: 8px;
  padding: 5px 8px;
  font-size: 14px;
  line-height: 32px;
  max-width: 50vw;

  &.is-dark {
    @include tokenTooltip(#000);
  }

  &.Datacolumn {
    @include tokenTooltip(#44D2FF);

    &:after {
      box-shadow: 0px 2px 15px rgba(71, 235, 251, 0.5);
    }
  }

  &.Datavalue {
    @include tokenTooltip(#CA66DA);

    &:after {
      box-shadow: 0px 2px 15px rgba(71, 235, 251, 0.5);
    }
  }

  &.DtToken, &.FuzzyDtToken, &.TimeScope {
    @include tokenTooltip(#FF9559);

    &:after {
      box-shadow: 0px 2px 15px rgba(71, 235, 251, 0.5);
    }
  }
}
</style>
