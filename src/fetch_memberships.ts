import type { ClientOptions } from "./client_options";
import type { Cookies } from "./cookies";
import type { MembershipItem } from "./membership_item";
import instanceFetch from "./instance_fetch";
import type { InstanceInfo } from "./instance_info";

const membershipListItemRegex = /<h4 class="[^"]*?il-item-title[^"]*?".*?<a href="([^"]+?)".*?>(.+?)<\/a>.*?(?:<div class="[^"]*?il-item-description[^"]*?">\s*?(.*?)\s*?<\/div>|il-item-title|<script>)/gms;

const fetchMemberships = async ({ endpoint, sessionId, clientId, ...options }: Cookies & InstanceInfo & ClientOptions): Promise<MembershipItem[]> => {
    const response = await instanceFetch(`${endpoint}?baseClass=ilmembershipoverviewgui`, {
        ...options,
        sessionId,
        clientId
    });

    if (response.status !== 200) {
        throw "Server returned non-200 status code when trying to fetch memberships";
    }

    const responseText = await response.text();

    return responseText.matchAll(membershipListItemRegex).toArray().filter(x => (
        x[2] && (x[1]?.includes("/crs/") || x[1]?.includes("/grp/"))
    )).map(x => ({
        name: x[2]!.replace(/\s\s+?/gm, " "),
        description: x[3] ? x[3].replace(/\s\s+?/gm, " ") : undefined,
        refId: x[1]!.replace(/.+?(?:\/goto\.php\/[^\/]+?\/)/, ""),
        itemType: x[1]!.includes("/crs/") ? "course" : "group"
    }));
}

export default fetchMemberships;
