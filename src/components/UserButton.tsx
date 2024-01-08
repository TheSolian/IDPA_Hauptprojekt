import { auth } from '@/firebase'
import useCurrentUser from '@/hooks/useCurrentUser'
import { Icons } from '@/icons'
import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

interface UserButtonProps {}

const UserButton: React.FC<UserButtonProps> = ({}) => {
  const user = useCurrentUser()
  function renderName() {
    if (auth.currentUser?.displayName) {
      return auth.currentUser.displayName.substring(0, 1).toUpperCase()
    }

    return auth.currentUser?.email?.substring(0, 1).toUpperCase()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={'icon'}>{renderName() || 'User'}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Link to='/statistics' className='flex gap-2'>
            <Icons.statistics />
            <span>Stats</span>
          </Link>
        </DropdownMenuItem>
        {user?.role === 'admin' && (
          <DropdownMenuItem>
            <Link to='/dashboard' className='flex gap-2'>
              <Icons.students />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <Link to='/logout' className='flex gap-2'>
            <Icons.logout />
            <span>Logout</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserButton
