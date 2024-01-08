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
import { db } from '@/firebase'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import * as z from 'zod'
import { Button, buttonVariants } from './ui/button'

const userSchema = z.object({
  username: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email(),
  password: z.string(),
})

interface UserCreationProps {}

const UserCreation: React.FC<UserCreationProps> = ({}) => {
  const auth = getAuth()
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof userSchema>) {
    console.log(values)

    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      )
      console.log(userCredentials.user)

      await setDoc(doc(db, 'users', userCredentials.user.uid), {
        role: 'student',
        username: values.username,
      })
      navigate('/')
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  return (
    <div className='grid justify-center mt-40'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-8 min-w-[400px] max-w-xl border rounded-lg p-4'
        >
          <h1 className='text-3xl'>Sign Up</h1>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder='' {...field} />
                </FormControl>
                <FormDescription>
                  Enter a Username for your account
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passwort</FormLabel>
                <FormControl>
                  <Input type='password' {...field} />
                </FormControl>
                <FormDescription>
                  Enter a password for your account
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='' {...field} />
                </FormControl>
                <FormDescription>
                  Enter an email for your account
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='self-end'>
            <Link to={'/login'} className={buttonVariants({ variant: 'link' })}>
              Login
            </Link>
            <Button>Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default UserCreation
