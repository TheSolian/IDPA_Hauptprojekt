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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { db } from '@/firebase'
import { zodResolver } from '@hookform/resolvers/zod'
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import ManageCategoryDialog from './ManageCategoryDialog'

const formSchema = z.object({
  category: z
    .string()
    .min(2, {
      message: 'Choose a category.',
    })
    .max(40, { message: 'Selected name is to long.' }),
  correctAnswer: z.object({
    answer: z.string().min(4, {
      message: 'Answer must be at least 2 characters.',
    }),
    correct: z.boolean(),
  }),
  wrongAnswer: z.object({
    answer: z.string().min(4, {
      message: 'Answer must be at least 2 characters.',
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

const TrueFalseForm: React.FC = () => {
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
  }, [])

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      correctAnswer: {
        answer: '',
        correct: true,
      },
      wrongAnswer: {
        answer: '',
        correct: false,
      },
      explanation: '',
      question: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.correctAnswer.answer === values.wrongAnswer.answer) {
      console.log('The answers must not be the same.')
      setAnswerError(true)
    } else {
      await addDoc(collection(db, 'questions'), {
        answers: [
          {
            id: 1,
            correct: values.correctAnswer.correct,
            title: values.correctAnswer.answer,
          },
          {
            id: 2,
            correct: values.wrongAnswer.correct,
            title: values.wrongAnswer.answer,
          },
        ],
        categories: values.category,
        explanation: values.explanation,
        question: values.question,
        type: 'trueFalse',
      })
      console.log(values)
      window.location.reload()
    }
  }

  const answerErrorStyle = {
    display: answerError ? 'block' : 'none',
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8 w-2/3 mx-auto mt-8'
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
                  <FormControl className='w-[200px]'>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a category' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className=' h-48'>
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
        <div className=' flex gap-8 '>
          <FormField
            control={form.control}
            name='correctAnswer.answer'
            render={({ field }) => (
              <FormItem className='w-1/3'>
                <FormLabel>True answer</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select an option' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='True'>True</SelectItem>
                    <SelectItem value='False'>False</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Decide whether true is correct or false.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='wrongAnswer.answer'
            render={({ field }) => (
              <FormItem className='w-1/3'>
                <FormLabel>False answer</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select an option' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='True'>True</SelectItem>
                    <SelectItem value='False'>False</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Decide whether true is correct or false.
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
          Answers must be different
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
  )
}

export default TrueFalseForm
