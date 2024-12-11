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
import { Label } from '@/components/ui/label';
import { useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name must be 150 characters or less' }),
});

export default function PractitionerRegistrationForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });
  const [services, setServices] = useState<string[]>([]);
  const servicesRef = useRef<HTMLInputElement>(null);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (services.length === 0) {
      alert('Make sure to offer at least 1 service!');
      return;
    }

    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    alert(JSON.stringify({ name: values.name, services: services }));
  }

  const onServiceAdd = () => {
    const temp = [...services];

    if (servicesRef.current && servicesRef.current.value) {
      temp.push(servicesRef.current.value);
      servicesRef.current.value = '';
      setServices(temp);
    }
  };

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
        <div className='flex flex-col gap-2'>
          <Label className='text-white text-base font-bold' htmlFor='services'>
            Services
          </Label>
          <div className='flex gap-7'>
            <Input
              name='services'
              placeholder='Physiotherapy'
              className='text-white placeholder:text-gray-300'
              ref={servicesRef}
            />
            <div className='flex gap-1'>
              <Button
                className='bg-blue-700 hover:bg-blue-500'
                onClick={onServiceAdd}
                type='button'
              >
                Add
              </Button>
              <Button
                className='bg-red-700 hover:bg-red-500'
                onClick={() => {
                  const temp = [...services];
                  temp.pop();
                  setServices(temp);
                }}
                type='button'
              >
                Del
              </Button>
            </div>
          </div>
          <div className='flex gap-5 my-3'>
            {services.map((s) => (
              <Badge
                className='px-4 py-2 text-gray-700 bg-white font-bold text-base hover:bg-white'
                key={s}
              >
                {s}
              </Badge>
            ))}
          </div>
        </div>
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
