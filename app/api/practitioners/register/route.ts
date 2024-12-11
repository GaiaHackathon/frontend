// Import everything needed for nextjs api route
import type { NextApiRequest, NextApiResponse } from 'next'
import { Patient, PrismaClient } from '@prisma/client'


interface PractitionerData {
    baseaddress: string;
    starrating: number;
    name: string;
    patients?: { baseaddress: string; height: number; weight: number; birthdate: string; name: string }[];

}

// create post route
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if (req.method === 'POST') {

        const data: PractitionerData = req.body;

        if (!data || !data.baseaddress || !data.name) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        data.patients = [];
        // create prisma client
        const prisma = new PrismaClient()

        // create patient
        const patient = await prisma.practitioner.create({
            data: {
                baseaddress: data.baseaddress,
                starrating: 0,
                name: data.name,
            },
        })
        res.status(200).json(patient)
    }
    else {
        res.status(400).json({ message: 'Invalid request method' })
    }
}