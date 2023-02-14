import ytdl from "ytdl-core";
import DialogWithUser from "../../DialogWithUser";
import { EditMessageBody } from "../../DialogWithUser/Types";
import { AvailableStorage } from "../../tools/CheckAvailableStorage";
import { QualitySelect } from "./QualitySelect";
import { Tools } from "./Tools";

class YoutubeDownloader extends Tools {
    public async sendVideoInfoToUser(notificationMessageId: number) {
        const videoInfo = await ytdl.getInfo(this.sourceLink);
        const qualitySelect = new QualitySelect(videoInfo, this.chatId);
        return await qualitySelect.sendQualitySelectToUser(notificationMessageId);
    }

    public async downloadVideoByLink(itag: number, messageId: number) {
        const storage = new AvailableStorage("./downloads");
        if (!storage.checkAvailableStorage()) {
            return DialogWithUser.sendErrorMessageToUser(this.chatId);
        }

        const messageWithLoadingState = this.createMessageWithLoadingState(messageId);
        DialogWithUser.editMessageCaption(messageWithLoadingState);
        return await this.downloadVideoAndNotifyUser(itag, messageId);
    }

    private async downloadVideoAndNotifyUser(itag: number, messageId: number) {
        const { newMessageWithLink, link } = await this.startDownload(itag);

        const editMessageBody: EditMessageBody = {
            chatId: this.chatId,
            messageId,
            caption: newMessageWithLink.text
        };
        await DialogWithUser.editMessageCaption(editMessageBody);
        const messageWithVideo = {
            chatId: this.chatId,
            video: link
        };
        return await DialogWithUser.sendVideoToUser(this.chatId, messageWithVideo);
    }
}

export default YoutubeDownloader;
