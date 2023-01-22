class FilterMessage {
    public prepareLinks(messageBody: string | undefined): string[] {
        let messageText = messageBody || "";
        if (!messageText) return [""];

        const linksArray: string[] = [];
        if (messageText.includes("https://youtu.be/")) {
            messageText = this.replaceMobileLink(messageText);
        }
        if (messageText.includes(" "))
            this.filterLinks(messageText, " ", linksArray);
        if (messageText.includes("\n"))
            this.filterLinks(messageText, "\n", linksArray);
        if (
            messageText.includes("https://") &&
            !messageText.includes(" ") &&
            !messageText.includes("\n")
        ) {
            linksArray.push(messageText);
        }
        return linksArray;
    }

    private replaceMobileLink(messageText: string): string {
        return messageText.replace(
            "https://youtu.be/",
            "https://www.youtube.com/watch?v="
        );
    }
    private filterLinks(
        messageText: string,
        splitBy: string,
        linksArray: string[]
    ) {
        messageText.split(splitBy).forEach((wordInMessage) => {
            if (wordInMessage.includes("https://"))
                linksArray.push(wordInMessage);
        });
    }
}

export default new FilterMessage();
