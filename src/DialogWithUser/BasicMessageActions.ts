import { axiosInstance } from ".";
import { SendMessageResponse } from "../Types/SendMessageResponse";
import { getResponse } from "./getResponse";
import { EditMessageBody, EditMessageRequestBody, NewMessage } from "./Types";

export class BasicMessageActions {
    public async sendMessageToUser(
        chatId: number,
        body: string,
        removeLinkPreview?: boolean
    ): Promise<SendMessageResponse> {
        const newMessage: NewMessage = {
            text: body
        };
        if (removeLinkPreview) newMessage.disable_web_page_preview = removeLinkPreview;
        return await this.requestTelegramApi(`/sendMessage`, chatId, newMessage);
    }

    public async editMessageCaption(
        editMessageBody: EditMessageBody
    ): Promise<SendMessageResponse> {
        const editMessageRequestBody: EditMessageRequestBody = {
            message_id: editMessageBody.messageId,
            caption: editMessageBody.caption
        };
        if (editMessageBody.photo) {
            editMessageRequestBody.photo = editMessageBody.photo;
        }
        if (editMessageBody.replyMarkup) {
            editMessageRequestBody.reply_markup = editMessageBody.replyMarkup;
        }
        return this.requestTelegramApi(
            `/editMessageCaption`,
            editMessageBody.chatId,
            editMessageRequestBody
        );
    }

    public async deleteMessage(chatId: number, messageId: number): Promise<SendMessageResponse> {
        return await this.requestTelegramApi(`/deleteMessage`, chatId, {
            message_id: messageId
        });
    }

    public async sendAction(chatId: number, action: string): Promise<SendMessageResponse> {
        return await this.requestTelegramApi(`/sendChatAction`, chatId, { action });
    }

    public async setChatMenuButton(chatId: number): Promise<SendMessageResponse> {
        return await this.requestTelegramApi(`/setChatMenuButton`, chatId, {
            menu_button: { type: "commands" }
        });
    }

    public async forwardMessage(
        targetChatId: number,
        fromChatId: number,
        messageId: number
    ): Promise<SendMessageResponse> {
        return await this.requestTelegramApi(`/forwardMessage`, targetChatId, {
            from_chat_id: fromChatId,
            message_id: messageId
        });
    }

    public async requestTelegramApi(endpoint: string, chatId: number, payload: object) {
        try {
            return await axiosInstance
                .post<SendMessageResponse>(endpoint, { chat_id: chatId, ...payload })
                .then((response) => response.data);
        } catch (error) {
            console.log(error);
            return getResponse();
        }
    }
}
