import { Request, Response } from "express";



export const handleEvent = async (req: Request, res: Response) => {
    const { payload } = req.body;
    console.log(payload);
    res.status(200).send();
    res.end();
    }
