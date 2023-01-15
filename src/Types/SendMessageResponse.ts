import { Chat } from "./Chat";
import { User } from "./User";

export interface SendMessageResponse {
    ok: boolean;
    result: {
        message_id: number;
        from: User;
        chat: Chat;
        date: number;
        text?: string;
    };
}

export interface DeleteMessageResponse {
    ok: boolean;
    result: boolean;
}
