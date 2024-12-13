import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa6';
import { RiRobot2Fill } from 'react-icons/ri';

export default function Patient() {
  return (
    <div className='w-screen h-screen flex justify-center items-center'>
      <div className='flex justify-between w-3/4 gap-10'>
        <Link className='w-2/4  cursor-pointer' href=''>
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
    </div>
  );
}
