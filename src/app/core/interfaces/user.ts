export interface User {
  fullName: string;
  email: string;
  password: string;
  collegeName: string;
  role: string;
}

export type CreateUserDto = Omit<User, 'role'>;
export type LoginUserDto = Pick<User, 'email' | 'password'>;
