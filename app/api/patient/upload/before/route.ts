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
    const file = formData.get('image') as File;

    const description = formData.get('description') as string || null;
    // check if description is null
    if (description === null) {
      return new Response(
        JSON.stringify({ error: 'Description is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    // check if baseaddress not null
    if (!formData.get('baseaddress')) {
      return new Response(
        JSON.stringify({ error: 'Baseaddress is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

        // Validation checks for 'description'
    if (description && description.length > 2000) {
      return new Response(
        JSON.stringify({
          error: 'Description exceeds maximum allowed length of 2000 characters',
        }),
        { status: 400 }
      );
    }

    if (!file || !file.type.startsWith('image/')) {
      return new Response(
        JSON.stringify({ error: 'Invalid file type. Only images are allowed.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      return new Response(
        JSON.stringify({ error: 'File too large. Maximum size is 5MB.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const cid = await client.uploadFile(file);

    // Get the patient ID from the baseaddress
    const patient = await prisma.patient.findFirst({
      where: {
        baseaddress: formData.get('baseaddress') as string,
      },
    });

    if (!patient) {
      return new Response(
        JSON.stringify({ error: 'Patient not found' }),
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
        description: description || null,
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
      { error: 'Error trying to store image in ipfs' },
      { status: 500 }
    );
  }
}
