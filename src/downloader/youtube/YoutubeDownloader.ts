import ytdl from "ytdl-core";
import DialogWithUser from "../../DialogWithUser";
import { EditMessageBody } from "../../DialogWithUser/Types";
import { SendMessageResponse } from "../../Types/SendMessageResponse";
import { QualitySelect } from "./QualitySelect";
import { Tools } from "./Tools";

class YoutubeDownloader extends Tools {
    public async sendVideoInfoToUser(notificationMessageId: number): Promise<SendMessageResponse> {
        try {
            const videoInfo = await ytdl.getInfo(this.sourceLink);
            const qualitySelect = new QualitySelect(videoInfo, this.chatId);
            return await qualitySelect.sendQualitySelectToUser(notificationMessageId);
        } catch (error) {
            console.log(
                `[server]: error while sending info about a video to user: ${JSON.stringify(error)}`
            );
            return await DialogWithUser.sendErrorMessageToUser(this.chatId);
        }
    }

    public async downloadVideoByLink(
        itag: number,
        messageId: number
    ): Promise<SendMessageResponse> {
        if (!this.checkAvailableStorage()) {
            DialogWithUser.sendMessageToMe("Server storage is full!");
            return await DialogWithUser.sendMessageToUser(this.chatId, "Server storage is full");
        }

        try {
            const messageWithLoadingState = this.createMessageWithLoadingState(messageId);
            DialogWithUser.editMessageCaption(messageWithLoadingState);
            return await this.downloadVideoAndNotifyUser(itag, messageId);
        } catch (error) {
            console.log(
                `[server]: An error has occurred while video download ${JSON.stringify(error)}`
            );
            return await DialogWithUser.sendErrorMessageToUser(this.chatId);
        }
    }

    private async downloadVideoAndNotifyUser(
        itag: number,
        messageId: number
    ): Promise<SendMessageResponse> {
        const { newMessageWithLink, link } = await this.startDownload(itag);

        const editMessageBody: EditMessageBody = {
            chatId: this.chatId,
            messageId,
            caption: newMessageWithLink.text,
        };
        await DialogWithUser.editMessageCaption(editMessageBody);

        const messageWithVideo = {
            chatId: this.chatId,
            video: link,
        };
        return await DialogWithUser.sendVideoToUser(this.chatId, messageWithVideo);
    }
}

export default YoutubeDownloader;
