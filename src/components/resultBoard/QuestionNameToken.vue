<template>
  <div class="question-token"
    :class="tokenInfo.type"
  >{{ tokenInfo.matchedWord }}<!--
    --><div class="name-info-tooltip">
      {{ tokenInfo.type === 'Datavalue' || tokenInfo.type === 'Datacolumn' ? $t(`segmentationToken.${tokenInfo.type}`, {name: tokenInfo.properties.datacolumnPrimaryAlias}) : $t(`segmentationToken.${tokenInfo.type}`) }}
    </div>
  </div>
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

    .name-info-tooltip {
      background-color: #44D2FF;

      &:after {
        border-bottom-color: #44D2FF;
        box-shadow: 0px 2px 15px rgba(71, 235, 251, 0.5);
      }
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

    .name-info-tooltip {
      background-color: #CA66DA;

      &:after {
        border-color: transparent;
        border-bottom-color: #CA66DA;
        box-shadow: 0px 2px 15px rgba(71, 235, 251, 0.5);
      }
    }
  }
  &.DtToken {
    border-bottom: 1px solid #FF9559;

    &:hover {
      background-color: rgba(255, 149, 89, 0.7);
    }

    .name-info-tooltip {
      background-color: #FF9559;

      &:after {
        border-bottom-color: #FF9559;
        box-shadow: 0px 2px 15px rgba(71, 235, 251, 0.5);
      }
    }
  }

  &:hover {
    .name-info-tooltip {
      display: block;
    }
  }

  .name-info-tooltip {
    display: none;
    position: absolute;
    top: 110%;
    left: 50%;
    transform: translateX(-50%);
    margin: auto;
    width: auto;
    font-size: 14px;
    line-height: 32px;
    // 處理寬度被 parent 限制的問題
    white-space:nowrap;
    text-align: center;
    background-color: #000;
    box-shadow: 0px 2px 15px rgba(71, 235, 251, 0.5);
    border-radius: 8px;
    padding: 5px 8px;
    z-index: 999;

    &:after {
      bottom: 100%;
      left: 50%;
      border: solid transparent;
      content: " ";
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
      border-bottom-color: #000;
      border-width: 7px;
      margin-left: -7px;
    }
  }
}
</style>
