export type User = {
  id: number;
  email: string;
  password: string;
  name: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};

export type Usersdata = {
  admins: User[];
  users: User[];
};

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}
