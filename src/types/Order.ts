export type Order = {
  id: number;
  userId: number;
  total: number;
  status: OrderStatus;
  itemId: number;
  createdAt: Date;
  updatedAt: Date;
};

export enum OrderStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELED = "canceled",
}
