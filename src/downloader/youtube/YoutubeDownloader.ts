import ytdl from "ytdl-core";
import DialogWithUser, { EditMessageBody } from "../../DialogWithUser";
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
            if (process.env.MY_CHAT_ID) {
                DialogWithUser.sendMessageToUser(
                    Number(process.env.MY_CHAT_ID),
                    "Server storage is full!"
                );
            }
            return await DialogWithUser.sendMessageToUser(this.chatId, "Server storage is full");
        }
        try {
            const messageWithLoadingState = this.createMessageWithLoadingState(messageId);

            DialogWithUser.editMessageCaption(messageWithLoadingState);
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
        } catch (error) {
            console.log(
                `[server]: An error has occurred while video download ${JSON.stringify(error)}`
            );
            return await DialogWithUser.sendErrorMessageToUser(this.chatId);
        }
    }
}

export default YoutubeDownloader;
