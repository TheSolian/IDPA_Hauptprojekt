import { useEffect, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { collection, getDocs, doc } from 'firebase/firestore'
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
} from '@/components/ui/select'

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <>
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
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
    </>
  )
}

export default MultipleChoiceCreation
