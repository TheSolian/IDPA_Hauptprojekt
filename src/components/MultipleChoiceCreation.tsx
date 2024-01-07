import { useEffect, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { collection, getDocs, doc, addDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useNavigate } from 'react-router-dom'

const formSchema = z.object({
  category: z.string().min(2, {
    message: 'Question must be at least 2 characters.',
  }),
  answer1: z.object({
    answer: z.string().min(1, {
      message: 'Answer must be at least 1 characters.',
    }),
    correct: z.boolean(),
  }),
  answer2: z.object({
    answer: z.string().min(1, {
      message: 'Answer must be at least 1 characters.',
    }),
    correct: z.boolean(),
  }),
  answer3: z.object({
    answer: z.string().min(1, {
      message: 'Answer must be at least 1 characters.',
    }),
    correct: z.boolean(),
  }),
  answer4: z.object({
    answer: z.string().min(1, {
      message: 'Answer must be at least 1 characters.',
    }),
    correct: z.boolean(),
  }),
  explanation: z.string().min(2, {
    message: 'Explanation must be at least 2 characters.',
  }),
  question: z.string().min(2, {
    message: 'Question must be at least 2 characters.',
  }),
})

const MultipleChoiceCreation: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      answer1: {
        answer: '',
        correct: true,
      },
      answer2: {
        answer: '',
        correct: false,
      },
      answer3: {
        answer: '',
        correct: false,
      },
      answer4: {
        answer: '',
        correct: false,
      },
      explanation: '',
      question: '',
    },
  })

  const [allCategories, setAllCategories] = useState<string[]>([])
  const [open, setOpen] = useState<boolean>(false)
  const [categoryName, setCategoryName] = useState<string>('')
  const [error, setError] = useState<boolean>(false)
  const [answerError, setAnswerError] = useState<boolean>(false)

  async function getCategories() {
    const cats = await getDocs(collection(db, 'categories'))
    const categoriesArray: string[] = []

    cats.forEach((doc) => {
      categoriesArray.push(doc.data().title)
    })

    setAllCategories(categoriesArray)
  }

  useEffect(() => {
    getCategories()
    console.log(allCategories)
  }, [open])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (
      values.answer1.correct ||
      values.answer2.correct ||
      values.answer3.correct ||
      values.answer4.correct
    ) {
      await addDoc(collection(db, 'questions'), {
        answers: [
          {
            correct: values.answer1.correct,
            title: values.answer1.answer,
          },
          {
            correct: values.answer2.correct,
            title: values.answer2.answer,
          },
          {
            correct: values.answer3.correct,
            title: values.answer3.answer,
          },
          {
            correct: values.answer4.correct,
            title: values.answer4.answer,
          },
        ],
        categories: values.category,
        explanation: values.explanation,
        question: values.question,
        type: 'multipleChoice',
      })
      setAnswerError(false)
      window.location.reload()
      console.log('top')
      console.log(values)
    } else {
      setAnswerError(true)
      console.log('flop')
    }
  }

  const openD = (value: string) => {
    if (value === 'n') {
      setOpen(!open)
      setError(false)
    }
  }

  async function addCat() {
    if (allCategories.length > 0) {
      for (const category of allCategories) {
        if (category !== categoryName && categoryName.length > 1) {
          console.log(category)
          await addDoc(collection(db, 'categories'), { title: categoryName })
          setOpen(false)
          break
        } else {
          setError(true)
          console.log(categoryName + " already exists or isn't long enough")
          break
        }
      }
    } else {
      await addDoc(collection(db, 'categories'), { title: categoryName })
      setOpen(false)
    }
  }

  const errorStyle = {
    display: error ? 'block' : 'none',
  }

  const answerErrorStyle = {
    display: answerError ? 'block' : 'none',
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 w-1/2 mx-auto mt-8 mb-8'
        >
          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
              <FormItem className=' w-1/3'>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    openD(value)
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a category' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className='h-48'>
                    <SelectGroup>
                      {allCategories.map((category) => (
                        <SelectItem value={category}>{category}</SelectItem>
                      ))}

                      <SelectItem value='n'>Add a new category...</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='question'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question</FormLabel>
                <FormControl>
                  <Input placeholder='Question...' {...field} />
                </FormControl>
                <FormDescription>Write your question here.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex gap-8'>
            <FormField
              control={form.control}
              name='answer1.answer'
              render={({ field }) => (
                <FormItem className='w-1/3'>
                  <FormLabel>Answer 1</FormLabel>
                  <FormControl>
                    <Input placeholder='Answer...' {...field} />
                  </FormControl>
                  <FormDescription>Write your answer here.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='answer1.correct'
              render={({ field }) => (
                <FormItem className='flex flex-col gap-[12px] mt-[6px] items-start'>
                  <FormLabel>Correct?</FormLabel>
                  <FormControl>
                    <Checkbox
                      className='rounded-[3px] h-5 w-5'
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose whether this answer is correct.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex gap-8'>
            <FormField
              control={form.control}
              name='answer2.answer'
              render={({ field }) => (
                <FormItem className='w-1/3'>
                  <FormLabel>Answer 2</FormLabel>
                  <FormControl>
                    <Input placeholder='Answer...' {...field} />
                  </FormControl>
                  <FormDescription>Write your answer here.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='answer2.correct'
              render={({ field }) => (
                <FormItem className='flex flex-col gap-[12px] mt-[6px] items-start'>
                  <FormLabel>Correct?</FormLabel>
                  <FormControl>
                    <Checkbox
                      className='rounded-[3px] h-5 w-5'
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose whether this answer is correct.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex gap-8'>
            <FormField
              control={form.control}
              name='answer3.answer'
              render={({ field }) => (
                <FormItem className='w-1/3'>
                  <FormLabel>Answer 3</FormLabel>
                  <FormControl>
                    <Input placeholder='Answer...' {...field} />
                  </FormControl>
                  <FormDescription>Write your answer here.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='answer3.correct'
              render={({ field }) => (
                <FormItem className='flex flex-col gap-[12px] mt-[6px] items-start'>
                  <FormLabel>Correct?</FormLabel>
                  <FormControl>
                    <Checkbox
                      className='rounded-[3px] h-5 w-5'
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose whether this answer is correct.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex gap-8'>
            <FormField
              control={form.control}
              name='answer4.answer'
              render={({ field }) => (
                <FormItem className='w-1/3'>
                  <FormLabel>Answer 4</FormLabel>
                  <FormControl>
                    <Input placeholder='Answer...' {...field} />
                  </FormControl>
                  <FormDescription>Write your answer here.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='answer4.correct'
              render={({ field }) => (
                <FormItem className='flex flex-col gap-[12px] mt-[6px] items-start'>
                  <FormLabel>Correct?</FormLabel>
                  <FormControl>
                    <Checkbox
                      className='rounded-[3px] h-5 w-5'
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose whether this answer is correct.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <p
            className='mb-4 text-sm font-medium text-destructive'
            style={answerErrorStyle}
          >
            At least one answer must be correct.
          </p>
          <FormField
            control={form.control}
            name='explanation'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Explanation</FormLabel>
                <FormControl>
                  <Input placeholder='Explanation...' {...field} />
                </FormControl>
                <FormDescription>
                  Write an explanation for your students.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit'>Submit</Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add a new category</DialogTitle>
                <DialogDescription>
                  <Input
                    className='my-4'
                    name='categoryName'
                    placeholder='Category name...'
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                  <p
                    className='mb-4 text-sm font-medium text-destructive'
                    style={errorStyle}
                  >
                    Category already exists or isn't long enough
                  </p>
                  <Button onClick={addCat}>Create category</Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </form>
      </Form>
    </>
  )
}

export default MultipleChoiceCreation
