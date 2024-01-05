import { Button } from '@/components/ui/button'
import MultipleChoiceCreation from '@/components/MultipleChoiceCreation'
import { Link } from 'react-router-dom'
// import TrueFalseCreation from '@/components/TrueFalseCreation'
import React from 'react'
interface DashboardPageProps {}

const DashboardPage: React.FC<DashboardPageProps> = ({}) => {

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Link to="/creatmultiplechoice" >Go to Multiple Choice Creation</Link>
      </div>
      {/* <TrueFalseCreation/>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button onClick={handleTrueFalseClick}>Go to True/False Creation</Button>
      </div> */}
    </>
  )
}

export default DashboardPage