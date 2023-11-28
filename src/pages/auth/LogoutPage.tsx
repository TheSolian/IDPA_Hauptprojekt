import { auth } from '@/firebase'
import { signOut } from 'firebase/auth'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface LogoutPageProps {}

const LogoutPage: React.FC<LogoutPageProps> = ({}) => {
  const navigate = useNavigate()

  useEffect(() => {
    signOut(auth)
      .then(() => {
        navigate('/login')
      })
      .catch((error) => {
        navigate('/')
      })
  }, [])

  return <></>
}

export default LogoutPage
