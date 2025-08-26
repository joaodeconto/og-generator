import '@testing-library/jest-dom'
import 'jest-canvas-mock'
import React from 'react'

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ComponentProps<'img'>) => {
    const rest = { ...props } as Record<string, unknown>;
    delete rest.fill;
    delete rest.unoptimized;
    return React.createElement('img', rest);
  },
}));
