module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
  globals: {
    THING: {},
    conch: {}
  },
  rootDir: __dirname,
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],
  // snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  // setupFiles: ['<rootDir>/test/unit/setup'],
  coverageDirectory: 'coverage'
}
