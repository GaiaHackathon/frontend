// Import everything needed for nextjs api route
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'


interface Image {
    imageid:number;
    beforeImageCid: string;
    afterImageCid: string;
    patientId: number;
}

// create post route
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if (req.method === 'POST') {

        const data: Image = req.body;

        if (!data || !data.beforeImageCid || !data.patientId || !data.afterImageCid || !data.imageid) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        // create prisma client
        const prisma = new PrismaClient()

        // Get the image according to the imageid and the beforeImageCid and update the afterImageCid
        const image = await prisma.image.update({
            where: {
                imageid: data.imageid,
                beforeImageCid: data.beforeImageCid,
            },
            data: {
                afterImageCid: data.afterImageCid,
                afterImageUploaded: true,
            },
        })
        res.status(200).json(image)
    }
    else {
        res.status(400).json({ message: 'Invalid request method' })
    }
}