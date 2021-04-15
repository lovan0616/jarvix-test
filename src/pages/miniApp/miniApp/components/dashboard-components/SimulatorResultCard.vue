<template>
  <div class="simulator-result-card">
    <div 
      v-for="(output, index) in outputList" 
      :key="index"
      class="output-field">
      <div class="output-field__label">{{ output.name }}</div>
      <div class="output-field__value">{{ output.value }}</div>
    </div>
    <hr>
    <div 
      v-for="(input, index) in inputList" 
      :key="index"
      class="input-field">
      <div class="input-field__label">{{ input.name }}</div>
      <div class="input-field__value">{{ input.value }}</div>
    </div>
  </div>
</template>

<script>

export default {
  name: "SimulatorResultCard",
  props: {
    result: {
      type: Array,
      default: () => ([])
    }
  },
  computed: {
    inputList() {
      return this.result.filter(param => param.type === 'input')
    },
    outputList() {
      return this.result.filter(param => param.type === 'output')
    }
  }
}
</script>

<style lang="scss" scoped>
.simulator-result-card {
  flex: 0 0 calc((100% - 30px) / 3);
  padding: 16px;
  min-width: 236px;
  height: 100%;
  background: #475353;
  border-radius: 5px;
  overflow-x: auto;

  &:not(:last-child) {
    margin-right: 8px;
  }

  &::-webkit-scrollbar {
    width: 5px;
  }

  .output-field {
    margin-bottom: 8px;
    
    &__label {
      margin-bottom: 4px;
      font-weight: 600;
      font-size: 12px;
      line-height: 17px;
      color: #AAAAAA;
    }

    &__value {
      font-size: 18px;
      line-height: 25px;
    }
  }

  hr {
    margin-block-end: 16px;
    margin-block-start: 16px;
    border: 0; 
    border-top: 1px solid #676E6E;
  }

  .input-field {
    display: flex;
    justify-content: center;
    &__label {
      flex: 0 0 50%;
      font-weight: 600;
      font-size: 12px;
      text-align: left;
      color: #AAAAAA;
    }

    &__value {
      flex: 0 0 50%;
      font-size: 12px;
      text-align: right;
      color: #EEEEEE;
    }

    &:not(:last-child) {
      margin-bottom: 5px;
    }
  }
}
</style>