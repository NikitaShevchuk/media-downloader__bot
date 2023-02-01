import { axiosInstance } from ".";
import { DeleteMessageResponse, SendMessageResponse } from "../Types/SendMessageResponse";
import { EditMessageBody, EditMessageRequestBody, NewMessage } from "./Types";

export class BasicMessageActions {
    public async sendMessageToUser(
        chatId: number,
        body: string,
        removeLinkPreview?: boolean
    ): Promise<SendMessageResponse> {
        const newMessage: NewMessage = {
            chat_id: chatId,
            text: body,
        };
        if (removeLinkPreview) newMessage.disable_web_page_preview = removeLinkPreview;
        return await axiosInstance
            .post<SendMessageResponse>(`/sendMessage`, newMessage)
            .then((response) => response.data);
    }

    public async editMessageCaption(
        editMessageBody: EditMessageBody
    ): Promise<SendMessageResponse> {
        try {
            const editMessageRequestBody: EditMessageRequestBody = {
                chat_id: editMessageBody.chatId,
                message_id: editMessageBody.messageId,
                caption: editMessageBody.caption,
            };
            if (editMessageBody.photo) {
                editMessageRequestBody.photo = editMessageBody.photo;
            }
            if (editMessageBody.replyMarkup) {
                editMessageRequestBody.reply_markup = editMessageBody.replyMarkup;
            }
            return await axiosInstance
                .post(`/editMessageCaption`, editMessageRequestBody)
                .then((response) => response.data);
        } catch (error) {
            console.log(error);
            const response: SendMessageResponse = {
                ok: false,
                result: {
                    message_id: editMessageBody.messageId,
                    chat: {
                        id: 1,
                        type: "private",
                        username: "admin",
                        first_name: "",
                        last_name: "",
                    },
                    date: 1,
                    from: {
                        first_name: "",
                        id: 1,
                        is_bot: false,
                    },
                    text: "text",
                },
            };
            return response;
        }
    }

    public async deleteMessage(chatId: number, messageId: number): Promise<DeleteMessageResponse> {
        const deleteMessageParameter = {
            chat_id: chatId,
            message_id: messageId,
        };
        return await axiosInstance
            .post<DeleteMessageResponse>(`/deleteMessage`, deleteMessageParameter)
            .then((response) => response.data);
    }

    public async sendAction(chatId: number, action: string): Promise<SendMessageResponse> {
        const actionMessage = {
            chat_id: chatId,
            action,
        };
        return await axiosInstance
            .post<SendMessageResponse>(`/sendChatAction`, actionMessage)
            .then((response) => response.data);
    }
}
