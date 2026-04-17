import type { ClientOptions } from "./client_options";
import instanceFetch from "./instance_fetch";
import type { InstanceInfo } from "./instance_info";

const retrieveClientId = async ({ endpoint, ...options }: InstanceInfo & ClientOptions) => {
    const response = await instanceFetch(`${endpoint}?baseClass=ilrepositorygui&ref_id=1`, options);

    if (response.status !== 200) {
        throw "Server returned non-200 status code when trying to retrieve client id";
    }

    const receivedCookies: { [key: string]: string } = Object.fromEntries(response.headers.get("set-cookie")?.split(",")?.map(s => s.trim().split(";")[0]?.split("=") || []) || []);

    const clientId = receivedCookies["ilClientId"];

    if (!clientId) {
        throw "Failed to find client id in server-sent cookies when trying to retrieve client id";
    }

    return clientId;
}

export default retrieveClientId;
