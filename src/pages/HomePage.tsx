import CategoryPicker from '@/components/CategoryPicker'
import React from 'react'

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = ({}) => {
  return (
    <div>
      <CategoryPicker />
    </div>
  )
}

export default HomePage
