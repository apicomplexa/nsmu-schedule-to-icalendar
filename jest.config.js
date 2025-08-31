module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  moduleFileExtensions: ['js', 'ts', 'json', 'node'],
  moduleNameMapper: { '@/(.*)': '<rootDir>/src/$1' },
  testMatch: ['**/src/**/*.test.(js|ts)'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
}
