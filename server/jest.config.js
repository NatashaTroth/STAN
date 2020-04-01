// module.exports = {
//   testEnvironment: "./tests/integration/StanEnvironment.js",
//   preset: "@shelf/jest-mongodb"
// };
module.exports = {
  testEnvironment: "node",
  // setupFiles: ["./tests/setup.js"],
  // testEnvironment: "./tests/integration/StanEnvironment.js",
  // preset: "@shelf/jest-mongodb",
  watchPathIgnorePatterns: ["<rootDir>/node_modules"]
  // moduleDirectories: ["node_modules"]

  // roots: ["src"]
};
