import prisma from '@/db';

export async function GET(request: Request) {
  const url = request.url;
  const { searchParams } = new URL(url);

  try {
    const patient = await prisma.patient.findFirst({
      where: {
        baseaddress: searchParams.get('address')!,
      },
    });

    if (patient) {
      return Response.json({ found: true, type: 'patient' });
    }

    const practitioner = await prisma.practitioner.findFirst({
      where: {
        baseaddress: searchParams.get('address')!,
      },
    });

    if (practitioner) {
      return Response.json({ found: true, type: 'practitioner' });
    }

    return Response.json({ found: false });
  } catch (err) {
    console.error(err);
    return Response.json({ message: 'User not found' }, { status: 404 });
  }
}
