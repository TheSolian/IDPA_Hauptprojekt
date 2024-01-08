import QuizHistory from '@/components/QuizHistory'
import React, { useEffect, useState } from 'react'

interface StatsPageProps {}

const StatsPage: React.FC<StatsPageProps> = ({}) => {
  const [rightPercentage, setRightPercentage] = useState<string | null>(null)
  const [totalStats, setTotalStats] = useState<{
    totalRight: number
    totalWrong: number
  }>({ totalRight: 0, totalWrong: 0 })

  const handleStatsChange = (totalRight: number, totalWrong: number) => {
    setTotalStats({ totalRight, totalWrong })
  }

  useEffect(() => {
    CalculatePercentage(totalStats.totalRight, totalStats.totalWrong)
  }, [totalStats.totalRight, totalStats.totalWrong])

  function CalculatePercentage(totalRight: number, totalWrong: number) {
    if (totalRight === 0 && totalWrong === 0) {
      setRightPercentage(null)
    } else {
      let percentage = (totalRight / (totalRight + totalWrong)) * 100
      setRightPercentage(percentage.toFixed(2))
    }
  }

  return (
    <>
      {totalStats.totalRight + totalStats.totalWrong !== 0 ? (
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
