module.exports = {
  root: true,

  env: {
    browser: true,
    node: true
  },

  parserOptions: {
    parser: 'babel-eslint'
  },

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 1 : 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 1 : 0,
    'no-tabs': 0,
    semi: ['error', 'always'],
    'vue/html-closing-bracket-newline': ['error', {
      singleline: 'never',
      multiline: 'never'
    }]
  },

  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ]
};
