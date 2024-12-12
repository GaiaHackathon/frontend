// Import everything needed for nextjs api route
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'


interface RatingData {
    patientId: number;
    rating: number;
    practionerId: number;
}

// create post route
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if (req.method === 'POST') {

        const data: RatingData = req.body;

        if (!data || !data.rating || !data.practionerId || !data.patientId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        // create prisma client
        const prisma = new PrismaClient()

        // create rating
        const rating = await prisma.rating.create({
            data: {
            },
        })
        res.status(200).json(rating)
    }
    else {
        res.status(400).json({ message: 'Invalid request method' })
    }
}