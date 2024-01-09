import { QuizStatus } from '@/components/Quiz'
import QuizHistory from '@/components/QuizHistory'
import { calculatePercentage } from '@/lib/utils'
import React, { useEffect, useState } from 'react'

interface StatsPageProps {}

const StatsPage: React.FC<StatsPageProps> = ({}) => {
  const [rightPercentage, setRightPercentage] = useState<string | null>(null)
  const [quizResults, setQuizResults] = useState<QuizStatus>({
    rightAnswers: 0,
    wrongAnswers: 0,
  })

  const handleStatsChange = (totalRight: number, totalWrong: number) => {
    setQuizResults({ rightAnswers: totalRight, wrongAnswers: totalWrong })
  }

  useEffect(() => {
    const result = calculatePercentage(
      quizResults.rightAnswers,
      quizResults.wrongAnswers
    )
    setRightPercentage(result)
  }, [quizResults])

  return (
    <>
      {quizResults.rightAnswers + quizResults.wrongAnswers !== 0 ? (
        <h1 className=' text-4xl text-center my-32'>
          {rightPercentage === null
            ? 'Calculating...'
            : `Right answers overall: ${rightPercentage}%`}
        </h1>
      ) : (
        <h1 className='my-32 text-4xl text-center'>Nothing to see here now</h1>
      )}

      <div className=' w-4/6 mx-auto'>
        <QuizHistory onStatsChange={handleStatsChange} />
      </div>
    </>
  )
}

export default StatsPage
