import prisma from '@/db';

type Practitioner = {
  baseaddress: string;
  name: string;
};

export async function GET(request: Request) {
  
}

export async function POST(request: Request) {
  const res: Practitioner = await request.json();

  if (!res.baseaddress || !res.name) {
    return Response.json(
      { message: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    const patient = await prisma.practitioner.create({
      data: {
        baseaddress: res.baseaddress,
        name: res.name,
      },
    });

    return Response.json({ patient });
  } catch (err) {
    console.log(err);
    return Response.json(
      { message: 'Ran into error creating new patient' },
      { status: 500 }
    );
  }
}
