import { Router } from 'express';
import {
  getAllUsers, getUser, createUser, updateMe, updateMeAvatar,
} from '../controllers/users';

const router = Router();

router.get('/users', getAllUsers);
router.get('/users/:userId', getUser);
router.post('/users', createUser);
router.patch('/users/me', updateMe);
router.patch('/users/me/avatar', updateMeAvatar);

export default router;
