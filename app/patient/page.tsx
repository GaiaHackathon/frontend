'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa6';
import { RiRobot2Fill } from 'react-icons/ri';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAccount } from 'wagmi';
import Image from 'next/image';

interface Patient {
  patientid: number;
  baseaddress: string;
  weight: number;
  height: number;
  fatPercentage: number | null;
  age: number;
  name: string;
  sex: 'male' | 'female' | 'other';
  images: {
    imageid: number;
    beforeImageCid: string;
    afterImageCid: string | null;
    afterImageUploaded: boolean;
    description: string | null;
    analysis: string | null;
  }[];
}

export default function Patient() {
  const { address } = useAccount();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!address) {
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const response = await fetch(`/api/patient/data?baseaddress=${address}`);
        if (response.ok) {
          const data = await response.json();
          setPatient(data);
        } else {
          throw new Error(response.status === 404 ? 'Patient profile not found' : 'Failed to fetch patient data');
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 1000 * Math.pow(2, retryCount));
        }
        console.error('Error fetching patient data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [address, retryCount]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">Error: {error}: Retrying...</div>
    );
  }

  if (!address) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p>Please connect your wallet to view your patient profile.</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Register as a Patient</h2>
          <p className="mb-4">You need to register before accessing your profile.</p>
          <Link href="/register/patient">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded">
              Register Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='w-screen min-h-screen p-8'>
      <div className='max-w-7xl mx-auto space-y-8'>
        {/* Actions Section */}
        <div className='flex justify-between gap-10'>
          <Link className='w-2/4 cursor-pointer' href=''>
            <Card className='hover:bg-purple-400 py-12'>
              <CardHeader>
                <CardTitle className='text-center text-purple-600 text-3xl'>
                  Rate
                </CardTitle>
              </CardHeader>
              <CardContent className='flex justify-center items-center'>
                <FaStar className='h-24 w-24 text-purple-600' />
              </CardContent>
            </Card>
          </Link>
          <Link className='w-2/4 cursor-pointer' href='/upload'>
            <Card className='hover:bg-purple-400 py-12'>
              <CardHeader>
                <CardTitle className='text-center text-purple-600 text-3xl'>
                  Analyze Progress Image
                </CardTitle>
              </CardHeader>
              <CardContent className='flex justify-center items-center'>
                <RiRobot2Fill className='h-24 w-24 text-purple-600' />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Medical Data Section */}
        <Card>
          <CardHeader>
            <CardTitle>Medical Data</CardTitle>
          </CardHeader>
          <CardContent className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div>
              <p className='text-sm text-gray-500'>Age</p>
              <p className='text-lg font-semibold'>{patient.age} years</p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>Weight</p>
              <p className='text-lg font-semibold'>{patient.weight} kg</p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>Height</p>
              <p className='text-lg font-semibold'>{patient.height} cm</p>
            </div>
            {patient.fatPercentage && (
              <div>
                <p className='text-sm text-gray-500'>Body Fat</p>
                <p className='text-lg font-semibold'>{patient.fatPercentage}%</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Progress Gallery Section */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            {patient.images && patient.images.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {patient.images.map((image) => (
                  <Card key={image.imageid} className='overflow-hidden'>
                    <div className='p-4'>
                      <div className='flex flex-col gap-4'>
                        <div className='flex justify-between items-start'>
                          <div className='space-y-4'>
                            <Image 
                              src={`https://${image.beforeImageCid}.ipfs.w3s.link`}
                              alt='Before'
                              className='w-full h-48 object-cover rounded'
                            />
                            {image.afterImageCid && (
                              <Image 
                                src={`https://${image.afterImageCid}.ipfs.w3s.link`}
                                alt='After'
                                className='w-full h-48 object-cover rounded'
                              />
                            )}
                          </div>
                        </div>
                        {image.description && (
                          <p className='text-sm text-gray-600'>{image.description}</p>
                        )}
                        {image.analysis && (
                          <div>
                            <Badge className='mb-2'>AI Analysis</Badge>
                            <p className='text-sm'>{image.analysis}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No progress images yet.</p>
                <Link href="/upload">
                  <Button className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded">
                    Upload Your First Image
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
