import ytdl from "ytdl-core";
import DialogWithUser from "../../DialogWithUser";
import { SendMessageResponse } from "../../Types/SendMessageResponse";
import { FormatButton, MessageBodyWithPhoto } from "../../messages/Types";

export class QualitySelect {
    videoInfo: ytdl.videoInfo;
    chatId: number;
    notificationMessageId?: number;

    constructor(videoInfo: ytdl.videoInfo, chatId: number) {
        this.videoInfo = videoInfo;
        this.chatId = chatId;
    }

    public async sendQualitySelectToUser(
        notificationMessageId: number
    ): Promise<SendMessageResponse> {
        try {
            this.notificationMessageId = notificationMessageId;
            const qualitySelectMessageBody = this.createQualitySelectMessage();
            DialogWithUser.deleteMessage(this.chatId, this.notificationMessageId);
            return await DialogWithUser.sendPhotoWithButtonsToUser(
                this.chatId,
                qualitySelectMessageBody
            );
        } catch (error) {
            console.error(error);
            return await DialogWithUser.sendErrorMessageToUser(this.chatId);
        }
    }

    private createQualitySelectMessage(): MessageBodyWithPhoto {
        const videoThumbnail = this.videoInfo?.videoDetails?.thumbnails[4]?.url
            ? this.videoInfo?.videoDetails?.thumbnails[4]?.url
            : this.videoInfo?.videoDetails?.thumbnails[0]?.url;
        const formatButtons = this.createFormatButtonsArray();
        const newMessage = {
            photo: videoThumbnail || "",
            caption: `${this.videoInfo.videoDetails.title}\n\n` + `Select video quality:`,
            formatButtons,
        };
        return newMessage;
    }

    private createFormatButtonsArray(): Array<[FormatButton]> {
        const formats = this.videoInfo.formats.map((format) => ({
            callback_data: this.createCallbackData(format),
            text: this.createButtonText(format),
        })) as Array<FormatButton>;
        const filteredFormats = formats.filter(
            (format) => format.callback_data !== null && format.text !== "null"
        );
        const formatArray: Array<[FormatButton]> = [];
        // creates two columns of buttons under a message
        filteredFormats.forEach((format, index) => {
            if (index % 2 === 0) formatArray.push([format]);
            else formatArray[formatArray.length - 1].push(format);
        });
        return formatArray;
    }

    private createCallbackData(format: ytdl.videoFormat): string {
        return `${format.itag} ${this.videoInfo.videoDetails.video_url}`;
    }

    private createButtonText(format: ytdl.videoFormat): string {
        return `${format.qualityLabel}${format.hasVideo ? "🖼️" : "🏴‍☠️"}${
            format.hasAudio ? "🔊" : "🔇"
        }`;
    }
}
