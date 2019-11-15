<template>
  <div
    :class="[`row-description ${className}`, {'description-reverse': !positionLeft}]"
  >
    <div
      :class="[{'description-space description-text-right': positionLeft, 'description-text': twoRow}]"
    >
    <span v-if="step">{{ step }}<br></span>
      {{ text }}
    </div>
    <div
      :class="['description-round-empty', {'description-space': !positionLeft}]"
    >
    </div>
    <div :class="`description-line ${lineClassName}`"></div>
    <div class="description-round-full"></div>
  </div>
</template>
<script>
export default {
  name: 'rowDescription',
  props: {
    positionLeft: {
      type: Boolean,
      default: true
    },
    className: {
      type: String
    },
    lineClassName: {
      type: String
    },
    text: {
      type: String
    },
    twoRow: {
      type: Boolean
    },
    step: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>

.row-description {
    position: absolute;
    display: flex;
    align-items: center;
    color: #FFDF6F;
}

.description-space {
    margin-right: 4px;
}

.description-round-empty {
  width: 8px;
  height: 8px;
  border: 1px solid #FFDF6F;
  border-radius: 99px;
}

.description-line {
  height: 1px;
  background: #FFDF6F;
}

.description-round-full {
  width: 8px;
  height: 8px;
  background: #FFDF6F;
  border-radius: 99px;
}

.description-text {
    width: 100px;
}

.description-text-right {
  text-align: right;
}

.first-interface-line {
  width: 15px;
}

.second-interface-box {
  left: -156px;
  top: 148px;
}

.second-interface-line {
  width: 185px;
}

.third-interface-box {
  right: -85px;
  top: 0px;
}

.third-interface-line {
  width: 15px;
}

.fouth-interface-box {
  right: -84px;
  top: 68px;
}

.fouth-interface-line {
  width: 29px;
}

// menu

.first-menu-box {
  right: -144px;
  top: 68px;
}

.first-menu-line {
  width: 126px;
}

.second-menu-box {
  right: -138px;
  top: 55px;
}

.second-menu-line {
  width: 42px;
}

// index page

.first-index-box {
  right: -130px;
  top: 53px;
}

.first-index-line {
  width: 28px;
}

.second-index-box {
  right: -131px;
  top: 183px;
}

.second-index-line {
  width: 28px;
}

// data

.first-data-box {
  right: -141px;
  top: 43px;
}

.first-data-line {
  width: 134px;
}

.second-data-box {
  left: -122px;
  top: 63px;
}

.second-data-line {
  width: 40px;
}

.first-sheet-box {
  left: -125px;
  top: 179px;
}

.first-sheet-line {
  width: 48px;
}

.second-sheet-box {
  left: -123px;
  top: 63px;
}

.second-sheet-line {
  width: 40px;
}

.first-data-edit-box {
  right: -137px;
  top: 105px;
}

.first-data-edit-line {
  width: 131px;
}

.second-data-edit-box {
  right: -138px;
  top: 49px;
}

.second-data-edit-line {
  width: 217px;
}

.third-data-edit-box {
  left: -108px;
  top: 49px;
}

.third-data-edit-line {
  width: 283px;
}

.forth-data-edit-box {
  right: -104px;
  top: 49px;
}

.forth-data-edit-line {
  width: 222px;
}

.fifth-data-edit-box {
  right: -110px;
  top: 4px;
}

.fifth-data-edit-line {
  width: 191px;
}

// connect

.first-data-connect-box {
  right: -158px;
  top: 64px;
}

.first-data-connect-line {
  width: 112px;
}

.second-data-connect-box {
  left: -154px;
  top: 30px;
}

.second-data-connect-line {
  width: 191px;
}

.third-data-connect-box {
  left: -140px;
  top: 90px;
}

.third-data-connect-line {
  width: 211px;
}

.fourth-data-connect-box {
  right: -104px;
  top: 159px;
}

.fourth-data-connect-line {
  width: 190px;
}

.description-reverse {
  flex-direction: row-reverse;
}
</style>
