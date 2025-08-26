import '@testing-library/jest-dom'
import 'jest-canvas-mock'
import React from 'react'

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => React.createElement('img', props),
}))
