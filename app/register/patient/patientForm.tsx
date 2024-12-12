'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name must be 100 characters or less' }),
  age: z.preprocess((value) => {
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? undefined : parsed;
    }
    return value;
  }, z.number().int().min(0, { message: 'Age must be a positive number' }).max(120, { message: 'Age must be realistic' })),
  weight: z.preprocess((value) => {
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? undefined : parsed;
    }
    return value;
  }, z.number().min(0, { message: 'Weight must be a positive number' })),
  sex: z.preprocess(
    (value) => {
      if (typeof value === 'string') {
        return value.toLowerCase();
      }
      return value;
    },
    z.enum(['male', 'female', 'other'], {
      message: "Sex must be 'male', 'female', or 'other'",
    })
  ),
});

export default function PatientRegistrationForm() {
  const { address } = useAccount();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });
  const router = useRouter();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch('/api/patient/register', {
        method: 'POST',
        body: JSON.stringify({
          baseaddress: address,
          ...values,
          practitionerid: 1,
        }),
      });

      if (response.status === 200) {
        router.push('/patient');
      }
    } catch (err) {
      console.error(err);
      alert('Ran into issue check submission values');
    }
  }

  return (
    <Form {...form}>
      <form
        className='grow flex flex-col gap-5'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white text-base font-bold'>
                Name
              </FormLabel>
              <FormControl>
                <Input
                  className='text-white placeholder:text-gray-300'
                  placeholder='Enter name'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='age'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white text-base font-bold'>
                Age
              </FormLabel>
              <FormControl>
                <Input
                  className='text-white placeholder:text-gray-300'
                  placeholder='Enter age'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='weight'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white text-base font-bold'>
                Weight
              </FormLabel>
              <FormControl>
                <Input
                  className='text-white placeholder:text-gray-300'
                  placeholder='Enter weight in lbs'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='sex'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='text-white text-base font-bold'>
                Sex
              </FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className='text-gray-300'>
                    <SelectValue placeholder='Choose gender' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {['Male', 'Female', 'Other'].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-6 px-4 rounded text-base'
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
