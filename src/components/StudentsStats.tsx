import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { db } from '@/firebase'
import { calculatePercentage } from '@/lib/utils'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import { ChevronLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { buttonVariants } from './ui/button'

type StudentsStatsProps = {}

const StudentsStats: React.FC<StudentsStatsProps> = ({}) => {
  const { id } = useParams()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [rightPercentage, setRightPercentage] = useState<string | null>(null)
  const [username, setUsername] = useState<string>()

  function renderRightWrongRatio(rightAnswers: number, wrongAnswers: number) {
    return `Right/False Ratio ${rightAnswers}/${wrongAnswers}`
  }

  async function getData() {
    if (id == null) return

    const querySnapshot = await getDocs(collection(db, 'users', id, 'quizzes'))

    const newQuizzes = querySnapshot.docs.map((doc) => doc.data() as Quiz)
    setQuizzes(newQuizzes)
  }

  async function getUserName() {
    if (id == null) return
    const docSnap = await getDoc(doc(db, 'users', id))
    if (docSnap.exists()) {
      setUsername(docSnap.data().username)
    }
  }

  useEffect(() => {
    getData()
    getUserName()
  }, [id])

  useEffect(() => {
    let totalRight = 0
    let totalWrong = 0

    quizzes.forEach((quiz) => {
      totalRight += quiz.stats.rightAnswers
      totalWrong += quiz.stats.wrongAnswers
    })
    setRightPercentage(calculatePercentage(totalRight, totalWrong))
  }, [quizzes])

  function CreateCategoriesList(categories: string[]) {
    return categories.join(', ')
  }
  return (
    <>
      <div className='ml-20 mt-20'>
        <Link
          to='/dashboard/students'
          className={buttonVariants({ variant: 'link' })}
        >
          <ChevronLeft />
          Back
        </Link>
      </div>
      <div className='mx-auto'>
        <h1 className='text-center text-xl mb-2'>{username}</h1>
      </div>

      {rightPercentage !== null ? (
        <h1 className='text-4xl text-center mb-32'>
          {rightPercentage === null
            ? 'Calculating...'
            : `Right answers overall: ${rightPercentage}%`}
        </h1>
      ) : (
        <h1 className='mb-32 text-4xl text-center'>Nothing to see here now</h1>
      )}
      <ScrollArea className='w-4/5 mx-auto border rounded-lg h-[500px]'>
        {quizzes.length === 0 ? (
          <div className='text-2xl text-center mt-8'>No quizzes played yet</div>
        ) : (
          quizzes.map((quiz, index) => (
            <div
              key={index}
              className='flex flex-row w-11/12 justify-between text-lg p-8 my-3 mx-auto rounded-sm border bg-popover hover:bg-accent'
            >
              <div>{new Date(quiz.playedAt).toLocaleDateString('de-DE')}</div>
              <div>
                {renderRightWrongRatio(
                  quiz.stats.rightAnswers,
                  quiz.stats.wrongAnswers
                )}
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>Categories</TooltipTrigger>
                  <TooltipContent className='max-w-[300px]'>
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

export default StudentsStats
