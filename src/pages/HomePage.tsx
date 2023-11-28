import useCurrentUser from '@/hooks/useCurrentUser'
import React from 'react'

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = ({}) => {
  const user = useCurrentUser()

  return (
    <div>
      <div>{user?.id}</div>
      <div>{user?.email}</div>
      <div>{user?.name}</div>
      <div>{user?.role}</div>
    </div>
  )
}

export default HomePage
