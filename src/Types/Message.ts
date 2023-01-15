import { Chat } from "./Chat";
import { User } from "./User";

export interface NewMessageRequest {
    update_id: number;
    message: Message;
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
    from: {
        id: number;
        is_bot: boolean;
        first_name: string;
        username: string;
        language_code: string;
        is_premium: boolean;
    };
    date: number;
    text?: string;
    entities?: MessageEntity[];
}
