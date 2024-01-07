import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  collection,
  getDocs,
  doc,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
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
import { useNavigate, useParams } from 'react-router-dom'

interface EditPageProps {}

const trueFalseFormSchema = z.object({
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

const EditPage: React.FC<EditPageProps> = ({}) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [question, setQuestion] = useState<Question>()
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

  async function getData() {
    if (id) {
      try {
        const docSnap = await getDoc(doc(db, 'questions', id))

        if (docSnap.exists()) {
          setQuestion(docSnap.data() as Question)
        } else {
          console.log('No such document!')
        }
      } catch (error) {
        console.error('Error fetching document:', error)
      }
    }
  }
  useEffect(() => {
    getData()
  }, [])

  const trueFalseForm = useForm<z.infer<typeof trueFalseFormSchema>>({
    resolver: zodResolver(trueFalseFormSchema),
    defaultValues: {
      category: question?.categories,
      correctAnswer: {
        answer: question?.answers[0].title,
        correct: question?.answers[0].correct,
      },
      wrongAnswer: {
        answer: question?.answers[1].title,
        correct: question?.answers[1].correct,
      },
      explanation: question?.explanation,
      question: question?.question,
    },
    values: {
      category: question?.categories,
      correctAnswer: {
        answer: question?.answers[0].title,
        correct: question?.answers[0].correct,
      },
      wrongAnswer: {
        answer: question?.answers[1].title,
        correct: question?.answers[1].correct,
      },
      explanation: question?.explanation,
      question: question?.question,
    },
  })

  async function onSubmit(values: z.infer<typeof trueFalseFormSchema>) {
    if (values.correctAnswer?.answer === values.wrongAnswer?.answer) {
      console.log('The answers must not be the same.')
      setAnswerError(true)
    } else {
      console.log(values)
      if (id) {
        const questionRef = doc(db, 'questions', id)
        const updatedData = {
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
        }

        try {
          await updateDoc(questionRef, updatedData)
          console.log('Document successfully updated')
          navigate('/dashboard/questions')
        } catch (error) {
          console.error('Error updating document: ', error)
        }
      }
    }
  }

  async function deleteQuestion() {
    if (id) {
      try {
        await deleteDoc(doc(db, 'questions', id))
        console.log('Document successfully deleted')
        navigate('/dashboard/questions')
      } catch (error) {
        console.error('Error deleting document:', error)
      }
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
      {question?.type === 'trueFalse' ? (
        <Form {...trueFalseForm}>
          <form
            onSubmit={trueFalseForm.handleSubmit(onSubmit)}
            className='space-y-8 w-1/2 mx-auto mt-8'
          >
            <FormField
              control={trueFalseForm.control}
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
                        <SelectValue placeholder={question.categories} />
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
              control={trueFalseForm.control}
              name='question'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input placeholder={question.question} {...field} />
                  </FormControl>
                  <FormDescription>Write your question here.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className=' flex gap-8 '>
              <FormField
                control={trueFalseForm.control}
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
                          <SelectValue
                            placeholder={question.answers[0].title}
                          />
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
                control={trueFalseForm.control}
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
                          <SelectValue
                            placeholder={question.answers[1].title}
                          />
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
              control={trueFalseForm.control}
              name='explanation'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Explanation</FormLabel>
                  <FormControl>
                    <Input placeholder={question.explanation} {...field} />
                  </FormControl>
                  <FormDescription>
                    Write an explanation for your students.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex gap-8'>
              <Button type='submit'>Update</Button>
              <Dialog>
                <DialogTrigger>
                  <Button
                    className='bg-destructive text-destructive-foreground hover:bg-red-800'
                    type='button'
                  >
                    Delete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className='mb-4'>Delete?</DialogTitle>
                    <DialogDescription>
                      <Button
                        onClick={deleteQuestion}
                        className='bg-destructive text-destructive-foreground hover:bg-red-800'
                      >
                        Yes!
                      </Button>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

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
      ) : (
        <div></div>
      )}
    </>
  )
}

export default EditPage
