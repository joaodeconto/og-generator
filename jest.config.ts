import nextJest from 'next/jest';

const createJestConfig = nextJest({ dir: './' });

const config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^components/(.*)$': '<rootDir>/components/$1',
    '^lib/(.*)$': '<rootDir>/lib/$1',
    '^app/(.*)$': '<rootDir>/app/$1',
  },
  coverageThreshold: {
    global: {
      branches: 60,
      lines: 70,
    },
  },
};

export default createJestConfig(config);
