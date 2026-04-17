export type ContentFileItem = {
    name: string,
    refId: string,
    itemType: "file",
    fileExtension: string | undefined,
    fileSizeBytesApproximation: number | undefined,
    fileCreationDateAndTimeString: string | undefined
};

export type ContentDirectoryItem = {
    name: string,
    description: string | undefined,
    refId: string,
    itemType: "directory"
};

export type ContentUnknownItem = {
    name: string,
    description: string | undefined,
    pageURL: URL,
    itemType: "unknown"
};

export type ContentItem = ContentDirectoryItem | ContentFileItem | ContentUnknownItem;
