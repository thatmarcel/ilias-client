import type { ClientOptions } from "./client_options";
import type { Cookies } from "./cookies";
import instanceFetch from "./instance_fetch";
import type { InstanceInfo } from "./instance_info";

const login = async ({ endpoint, clientId, ...options }: InstanceInfo & Pick<Cookies, "clientId"> & ClientOptions, username: string, password: string) => {
    const r = await instanceFetch(`${endpoint}?baseClass=ilstartupgui&cmd=post&fallbackCmd=doStandardAuthentication&lang=de&client_id=${clientId}`, {
        ...options,
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `login_form/input_3/input_4=${encodeURIComponent(username)}&login_form/input_3/input_5=${encodeURIComponent(password)}`,
        clientId
    });

    if (r.status === 200) {
        throw "Invalid credentials (server returned 200 status code when trying to login)";
    } else if (r.status !== 302) {
        throw "Server returned an unexpected status code when trying to login";
    } else {
        const receivedCookies: { [key: string]: string } = Object.fromEntries(r.headers.get("set-cookie")?.split(",")?.map(s => s.trim().split(";")[0]?.split("=") || []) || []);

        const sessionId = receivedCookies["PHPSESSID"];

        if (!sessionId) {
            throw "Failed to find session id in server-sent cookies when trying to login";
        }

        return sessionId;
    }
}

export default login;
