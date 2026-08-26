// backend/src/routes/paymentWebhookRoutes.js

import express from 'express';
import { handleWebhook } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/:provider', handleWebhook);

export default router;
