import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Input } from './ui/input'

type CategoryPickerProps = {}

const CategoryPicker: React.FC<CategoryPickerProps> = ({}) => {
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const run = async () => {
      setCategories([])
      const ref = collection(db, 'categories')
      const snapshot = await getDocs(ref)
      snapshot.docs.forEach((doc) => {
        setCategories((prev) => [...prev, doc.data().title])
      })
    }
    run()
  }, [])

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError('')
    if (e.currentTarget.checked) {
      const value = e.currentTarget.value
      setSelectedCategories((prev) => [...prev, value])
    } else {
      const value = e.currentTarget.value
      const arr = selectedCategories.filter((category) => category !== value)
      setSelectedCategories(arr)
    }
  }

  async function handleClick() {
    if (selectedCategories.length === 0)
      return setError('Pick at least one category')

    localStorage.setItem('quiz-categories', JSON.stringify(selectedCategories))
    navigate('/quiz')
  }

  return (
    <div className='grid place-content-center pt-40'>
      <div className='flex flex-col gap-2 p-4 min-w-[300px] border border-primary rounded-md'>
        <h2 className='text-xl font-semibold'>Select categories</h2>
        <div>
          {categories.map((category, index) => (
            <div key={index} className='flex gap-2 items-center w-full'>
              <Input
                type='checkbox'
                className='w-4 h-4'
                onChange={handleChange}
                value={category}
              />
              <div>{category}</div>
            </div>
          ))}
        </div>
        <p className='text-red-500'>{error}</p>
        <Button onClick={handleClick}>Start Quiz</Button>
      </div>
    </div>
  )
}

export default CategoryPicker
