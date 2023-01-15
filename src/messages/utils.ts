import ytdl from "ytdl-core";

export const createTitleAndFileName = (
    videoInfo: ytdl.videoInfo,
    chatId: number
): [{ chat_id: number; text: string }, string] => {
    const name = `${videoInfo.videoDetails.title} by ${
        videoInfo.videoDetails.author.name
    } - ${new Date().getTime().toString()}`.replace(/\s/g, "_");

    const title = videoInfo.videoDetails.title;
    const newMessageWithLink = {
        chat_id: chatId,
        text: `${title} \n\nDownload your video from this link: \n${
            process.env.HOST || "http://localhost:80"
        }/download/ngrok-redirect/${name}`,
    };
    return [newMessageWithLink, name];
};

const filterLinks = (
    messageText: string,
    splitBy: string,
    linksArray: string[]
) => {
    messageText.split(splitBy).forEach((wordInMessage) => {
        if (wordInMessage.includes("https://")) linksArray.push(wordInMessage);
    });
};
export const prepareLinks = (messageText: string | undefined): string[] => {
    if (!messageText) return [""];

    const linksArray: string[] = [];
    if (messageText.includes(" ")) filterLinks(messageText, " ", linksArray);
    if (messageText.includes("\n")) filterLinks(messageText, "\n", linksArray);
    if (
        messageText.includes("https://") &&
        !messageText.includes(" ") &&
        !messageText.includes("\n")
    ) {
        linksArray.push(messageText);
    }
    return linksArray;
};
