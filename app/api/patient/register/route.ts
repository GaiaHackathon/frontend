import prisma from '@/db';

type Patient = {
  baseaddress: string;
  height: number;
  weight: number;
  birthdate: string;
  name: string;
  practitionerId?: number;
};

// create post route
export async function POST(request: Request) {
  try {
    const data: Patient = await request.json();

    const { baseaddress, height, weight, birthdate, name, practitionerId } =
      data;

    if (!baseaddress || !height || !weight || !birthdate || !name) {
      return new Response(
        JSON.stringify({ message: 'Missing required fields' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    await prisma.patient.create({
      data: {
        baseaddress,
        height,
        weight,
        birthdate: new Date(birthdate),
        name,
        practitionerid: practitionerId,
      },
    });

    return Response.json({ message: 'Successfully created patient!' });
  } catch (error) {
    console.error('Error in POST request:', error); // Log the error
    return new Response(
      JSON.stringify({ message: 'Could not create patient' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
