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

    const createdImage = await prisma.image.create({
      data: {
        beforeImageCid: cid.toString(),
        patientid: Number(formData.get('patientid')),
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

  //   if (req.method === 'POST') {
  //     const data: Image = req.body;

  //     if (!data || !data.beforeImageCid || !data.patientId) {
  //       return res.status(400).json({ message: 'Missing required fields' });
  //     }
  //     // create prisma client
  //     const prisma = new PrismaClient();

  //     // create patient
  //     const patient = await prisma.image.create({
  //       data: {
  //         beforeImageCid: data.beforeImageCid,
  //         patientid: data.patientId,
  //         afterImageUploaded: false,
  //       },
  //     });
  //     res.status(200).json(patient);
  //   } else {
  //     res.status(400).json({ message: 'Invalid request method' });
  //   }
}
