import { GetUserResponse } from "@/types/user";
import { restInstance } from "@/utils/api.util";
import { AxiosResponse } from "axios";

export const getUserByEmail = async (email: string) => {
    const response: AxiosResponse<GetUserResponse> = await restInstance.get<GetUserResponse>(`/users/email/${email}`);
    console.log("getUserByEmail response:", response);
    checkForError(response);
    return response?.data;
}

export const getUserByUuid = async (uuid: string) => {
    const response: AxiosResponse<GetUserResponse> = await restInstance.get<GetUserResponse>(`/users/${uuid}`);
    checkForError(response);
    return response?.data;
}

const checkForError = (response: any) => {
    if (response?.error) {
        throw new Error(response.error);
    }
}
