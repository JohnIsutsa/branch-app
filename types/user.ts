import { Message } from "./message";
import { Ticket } from "./tickets";

export interface User {
    uuid: string;
    name: string;
    email: string
    password: string;
    role: UserRole;
    created_at: Date;
    updated_at: Date;
    tickets?: Ticket[];
    assigned_tickets?: Ticket[];
    messages?: Message[];
}

export enum UserRole {
    CUSTOMER = 'customer',
    AGENT = 'agent',
}

// GET /user
export interface GetUserResponse {
    status: string;
    data: User[] | User;
};