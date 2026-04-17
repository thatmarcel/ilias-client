import type { ClientOptions } from "./client_options";
import type { ContentItem } from "./content_item";
import type { Cookies } from "./cookies";
import instanceFetch from "./instance_fetch";
import type { InstanceInfo } from "./instance_info";

const contentsListItemRegex = /<a href="([^"]+?)" class="il_ContainerItemTitle".*?>(.+?)<\/a>.*?(?:<div class="[^"]*?il_Description[^"]*?".*?>(.*?)<\/div>).+?(?:<span class="il_ItemProperty">\s*(.+?)(?:&nbsp;&nbsp;|)\s*?<\/span>\s*<span class="il_ItemProperty">\s*(.+?)(?:&nbsp;&nbsp;|)\s*?<\/span>\s*<span class="il_ItemProperty">\s*(.+?)(?:&nbsp;&nbsp;|)\s*?<\/span>|il_ContainerListItem|<script>|<\/html>)/gms;

const fetchContents = async ({ endpoint, sessionId, clientId, ...options }: Cookies & InstanceInfo & ClientOptions, refId: string): Promise<ContentItem[]> => {
    const response = await instanceFetch(`${endpoint}?baseClass=ilrepositorygui&ref_id=${refId}`, {
        ...options,
        sessionId,
        clientId
    });

    if (response.status !== 200) {
        throw "Server returned non-200 status code when trying to fetch the contents of an item...";
    }

    const responseText = await response.text();

    return responseText.matchAll(contentsListItemRegex).toArray().filter(x => (
        x[1] && x[2] && (x[1]?.includes("/fold/" /* true for directories (at least?) */) || x[1]?.includes("&cmdClass=ilObjFileGUI") || URL.parse(x[1]!, endpoint))
    )).map(x => {
        const itemType = x[1]!.includes("/fold/")
            ? "directory"
            : x[1]!.includes("&cmdClass=ilObjFileGUI")
                ? "file"
                : "unknown";

        if (itemType === "file") {
            return {
                name: x[2]!.replace(/\s\s+?/gm, " "),
                refId: x[1]!.includes("/fold/") ? x[1]!.split("/fold/")[1]! : x[1]!.split("&ref_id=")[1]!.split("&")[0]!,
                itemType,
                fileExtension: x[4],
                fileSizeBytesApproximation: (s => {
                    const parts = s?.toLowerCase()?.split(" ");

                    if (!parts || parts.length < 2) {
                        return undefined;
                    }

                    const unit = parts[1]!;
                    const amount = parseFloat(parts[0]!);

                    if (!amount) {
                        return undefined;
                    }

                    // see also https://github.com/ILIAS-eLearning/ILIAS/blob/ac6ea714a1ef3ba6bd5b22a5e6c0dcd719c021db/components/ILIAS/Data/src/DataSize.php
                    switch (unit) {
                        case "k":
                        case "kib":
                            return amount * 1024;
                        case "kb":
                            return amount * 1000;
                        case "m":
                        case "mib":
                            return amount * 1024 * 1024;
                        case "mb":
                            return amount * 1000 * 1000;
                        case "g":
                        case "gib":
                            return amount * 1024 * 1024 * 1024;
                        case "gb":
                            return amount * 1000 * 1000 * 1000;
                        case "t":
                        case "tib":
                            return amount * 1024 * 1024 * 1024 * 1024;
                        case "tb":
                            return amount * 1000 * 1000 * 1000 * 1000;
                        case "b":
                            return amount;
                        default:
                            return undefined;
                    }
                })(x[5]),
                fileCreationDateAndTimeString: x[6]
            };
        } else if (itemType === "directory") {
            return {
                name: x[2]!.replace(/\s\s+?/gm, " "),
                description: x[3] ? x[3].replace(/\s\s+?/gm, " ") : undefined,
                refId: x[1]!.includes("/fold/") ? x[1]!.split("/fold/")[1]! : x[1]!.split("&ref_id=")[1]!.split("&")[0]!,
                itemType
            };
        } else {
            return {
                name: x[2]!.replace(/\s\s+?/gm, " "),
                description: x[3] ? x[3].replace(/\s\s+?/gm, " ") : undefined,
                pageURL: URL.parse(x[1]!, endpoint)!,
                itemType
            };
        }
    });
}

export default fetchContents;
