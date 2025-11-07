import { Router } from 'express';
import { getLogsController, clearLogsController, getLogsHTML } from '../controllers/logController';

const router = Router();

// HTML 로그 뷰어
router.get('/', getLogsHTML);

// JSON 로그 API
router.get('/api', getLogsController);

// 로그 초기화
router.post('/clear', clearLogsController);

export default router;

