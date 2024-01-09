import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { Eye } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface QuestionListProps {}

const QuestionList: React.FC<QuestionListProps> = ({}) => {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<
    { id: string; question: Question }[]
  >([])

  async function getData() {
    const querySnapshot = await getDocs(collection(db, 'questions'))

    const newQuestions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      question: doc.data() as Question,
    }))

    setQuestions(newQuestions)
  }

  useEffect(() => {
    getData()
  }, [])

  const handleViewClick = (questionID: string) => {
    navigate(`/dashboard/edit/${questionID}`)
  }

  return (
    <>
      <ScrollArea className='w-4/5 mt-32 mx-auto border rounded-lg h-[650px]'>
        {questions.length === 0 ? (
          <div className='text-2xl text-center mt-8'>No questions yet</div>
        ) : (
          questions.map((item) => (
            <div className='flex justify-between w-11/12 text-lg p-8 my-3 mx-auto rounded-sm border bg-popover'>
              <div className='flex items-center text-xl'>
                {item.question.question}
              </div>
              <div>
                <Button
                  onClick={() => handleViewClick(item.id)}
                  variant='ghost'
                >
                  <Eye />
                </Button>
              </div>
            </div>
          ))
        )}
      </ScrollArea>
    </>
  )
}

export default QuestionList
