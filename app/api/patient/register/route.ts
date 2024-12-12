import prisma from '@/db';

type Patient = {
  baseaddress: string;
  weight: number;
  age: number;
  name: string;
  sex: string;
  practitionerId?: number;
};

// create post route
export async function POST(request: Request) {
  try {
    const data: Patient = await request.json();

    const { baseaddress, name, age, weight, sex, practitionerId } = data;
    console.log(data);

    if (!baseaddress || !weight || !age || !name || !sex) {
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
        weight,
        age,
        name,
        sex,
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
