import { Button, buttonVariants } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore'
import { ChevronLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import * as z from 'zod'
import ManageCategoryDialog from './ManageCategoryDialog'
import { Checkbox } from './ui/checkbox'

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

const multipleChoiceFormSchema = z.object({
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

const EditPage: React.FC<EditPageProps> = ({}) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [question, setQuestion] = useState<Question>()
  const [multiQuestion, setMultiQuestion] = useState<Question>()
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
  }, [open])

  async function getData() {
    if (id) {
      try {
        const docSnap = await getDoc(doc(db, 'questions', id))

        if (docSnap.exists()) {
          const quest: Question = docSnap.data() as Question
          if (quest.type === 'trueFalse') {
            setQuestion(quest)
          } else {
            setMultiQuestion(quest)
          }
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
      category: question?.categories[0] || '',
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
      category: question?.categories[0] || '',
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

  const multipleChoiceForm = useForm<z.infer<typeof multipleChoiceFormSchema>>({
    resolver: zodResolver(multipleChoiceFormSchema),
    defaultValues: {
      category: multiQuestion?.categories[0] || '',
      answer1: {
        answer: multiQuestion?.answers[0].title,
        correct: multiQuestion?.answers[0].correct,
      },
      answer2: {
        answer: multiQuestion?.answers[1].title,
        correct: multiQuestion?.answers[1].correct,
      },
      answer3: {
        answer: multiQuestion?.answers[2].title,
        correct: multiQuestion?.answers[2].correct,
      },
      answer4: {
        answer: multiQuestion?.answers[3].title,
        correct: multiQuestion?.answers[3].correct,
      },
      explanation: multiQuestion?.explanation,
      question: multiQuestion?.question,
    },
    values: {
      category: multiQuestion?.categories[0] || '',
      answer1: {
        answer: multiQuestion?.answers[0].title,
        correct: multiQuestion?.answers[0].correct,
      },
      answer2: {
        answer: multiQuestion?.answers[1].title,
        correct: multiQuestion?.answers[1].correct,
      },
      answer3: {
        answer: multiQuestion?.answers[2].title,
        correct: multiQuestion?.answers[2].correct,
      },
      answer4: {
        answer: multiQuestion?.answers[3].title,
        correct: multiQuestion?.answers[3].correct,
      },
      explanation: multiQuestion?.explanation,
      question: multiQuestion?.question,
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

  async function onMultipleChoiceSubmit(
    values: z.infer<typeof multipleChoiceFormSchema>
  ) {
    if (
      values.answer1.correct ||
      values.answer2.correct ||
      values.answer3.correct ||
      values.answer4.correct
    ) {
      if (id) {
        const questionRef = doc(db, 'questions', id)
        const updatedData = {
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
        }
        try {
          await updateDoc(questionRef, updatedData)
          console.log('Document successfully updated')
          navigate('/dashboard/questions')
        } catch (error) {
          console.error('Error updating document: ', error)
        }
      }
      console.log(values)
    } else {
      setAnswerError(true)
      console.log('flop')
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
      <div className='ml-20 mt-20'>
        <Link
          to='/dashboard/questions'
          className={buttonVariants({ variant: 'link' })}
        >
          <ChevronLeft />
          Back
        </Link>
      </div>
      {question?.type === 'trueFalse' ? (
        <Form {...trueFalseForm}>
          <form
            onSubmit={trueFalseForm.handleSubmit(onSubmit)}
            className='space-y-8 w-2/3 mx-auto mt-8'
          >
            <div className='flex-col gap-4 justify-end'>
              <FormField
                control={trueFalseForm.control}
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
                          <SelectValue placeholder={question?.categories} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className=' h-48'>
                        <SelectGroup>
                          {categories.map((category) => (
                            <SelectItem
                              value={category.title}
                              key={category.id}
                            >
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
              <Button
                variant='link'
                type='button'
                onClick={() => setOpen(true)}
              >
                Manage Categories
              </Button>
            </div>
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

            <ManageCategoryDialog
              open={open}
              setOpen={setOpen}
              categories={categories}
              add={addCategory}
              delete={deleteCategory}
            />
          </form>
        </Form>
      ) : (
        <Form {...multipleChoiceForm}>
          <form
            onSubmit={multipleChoiceForm.handleSubmit(onMultipleChoiceSubmit)}
            className='space-y-8 w-2/3 mx-auto mt-8 mb-8'
          >
            <div className='flex-col gap-4 justify-end'>
              <FormField
                control={multipleChoiceForm.control}
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
                          <SelectValue placeholder={question?.categories} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className=' h-48'>
                        <SelectGroup>
                          {categories.map((category) => (
                            <SelectItem
                              value={category.title}
                              key={category.id}
                            >
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
              <Button
                variant='link'
                type='button'
                onClick={() => setOpen(true)}
              >
                Manage Categories
              </Button>
            </div>
            <FormField
              control={multipleChoiceForm.control}
              name='question'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input placeholder={multiQuestion?.question} {...field} />
                  </FormControl>
                  <FormDescription>Write your question here.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex gap-8'>
              <FormField
                control={multipleChoiceForm.control}
                name='answer1.answer'
                render={({ field }) => (
                  <FormItem className='w-1/3'>
                    <FormLabel>Answer 1</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={multiQuestion?.answers[1].title}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Write your answer here.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={multipleChoiceForm.control}
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
                control={multipleChoiceForm.control}
                name='answer2.answer'
                render={({ field }) => (
                  <FormItem className='w-1/3'>
                    <FormLabel>Answer 2</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={multiQuestion?.answers[1].title}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Write your answer here.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={multipleChoiceForm.control}
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
                control={multipleChoiceForm.control}
                name='answer3.answer'
                render={({ field }) => (
                  <FormItem className='w-1/3'>
                    <FormLabel>Answer 3</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={multiQuestion?.answers[2].title}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Write your answer here.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={multipleChoiceForm.control}
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
                control={multipleChoiceForm.control}
                name='answer4.answer'
                render={({ field }) => (
                  <FormItem className='w-1/3'>
                    <FormLabel>Answer 4</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={multiQuestion?.answers[3].title}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Write your answer here.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={multipleChoiceForm.control}
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
              control={multipleChoiceForm.control}
              name='explanation'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Explanation</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={multiQuestion?.explanation}
                      {...field}
                    />
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
                <DialogTrigger asChild>
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
          </form>
          <ManageCategoryDialog
            open={open}
            setOpen={setOpen}
            categories={categories}
            add={addCategory}
            delete={deleteCategory}
          />
        </Form>
      )}
    </>
  )
}

export default EditPage
