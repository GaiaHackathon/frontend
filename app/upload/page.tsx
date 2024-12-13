'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedAfterFile, setSelectedAfterFile] = useState(null);

  const onBeforeImageSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('image', selectedFile!);

    try {
      const resp = await fetch('/api/patient/upload/before', {
        method: 'POST',
        body: formData,
      });

      const imageUrl: string = (await resp.json()).imageUrl;
    } catch (err) {
      console.error(err);
    }
  };

  const onAfterImageSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('image', selectedAfterFile!);

    try {
      const resp = await fetch('/api/patient/upload/after', {
        method: 'POST',
        body: formData,
      });

      const imageUrl: string = (await resp.json()).imageUrl;
    } catch (err) {
      console.error(err);
    }
  };

  const handleBeforeImageChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleAfterImageChange = (event) => {
    setSelectedAfterFile(event.target.files[0]);
  };

  return (
    <div>
      <form onSubmit={onBeforeImageSubmit}>
        <div className='grid w-full max-w-sm items-center gap-1.5'>
          <Label htmlFor='before-image'>Before Image</Label>
          <Input
            id='before-image'
            type='file'
            onChange={handleBeforeImageChange}
            required
          />
        </div>
        <Button type='submit'>Submit</Button>
      </form>

      <form onSubmit={onAfterImageSubmit}>
        <div className='grid w-full max-w-sm items-center gap-1.5'>
          <Label htmlFor='after-image'>After Image</Label>
          <Input
            id='after-image'
            type='file'
            onChange={handleAfterImageChange}
            required
          />
        </div>
        <Button type='submit'>Submit</Button>
      </form>
    </div>
  );
}
