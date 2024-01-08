type Quiz = {
  playedAt: Date
  questions?: Question[]
  categories: string[]
  stats: {
    rightAnswers: number
    wrongAnswers: number
  }
}

type Question = {
  type: 'trueFalse' | 'multipleChoice'
  question: string
  explanation: string
  answers: { title: string; correct: boolean }[]
  categories: string
}
