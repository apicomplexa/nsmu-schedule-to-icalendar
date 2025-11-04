const { createDefaultPreset } = require('ts-jest')

const tsJestTransformCfg = createDefaultPreset().transform

module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  moduleFileExtensions: ['js', 'ts', 'json', 'node'],
  moduleNameMapper: {
    '#/(.*)': '<rootDir>/src/$1',
    '#types/(.*)': '<rootDir>/src/types/$1',
    '#tools/(.*)': '<rootDir>/src/tools/$1',
  },
  testMatch: ['**/src/**/*.test.(js|ts)'],
  transform: {
    ...tsJestTransformCfg,
  },
}
