const { createDefaultPreset } = require('ts-jest')

const tsJestTransformCfg = createDefaultPreset().transform

module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  moduleFileExtensions: ['js', 'ts', 'json', 'node'],
  moduleNameMapper: {
    '#/(.*)': '<rootDir>/src/$1',
    '#T/(.*)': '<rootDir>/src/types/$1',
    '#DS/(.*)': '<rootDir>/src/data-structures/$1',
  },
  testMatch: ['**/src/**/*.test.(js|ts)'],
  transform: {
    ...tsJestTransformCfg,
  },
}
