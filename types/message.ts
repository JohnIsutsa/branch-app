import { Ticket } from "./tickets";
import { User, UserRole } from "./user";

export type Message = {
    uuid: string;
    content: string;
    sender: UserRole;
    timestamp: Date;
    user?: User;
    ticket?: Ticket;
}

export interface CreateMessageDto {
    sender_uuid: string;
    ticket_uuid: string;
    content: string;
}

// GET /messages
export type GetMessageResponse = {
    status: string;
    data: Message[] | Message;
}