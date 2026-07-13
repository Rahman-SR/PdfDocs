import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

if (typeof URL.createObjectURL !== 'function') {
  Object.defineProperty(URL, 'createObjectURL', { configurable: true, value: () => 'blob:pdf-toolkit-test' })
}
if (typeof URL.revokeObjectURL !== 'function') {
  Object.defineProperty(URL, 'revokeObjectURL', { configurable: true, value: () => undefined })
}

afterEach(() => {
  cleanup()
})
