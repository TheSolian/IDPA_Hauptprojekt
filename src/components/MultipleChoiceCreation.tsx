import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { db } from '@/lib/firebase'
import { zodResolver } from '@hookform/resolvers/zod'
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import ManageCategoryDialog from './ManageCategoryDialog'

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

  const [categories, setCategories] = useState<Category[]>([])
  const [open, setOpen] = useState<boolean>(false)
  const [answerError, setAnswerError] = useState<boolean>(false)

  async function getCategories() {
    const docs = await getDocs(collection(db, 'categories'))
    const categories: Category[] = []

    docs.forEach((doc) => {
      categories.push({
        id: doc.id,
        title: doc.data().title,
      })
    })

    setCategories(categories)
  }

  useEffect(() => {
    getCategories()
    console.log(categories)
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
            id: 1,
            correct: values.answer1.correct,
            title: values.answer1.answer,
          },
          {
            id: 2,
            correct: values.answer2.correct,
            title: values.answer2.answer,
          },
          {
            id: 3,
            correct: values.answer3.correct,
            title: values.answer3.answer,
          },
          {
            id: 4,
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

  async function addCategory(category: Omit<Category, 'id'>) {
    const ref = collection(db, 'categories')
    await addDoc(ref, { title: category.title })
    getCategories()
  }

  async function deleteCategory(category: Category) {
    const ref = doc(db, 'categories', category.id)
    await deleteDoc(ref)
    getCategories()
  }

  const answerErrorStyle = {
    display: answerError ? 'block' : 'none',
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 w-2/3 mx-auto mt-8 mb-8'
        >
          <div className='flex-col gap-4 justify-end'>
            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem className=' w-1/3'>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
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
                        {categories.map((category) => (
                          <SelectItem value={category.title} key={category.id}>
                            {category.title}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant='link' type='button' onClick={() => setOpen(true)}>
              Manage Categories
            </Button>
          </div>
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
        </form>
        <ManageCategoryDialog
          open={open}
          setOpen={setOpen}
          categories={categories}
          add={addCategory}
          delete={deleteCategory}
        />
      </Form>
    </>
  )
}

export default MultipleChoiceCreation
