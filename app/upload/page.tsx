'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedAfterFile, setSelectedAfterFile] = useState(null);
  const [beforeAfterImageSrc, setBeforeAfterImageSrc] = useState<string>();
  const [beforeAfterImageDescription, setBeforeAfterImageDescription] =
    useState<string>();

  const onBeforeAfterImageSubmit = async (
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
      setBeforeAfterImageSrc(imageUrl);

      const agentResp = await fetch('/api/agent', {
        method: 'POST',
        body: JSON.stringify({ image_url: imageUrl }),
      });

      console.log(agentResp);

      const agentDescription: string = (await agentResp.json()).message.content;
      setBeforeAfterImageDescription(agentDescription);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBeforeAfterImageChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  return (
    <div className='w-screen my-48 flex justify-center items-center'>
      <div className='flex flex-col gap-10 w-2/4'>
        <form onSubmit={onBeforeAfterImageSubmit}>
          <div className='grid w-full items-center gap-1.5'>
            <Label
              htmlFor='before-image'
              className='text-white text-base font-bold'
            >
              Before & After Image
            </Label>
            <Input
              id='before-image'
              type='file'
              onChange={handleBeforeAfterImageChange}
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

        {beforeAfterImageSrc &&
          beforeAfterImageSrc.length > 0 &&
          beforeAfterImageDescription &&
          beforeAfterImageDescription.length > 0 && (
            <Card className='flex flex-col gap-4 justify-center items-center'>
              <CardHeader>
                <CardTitle>Before & After Image</CardTitle>
              </CardHeader>
              <CardContent className='flex flex-col gap-4 justify-center items-center'>
                <img className='w-64 h-30' src={beforeAfterImageSrc} />
                <p className='w-30 h-30 text-wrap'>
                  {beforeAfterImageDescription}
                </p>
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  );
}
