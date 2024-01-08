import { cn, shuffle } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Answers from './Answers'
import { Button } from './ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

type QuizProps = {
  initialQuestions: Question[]
}

type QuizState = {
  rightAnswers: number
  wrongAnswers: number
}

const Quiz2: React.FC<QuizProps> = ({ initialQuestions }) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState<
    Question & { guessedRight: boolean }
  >()
  const [hasGuessed, setHasGuessed] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [quizState, setQuizState] = useState<QuizState>({
    rightAnswers: 0,
    wrongAnswers: 0,
  })

  useEffect(() => {
    const question = questions[currentQuestionIndex]

    setCurrentQuestion({
      type: question.type,
      question: question.question,
      explanation: question.explanation,
      categories: question.categories,
      answers: shuffle(question.answers),
      guessedRight: false,
    })
  }, [currentQuestionIndex])

  function handleGuess(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    answer: Answer
  ) {
    setHasGuessed(true)
    setIsDialogOpen(true)

    if (answer.correct) {
      setCurrentQuestion({
        type: currentQuestion!.type,
        question: currentQuestion!.question,
        explanation: currentQuestion!.explanation,
        answers: currentQuestion!.answers,
        categories: currentQuestion!.categories,
        guessedRight: true,
      })

      setQuizState({
        rightAnswers: quizState.rightAnswers + 1,
        wrongAnswers: quizState.wrongAnswers,
      })
    } else {
      setQuizState({
        rightAnswers: quizState.rightAnswers,
        wrongAnswers: quizState.wrongAnswers + 1,
      })
    }
  }

  function nextQuestion() {
    setHasGuessed(false)
    setCurrentQuestionIndex((prev) => prev + 1)
  }

  return (
    <>
      <p className='text-center text-4xl py-16'>{currentQuestion?.question}</p>
      {/* <Answers
        answers={currentQuestion?.answers}
        type={currentQuestion?.type}
        hasGuessed={hasGuessed}
        setHasGuessed={setHasGuessed}
      /> */}
      {/* <div className='grid grid-cols-2 px-72 gap-8'> */}
      {/* {currentQuestion?.answers.map((answer, index) => (
          <button
            onClick={(e) => handleGuess(e, answer)}
            key={index}
            disabled={hasGuessed}
            className={cn(
              'bg-primary text-white text-2xl aspect-[8/4] rounded-lg',
              {
                'bg-[#10B447]': answer.correct && hasGuessed,
                'bg-[#E33636]': !answer.correct && hasGuessed,
              }
            )}
          >
            {answer.title}
          </button>
        ))} */}
      {/* </div> */}
      <div className='flex justify-center items-center pt-16 text-2xl px-72 relative'>
        <div>
          {currentQuestionIndex + 1} / {questions.length}
        </div>
        {hasGuessed && currentQuestionIndex !== questions.length - 1 ? (
          <Button
            variant='link'
            onClick={nextQuestion}
            className='absolute translate-x-28'
          >
            Next Question <ChevronRight />
          </Button>
        ) : null}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className=''>
              {currentQuestion?.guessedRight ? 'Right' : 'Wrong'}
            </DialogTitle>
          </DialogHeader>
          <div>
            <p className='font-semibold'>Explanation</p>
            <p className='leading-4'>{currentQuestion?.explanation}</p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Quiz2
