module.exports = {
  root: true,
  parser: 'babel-eslint',
  globals: {
    THING: true
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': ['error', { allow: ['warn', 'error', 'table'] }]
  }
}
