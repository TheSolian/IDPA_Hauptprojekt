import { Link } from 'react-router-dom'

interface DashboardNavbarProps {}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({}) => {
  return (
    <>
      <div className=' flex flex-col border rounded-sm pb-96 w-1/5 absolute p-4 gap-4'>
        <h1 className='text-center text-3xl'>Dashboard</h1>
        <Link to='/dashboard/createmultiplechoice'>
          <div className='text-center py-3 bg-popover hover:bg-accent rounded-sm border'>
            Create a multiple choice question
          </div>
        </Link>
        <Link to='/dashboard/createtruefalse'>
          <div className='text-center py-3 bg-popover hover:bg-accent rounded-sm border'>
            Create a True/False question
          </div>
        </Link>
        <Link to='/dashboard/questions'>
          <div className='text-center py-3 bg-popover hover:bg-accent rounded-sm border'>
            View Questions
          </div>
        </Link>
        <Link to='/dashboard/students'>
          <div className='text-center py-3 bg-popover hover:bg-accent rounded-sm border'>
            View Students
          </div>
        </Link>
      </div>
    </>
  )
}

export default DashboardNavbar
