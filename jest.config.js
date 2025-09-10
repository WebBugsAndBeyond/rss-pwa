module.exports = {
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: [
      "<rootDir>/src/**/*.ts",
      "!<rootDir>/test/**/*.test.ts"
    ],
  
    // The directory where Jest should output its coverage files
    coverageDirectory: "coverage",
  
    // An array of regexp pattern strings used to skip coverage collection
    coveragePathIgnorePatterns: [
      "/node_modules/"
    ],
  
    // A list of reporter names that Jest uses when writing coverage reports
    coverageReporters: [
      "json",
      "text",
      "lcov",
      "clover",
      "cobertura"
    ],
  
    // An object that configures minimum threshold enforcement for coverage results
    coverageThreshold: {
      global: {
        branches: 50, functions: 40, lines: 40, statements: 40
      }
    },
  
    // globals: {
    //     'ts-jest': 'tsconfig.test.json',
    // },
    //bail: 1,
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    verbose: true,
    // The paths to modules that run some code to configure or set up the testing environment before each test
    setupFiles: [
      "./jest.setup.js"
    ],
}