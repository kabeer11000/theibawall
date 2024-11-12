import { CreateToken } from "@/utils/create-token";
import { NextApiRequest, NextApiResponse } from "next";

// API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // if (req.method !== 'POST') {
    //     res.setHeader('Allow', ['POST']);
    //     return res.status(405).end(`Method ${req.method} Not Allowed`);
    // }
    const user = req.query.user?.toString() || "";
    return res.send(CreateToken(user).toString());
}