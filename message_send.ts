export async function serverChan(sendkey: string, title: string, content: string): Promise<number> {
    if (typeof sendkey !== 'string') {
        console.error("Wrong type for serverChan token.");
        return -1;
        // throw new Error("Wrong type for serverChan token.");
    }
    const payload = {
        "title": title,
        "desp": content,
    };
    try {
        // const resp = await axios.post(`https://sctapi.ftqq.com/${sendkey}.send`, payload);
        const resp = await fetch(
            `https://sctapi.ftqq.com/${sendkey}.send`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }
        );
        const data = await resp.json();
        if (data["code"] === 0) {
            console.log("[ServerChan] Send message to ServerChan successfully.");
            return 0;
        } else {
            console.log(`[ServerChan][Send Message Response] ${data}`);
            return -1;
        }
    } catch (error) {
        console.error(`[ServerChan] Error: ${error}`);
        return -1;
    }
}

export async function bark(url: string, title: string, content: string) {
    if (typeof url !== 'string' || !url.startsWith("https://")) {
        console.error("Wrong type for Bark URL.");
        return -1;
    }

    const payload = {
        "title": title,
        "body": content,
        "group": "Skland",
    };
    try {
        const resp = await fetch(
            url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }
        );
        const data = await resp.json();
        console.debug(data)
    } catch (error) {
        console.error(`[Bark] Error: ${error}`);
        return -1;
    }
}
