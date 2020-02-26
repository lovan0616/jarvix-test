<template>
  <el-tooltip placement="bottom"
    :tabindex="999"
    :popper-class="tokenInfo.type"
    :hide-after="0"
  >
    <div slot="content">{{tooltipContent(tokenInfo)}}
      <div v-if="tokenInfo.properties && tokenInfo.properties.length > 1">
        <span>{{ $t('resultDescription.hasColumn') }}</span>
        <span
          v-for="(property, propertyIndex) in tokenInfo.properties"
          :key="propertyIndex"
        >{{ property.datacolumnPrimaryAlias }}<span v-show="propertyIndex < tokenInfo.properties.length - 1">、</span></span>
      </div>
    </div>
    <span class="question-token"
      :class="tokenInfo.type"
    >{{tokenInfo.word}}</span>
  </el-tooltip>
</template>
<script>
export default {
  name: 'QuestionNameToken',
  props: {
    tokenInfo: {
      type: Object
    }
  },
  methods: {
    tooltipContent (tokenInfo) {
      switch (tokenInfo.type) {
        case 'ColumnSet':
          return this.$t('resultDescription.from') + tokenInfo.properties[0].dataframePrimaryAlias + this.$t('resultDescription.has') + tokenInfo.matchedWord
        case 'Datavalue':
          return this.$t('resultDescription.from') + tokenInfo.properties[0].dataframePrimaryAlias + this.$t('resultDescription.has') + tokenInfo.properties[0].datacolumnPrimaryAlias + this.$t('resultDescription.has') + this.$t(`segmentationToken.${tokenInfo.type}`) + this.$t(`resultDescription.recognize`) + tokenInfo.matchedWord
        case 'Datacolumn':
          return this.$t('resultDescription.from') + tokenInfo.properties[0].dataframePrimaryAlias + this.$t('resultDescription.has') + tokenInfo.properties[0].datacolumnPrimaryAlias + this.$t(`segmentationToken.${tokenInfo.type}`) + this.$t(`resultDescription.recognize`) + tokenInfo.matchedWord
        case 'Datarow':
          return this.$t('resultDescription.from') + tokenInfo.properties[0].dataframePrimaryAlias + this.$t('resultDescription.has') + this.$t(`segmentationToken.${tokenInfo.type}`) + tokenInfo.matchedWord
        default:
          return this.$t(`segmentationToken.${tokenInfo.type}`)
      }
    }
  },
  computed: {
  }
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
