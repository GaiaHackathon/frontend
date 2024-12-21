'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import Image from 'next/image';

const validateImageFile = (file: File | null, inputElement: HTMLInputElement): boolean => {
  if (!file) return true;
  
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file');
    inputElement.value = '';
    return false;
  }
  
  if (file.size > 5 * 1024 * 1024) {
    alert('Image size must be less than 5MB');
    inputElement.value = '';
    return false;
  }
  
  return true;
};

export default function Upload() {
  const { address } = useAccount();
  const router = useRouter();
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [description, setDescription] = useState('');
  const [beforeImageSrc, setBeforeImageSrc] = useState<string>();
  const [afterImageSrc, setAfterImageSrc] = useState<string>();
  const [analysis, setAnalysis] = useState<string>();
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Add confirmation before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (beforeFile || afterFile) {
        const message = 'You have unsaved changes. Are you sure you want to leave?';
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [beforeFile, afterFile]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);

    try {
      // Upload before image
      const beforeFormData = new FormData();
      if(!beforeFile || !address)
      {
          alert("Missing required data for before image upload.");
          return; 
      }
      beforeFormData.append('image', beforeFile!);
      beforeFormData.append('description', description);
      beforeFormData.append('baseaddress', address!);
      const beforeResp = await fetch('/api/patient/upload/before', {
        method: 'POST',
        body: beforeFormData,
      });

      if (!beforeResp.ok) {
        const error = await beforeResp.json();
        throw new Error(error.message || 'Failed to upload before image');
      }

      const beforeData = await beforeResp.json();
      setBeforeImageSrc(beforeData.imageUrl);

      // Get AI analysis of the before image
      setIsAnalyzing(true);
      const agentResp = await fetch('/api/agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          before_url: beforeData.imageUrl,
        }),
      });

      if (!agentResp.ok) {
        throw new Error('Failed to analyze image');
      }

      const agentData = await agentResp.json();
      let analysisText = agentData.message.content;
      setAnalysis(analysisText);
      
      // set before file to null so that the warning is not shown that no upload was saved
      setBeforeFile(null);

      let afterData = null;
      // Upload after image if provided
      if (afterFile) {
        // First upload the after image
        const afterFormData = new FormData();
        afterFormData.append('image', afterFile);
        afterFormData.append('baseaddress', address!);
        afterFormData.append('imageId', beforeData.createdImage.imageid.toString());
        
        const afterResp = await fetch('/api/patient/upload/after', {
          method: 'POST',
          body: afterFormData,
        });

        if (!afterResp.ok) {
          const error = await afterResp.json();
          throw new Error(error.message || 'Failed to upload after image');
        }

        afterData = await afterResp.json();
        setAfterImageSrc(afterData.imageUrl);

        // Then get AI analysis with both images
        setIsAnalyzing(true);
        const updatedAgentResp = await fetch('/api/agent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            before_url: beforeData.imageUrl,
            after_url: afterData.imageUrl,
          }),
        });

        if (!updatedAgentResp.ok) {
          throw new Error('Failed to analyze images');
        }

        const updatedAgentData = await updatedAgentResp.json();
        analysisText = updatedAgentData.message.content;
        setAnalysis(analysisText);

        // Finally, update the analysis in the database
        const updateFormData = new FormData();
        updateFormData.append('baseaddress', address!);
        updateFormData.append('imageId', beforeData.createdImage.imageid.toString());
        updateFormData.append('analysis', analysisText);
        
        const updateResp = await fetch('/api/patient/upload/analysis', {
          method: 'POST',
          body: updateFormData,
        });

        if (!updateResp.ok) {
          throw new Error('Failed to save analysis');
        }

        setAfterFile(null);
      }

      // Navigate to patient profile after successful upload
      router.push('/patient');
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  if (!address) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p>Please connect your wallet to upload progress images.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-screen my-48 flex justify-center items-center'>
      <div className='flex flex-col gap-10 w-2/4'>
        <form onSubmit={handleSubmit}>
          <div className='grid w-full items-center gap-4'>
            <div>
              <Label
                htmlFor='before-image'
                className='text-white text-base font-bold'
              >
                Before Image (Required)
              </Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id='before-image'
                    type='file'
                    accept='image/*'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (validateImageFile(file, e.target)) {
                        setBeforeFile(file || null);
                      }
                    }}
                    required
                  />
                  {beforeFile && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setBeforeFile(null);
                        const input = document.getElementById('before-image') as HTMLInputElement;
                        if (input) input.value = '';
                      }}
                    >
                      Clear
                    </Button>
                  )}
                </div>
                {beforeFile && (
                  <p className="text-sm text-gray-400">Selected: {beforeFile.name}</p>
                )}
                <p className="text-sm text-gray-500">Max file size: 5MB. Supported formats: JPG, PNG, GIF</p>
              </div>
            </div>

            <div>
              <Label
                htmlFor='after-image'
                className='text-white text-base font-bold'
              >
                After Image (Optional)
              </Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id='after-image'
                    type='file'
                    accept='image/*'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (validateImageFile(file, e.target)) {
                        setAfterFile(file || null);
                      }
                    }}
                  />
                  {afterFile && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setAfterFile(null);
                        const input = document.getElementById('after-image') as HTMLInputElement;
                        if (input) input.value = '';
                      }}
                    >
                      Clear
                    </Button>
                  )}
                </div>
                {afterFile && (
                  <p className="text-sm text-gray-400">Selected: {afterFile.name}</p>
                )}
                <p className="text-sm text-gray-500">Max file size: 5MB. Supported formats: JPG, PNG, GIF</p>
              </div>
            </div>

            <div>
              <Label
                htmlFor='description'
                className='text-white text-base font-bold'
              >
                Description
              </Label>
              <Input
                id='description'
                type='text'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder='Add a description for these images'
              />
            </div>
          </div>
          <Button
            className='bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded text-base mt-4 w-full'
            type='submit'
            disabled={isUploading || isAnalyzing}
          >
            {isUploading ? 'Uploading...' : isAnalyzing ? 'Analyzing...' : 'Submit'}
          </Button>
        </form>

        {(beforeImageSrc || afterImageSrc) && (
          <Card className='flex flex-col gap-4'>
            <CardHeader>
              <CardTitle>Progress Images</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
              <div className='flex flex-row gap-4 justify-center'>
                {beforeImageSrc && (
                  <div className='flex flex-col items-center'>
                    <p className='font-bold mb-2'>Before</p>
                    <div className='w-64 h-64 relative'>
                      <Image 
                        src={beforeImageSrc}
                        alt='Before'
                        className='w-full h-full object-cover rounded opacity-0 transition-opacity duration-300'
                        onLoad={(e) => (e.target as HTMLImageElement).classList.remove('opacity-0')}
                        onError={(e) => {
                          (e.target as HTMLImageElement).classList.remove('opacity-0');
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxsaW5lIHgxPSIxOCIgeTE9IjYiIHgyPSI2IiB5Mj0iMTgiPjwvbGluZT48bGluZSB4MT0iNiIgeTE9IjYiIHgyPSIxOCIgeTI9IjE4Ij48L2xpbmU+PC9zdmc+';
                        }}
                      />
                      <div className='absolute inset-0 bg-gray-100 animate-pulse' />
                    </div>
                  </div>
                )}
                {afterImageSrc && (
                  <div className='flex flex-col items-center'>
                    <p className='font-bold mb-2'>After</p>
                    <div className='w-64 h-64 relative'>
                      <Image 
                        src={afterImageSrc}
                        alt='After'
                        className='w-full h-full object-cover rounded opacity-0 transition-opacity duration-300'
                        onLoad={(e) => (e.target as HTMLImageElement).classList.remove('opacity-0')}
                        onError={(e) => {
                          (e.target as HTMLImageElement).classList.remove('opacity-0');
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxsaW5lIHgxPSIxOCIgeTE9IjYiIHgyPSI2IiB5Mj0iMTgiPjwvbGluZT48bGluZSB4MT0iNiIgeTE9IjYiIHgyPSIxOCIgeTI9IjE4Ij48L2xpbmU+PC9zdmc+';
                        }}
                      />
                      <div className='absolute inset-0 bg-gray-100 animate-pulse' />
                    </div>
                  </div>
                )}
              </div>
              {description && (
                <div className='mt-4'>
                  <p className='font-bold'>Description:</p>
                  <p>{description}</p>
                </div>
              )}
              {(beforeImageSrc || isAnalyzing || analysis) && (
                <div className='mt-4'>
                  <p className='font-bold'>AI Analysis:</p>
                  {isAnalyzing ? (
                    <div className='flex items-center justify-center py-4'>
                      <div className='animate-pulse text-gray-500'>Analyzing images...</div>
                    </div>
                  ) : analysis ? (
                    <p className='text-wrap'>{analysis}</p>
                  ) : (
                    <div className='text-gray-500 py-2'>Analysis will appear here...</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
