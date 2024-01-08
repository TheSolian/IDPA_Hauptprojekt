import Navbar from '@/components/Navbar'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'

interface LayoutProps {}

const RootLayout: React.FC<LayoutProps> = ({}) => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Toaster />
    </>
  )
}

export default RootLayout
