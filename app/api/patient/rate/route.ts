import prisma from '@/db';

type Rating = {
  patientid: number;
  rating: number;
  practitionerid: number;
};

export async function POST(request: Request) {
  const data: Rating = await request.json();

  if (!data.rating || !data.practitionerid || !data.patientid) {
    return Response.json(
      { message: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    const rating = await prisma.rating.create({
      data: {
        patientid: data.patientid,
        practitionerid: data.practitionerid,
        rating: data.rating,
      },
    });

    return Response.json(rating);
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: 'Error trying to save rating' },
      { status: 500 }
    );
  }
}
