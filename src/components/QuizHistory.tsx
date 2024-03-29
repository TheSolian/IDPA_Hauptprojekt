import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import useCurrentUser from '@/hooks/useCurrentUser'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'

interface QuizHistoryProps {
  onStatsChange: (totalRight: number, totalWrong: number) => void
}

const QuizHistory: React.FC<QuizHistoryProps> = ({ onStatsChange }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const user = useCurrentUser()

  function calculateRightFalseRatio(
    rightAnswers: number,
    wrongAnswers: number
  ) {
    return `Right/False Ratio ${rightAnswers}/${wrongAnswers}`
  }

  async function getData() {
    if (user == null) return

    const querySnapshot = await getDocs(
      collection(db, 'users', user.id, 'quizzes')
    )

    const newQuizzes = querySnapshot.docs.map((doc) => doc.data() as Quiz)
    console.log(newQuizzes[0].playedAt)
    setQuizzes(newQuizzes)
  }

  useEffect(() => {
    getData()
  }, [user])

  useEffect(() => {
    let totalRight = 0
    let totalWrong = 0

    quizzes.forEach((quiz) => {
      totalRight += quiz.stats.rightAnswers
      totalWrong += quiz.stats.wrongAnswers
    })

    onStatsChange(totalRight, totalWrong)
  }, [quizzes, onStatsChange])

  function CreateCategoriesList(categories: string[]) {
    return categories.join(', ')
  }
  return (
    <>
      <ScrollArea className='w-full mx-auto border rounded-lg h-[500px]'>
        {quizzes.length === 0 ? (
          <div className=' text-2xl text-center mt-8'>
            No quizzes played yet
          </div>
        ) : (
          quizzes.map((quiz, index) => (
            <div
              className='flex flex-row w-11/12 justify-between text-lg p-8 my-3 mx-auto rounded-sm border bg-popover hover:bg-accent'
              key={index}
            >
              <div>{quiz.playedAt.toDate().toDateString('de-DE')}</div>
              <div>
                {calculateRightFalseRatio(
                  quiz.stats.rightAnswers,
                  quiz.stats.wrongAnswers
                )}
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>Categories</TooltipTrigger>
                  <TooltipContent className=' max-w-[300px]'>
                    {CreateCategoriesList(quiz.categories)}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))
        )}
      </ScrollArea>
    </>
  )
}

export default QuizHistory
