import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { collection, getDocs, doc, addDoc } from 'firebase/firestore'
import { db } from '@/firebase'
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
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'

const formSchema = z.object({
  category: z.string().min(2, {
    message: 'Choose a category.',
  }),
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
            correct: values.correctAnswer.correct,
            title: values.correctAnswer.answer,
          },
          {
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8 w-1/2 mx-auto mt-8'
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
                <SelectContent className=' h-48'>
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
  )
}

export default TrueFalseForm
