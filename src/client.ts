import type { ClientOptions } from "./client_options";
import type { Cookies } from "./cookies";
import fetchContents from "./fetch_contents";
import fetchFileBlob from "./fetch_file_blob";
import fetchMemberships from "./fetch_memberships";
import type { InstanceInfo } from "./instance_info";
import login from "./login";
import openFileStream from "./open_file_stream";
import retrieveClientId from "./retrieve_client_id";

export class IliasClient {
    private info: Partial<Cookies> & InstanceInfo;

    constructor(baseURL: string | URL, options: ClientOptions = {}) {
        baseURL = new URL(baseURL);

        if (!baseURL.pathname.endsWith("/ilias.php")) {
            if (!baseURL.pathname.endsWith("/")) {
                baseURL.pathname += "/";
            }

            baseURL.pathname += "ilias.php";
        }

        baseURL.search = "";

        this.info = {
            endpoint: baseURL.toString(),
            ...options
        };
    }

    private get assertedInfo(): Readonly<Cookies & InstanceInfo> {
        return {
            ...this.info,
            clientId: this.info.clientId || (() => { throw "Not logged in (missing client id)" })(),
            sessionId: this.info.sessionId || (() => { throw "Not logged in (missing session id)" })()
        }
    }

    async login(username: string, password: string) {
        this.info.clientId = await retrieveClientId(this.info);

        this.info.sessionId = await login({
            ...this.info,
            clientId: this.info.clientId!
        }, username, password);
    }

    async fetchMemberships() {
        return fetchMemberships(this.assertedInfo);
    }

    async fetchContents(refId: string) {
        return fetchContents(this.assertedInfo, refId);
    }

    async fetchFileBlob(refId: string) {
        return fetchFileBlob(this.assertedInfo, refId);
    }

    async openFileStream(refId: string) {
        return openFileStream(this.assertedInfo, refId);
    }
}
