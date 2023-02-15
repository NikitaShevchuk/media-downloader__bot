import { Chat } from "./Chat";
import { User } from "./User";

export interface CallbackQuery {
    id: string;
    from: User;
    message: Message;
    data: string;
}

export interface NewMessageRequest {
    update_id?: number;
    message?: Message;
    callback_query?: CallbackQuery;
}

export interface MessageEntity {
    type:
        | "mention"
        | "hashtag"
        | "cashtag"
        | "bot_command"
        | "url"
        | "email"
        | "phone_number"
        | "bold"
        | "italic"
        | "underline"
        | "strikethrough"
        | "spoiler"
        | "code"
        | "pre"
        | "text_link"
        | "text_mention"
        | "custom_emoji";
    offset: number;
    length: number;
    url?: string;
    user?: User;
    language?: string;
}

export interface Message {
    message_id: number;
    chat: Chat;
    from: User;
    date: number;
    text?: string;
    entities?: MessageEntity[];
}
