import { axiosInstance } from ".";
import { DeleteMessageResponse, SendMessageResponse } from "../Types/SendMessageResponse";
import { EditMessageBody, EditMessageRequestBody, NewMessage } from "./Types";
import { getReseponse } from "./getResponse";

export class BasicMessageActions {
    public async sendMessageToUser(
        chatId: number,
        body: string,
        removeLinkPreview?: boolean
    ): Promise<SendMessageResponse> {
        const newMessage: NewMessage = {
            chat_id: chatId,
            text: body
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
                caption: editMessageBody.caption
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
            return getReseponse(editMessageBody.messageId);
        }
    }

    public async deleteMessage(chatId: number, messageId: number): Promise<DeleteMessageResponse> {
        const deleteMessageParameter = {
            chat_id: chatId,
            message_id: messageId
        };
        return await axiosInstance
            .post<DeleteMessageResponse>(`/deleteMessage`, deleteMessageParameter)
            .then((response) => response.data);
    }

    public async sendAction(chatId: number, action: string): Promise<SendMessageResponse> {
        const actionMessage = {
            chat_id: chatId,
            action
        };
        return await axiosInstance
            .post<SendMessageResponse>(`/sendChatAction`, actionMessage)
            .then((response) => response.data);
    }

    public async setChatMenuButton(chatId: number): Promise<SendMessageResponse> {
        const setMyCommands = {
            chat_id: chatId,
            menu_button: { type: "commands" }
        };
        return await axiosInstance
            .post<SendMessageResponse>(`/setChatMenuButton`, setMyCommands)
            .then((response) => response.data);
    }
}
