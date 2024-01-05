import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { collection, getDocs, doc } from 'firebase/firestore'
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEffect, useState } from 'react'

const formSchema = z.object({
  category: z.string().min(2, {
    message: 'Explanation must be at least 2 characters.',
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
  }, [])
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.correctAnswer.answer === values.wrongAnswer.answer) {
      console.log('Die Antworten dürfen nicht gleich sein.')
      return
    }
    console.log(values)
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a category' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {allCategories.map((category) => (
                    <SelectItem value={category}>{category}</SelectItem>
                  ))}
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
    </Form>
  )
}

export default TrueFalseForm
