type User = {
  id: string
  name: string
  email: string
  role: string
}

type Quiz = {
  playedAt: any
  questions: Question[]
  categories: string[]
  stats: {
    rightAnswers: number
    wrongAnswers: number
  }
}

type Question = {
  type: 'multipleChoice' | 'trueFalse'
  categories: string[]
  question: string
  explanation: string
  answers: Answer[]
}

type Answer = {
  id: number
  title: string
  correct: boolean
}

type Category = {
  id: string
  title: string
}
