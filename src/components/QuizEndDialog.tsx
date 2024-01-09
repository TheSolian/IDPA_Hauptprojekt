import { calculatePercentage, formatPercentage } from '@/lib/utils'
import React from 'react'
import { QuizStatus } from './Quiz'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

type QuizEndDialogProps = {
  open: boolean
  summary: QuizStatus
  saveQuiz: () => void
}

const QuizEndDialog: React.FC<QuizEndDialogProps> = ({
  open,
  summary,
  saveQuiz,
}) => {
  return (
    <Dialog open={open}>
      <DialogContent noCloseButton>
        <DialogHeader>
          <DialogTitle>End of Quiz</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-2'>
          <div className='font-semibold'>Summary:</div>
          <div>
            <div>Right answers: {summary.rightAnswers}</div>
            <div>Wrong answers: {summary.wrongAnswers}</div>
            <div>
              <span>Percentage: </span>
              {calculatePercentage(summary.rightAnswers, summary.wrongAnswers)}%
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={saveQuiz}>End Quiz</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default QuizEndDialog
