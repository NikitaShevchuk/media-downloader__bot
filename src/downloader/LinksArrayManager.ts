import DialogWithUser from "../DialogWithUser";
import CheckByLinkSource from "./CheckByLinkSource";
import { InstagramDownloader } from "./instagram";
import { TikTokDownloader } from "./tiktok/TikTokDownloader";
import YoutubeDownloader from "./youtube/YoutubeDownloader";

class LinksArrayManager {
    public manageLinksArray(linksArray: string[], chatId: number, notificationMessageId: number) {
        linksArray.forEach(async (singleLink) => {
            if (CheckByLinkSource.isYoutube(singleLink)) {
                const downloader = new YoutubeDownloader(singleLink, chatId);
                await downloader.sendVideoInfoToUser(notificationMessageId);
            } else if (CheckByLinkSource.isInstagram(singleLink)) {
                const downloader = new InstagramDownloader(
                    chatId,
                    singleLink,
                    notificationMessageId
                );
                await downloader.download();
                await downloader.sendLinkToUser();
            } else if (CheckByLinkSource.isTikTok(singleLink)) {
                const downloader = new TikTokDownloader(singleLink, chatId);
                await downloader.download();
            } else {
                DialogWithUser.deleteMessage(chatId, notificationMessageId);
                DialogWithUser.sendMessageToUser(
                    chatId,
                    `Resource ${singleLink} is not supported yet. Please contact me if you need it.`
                );
            }
        });
    }
}

export default new LinksArrayManager();
