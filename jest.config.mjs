export default {
  testEnvironment: "jest-environment-node",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|js?|tsx?|ts?|mjs?)$",
  transform: {
    "^.+\\.m?js$": "babel-jest",
  },
  testPathIgnorePatterns: ["<rootDir>/build/", "<rootDir>/node_modules/"],
  moduleFileExtensions: ["js", "jsx", "mjs"],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.mjs'],
};