export type UserRole = "admin" | "staff";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
}

export type TicketStatus = "open" | "in-progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  departmentId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  department?: Department;
  user?: User;
}

export interface Comment {
  id: number;
  content: string;
  ticketId: number;
  userId: number;
  createdAt: string;
  user?: Pick<User, "id" | "name">;
}

// DTOs
export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface TicketDTO {
  title: string;
  description: string;
  priority: TicketPriority;
  departmentId: number;
}

export interface CommentDTO {
  content: string;
}