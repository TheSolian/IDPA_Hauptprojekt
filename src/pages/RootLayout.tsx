import Navbar from '@/components/Navbar'
import React from 'react'
import { Outlet } from 'react-router-dom'

interface LayoutProps {}

const RootLayout: React.FC<LayoutProps> = ({}) => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

export default RootLayout
