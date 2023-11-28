import React from 'react'
import { Link } from 'react-router-dom'
import { ThemeButton } from './ThemeButton'
import UserButton from './UserButton'
import { Separator } from './ui/separator'

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  return (
    <header>
      <div className='flex justify-between items-center p-4'>
        <Link to='/' className='text-3xl font-bold'>
          Fake Bookyto
        </Link>
        <div className='flex items-center gap-4'>
          <ThemeButton />
          <UserButton />
        </div>
      </div>
      <Separator />
    </header>
  )
}

export default Navbar
