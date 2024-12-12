'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaUserDoctor } from 'react-icons/fa6';
import { RiUserHeartFill } from 'react-icons/ri';
import Link from 'next/link';

export default function Register() {
  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <div className='flex justify-between w-3/4 gap-10'>
        <Card className='w-2/4 py-12 hover:bg-purple-400 cursor-pointer'>
          <CardHeader>
            <CardTitle className='text-center text-purple-600 text-3xl'>
              <Link href='/register/practitioner'>Practitioner</Link>
            </CardTitle>
          </CardHeader>
          <CardContent className='flex justify-center items-center'>
            <FaUserDoctor className='h-24 w-24 text-purple-600' />
          </CardContent>
        </Card>
        <Card className='w-2/4 py-12 hover:bg-purple-400 cursor-pointer'>
          <CardHeader>
            <CardTitle className='text-center text-purple-600 text-3xl'>
              <Link href='/register/patient'>Patient</Link>
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
