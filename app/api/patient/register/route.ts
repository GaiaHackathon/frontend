import prisma from '@/db';

type Patient = {
  baseaddress: string;
  weight: number;
  height: number;
  fatPercentage?: number;
  age: number;
  name: string;
  sex: string;
  practitionerId?: number;
};

// create post route
export async function POST(request: Request) {
  try {
    const data: Patient = await request.json();
    console.log('Received payload:', data); // Add logging here


    const { baseaddress, name, age, weight, height, fatPercentage,sex, practitionerId } = data;
    console.log(data);

    if (!baseaddress || !weight || !age || !name || !sex || !height) {
      return new Response(
        JSON.stringify({ message: 'Missing required fields' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
 console.log('Here');
    await prisma.patient.create({
      data: {
        baseaddress,
        weight,
        height,
        fatPercentage,
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
