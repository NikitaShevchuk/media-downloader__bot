// use this script to set a web hook hook for telegram bot api: yarn hook

import "dotenv/config";
import { axiosInstance } from "./DialogWithUser";

interface WebHookResponse {
    ok: boolean;
    result: boolean;
    description: string;
}

class WebHook {
    public async setWebHook(): Promise<WebHookResponse> {
        try {
            const newWebHook = {
                url: process.env.HOST,
            };
            const webHookSettingResponse = await axiosInstance
                .post<WebHookResponse>(`/setwebhook`, newWebHook)
                .then((response) => response.data);
            console.log(`[server]: WebHook setup is success: ${webHookSettingResponse.result}`);
            return webHookSettingResponse;
        } catch (error) {
            const errorResponse: WebHookResponse = {
                ok: false,
                result: false,
                description: "Error while setting webhook",
            };
            console.log(`[server]: error while setting webhook: ${error}`);
            return errorResponse;
        }
    }
}

export default new WebHook();

const webHook = new WebHook();
webHook.setWebHook();
