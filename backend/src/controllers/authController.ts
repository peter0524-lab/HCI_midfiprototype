import { Request, Response } from 'express';
import { userModel } from '../models/User';

export const login = (req: Request, res: Response) => {
  try {
    // 프로토타입이므로 간단한 로그인 처리
    res.json({ success: true, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Login failed' });
  }
};

export const getProfile = (req: Request, res: Response) => {
  try {
    const user = userModel.get();
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch profile' });
  }
};

export const updateProfile = (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const updatedUser = userModel.update(userData);
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
};

