import { Router } from 'express';
import contactRoutes from './contactRoutes';
import giftRoutes from './giftRoutes';
import chatRoutes from './chatRoutes';
import eventRoutes from './eventRoutes';
import authRoutes from './authRoutes';

const router = Router();

router.use('/contacts', contactRoutes);
router.use('/gifts', giftRoutes);
router.use('/chats', chatRoutes);
router.use('/events', eventRoutes);
router.use('/auth', authRoutes);

export default router;

