import axios from "axios";
import { DeleteMessageResponse, SendMessageResponse } from "../Types/SendMessageResponse";
import { apiToken, baseApiUrl } from "../api-connection";
import { MessageBodyWithPhoto } from "../messages/Types";
import { FormatButton } from "./../messages/Types/index";

export interface NewMessage {
    chat_id: number;
    text: string;
    disable_web_page_preview?: boolean;
}

interface ReplyMarkup {
    resize_keyboard: boolean;
    inline_keyboard: [FormatButton][] | [{}][];
}

export interface EditMessageBody {
    chatId: number;
    messageId: number;
    caption?: string;
    replyMarkup?: ReplyMarkup;
    photo?: string;
}

export interface EditMessageRequestBody {
    chat_id: number;
    message_id: number;
    caption?: string;
    reply_markup?: ReplyMarkup;
    photo?: string;
}

export const axiosInstance = axios.create({ baseURL: `${baseApiUrl}${apiToken}` });

class DialogWithUser {
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

    public async sendErrorMessageToUser(chatId: number): Promise<SendMessageResponse> {
        const newMessage = {
            chat_id: chatId,
            text: "Something went wrong :(",
        };
        return await axiosInstance
            .post<SendMessageResponse>(`/sendMessage`, newMessage)
            .then((response) => response.data);
    }

    public async sendPhotoToUser(
        chatId: number,
        body: MessageBodyWithPhoto
    ): Promise<SendMessageResponse> {
        const newMessage = {
            chat_id: chatId,
            photo: body.photo,
            caption: body.caption,
        };
        return await axiosInstance
            .post<SendMessageResponse>(`/sendPhoto`, newMessage)
            .then((response) => response.data);
    }

    public async sendPhotoWithButtonsToUser(
        chatId: number,
        body: MessageBodyWithPhoto
    ): Promise<SendMessageResponse> {
        const newMessage = {
            chat_id: chatId,
            photo: body.photo,
            caption: body.caption,
            resize_keyboard: true,
            reply_markup: { inline_keyboard: body.formatButtons },
        };
        return await axiosInstance
            .post<SendMessageResponse>(`/sendPhoto`, newMessage)
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

export default new DialogWithUser();
