import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { Eye } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

const AllQuizzes: React.FC = () => {
  const [students, setStudents] = useState<{ id: string; username: string }[]>(
    []
  )
  const navigate = useNavigate()

  async function getAllStudents() {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'))
      querySnapshot.docs.forEach((doc) => {
        if (doc.data().role === 'student') {
          setStudents((prev) => [
            ...prev,
            {
              id: doc.id,
              username: doc.data().username,
            },
          ])
        }
      })
    } catch (error) {
      console.error('Error getting students:', error)
    }
  }

  useEffect(() => {
    getAllStudents()
  }, [])

  const handleViewClick = (questionID: string) => {
    navigate(`/dashboard/student/${questionID}`)
  }

  return (
    <ScrollArea className='w-4/5 mx-auto border rounded-lg h-[650px] mt-32'>
      {students.map((student) => (
        <div
          className='flex justify-between w-11/12 text-lg p-8 my-3 mx-auto rounded-sm border bg-popover'
          key={student.id}
        >
          <div className='flex items-center text-xl'>{student.username}</div>
          <div>
            <Button variant='ghost' onClick={() => handleViewClick(student.id)}>
              <Eye />
            </Button>
          </div>
        </div>
      ))}
    </ScrollArea>
  )
}

export default AllQuizzes
