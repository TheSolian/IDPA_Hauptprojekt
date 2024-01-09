import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shuffle<T>(arr: T[]): T[] {
  let m = arr.length
  while (m) {
    const i = Math.floor(Math.random() * m--)
    ;[arr[m], arr[i]] = [arr[i], arr[m]]
  }
  return arr
}

export function arraysEqual<T>(setA: Set<T>, setB: Set<T>): boolean {
  if (setA.size !== setB.size) {
    return false
  }

  for (const item of setA) {
    if (!setB.has(item)) {
      return false
    }
  }

  return true
}

export function formatPercentage(percentage: number): string {
  const formatter = new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return formatter.format(percentage)
}

export function calculatePercentage(
  rightAnswers: number,
  wrongAnswers: number
): string | null {
  if (rightAnswers === 0 && wrongAnswers === 0) {
    return null
  } else {
    return formatPercentage(
      (rightAnswers / (rightAnswers + wrongAnswers)) * 100
    )
  }
}
