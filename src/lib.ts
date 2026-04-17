import { IliasClient } from "./client";
import type { ClientOptions } from "./client_options";
import type { ContentItem, ContentDirectoryItem, ContentFileItem, ContentUnknownItem } from "./content_item";
import type { MembershipItem } from "./membership_item";

export {
    IliasClient
};

export type {
    ClientOptions as IliasClientOptions,
    ContentItem as IliasContentItem,
    ContentDirectoryItem as IliasContentDirectoryItem,
    ContentFileItem as IliasContentFileItem,
    ContentUnknownItem as IliasContentUnknownItem,
    MembershipItem as IliasMembershipItem
};
