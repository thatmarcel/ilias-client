import type { ClientOptions } from "./client_options";
import type { Cookies } from "./cookies";
import instanceFetch from "./instance_fetch";
import type { InstanceInfo } from "./instance_info";

const fetchFileBlob = async ({ endpoint, sessionId, clientId, ...options }: Cookies & InstanceInfo & ClientOptions, refId: string) => {
    const response = await instanceFetch(`${endpoint}?baseClass=ilrepositorygui&cmdNode=z4:o1&cmdClass=ilObjFileGUI&cmd=sendfile&ref_id=${refId}`, {
        ...options,
        sessionId,
        clientId
    });

    if (response.status !== 200) {
        throw "Server returned non-200 status code when trying to download / fetch a file";
    }

    return await response.blob();
}

export default fetchFileBlob;
