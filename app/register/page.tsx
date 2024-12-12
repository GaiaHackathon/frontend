'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaUserDoctor } from 'react-icons/fa6';
import { RiUserHeartFill } from 'react-icons/ri';

export default function Register() {
  const router = useRouter();

  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <div className='flex justify-between w-3/4 gap-10'>
        <Card
          className='w-2/4 py-12 hover:bg-purple-400 cursor-pointer'
          onClick={() => router.push('/register/practitioner')}
        >
          <CardHeader>
            <CardTitle className='text-center text-purple-600 text-3xl'>
              Practitioner
            </CardTitle>
          </CardHeader>
          <CardContent className='flex justify-center items-center'>
            <FaUserDoctor className='h-24 w-24 text-purple-600' />
          </CardContent>
        </Card>
        <Card
          className='w-2/4 py-12 hover:bg-purple-400 cursor-pointer'
          onClick={() => router.push('/register/patient')}
        >
          <CardHeader>
            <CardTitle className='text-center text-purple-600 text-3xl'>
              Patient
            </CardTitle>
          </CardHeader>
          <CardContent className='flex justify-center items-center'>
            <RiUserHeartFill className='h-24 w-24 text-purple-600' />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
