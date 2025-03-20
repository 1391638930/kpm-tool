export type RoleType = '' | '*' | 'admin' | 'user';
export interface UserState {
  userId?: number;
  username?: string;
  avatar?: string;
  email?: string;
  password?: string;
  create_time?: string;
  group?: string;
  department?: string;
  position?: string;
  phone?: string;
  profile?: string;
  role: string;
}
