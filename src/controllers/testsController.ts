import { Request, Response } from "express";
import { recommendationService } from "../services/recommendationsService.js";

export async function resetDatabase(req: Request, res: Response) {
    await recommendationService.truncate();
    res.sendStatus(200);
}

export async function seedDatabase(req: Request, res: Response) {
    await recommendationService.seed();
    res.sendStatus(201);
}