import * as TestFunctions from '../lib/utils'

const { arraysEqual, formatPercentage, calculatePercentage } =
  jest.requireActual<typeof TestFunctions>('../lib/utils.ts')

test('arraysEqual returns true', () => {
  const setA = new Set([1, 2, 3])
  const setB = new Set([1, 2, 3])
  expect(arraysEqual(setA, setB)).toBe(true)
})

test('formatPercentage formats correctly', () => {
  const percentage = 10.6666
  expect(formatPercentage(percentage)).toBe('10,67')
})

test('calculatePercentage calculates correctly', () => {
  const rightAnswers = 4
  const wrongAnswers = 1
  expect(calculatePercentage(rightAnswers, wrongAnswers)).toBe('80,00')
})
