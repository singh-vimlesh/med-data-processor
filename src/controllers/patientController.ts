import { Request, Response } from 'express';
import { processPatientData } from '../services/patientService';

export function parsePatientData(req: Request, res: Response): void {
  try {
    const message = typeof req.body === 'string' ? req.body : req.body.message;
    if (!message) {
      res.status(400).json({ error: 'Invalid message format or empty body' });
      return;
    }

    const extractedData = processPatientData(message);

    res.status(200).json(extractedData);
  } catch (error) {
    const err = error as Error;
    console.error('Error processing message:', err.message);
    res.status(500).json({ error: err.message });
  }
}
