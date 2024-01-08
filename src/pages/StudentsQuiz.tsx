// AllQuizzes.tsx

import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router';

const AllQuizzes: React.FC = () => {
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]);
  const [students, setStudents] = useState<{ id: string, username: string }[]>([])
  const navigate = useNavigate()
    
  async function getAllQuizzes() {
    const querySnapshot = await getDocs(collection(db, 'quizzes'));

    const quizzes = querySnapshot.docs.map((doc) => doc.data() as Quiz);
    setAllQuizzes(quizzes);
    console.log(quizzes);
  }

  async function getAllStudents() {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
       querySnapshot.docs.forEach((doc) => {
         if (doc.data().role === 'student') {
            setStudents(prev => [...prev,{
                id: doc.id, 
            username: doc.data().username
            }])

         }
      });
      // Do something with the roles if needed
    } catch (error) {
      console.error('Error getting students:', error);
    }
  }
  
  useEffect(() => {
    getAllStudents();
  }, []);

  const handleViewClick = (questionID: string) => {
    navigate(`/dashboard/student/${questionID}`)
  }
  

  return (
    <ScrollArea className='w-4/5 mx-auto border rounded-lg h-[650px] mt-32'>
      
      {
        students.map((student) =>(
            
            <div className='flex justify-between w-11/12 text-lg p-8 my-3 mx-auto rounded-sm border bg-popover hover:bg-accent'>
              <div className='flex items-center text-xl'>
                {student.username}
              </div>
              <div>
                <Button onClick={() => handleViewClick(student.id)}>View</Button>
              </div>
            </div>
        ))
      }
    </ScrollArea>
  );
};

export default AllQuizzes;
