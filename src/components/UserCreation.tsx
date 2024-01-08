import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from './ui/button';
import { db } from '@/firebase';
import { collection, getDocs, doc, addDoc, setDoc } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from 'firebase/auth'
import { useNavigate } from 'react-router';




const userSchema = z.object({
    username: z.string().min(2,{
        message: 'Name must be at least 2 characters.',
    }),
    email: z.string().email(),
    password: z.string(),
    
  });
  

interface UserCreationProps {}

const UserCreation: React.FC<UserCreationProps> = ({}) => {
    const auth = getAuth();
    const navigate = useNavigate();
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
        username: '',
        email: '',
        password: '',
        
    },
  });

  async function onSubmit(values: z.infer<typeof userSchema>) {
    console.log(values);

    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, values.email, values.password);
        console.log(userCredentials.user);

            await setDoc(doc(db, "users", userCredentials.user.uid), { role: "student", username: values.username});
        navigate("/")
    } catch (error) {
        console.error("Error creating user:", error);
    }

}




return (
    <div className="mx-[1000px] my-80">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormDescription>
                  Geben Sie hier den Namen des Nutzers ein.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passwort</FormLabel>
                <FormControl>
                  <Input type= "password" {...field} />
                </FormControl>
                <FormDescription>
                  Tragen Sie das Passwort für den Nutzer ein.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormDescription>
                  Tragen Sie die Email des Nutzers ein.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default UserCreation;
