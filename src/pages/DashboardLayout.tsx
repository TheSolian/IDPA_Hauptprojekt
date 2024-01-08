import DashboardNavbar from '@/components/DashboardNavbar'
import { Outlet } from 'react-router-dom'

interface DashboardLayoutProps {}

const DashboardLayoutProps: React.FC<DashboardLayoutProps> = ({}) => {
  return (
    <>
      <div className=' flex'>
        <div className=' w-1/5 p-2'>
          <DashboardNavbar />
        </div>
        <div className=' w-4/5'>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default DashboardLayoutProps
