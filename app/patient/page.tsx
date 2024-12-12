import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa6';
import { FaFileUpload } from 'react-icons/fa';
import { RiRobot2Fill } from 'react-icons/ri';

export default function Patient() {
  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <div className='flex justify-between w-3/4 gap-10'>
        <Card className='w-2/4 py-12 hover:bg-purple-400 cursor-pointer'>
          <CardHeader>
            <CardTitle className='text-center text-purple-600 text-3xl'>
              <Link href=''>Rate</Link>
            </CardTitle>
          </CardHeader>
          <CardContent className='flex justify-center items-center'>
            <FaStar className='h-24 w-24 text-purple-600' />
          </CardContent>
        </Card>
        <Card className='w-2/4 py-12 hover:bg-purple-400 cursor-pointer'>
          <CardHeader>
            <CardTitle className='text-center text-purple-600 text-3xl'>
              <Link href=''>Upload Image</Link>
            </CardTitle>
          </CardHeader>
          <CardContent className='flex justify-center items-center'>
            <FaFileUpload className='h-24 w-24 text-purple-600' />
          </CardContent>
        </Card>
        <Card className='w-2/4 py-12 hover:bg-purple-400 cursor-pointer'>
          <CardHeader>
            <CardTitle className='text-center text-purple-600 text-3xl'>
              <Link href=''>Agent</Link>
            </CardTitle>
          </CardHeader>
          <CardContent className='flex justify-center items-center'>
            <RiRobot2Fill className='h-24 w-24 text-purple-600' />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
