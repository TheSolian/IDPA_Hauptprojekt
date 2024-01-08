import { cn } from '@/lib/utils'
import React from 'react'
import type { Answer, QuizQuestion } from './Quiz'

type AnswersProps = {
  type: 'trueFalse' | 'multipleChoice'
  currentQuestion: QuizQuestion
  setCurrentQuestion: React.Dispatch<
    React.SetStateAction<QuizQuestion | undefined>
  >
  hasCheckedAnswers: boolean
}

const Answers: React.FC<AnswersProps> = ({
  hasCheckedAnswers,
  type,
  currentQuestion,
  setCurrentQuestion,
}) => {
  function handleAnswerClick(answer: Answer, index: number) {
    const updatedAnswers = [...currentQuestion.answers]
    const selectedAnswers = currentQuestion.answers.filter(
      (answer) => answer.selected
    )

    if (answer.selected) {
      updatedAnswers[index] = { ...updatedAnswers[index], selected: false }
    } else {
      updatedAnswers[index] = { ...updatedAnswers[index], selected: true }

      if (type === 'trueFalse') {
        if (selectedAnswers.length !== 0) {
          const idx = updatedAnswers.indexOf(selectedAnswers[0])

          updatedAnswers[idx] = { ...updatedAnswers[idx], selected: false }
        }
      }
    }

    setCurrentQuestion({
      ...currentQuestion,
      answers: updatedAnswers,
    })
  }

  return (
    <div className='grid grid-cols-2 gap-8'>
      {currentQuestion.answers.map((answer, index) => (
        <button
          key={answer.id}
          onClick={() => handleAnswerClick(answer, index)}
          disabled={hasCheckedAnswers}
          className={cn(
            'bg-gray-500 text-white text-2xl aspect-[8/3] rounded-lg',
            {
              'border-4 border-primary': answer.selected && !hasCheckedAnswers,
              'bg-green-500': hasCheckedAnswers && answer.correct,
              'bg-red-500': hasCheckedAnswers && !answer.correct,
            }
          )}
        >
          {answer.title}
        </button>
      ))}
    </div>
  )
}

export default Answers
