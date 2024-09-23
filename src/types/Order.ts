export type Order = {
  id: number;
  userId: number;
  total: number;
  status: string;
  itemId: number;
  createdAt: Date;
  updatedAt: Date;
};
