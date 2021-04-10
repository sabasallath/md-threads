module.exports = {
  coverageDirectory: "./coverage",
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/index.tsx",
    "!src/serviceWorker.ts",
    "!**/node_modules/**",
    "!build/**",
  ],
  testEnvironment: "node",
  modulePaths: ["<rootDir>/src", "node_modules"],
  roots: ["src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx)$",
  coverageReporters: ["json", "lcov", "text"],
  coveragePathIgnorePatterns: [".*/src/.*\\.d\\.ts", ".*/src/testUtil/.*"],
  // Use the below to set coverage goals.
  // 'npm test' will fail if these metrics are violated
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
