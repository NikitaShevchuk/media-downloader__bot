export const getOptions = (url: string) => ({
    headers: {
        accept: "*/*",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "sec-ch-ua": '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
    },

    referrer: "https://tikmate.app/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: encodeURIComponent(url),
    mode: "cors",
    credentials: "omit",
});
