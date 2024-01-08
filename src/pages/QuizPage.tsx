import Quiz from '@/components/Quiz'
import { buttonVariants } from '@/components/ui/button'
import { db } from '@/firebase'
import { shuffle } from '@/lib/utils'
import { collection, getDocs } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

type QuizPageProps = {}

const QuizPage: React.FC<QuizPageProps> = ({}) => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    const run = async () => {
      const selectedCategories = JSON.parse(
        localStorage.getItem('quiz-categories')!
      )
      localStorage.setItem('quiz-categories', '')

      setCategories(selectedCategories)

      const ref = collection(db, 'questions')
      const docs = await getDocs(ref)

      const qs: Question[] = []
      docs.docs.forEach((doc) => {
        const question = doc.data() as Question

        const contains = selectedCategories.some((element: string) => {
          return question.categories.includes(element)
        })

        if (contains) {
          qs.push(question)
        }
      })

      if (qs.length > 30) {
        setQuestions(shuffle(qs).slice(0, 30))
      } else {
        setQuestions(shuffle(qs))
      }
    }
    run()
  }, [])

  return (
    <div>
      {questions.length !== 0 ? (
        <Quiz questions={questions} categories={categories} />
      ) : (
        <div className='flex flex-col items-center gap-4 pt-28'>
          <h1 className='text-3xl font-semibold text-center'>Empty Category</h1>
          <div className='flex flex-col'>
            <p className='text-lg'>There are no question in this category.</p>
            <Link to='/' className={buttonVariants({ variant: 'link' })}>
              Homepage
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuizPage
