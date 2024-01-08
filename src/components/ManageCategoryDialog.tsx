import { cn } from '@/lib/utils'
import { Trash2 } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import { ScrollArea } from './ui/scroll-area'

type ManageCategoryDialogProps = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  categories: Category[]
  add: (category: Omit<Category, 'id'>) => Promise<void>
  delete: (category: Category) => Promise<void>
}

const ManageCategoryDialog: React.FC<ManageCategoryDialogProps> = ({
  open,
  setOpen,
  categories,
  add,
  delete: deleteCategory,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>
        <ScrollArea className='h-80 pr-4'>
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={cn('flex items-center pl-4 justify-between', {
                'bg-gray-200': index % 2 === 0,
              })}
            >
              <div>{category.title}</div>
              <Button variant='ghost2' onClick={() => deleteCategory(category)}>
                <Trash2 />
              </Button>
            </div>
          ))}
        </ScrollArea>
        <DialogFooter className='block'>
          <form
            className='flex gap-4'
            onSubmit={(e) => {
              e.preventDefault()
              add({ title: e.currentTarget.categoryTitle.value })
              e.currentTarget.reset()
            }}
          >
            <Input
              className='grow'
              placeholder='Category title'
              name='categoryTitle'
              min={2}
              max={40}
            />
            <Button>Add</Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ManageCategoryDialog
