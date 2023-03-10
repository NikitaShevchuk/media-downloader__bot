import { FormatButton } from "../messages/Types/index";

export interface NewMessage {
    text: string;
    disable_web_page_preview?: boolean;
}

export interface ReplyMarkup {
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
    message_id: number;
    caption?: string;
    reply_markup?: ReplyMarkup;
    photo?: string;
}
