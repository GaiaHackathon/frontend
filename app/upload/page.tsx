'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Upload() {
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    console.log(formData);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className='grid w-full max-w-sm items-center gap-1.5'>
        <Label htmlFor='image'>Image</Label>
        <Input id='image' type='file' />
      </div>
      <Button type='submit'>Submit</Button>
    </form>
  );
}
