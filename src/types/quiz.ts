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
  title: string
  explanation: string
  answers: { title: string; correct: boolean }[]
}
