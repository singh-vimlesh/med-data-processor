import { Router } from 'express';
import { parsePatientData } from '../controllers/patientController';

const router = Router();

router.post('/', parsePatientData);

export default router;
