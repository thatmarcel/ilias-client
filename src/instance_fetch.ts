import type { Cookies } from "./cookies";
import type { ClientOptions } from "./client_options";

const instanceFetch = async (input: URL | string, options: RequestInit & Partial<Cookies> & ClientOptions = {}) => {
    const url = new URL(input);

    const headers = new Headers(options.headers);

    headers.has("User-Agent") || headers.set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36");
    headers.has("Referer") || headers.set("Referer", `https://${url.host}/`);
    headers.has("Origin") || headers.set("Origin", `https://${url.host}`);

    const cookieHeaderValue = [
        ...(options.clientId ? [`ilClientId=${options.clientId}`] : []),
        ...(options.sessionId ? [`PHPSESSID=${options.sessionId}`] : []),
        ...(headers.get("Cookie")?.split(";")?.map(c => c.trim()) || [])
    ].join("; ");

    if (cookieHeaderValue) {
        headers.set("Cookie", cookieHeaderValue);
    }

    return fetch(url, {
        redirect: "manual",
        ...options,
        headers
    });
}

export default instanceFetch;
