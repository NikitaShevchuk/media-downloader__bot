import { axiosInstance } from ".";
import { DeleteMessageResponse, SendMessageResponse } from "../Types/SendMessageResponse";
import { NewMessage, EditMessageBody, EditMessageRequestBody } from "./Types";

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
}
