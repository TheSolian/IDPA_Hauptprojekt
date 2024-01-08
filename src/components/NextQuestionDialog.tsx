import { cn } from '@/lib/utils'
import { Dialog } from '@radix-ui/react-dialog'
import { ChevronRight } from 'lucide-react'
import React from 'react'
import { QuizQuestion } from './Quiz'
import { Button } from './ui/button'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

type NextQuestionDialogProps = {
  correct: boolean
  open: boolean
  currentQuestion: QuizQuestion
  nextQuestion: () => void
}

const NextQuestionDialog: React.FC<NextQuestionDialogProps> = ({
  correct,
  open,
  currentQuestion,
  nextQuestion,
}) => {
  return (
    <Dialog open={open}>
      <DialogContent noCloseButton>
        <DialogHeader>
          <DialogTitle
            className={cn({
              'text-green-500': correct,
              'text-red-500': !correct,
            })}
          >
            {correct ? 'Right' : 'Wrong'}
          </DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-2'>
          <p className='font-semibold'>Explanation:</p>
          <p className=''>{currentQuestion.explanation}</p>
        </div>
        <DialogFooter>
          <Button variant='link' onClick={nextQuestion}>
            Next Question
            <ChevronRight />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default NextQuestionDialog
