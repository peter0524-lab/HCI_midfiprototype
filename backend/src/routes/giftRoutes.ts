import { Router } from 'express';
import {
  recommendGifts,
  addGiftToHistory,
  scanBusinessCard
} from '../controllers/giftController';

const router = Router();

router.post('/recommend', recommendGifts);
router.post('/:contactId', addGiftToHistory);
router.post('/ocr/scan', scanBusinessCard);

export default router;

