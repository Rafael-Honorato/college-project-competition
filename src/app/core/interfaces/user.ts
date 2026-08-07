export interface User {
  userId: number;
  fullName: string;
  email: string;
  collegeName: string;
  role: string;
}

export type CreateUserDto = Omit<User, 'userId' | 'role'> & {
  password: string;
};
export type LoginUserDto = Pick<User, 'email'> & {
  password: string;
};
