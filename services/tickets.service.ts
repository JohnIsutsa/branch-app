import { CreateTicketDto, GetTicketsResponse, UpdateTicketDto } from "@/types/tickets";
import { restInstance } from "@/utils/api.util";
import { AxiosResponse } from "axios";

export const getTickets = async (queryParams?: Record<string, string>) => {
    const response = await restInstance.get<GetTicketsResponse>("/tickets", {
        params: queryParams
    });
    return response?.data;
}

export const getTicketByUuid = async (uuid: string) => {
    const response = await restInstance.get<GetTicketsResponse>(`/tickets/${uuid}`);
    return response?.data;
}

export const getCustomerTickets = async (customerUuid: string) => {
    const response: AxiosResponse<GetTicketsResponse> = await restInstance.get<GetTicketsResponse>(`/tickets/customer/${customerUuid}`);
    return response?.data;
}

export const createTicket = async (ticket: CreateTicketDto) => {
    const response: AxiosResponse<GetTicketsResponse> = await restInstance.post<GetTicketsResponse>("/tickets", ticket);
    return response?.data;
}

export const updateTicket = async (uuid: string, ticket: UpdateTicketDto) => {

    const response = await restInstance.patch<GetTicketsResponse>(`/tickets/${uuid}`, ticket);
    console.log(response)
    return response?.data;

}

// export const getTickets = async (): Promise<GetTicketsResponse | undefined> => {
//     try {
//         const response = await axios.get<GetTicketsResponse>(`${process.env.NEXT_PUBLIC_API_URL}/api/tickets`);
//         console.log("Tickets response:", response);
//         return response.data;
//     } catch (error) {
//         console.error("Error fetching tickets:", error);
//         return undefined;
//     }
// };
