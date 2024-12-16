// app/api/patient/upload/analysis/route.ts
import prisma from '@/db';

export async function POST(request: Request) {
  const formData = await request.formData();

  try {
    const baseaddress = formData.get('baseaddress') as string;
    const imageId = formData.get('imageId') as string;
    const analysis = formData.get('analysis') as string;

    if (!baseaddress || !imageId || !analysis) {
      return new Response(
        JSON.stringify({ message: 'Missing required fields: baseaddress, imageId, and analysis are required.' }),
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

    const updatedImage = await prisma.image.update({
      where: {
        imageid: Number(imageId),
      },
      data: {
        analysis: analysis,
      },
    });

    return Response.json({
      message: 'Analysis successfully saved.',
      updatedImage,
    });
  } catch (error) {
    console.error('Error saving analysis:', error);
    return new Response(
      JSON.stringify({ message: 'Error saving analysis.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
