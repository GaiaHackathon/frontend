// // Import everything needed for nextjs api route
// import type { NextApiRequest, NextApiResponse } from 'next'
// import { PrismaClient } from '@prisma/client'


// interface Image {
//     beforeImageCid: string;
//     patientId: number;
// }

// // create post route
// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {

//     if (req.method === 'POST') {

//         const data: Image = req.body;

//         if (!data || !data.beforeImageCid || !data.patientId) {
//             return res.status(400).json({ message: 'Missing required fields' });
//         }
//         // create prisma client
//         const prisma = new PrismaClient()

//         // create patient
//         const patient = await prisma.image.create({
//             data: {
//                 beforeImageCid: data.beforeImageCid,
//                 patientid: data.patientId,
//                 afterImageUploaded: false,
//             },
//         })
//         res.status(200).json(patient)
//     }
//     else {
//         res.status(400).json({ message: 'Invalid request method' })
//     }
// }