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
    formatButtons: Array<[FormatButton]>;
}
