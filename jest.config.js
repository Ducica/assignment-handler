module.exports = {
  preset: "ts-jest",
  globals: {
    extensionsToTreatAsEsm: [".ts"],
    "ts-jest": {
      useESM: true,
    },
  },
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx|js|jsx)?$": "ts-jest",
    //"^.+\\.tsx?$": "ts-jest",
  },

  transformIgnorePatterns: [],
};
