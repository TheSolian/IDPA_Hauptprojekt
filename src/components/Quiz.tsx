import useCurrentUser from '@/hooks/useCurrentUser'
import { db } from '@/lib/firebase'
import { arraysEqual, shuffle } from '@/lib/utils'
import { addDoc, collection } from 'firebase/firestore'
import { CheckCircle2, XCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Answers from './Answers'
import NextQuestionDialog from './NextQuestionDialog'
import QuizEndDialog from './QuizEndDialog'
import { Button } from './ui/button'

type QuizProps = {
  questions: Question[]
  categories: string[]
}

export type QuizStatus = {
  rightAnswers: number
  wrongAnswers: number
}

export type QuizQuestion = {
  type: 'multipleChoice' | 'trueFalse'
  categories: string[]
  question: string
  explanation: string
  answers: Answer[]
}

export type Answer = {
  id: number
  title: string
  correct: boolean
  selected: boolean
}

const Quiz: React.FC<QuizProps> = ({ questions: initialData, categories }) => {
  const [questions] = useState(initialData)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>()
  const [hasCheckedAnswers, setHasCheckedAnswers] = useState(false)
  const [hasAnsweredCorrectly, setHasAnsweredCorrectly] = useState(false)
  const [isNextQuestionDialogOpen, setIsNextQuestionDialogOpen] =
    useState(false)
  const [isQuizEndDialogOpen, setIsQuizEndDialogOpen] = useState(false)
  const [quizStatus, setQuizStatus] = useState<QuizStatus>({
    rightAnswers: 0,
    wrongAnswers: 0,
  })
  const navigate = useNavigate()
  const user = useCurrentUser()

  useEffect(() => {
    const answers: Answer[] = []
    questions[currentQuestionIndex].answers.forEach((answer) => {
      answers.push({
        ...answer,
        selected: false,
      })
    })

    setCurrentQuestion({
      ...questions[currentQuestionIndex],
      answers: shuffle(answers),
    })
  }, [currentQuestionIndex])

  function checkAnswers() {
    const selectedAnswers = currentQuestion?.answers.filter(
      (answer) => answer.selected
    )

    if (selectedAnswers?.length === 0) {
      return toast('Please select at least one answer', {
        dismissible: true,
      })
    }

    setHasCheckedAnswers(true)

    const correctAnsweres = currentQuestion?.answers
      .map((answer) => {
        if (answer.correct === true) return answer
      })
      .filter((answer) => answer !== undefined)

    const correctSet = new Set(correctAnsweres)
    const selectedSet = new Set(selectedAnswers)

    if (arraysEqual(correctSet, selectedSet)) {
      setQuizStatus({
        rightAnswers: quizStatus.rightAnswers + 1,
        wrongAnswers: quizStatus.wrongAnswers,
      })
      setHasAnsweredCorrectly(true)
    } else {
      setQuizStatus({
        rightAnswers: quizStatus.rightAnswers,
        wrongAnswers: quizStatus.wrongAnswers + 1,
      })
    }

    setIsNextQuestionDialogOpen(true)
  }

  function nextQuestion() {
    if (currentQuestionIndex !== questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setIsNextQuestionDialogOpen(false)
      setHasCheckedAnswers(false)
      setHasAnsweredCorrectly(false)
    } else {
      setIsNextQuestionDialogOpen(false)
      setIsQuizEndDialogOpen(true)
    }
  }

  async function saveQuiz() {
    const ref = collection(db, 'users', user!.id, 'quizzes')

    const quiz: Quiz = {
      categories,
      playedAt: new Date(),
      questions: questions,
      stats: quizStatus,
    }

    await addDoc(ref, quiz)

    setIsQuizEndDialogOpen(false)
    navigate('/')
  }

  return (
    <div className='flex flex-col gap-16 px-72 pt-16'>
      <h1 className='text-3xl font-semibold text-center'>
        {currentQuestion?.question}
      </h1>
      {currentQuestion ? (
        <Answers
          type={currentQuestion.type}
          setCurrentQuestion={setCurrentQuestion}
          currentQuestion={currentQuestion}
          hasCheckedAnswers={hasCheckedAnswers}
        />
      ) : null}
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-4 w-36'>
          <div className='flex items-center gap-2'>
            <CheckCircle2 className='text-green-500 w-[20px]' />
            <span> {quizStatus.rightAnswers}</span>
          </div>
          <div className='flex items-center gap-2'>
            <XCircle className='text-red-500 w-[20px]' />
            <span> {quizStatus.wrongAnswers}</span>
          </div>
        </div>
        <div className='text-xl'>
          {currentQuestionIndex + 1} / {questions.length}
        </div>
        <Button className='w-36' onClick={checkAnswers}>
          Check Answers
        </Button>
      </div>
      {currentQuestion ? (
        <NextQuestionDialog
          correct={hasAnsweredCorrectly}
          open={isNextQuestionDialogOpen}
          currentQuestion={currentQuestion}
          nextQuestion={nextQuestion}
        />
      ) : null}
      <QuizEndDialog
        open={isQuizEndDialogOpen}
        summary={quizStatus}
        saveQuiz={saveQuiz}
      />
    </div>
  )
}

export default Quiz
