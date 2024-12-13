'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedAfterFile, setSelectedAfterFile] = useState(null);
  const [beforeImageSrc, setBeforeImageSrc] = useState<string>();
  const [afterImageSrc, setAfterImageSrc] = useState<string>();
  const [beforeImageDescription, setBeforeImageDescription] =
    useState<string>();
  const [afterImageDescription, setAfterImageDescription] = useState<string>();

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
      setBeforeImageSrc(imageUrl);

      const agentResp = await fetch('/api/agent', {
        method: 'POST',
        body: JSON.stringify({ image_url: imageUrl }),
      });

      const agentDescription: string = (await agentResp.json()).message;
      setBeforeImageDescription(agentDescription);
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
      setAfterImageSrc(imageUrl);

      const agentResp = await fetch('/api/agent', {
        method: 'POST',
        body: JSON.stringify({ image_url: imageUrl }),
      });

      const agentDescription: string = (await agentResp.json()).message;
      setAfterImageDescription(agentDescription);
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
    <div className='w-screen my-24 flex justify-center items-center'>
      <div className='flex flex-col gap-10 w-2/4'>
        <form onSubmit={onBeforeImageSubmit}>
          <div className='grid w-full items-center gap-1.5'>
            <Label
              htmlFor='before-image'
              className='text-white text-base font-bold'
            >
              Before Image
            </Label>
            <Input
              id='before-image'
              type='file'
              onChange={handleBeforeImageChange}
              required
            />
          </div>
          <Button
            className='bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded text-base mt-2 w-full'
            type='submit'
          >
            Submit
          </Button>
        </form>

        {beforeImageSrc &&
          beforeImageSrc.length > 0 &&
          beforeImageDescription &&
          beforeImageDescription.length > 0 && (
            <Card className='flex flex-col gap-4 justify-center items-center'>
              <CardHeader>
                <CardTitle>Before Image</CardTitle>
              </CardHeader>
              <CardContent className='flex flex-col gap-4 justify-center items-center'>
                <img className='w-64 h-30' src={beforeImageSrc} />
                <p className='w-30 h-30 text-wrap overflow-scroll'>
                  {beforeImageDescription}
                </p>
              </CardContent>
            </Card>
          )}

        <form onSubmit={onAfterImageSubmit}>
          <div className='grid w-full items-center gap-1.5'>
            <Label
              htmlFor='after-image'
              className='text-white text-base font-bold'
            >
              After Image
            </Label>
            <Input
              id='after-image'
              type='file'
              onChange={handleAfterImageChange}
              required
            />
          </div>
          <Button
            className='bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded text-base mt-2 w-full'
            type='submit'
          >
            Submit
          </Button>
        </form>

        {afterImageSrc &&
          afterImageSrc.length > 0 &&
          afterImageDescription &&
          afterImageDescription.length > 0 && (
            <Card className='flex flex-col gap-4 justify-center items-center'>
              <CardHeader>
                <CardTitle>After Image</CardTitle>
              </CardHeader>
              <CardContent className='flex flex-col gap-4 justify-center items-center'>
                <img className='w-64 h-30' src={afterImageSrc} />
                <p className='w-30 h-30 text-wrap overflow-scroll'>
                  {afterImageDescription}
                </p>
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  );
}
