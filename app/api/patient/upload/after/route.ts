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

    const imageId = formData.get('imageId');
    if (!imageId) {
      return new Response(
        JSON.stringify({ message: 'Image ID is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // check if image id is a number
    if (isNaN(Number(imageId))) {
      return new Response(
        JSON.stringify({ message: 'Image ID is not a number' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const createdImage = await prisma.image.update({
      where: {
        imageid: Number(imageId),
        patientid: patient.patientid,
        afterImageUploaded: false,
      },
      data: {
        afterImageCid: cid.toString(),
        afterImageUploaded: true
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
