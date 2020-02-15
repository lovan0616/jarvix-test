<template>
  <el-tooltip placement="bottom"
    :tabindex="999"
    :popper-class="tokenInfo.type"
    :content="tokenInfo.type === 'Datavalue' || tokenInfo.type === 'Datacolumn' ? $t(`segmentationToken.${tokenInfo.type}`, {name: tokenInfo.properties.datacolumnPrimaryAlias, dataFrame: tokenInfo.properties.dataframePrimaryAlias}) : $t(`segmentationToken.${tokenInfo.type}`)"
  >
    <span class="question-token"
      :class="tokenInfo.type"
    >{{tokenInfo.matchedWord}}</span>
  </el-tooltip>
</template>
<script>
export default {
  name: 'QuestionNameToken',
  props: {
    tokenInfo: {
      type: Object
    }
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
