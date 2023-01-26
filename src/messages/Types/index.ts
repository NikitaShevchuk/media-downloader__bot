export interface CallbackData {
    videoLink: string;
    itag: number;
}

export interface FormatButton {
    text: string;
    callback_data: string;
}

export interface MessageBodyWithPhoto {
    photo: string;
    caption: string;
    formatButtons?: Array<[FormatButton]>;
}

export interface MessageBodyWithVideo {
    caption?: string;
    video: string;
}

export interface MessageRequestBodyWithVideo {
    chat_id: number;
    caption?: string;
    video: string;
}
