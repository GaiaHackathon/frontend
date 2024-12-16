import * as Client from '@web3-storage/w3up-client';
import * as Proof from '@web3-storage/w3up-client/proof';
import { Signer } from '@web3-storage/w3up-client/principal/ed25519';
import { StoreMemory } from '@web3-storage/w3up-client/stores/memory';
import prisma from '@/db';

export async function POST(request: Request) {
  const formData = await request.formData();

  try {
    const principal = Signer.parse(process.env.WEB3_STORAGE_KEY!);
    const store = new StoreMemory();
    const client = await Client.create({ principal, store });
    const proof = await Proof.parse(process.env.WEB3_STORAGE_PROOF!);
    const space = await client.addSpace(proof);
    await client.setCurrentSpace(space.did());
    const cid = await client.uploadFile(formData.get('image') as File);

    // Get the patient ID from the baseaddress
    const patient = await prisma.patient.findFirst({
      where: {
        baseaddress: formData.get('baseaddress') as string,
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

    const createdImage = await prisma.image.create({
      data: {
        beforeImageCid: cid.toString(),
        patientid: patient.patientid,
        description: formData.get('description') as string || null,
        analysis: null, // Will be updated when after image is uploaded
      },
    });

    return Response.json({
      imageUrl: `https://${cid.toString()}.ipfs.w3s.link`,
      createdImage,
    });
  } catch (err) {
    console.error(err);
    return Response.json(
      { message: 'Error trying to store image in ipfs' },
      { status: 500 }
    );
  }
}
