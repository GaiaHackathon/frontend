import prisma from '@/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const baseaddress = searchParams.get('baseaddress');

    if (!baseaddress) {
      return new Response(
        JSON.stringify({ message: 'Wallet address is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const patient = await prisma.patient.findFirst({
      where: {
        baseaddress: baseaddress,
      },
      include: {
        images: true,
      },
    });

    if (!patient) {
      return new Response(
        JSON.stringify({ message: 'Patient not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return Response.json(patient);
  } catch (error) {
    console.error('Error in GET request:', error);
    return new Response(
      JSON.stringify({ message: 'Could not fetch patient data' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}