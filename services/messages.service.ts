import { GetMessageResponse } from "@/types/message";
import { restInstance } from "@/utils/api.util";

export const getMessagesByTicket = async (uuid: string) => {
    const response = await restInstance.get<GetMessageResponse>(`/messages/ticket/${uuid}`);
    return response?.data;
}
