import { SendMessageResponse } from "../Types/SendMessageResponse";

export const getReseponse = (messageId: number): SendMessageResponse => ({
    ok: false,
    result: {
        message_id: messageId,
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
});
