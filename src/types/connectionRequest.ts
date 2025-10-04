import type { User } from "./user";

export interface ConnectionRequest {
  _id: string;
  fromUserId: User;
  toUserId: User;
  status: "ignored" | "interested" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}