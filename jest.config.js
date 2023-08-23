export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  // testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  testMatch: [
    '**/__tests__/**/*.test.tsx',
    '**/*.test.tsx',
    '**/__tests__/**/*.test.jsx',
    '**/*.test.jsx',
  ],
  coverageDirectory: 'coverage',
  extensionsToTreatAsEsm: ['.jsx', '.ts', '.tsx'],
  rootDir: './src',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!@shotgunjed)/'],
};
