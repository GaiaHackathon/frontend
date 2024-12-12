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
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name must be 150 characters or less' }),
});

export default function PractitionerRegistrationForm() {
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
      const response = await fetch('/api/practitioner/register', {
        method: 'POST',
        body: JSON.stringify({ baseaddress: address, name: values.name }),
      });

      if (response.status === 200) {
        router.push('/practitioner');
      }
    } catch (err) {
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
                  placeholder='Jake Fitness'
                  {...field}
                />
              </FormControl>
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
