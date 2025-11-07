import { User } from '../types';
import { mockUser } from '../data/mockData';

class UserModel {
  private user: User = { ...mockUser };

  get(): User {
    return this.user;
  }

  update(data: Partial<User>): User {
    this.user = { ...this.user, ...data };
    return this.user;
  }
}

export const userModel = new UserModel();

