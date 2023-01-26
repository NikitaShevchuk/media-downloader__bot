import DialogWithUser from "../DialogWithUser";
import CheckByLinkSource from "./CheckByLinkSource";
import { InstagramDownloader } from "./instagram";
import YoutubeDownloader from "./youtube/YoutubeDownloader";

class LinksArrayManager {
    public manageLinksArray(linksArray: string[], chatId: number, notificationMessageId: number) {
        linksArray.forEach(async (singleLink) => {
            if (CheckByLinkSource.checkIsLinkYoutube(singleLink)) {
                const downloader = new YoutubeDownloader(singleLink, chatId);
                await downloader.sendVideoInfoToUser(notificationMessageId);
            } else if (CheckByLinkSource.checkIsLinkInstagram(singleLink)) {
                const downloader = new InstagramDownloader(
                    chatId,
                    singleLink,
                    notificationMessageId
                );
                await downloader.download();
                await downloader.sendLinkToUser();
            } else {
                DialogWithUser.deleteMessage(chatId, notificationMessageId);
                DialogWithUser.sendMessageToUser(
                    chatId,
                    `Resource ${singleLink} is not supported yet. Please contact me if you need it (contact form will be available soon)`
                );
            }
        });
    }
}

export default new LinksArrayManager();
