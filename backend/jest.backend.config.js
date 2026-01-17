export default {
  testEnvironment: "node",
  transform: {},
  roots: ["<rootDir>/test"],
  moduleFileExtensions: ["js", "json"],
  testPathIgnorePatterns: ["/node_modules/", "vitest"],
  modulePathIgnorePatterns: ["vitest"]
};
