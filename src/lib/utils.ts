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
