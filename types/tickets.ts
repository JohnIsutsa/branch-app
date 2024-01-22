import { Message } from "./message";
import { User } from "./user";

export type Ticket = {
    uuid: string;
    title: string;
    description: string;
    status: TicketStatus
    ticket_type: TicketType;
    created_at: Date;
    updated_at: Date;
    customer: User;
    agents?: User[];
    messages: Message[];
}

export enum TicketStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED',
    CLOSED = 'CLOSED'
}

export enum TicketType {
    LOAN_APPLICATION_STATUS = 'LOAN_APPLICATION_STATUS',
    REPAYMENT_ISSUES = 'REPAYMENT_ISSUES',
    LOAN_APPROVAL_PROCESS = 'LOAN_APPROVAL_PROCESS',
    ACCOUNT_MANAGEMENT = 'ACCOUNT_MANAGEMENT',
    TECHNICAL_ISSUES = 'TECHNICAL_ISSUES',
    OTHER = 'OTHER'
}

// GET /tickets
export type GetTicketsResponse = {
    status: string;
    data: {
        tickets: Ticket[];
    };
};

export interface CreateTicketDto {
    customer_uuid: string;
    title: string;
    description: string;
}

export interface UpdateTicketDto {
    customer_uuid?: string;
    title?: string;
    description?: string;
    status?: TicketStatus
}