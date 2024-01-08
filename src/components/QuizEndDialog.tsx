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
  function formatPercentage(percentage: number): string {
    const formatter = new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    return formatter.format(percentage)
  }

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
              Percentage:{' '}
              {formatPercentage(
                (100 / (summary.rightAnswers + summary.wrongAnswers)) *
                  summary.rightAnswers
              )}
              %
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
