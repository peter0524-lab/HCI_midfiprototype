import { Router } from 'express';
import {
  getAllConversations,
  getConversationsByContact,
  saveConversation
} from '../controllers/chatController';

const router = Router();

router.get('/', getAllConversations);
router.get('/:contactId', getConversationsByContact);
router.post('/:contactId', saveConversation);

export default router;

