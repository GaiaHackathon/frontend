
// Import everything needed for nextjs api route
import { PrismaClient, Patient } from '@prisma/client'

interface PatientData {
  baseaddress: string;
  height: number;
  weight: number;
  birthdate: string;
  name: string;
  practitionerId?: number;
}

// create post route
export async function POST(req: Request) {
  try {
    console.log('Received request:', req); // Log the request object

    const data = await req.json();
    console.log('Parsed request body:', data); // Log the parsed request body

    const { baseaddress, height, weight, birthdate, name, practitionerId } = data;

    if (!baseaddress || !height || !weight || !birthdate || !name) {
      console.error('Missing required fields:', data); // Log the missing fields
      return new Response(JSON.stringify({ message: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // create prisma client
    const prisma = new PrismaClient();
    console.log('Prisma client created'); // Log Prisma client creation

    // create patient
    const patient: Patient = await prisma.patient.create({
      data: {
        baseaddress,
        height,
        weight,
        birthdate: new Date(birthdate),
        name,
        practitionerid: practitionerId ? practitionerId : 0
      },
    });

    console.log('Patient created:', patient); // Log the created patient
    return new Response("Success", {
      status: 200,
    });
  } catch (error) {
    console.error('Error in POST request:', error); // Log the error
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
