import DialogWithUser from "../DialogWithUser";
import CheckByLinkSource from "../messages/CheckByLinkSource";
import YoutubeDownloader from "./youtube";

class LinksArrayManager {
    public manageLinksArray(linksArray: string[], chatId: number, notificationMessageId: number) {
        linksArray.forEach(async (singleLink) => {
            if (CheckByLinkSource.checkIsLinkYoutube(singleLink)) {
                const downloader = new YoutubeDownloader(singleLink, chatId);
                await downloader.sendVideoInfoToUser(notificationMessageId);
            } else if (CheckByLinkSource.checkIsLinkInstagram(singleLink)) {
                // todo: add instagram support
            } else {
                // todo: add contact form for users feedback
                DialogWithUser.deleteMessage(chatId, notificationMessageId);
                DialogWithUser.sendMessageToUser(
                    chatId,
                    `Resource ${singleLink} is not supported yet.
                    Please contact me if you need it (contact form will be available soon)`
                );
            }
        });
    }
}

export default new LinksArrayManager();
