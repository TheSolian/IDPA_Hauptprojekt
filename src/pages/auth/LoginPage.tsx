import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { auth, db } from '@/firebase'
import { useAppDispatch } from '@/redux/hooks'
import { setUser } from '@/redux/slices/authSlice'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as z from 'zod'

interface LoginPageProps {}

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

const LoginPage: React.FC<LoginPageProps> = ({}) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values

    const credentials = await signInWithEmailAndPassword(auth, email, password)
    navigate('/')
  }

  return (
    <div className='grid place-content-center min-h-screen'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-4 border p-4 min-w-[600px] rounded-xl'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Email' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder='Password' type='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex justify-end'>
            <Button>Login</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default LoginPage
