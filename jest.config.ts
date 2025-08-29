import nextJest from 'next/jest.js';

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
    // Global thresholds ratcheted to current baseline. We will
    // incrementally raise these as coverage improves.
    global: {
      branches: 60,
      lines: 80,
    },
    // Per-file no-regression locks for critical paths.
    // Increase gradually toward 90%+ for these files.
    'lib/images.ts': { branches: 70, lines: 89 },
    'lib/removeBg.ts': { branches: 75, lines: 90 },
    'lib/meta.ts': { branches: 91, lines: 97 },
    'lib/editorStore.ts': { branches: 69, lines: 91 },
    'components/Draggable.tsx': { branches: 88, lines: 100 },
  },
};

export default createJestConfig(config);
