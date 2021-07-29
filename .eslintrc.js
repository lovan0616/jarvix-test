module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/recommended',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard',
    'eslint:recommended'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/no-mutating-props': 0,
    'vue/no-v-html': 0,
    'vue/no-lone-template': 0,
    'vue/no-unused-components': 0,
    'vue/require-valid-default-prop': 0,
    'vue/return-in-computed-property': 0,
    'vue/attributes-order': 0,
    'vue/valid-v-show': 0,
    'vue/no-template-shadow': 0,
    'vue/no-unused-vars': 0,
    'vue/no-use-v-if-with-v-for': 0,
    'vue/one-component-per-file': 0,
    'vue/order-in-components': 0,
    'vue/require-default-prop': 0,
    'no-empty': 0,
    'no-return-assign': 0,
    'no-mixed-operators': 0,
    'no-prototype-builtins': 0,
    'prefer-const': 0,
    'no-tabs': 0,
    camelcase: 0,
    eqeqeq: 0,
    'no-unmodified-loop-condition': 0,
    'no-useless-call': 0,
    'handle-callback-err': 0,
    'no-sequences': 0,
    'no-unused-expressions': 0,
    'prefer-promise-reject-errors': 0
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
