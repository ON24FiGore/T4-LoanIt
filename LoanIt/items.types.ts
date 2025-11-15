export interface Item {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  status: "available" | "borrowed";
  borrowerId?: string | null;
}